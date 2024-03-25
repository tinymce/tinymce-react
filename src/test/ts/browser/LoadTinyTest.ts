import { Chain, Log, Pipeline, Assertions } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { Arr, Strings, Global } from '@ephox/katamari';
import { SelectorFilter, Attribute, SugarElement, Remove } from '@ephox/sugar';

import { ScriptLoader } from '../../../main/ts/ScriptLoader2';
import { cRemove, cRender } from '../alien/Loader';
import { VERSIONS, CLOUD_VERSIONS, type Version } from '../alien/TestHelpers';

const apiKey = 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc';
UnitTest.asynctest('LoadTinyTest', (success, failure) => {
  const cDeleteTinymce = Chain.op(() => {
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
  });

  const cAssertTinymceVersion = (version: Version) => Chain.op(() => {
    Assertions.assertEq(`Loaded version of TinyMCE should be ${version}`, version, Global.tinymce.majorVersion);
  });

  Pipeline.async({}, [
    Log.chainsAsStep('Should be able to load local version of TinyMCE using the tinymceScriptSrc prop', '', [
      cDeleteTinymce,

      ...VERSIONS.flatMap((version) => [
        cRender({ tinymceScriptSrc: `/project/node_modules/tinymce-${version}/tinymce.min.js` }),
        cAssertTinymceVersion(version),
        cRemove,
        cDeleteTinymce,
      ]),
    ]),

    Log.chainsAsStep('Should be able to load TinyMCE from Cloud', '',
      CLOUD_VERSIONS.flatMap((version) => [
        cRender({ apiKey: 'a-fake-api-key', cloudChannel: version }),
        cAssertTinymceVersion(version),
        Chain.op(() => {
          Assertions.assertEq(
            'TinyMCE should have been loaded from Cloud',
            `https://cdn.tiny.cloud/1/a-fake-api-key/tinymce/${version}`,
            Global.tinymce.baseURI.source
          );
        }),
        cRemove,
        cDeleteTinymce,
      ])
    ),

    Log.chainsAsStep('Should be able to load TinyMCE in hybrid', '',
      CLOUD_VERSIONS.flatMap((version) => [
        cRender({ tinymceScriptSrc: [
          `/project/node_modules/tinymce-${version}/tinymce.min.js`,
          `https://cdn.tiny.cloud/1/${apiKey}/tinymce/${version}/cloud-plugins.min.js?tinydrive=${version}`
        ], plugins: [ 'tinydrive' ] }),
        cAssertTinymceVersion(version),
        Chain.op(() => {
          Assertions.assertEq(
            'TinyMCE should have been loaded locally',
            `/project/node_modules/tinymce-${version}`,
            Global.tinymce.baseURI.path
          );
        }),
        Chain.op(() => {
          Assertions.assertEq(
            'The tinydrive plugin should have defaults for the cloud',
            `https://cdn.tiny.cloud/1/${apiKey}/tinymce-plugins/tinydrive/${version}/plugin.min.js`,
            (Global.tinymce.defaultOptions || Global.tinymce.defaultSettings)?.custom_plugin_urls?.tinydrive
          );
        }),
        cRemove,
        cDeleteTinymce,
        Chain.wait(1000),
      ])
    )
  ], success, failure);
});