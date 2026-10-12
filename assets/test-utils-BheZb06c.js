import{b as l,g as p}from"./index-DhY--VwN.js";function d(t,e){for(var r=0;r<e.length;r++){const o=e[r];if(typeof o!="string"&&!Array.isArray(o)){for(const s in o)if(s!=="default"&&!(s in t)){const a=Object.getOwnPropertyDescriptor(o,s);a&&Object.defineProperty(t,s,a.get?a:{enumerable:!0,get:()=>o[s]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}var i={exports:{}},n={};/**
 * @license React
 * react-dom-test-utils.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var c;function m(){if(c)return n;c=1;var t=l(),e=!1;return n.act=function(r){return e===!1&&(e=!0,console.error("`ReactDOMTestUtils.act` is deprecated in favor of `React.act`. Import `act` from `react` instead of `react-dom/test-utils`. See https://react.dev/warnings/react-dom-test-utils for more info.")),t.act(r)},n}var u;function g(){return u||(u=1,i.exports=m()),i.exports}var f=g();const U=p(f),b=d({__proto__:null,default:U},[f]);export{b as t};
