import { Assertions, Chain, GeneralSteps, Logger, Pipeline } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { Element } from '@ephox/dom-globals';
import * as React from 'react';
import { cRemove, cSetup, cDOMNode } from '../alien/Loader';

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
        cDOMNode(cAssertProperty('tagName', 'DIV')),
        cRemove
      ])),

      Logger.t('can be set to inline in init', Chain.asStep({}, [
        cSetup((Editor) => <Editor init={{ inline: true }} />),
        cDOMNode(cAssertProperty('tagName', 'DIV')),
        cRemove
      ])),

      Logger.t('it can be changed to p', Chain.asStep({}, [
        cSetup((Editor) => <Editor inline tagName='p' />),
        cDOMNode(cAssertProperty('tagName', 'P')),
        cRemove
      ])),

      Logger.t('iframe editor does not change element', Chain.asStep({}, [
        cSetup((Editor) => <Editor tagName='p' />),
        cDOMNode(cAssertProperty('tagName', 'TEXTAREA')),
        cRemove
      ]))
    ])),

    Logger.t('id is set automatically if id prop not provided', GeneralSteps.sequence([
      Logger.t('is set normally if prop is provided', Chain.asStep({}, [
        cSetup((Editor) => <Editor id='test' />),
        cDOMNode(cAssertProperty('id', 'test')),
        cRemove
      ])),

      Logger.t('gets set automatically to uuid if not set', Chain.asStep({}, [
        cSetup((Editor) => <Editor />),
        cDOMNode(Chain.op((node: Element) => {
          Assertions.assertEq('Should not be uuid', typeof node.id === 'string' && node.id.indexOf('tiny-react') !== -1, true);
        })),
        cRemove
      ])),
    ])),

    Logger.t('sets name on form', GeneralSteps.sequence([
      Logger.t('is not set when prop is not provided', Chain.asStep({}, [
        cSetup((Editor) => <Editor />),
        cDOMNode(cAssertProperty('name', '')),
        cRemove
      ])),

      Logger.t('is set when prop is provided', Chain.asStep({}, [
        cSetup((Editor) => <Editor textareaName='test' />),
        cDOMNode(cAssertProperty('name', 'test')),
        cRemove
      ])),
    ])),
  ], success, failure);
});