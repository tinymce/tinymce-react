/* eslint-disable @typescript-eslint/no-unused-vars */
import { Assertions } from '@ephox/agar';
import { beforeEach, describe, it } from '@ephox/bedrock-client';
import { Arr, Global, Strings } from '@ephox/katamari';

import { CLOUD_VERSIONS, VALID_API_KEY, VERSIONS, type Version } from '../alien/TestHelpers';
import { render } from '../alien/Loader';
import { ScriptLoader } from 'src/main/ts/ScriptLoader2';
import { Attribute, Remove, SelectorFilter, SugarElement } from '@ephox/sugar';

const assertTinymceVersion = (version: Version) => {
  Assertions.assertEq(`Loaded version of TinyMCE should be ${version}`, version, Global.tinymce.majorVersion);
};

export const deleteTinymce = () => {
  ScriptLoader.reinitialize();

  delete Global.tinymce;
  delete Global.tinyMCE;
  const hasTinymceUri = (attrName: string) => (elm: SugarElement<Element>) =>
    Attribute.getOpt(elm, attrName).exists((src) => Strings.contains(src, 'tinymce'));

  const elements = Arr.flatten([
    Arr.filter(SelectorFilter.all('script'), hasTinymceUri('src')),
    Arr.filter(SelectorFilter.all('link'), hasTinymceUri('href')),
  ]);

  Arr.each(elements, Remove.remove);
};

describe('LoadTinyTest', () => {
  beforeEach(() => {
    deleteTinymce();
  });

  VERSIONS.forEach((version) => {
    it(`Should be able to load local version (${version}) of TinyMCE using the tinymceScriptSrc prop`, async () => {
      using _ = await render({ tinymceScriptSrc: `/project/node_modules/tinymce-${version}/tinymce.min.js`, licenseKey: 'gpl' });
      assertTinymceVersion(version);
    });
  });

  CLOUD_VERSIONS.forEach((version) => {
    it(`Should be able to load TinyMCE from Cloud (${version})`, async () => {
      const apiKey = 'a-fake-api-key';
      using _ = await render({ apiKey, cloudChannel: version });
      assertTinymceVersion(version);
      Assertions.assertEq(
        'TinyMCE should have been loaded from Cloud',
        `https://cdn.tiny.cloud/1/${apiKey}/tinymce/${version}`,
        Global.tinymce.baseURI.source
      );
    });

    it(`Should be able to load TinyMCE (${version}) in hybrid`, async () => {
      using _ = await render({
        tinymceScriptSrc: [
          `/project/node_modules/tinymce-${version}/tinymce.min.js`,
          `https://cdn.tiny.cloud/1/${VALID_API_KEY}/tinymce/${version}/cloud-plugins.min.js?tinydrive=${version}`
        ],
        plugins: [ 'tinydrive' ]
      });
      assertTinymceVersion(version);
      Assertions.assertEq(
        'TinyMCE should have been loaded locally',
        `/project/node_modules/tinymce-${version}`,
        Global.tinymce.baseURI.path
      );
      Assertions.assertEq(
        'The tinydrive plugin should have defaults for the cloud',
        `https://cdn.tiny.cloud/1/${VALID_API_KEY}/tinymce-plugins/tinydrive/${version}/plugin.min.js`,
        (Global.tinymce.defaultOptions || Global.tinymce.defaultSettings)?.custom_plugin_urls?.tinydrive
      );
    });
  });
});
