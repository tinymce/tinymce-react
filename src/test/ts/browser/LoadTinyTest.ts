import { Assertions } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';
import { Global } from '@ephox/katamari';

import { CLOUD_VERSIONS, VALID_API_KEY, VERSIONS, type Version } from '../alien/TestHelpers';
import { render, ReactEditorContext } from '../alien/Loader';

const assertTinymceVersion = (ctx: ReactEditorContext, version: Version) => {
  Assertions.assertEq(`Loaded version of TinyMCE should be ${version}`, version, ctx.majorVersion);
};

describe('LoadTinyTest', () => {
  VERSIONS.forEach((version) => {
    it(`Should be able to load local version (${version}) of TinyMCE using the tinymceScriptSrc prop`, async () => {
      using ctx = await render({ tinymceScriptSrc: `/project/node_modules/tinymce-${version}/tinymce.min.js`, licenseKey: 'gpl' });
      assertTinymceVersion(ctx, version);
    });
  });

  CLOUD_VERSIONS.forEach((version) => {
    it(`Should be able to load TinyMCE from Cloud (${version})`, async () => {
      const apiKey = 'a-fake-api-key';
      using ctx = await render({ apiKey, cloudChannel: version });
      assertTinymceVersion(ctx, version);
      Assertions.assertEq(
        'TinyMCE should have been loaded from Cloud',
        `https://cdn.tiny.cloud/1/${apiKey}/tinymce/${version}`,
        ctx.editor.baseURI.source
      );
    });

    it(`Should be able to load TinyMCE (${version}) in hybrid`, async () => {
      using ctx = await render({
        tinymceScriptSrc: [
          `/project/node_modules/tinymce-${version}/tinymce.min.js`,
          `https://cdn.tiny.cloud/1/${VALID_API_KEY}/tinymce/${version}/cloud-plugins.min.js?tinydrive=${version}`
        ],
        plugins: [ 'tinydrive' ]
      });
      assertTinymceVersion(ctx, version);
      Assertions.assertEq(
        'TinyMCE should have been loaded locally',
        `/project/node_modules/tinymce-${version}`,
        ctx.editor.baseURI.source
      );
      Assertions.assertEq(
        'The tinydrive plugin should have defaults for the cloud',
        `https://cdn.tiny.cloud/1/${VALID_API_KEY}/tinymce-plugins/tinydrive/${version}/plugin.min.js`,
        (Global.tinymce.defaultOptions || Global.tinymce.defaultSettings)?.custom_plugin_urls?.tinydrive
      );
    });
  });
});
