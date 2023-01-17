import { Chain, Log, Pipeline, Assertions } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { Arr, Strings, Global } from '@ephox/katamari';
import { SelectorFilter, Attribute, SugarElement, Remove } from '@ephox/sugar';

import { ScriptLoader } from '../../../main/ts/ScriptLoader2';
import { cRemove, cRender } from '../alien/Loader';

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

  const cAssertTinymceVersion = (version: '4' | '5' | '6') => Chain.op(() => {
    Assertions.assertEq(`Loaded version of TinyMCE should be ${version}`, version, Global.tinymce.majorVersion);
  });

  Pipeline.async({}, [
    Log.chainsAsStep('Should be able to load local version of TinyMCE using the tinymceScriptSrc prop', '', [
      cDeleteTinymce,

      cRender({ tinymceScriptSrc: '/project/node_modules/tinymce-6/tinymce.min.js' }),
      cAssertTinymceVersion('6'),
      cRemove,
      cDeleteTinymce,

      cRender({ tinymceScriptSrc: '/project/node_modules/tinymce-5/tinymce.min.js' }),
      cAssertTinymceVersion('5'),
      cRemove,
      cDeleteTinymce,

      cRender({ tinymceScriptSrc: '/project/node_modules/tinymce-4/tinymce.min.js' }),
      cAssertTinymceVersion('4'),
      cRemove,
      cDeleteTinymce,
    ]),
    Log.chainsAsStep('Should be able to load TinyMCE from Cloud', '', [
      cRender({ apiKey: 'a-fake-api-key', cloudChannel: '6' }),
      cAssertTinymceVersion('6'),
      Chain.op(() => {
        Assertions.assertEq(
          'TinyMCE should have been loaded from Cloud',
          'https://cdn.tiny.cloud/1/a-fake-api-key/tinymce/6',
          Global.tinymce.baseURI.source
        );
      }),
      cRemove,
      cDeleteTinymce,

      cRender({ apiKey: 'a-fake-api-key', cloudChannel: '5' }),
      cAssertTinymceVersion('5'),
      Chain.op(() => {
        Assertions.assertEq(
          'TinyMCE should have been loaded from Cloud',
          'https://cdn.tiny.cloud/1/a-fake-api-key/tinymce/5',
          Global.tinymce.baseURI.source
        );
      }),
      cRemove,
      cDeleteTinymce,
    ]),
    Log.chainsAsStep('Should be able to load TinyMCE in hybrid', '', [
      cRender({ tinymceScriptSrc: [
        '/project/node_modules/tinymce-6/tinymce.min.js',
        `https://cdn.tiny.cloud/1/${apiKey}/tinymce/6/cloud-plugins.min.js?tinydrive=6.3.1`
      ], plugins: [ 'tinydrive' ] }),
      cAssertTinymceVersion('6'),
      Chain.op(() => {
        Assertions.assertEq(
          'TinyMCE should have been loaded locally',
          '/project/node_modules/tinymce-6',
          Global.tinymce.baseURI.path
        );
      }),
      Chain.op(() => {
        Assertions.assertEq(
          'The tinydrive plugin should have defaults for the cloud',
          `https://cdn.tiny.cloud/1/${apiKey}/tinymce-plugins/tinydrive/6.3.1/plugin.min.js`,
          Global.tinymce.defaultOptions?.custom_plugin_urls?.tinydrive
        );
      }),
      cRemove,
      cDeleteTinymce,

      cRender({ tinymceScriptSrc: [
        '/project/node_modules/tinymce-5/tinymce.min.js',
        `https://cdn.tiny.cloud/1/${apiKey}/tinymce/5/cloud-plugins.min.js?tinydrive=5.10.7`
      ], plugins: [ 'tinydrive' ] }),
      cAssertTinymceVersion('5'),
      Chain.op(() => {
        Assertions.assertEq(
          'TinyMCE should have been loaded locally',
          '/project/node_modules/tinymce-5',
          Global.tinymce.baseURI.path
        );
      }),
      Chain.op(() => {
        Assertions.assertEq(
          'The tinydrive plugin should have defaults for the cloud',
          `https://cdn.tiny.cloud/1/${apiKey}/tinymce-plugins/tinydrive/5.10.7/plugin.min.js`,
          Global.tinymce.defaultSettings?.custom_plugin_urls?.tinydrive
        );
      }),
      cRemove,
      cDeleteTinymce,
    ])
  ], success, failure);
});