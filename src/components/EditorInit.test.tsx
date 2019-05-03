import { Assertions, Chain, GeneralSteps, Logger, NamedChain, Pipeline } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { Element } from '@ephox/dom-globals';
import * as React from 'react';
import { cRemove, cSetup, cNamedChainDirect } from './TestHelpers';

UnitTest.asynctest('Editor.test', (success, failure) => {
  const cAssertProperty = (propName: any, expected: any) => {
    return Chain.op((el: any) => {
      Assertions.assertEq(propName + ' should be ' + expected, el[propName], expected);
    });
  };

  Pipeline.async({}, [
    Logger.t('tagName prop changes element', GeneralSteps.sequence([
      Logger.t('it is div by default for inline', Chain.asStep({}, [
        cSetup((Editor) => <Editor inline />),
        NamedChain.asChain([
          cNamedChainDirect('DOMNode'),
          NamedChain.read('DOMNode', cAssertProperty('tagName', 'DIV')),
          NamedChain.outputInput
        ]),
        cRemove
      ])),

      Logger.t('can be set to inline in init', Chain.asStep({}, [
        cSetup((Editor) => <Editor init={{ inline: true }} />),
        NamedChain.asChain([
          cNamedChainDirect('DOMNode'),
          NamedChain.read('DOMNode', cAssertProperty('tagName', 'DIV')),
          NamedChain.outputInput
        ]),
        cRemove
      ])),

      Logger.t('it can be changed to p', Chain.asStep({}, [
        cSetup((Editor) => <Editor inline tagName='p' />),
        NamedChain.asChain([
          cNamedChainDirect('DOMNode'),
          NamedChain.read('DOMNode', cAssertProperty('tagName', 'P')),
          NamedChain.outputInput
        ]),
        cRemove
      ])),

      Logger.t('iframe editor does not change element', Chain.asStep({}, [
        cSetup((Editor) => <Editor tagName='p' />),
        NamedChain.asChain([
          cNamedChainDirect('DOMNode'),
          NamedChain.read('DOMNode', cAssertProperty('tagName', 'TEXTAREA')),
          NamedChain.outputInput
        ]),
        cRemove
      ]))
    ])),

    Logger.t('id is set automatically if id prop not provided', GeneralSteps.sequence([
      Logger.t('is set normally if prop is provided', Chain.asStep({}, [
        cSetup((Editor) => <Editor id='test' />),
        NamedChain.asChain([
          cNamedChainDirect('DOMNode'),
          NamedChain.read('DOMNode', cAssertProperty('id', 'test')),
          NamedChain.outputInput
        ]),
        cRemove
      ])),

      Logger.t('gets set automatically to uuid if not set', Chain.asStep({}, [
        cSetup((Editor) => <Editor />),
        NamedChain.asChain([
          cNamedChainDirect('DOMNode'),
          NamedChain.read('DOMNode', Chain.op((node: Element) => {
            Assertions.assertEq('Should not be falsy', !!node.id, true);
          })),
          NamedChain.outputInput
        ]),
        cRemove
      ])),
    ])),

    Logger.t('sets name on form', GeneralSteps.sequence([
      Logger.t('is not set when prop is not provided', Chain.asStep({}, [
        cSetup((Editor) => <Editor />),
        NamedChain.asChain([
          cNamedChainDirect('DOMNode'),
          NamedChain.read('DOMNode', cAssertProperty('name', '')),
          NamedChain.outputInput
        ]),
        cRemove
      ])),

      Logger.t('is set when prop is provided', Chain.asStep({}, [
        cSetup((Editor) => <Editor textareaName='test' />),
        NamedChain.asChain([
          cNamedChainDirect('DOMNode'),
          NamedChain.read('DOMNode', cAssertProperty('name', 'test')),
          NamedChain.outputInput
        ]),
        cRemove
      ])),
    ])),
  ], success, failure);
});