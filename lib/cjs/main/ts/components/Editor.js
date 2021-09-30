"use strict";
/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
var React = require("react");
var ScriptLoader_1 = require("../ScriptLoader");
var TinyMCE_1 = require("../TinyMCE");
var Utils_1 = require("../Utils");
var EditorPropTypes_1 = require("./EditorPropTypes");
var changeEvents = function () { var _a, _b, _c; return ((_c = (_b = (_a = TinyMCE_1.getTinymce()) === null || _a === void 0 ? void 0 : _a.Env) === null || _b === void 0 ? void 0 : _b.browser) === null || _c === void 0 ? void 0 : _c.isIE()) ? 'change keyup compositionend setcontent' : 'change input compositionend setcontent'; };
var beforeInputEvent = function () { return Utils_1.isBeforeInputEventAvailable() ? 'beforeinput SelectionChange' : 'SelectionChange'; };
var Editor = /** @class */ (function (_super) {
    __extends(Editor, _super);
    function Editor(props) {
        var _a, _b, _c;
        var _this = _super.call(this, props) || this;
        _this.rollbackTimer = undefined;
        _this.valueCursor = undefined;
        _this.rollbackChange = function () {
            var editor = _this.editor;
            var value = _this.props.value;
            if (editor && value && value !== _this.currentContent) {
                editor.undoManager.ignore(function () {
                    editor.setContent(value);
                    // only restore cursor on inline editors when they are focused
                    // as otherwise it will cause a focus grab
                    if (_this.valueCursor && (!_this.inline || editor.hasFocus())) {
                        try {
                            editor.selection.moveToBookmark(_this.valueCursor);
                        }
                        catch (e) { /* ignore */ }
                    }
                });
            }
            _this.rollbackTimer = undefined;
        };
        _this.handleBeforeInput = function (_evt) {
            if (_this.props.value !== undefined && _this.props.value === _this.currentContent && _this.editor) {
                if (!_this.inline || _this.editor.hasFocus) {
                    try {
                        // getBookmark throws exceptions when the editor has not been focused
                        // possibly only in inline mode but I'm not taking chances
                        _this.valueCursor = _this.editor.selection.getBookmark(3);
                    }
                    catch (e) { /* ignore */ }
                }
            }
        };
        _this.handleBeforeInputSpecial = function (evt) {
            if (evt.key === 'Enter' || evt.key === 'Backspace' || evt.key === 'Delete') {
                _this.handleBeforeInput(evt);
            }
        };
        _this.handleEditorChange = function (_evt) {
            var editor = _this.editor;
            if (editor && editor.initialized) {
                var newContent = editor.getContent();
                if (_this.props.value !== undefined && _this.props.value !== newContent) {
                    // start a timer and revert to the value if not applied in time
                    if (!_this.rollbackTimer) {
                        _this.rollbackTimer = window.setTimeout(_this.rollbackChange, 200);
                    }
                }
                if (newContent !== _this.currentContent) {
                    _this.currentContent = newContent;
                    if (Utils_1.isFunction(_this.props.onEditorChange)) {
                        var format = _this.props.outputFormat;
                        var out = format === 'html' ? newContent : editor.getContent({ format: format });
                        _this.props.onEditorChange(out, editor);
                    }
                }
            }
        };
        _this.handleEditorChangeSpecial = function (evt) {
            if (evt.key === 'Backspace' || evt.key === 'Delete') {
                _this.handleEditorChange(evt);
            }
        };
        _this.initialise = function (attempts) {
            var _a, _b, _c;
            if (attempts === void 0) { attempts = 0; }
            var target = _this.elementRef.current;
            if (!target) {
                return; // Editor has been unmounted
            }
            if (!Utils_1.isInDoc(target)) {
                // this is probably someone trying to help by rendering us offscreen
                // but we can't do that because the editor iframe must be in the document
                // in order to have state
                if (attempts === 0) {
                    // we probably just need to wait for the current events to be processed
                    setTimeout(function () { return _this.initialise(1); }, 1);
                }
                else if (attempts < 100) {
                    // wait for a second, polling every tenth of a second
                    setTimeout(function () { return _this.initialise(attempts + 1); }, 100);
                }
                else {
                    // give up, at this point it seems that more polling is unlikely to help
                    throw new Error('tinymce can only be initialised when in a document');
                }
                return;
            }
            var tinymce = TinyMCE_1.getTinymce();
            if (!tinymce) {
                throw new Error('tinymce should have been loaded into global scope');
            }
            var finalInit = __assign(__assign({}, _this.props.init), { selector: undefined, target: target, readonly: _this.props.disabled, inline: _this.inline, plugins: Utils_1.mergePlugins((_a = _this.props.init) === null || _a === void 0 ? void 0 : _a.plugins, _this.props.plugins), toolbar: (_b = _this.props.toolbar) !== null && _b !== void 0 ? _b : (_c = _this.props.init) === null || _c === void 0 ? void 0 : _c.toolbar, setup: function (editor) {
                    _this.editor = editor;
                    _this.bindHandlers({});
                    // When running in inline mode the editor gets the initial value
                    // from the innerHTML of the element it is initialized on.
                    // However we don't want to take on the responsibility of sanitizing
                    // to remove XSS in the react integration so we have a chicken and egg
                    // problem... We avoid it by sneaking in a set content before the first
                    // "official" setContent and using TinyMCE to do the sanitization.
                    if (_this.inline && !Utils_1.isTextareaOrInput(target)) {
                        editor.once('PostRender', function (_evt) {
                            editor.setContent(_this.getInitialValue(), { no_events: true });
                        });
                    }
                    if (_this.props.init && Utils_1.isFunction(_this.props.init.setup)) {
                        _this.props.init.setup(editor);
                    }
                }, init_instance_callback: function (editor) {
                    var _a, _b;
                    // check for changes that happened since tinymce.init() was called
                    var initialValue = _this.getInitialValue();
                    _this.currentContent = (_a = _this.currentContent) !== null && _a !== void 0 ? _a : editor.getContent();
                    if (_this.currentContent !== initialValue) {
                        _this.currentContent = initialValue;
                        // same as resetContent in TinyMCE 5
                        editor.setContent(initialValue);
                        editor.undoManager.clear();
                        editor.undoManager.add();
                        editor.setDirty(false);
                    }
                    var disabled = (_b = _this.props.disabled) !== null && _b !== void 0 ? _b : false;
                    editor.setMode(disabled ? 'readonly' : 'design');
                    // ensure existing init_instance_callback is called
                    if (_this.props.init && Utils_1.isFunction(_this.props.init.init_instance_callback)) {
                        _this.props.init.init_instance_callback(editor);
                    }
                } });
            if (!_this.inline) {
                target.style.visibility = '';
            }
            if (Utils_1.isTextareaOrInput(target)) {
                target.value = _this.getInitialValue();
            }
            tinymce.init(finalInit);
        };
        _this.id = _this.props.id || Utils_1.uuid('tiny-react');
        _this.elementRef = React.createRef();
        _this.inline = (_c = (_a = _this.props.inline) !== null && _a !== void 0 ? _a : (_b = _this.props.init) === null || _b === void 0 ? void 0 : _b.inline) !== null && _c !== void 0 ? _c : false;
        _this.boundHandlers = {};
        return _this;
    }
    Editor.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        var _a, _b;
        if (this.rollbackTimer) {
            clearTimeout(this.rollbackTimer);
            this.rollbackTimer = undefined;
        }
        if (this.editor) {
            this.bindHandlers(prevProps);
            if (this.editor.initialized) {
                this.currentContent = (_a = this.currentContent) !== null && _a !== void 0 ? _a : this.editor.getContent();
                if (typeof this.props.initialValue === 'string' && this.props.initialValue !== prevProps.initialValue) {
                    // same as resetContent in TinyMCE 5
                    this.editor.setContent(this.props.initialValue);
                    this.editor.undoManager.clear();
                    this.editor.undoManager.add();
                    this.editor.setDirty(false);
                }
                else if (typeof this.props.value === 'string' && this.props.value !== this.currentContent) {
                    var localEditor_1 = this.editor;
                    localEditor_1.undoManager.transact(function () {
                        // inline editors grab focus when restoring selection
                        // so we don't try to keep their selection unless they are currently focused
                        var cursor;
                        if (!_this.inline || localEditor_1.hasFocus()) {
                            try {
                                // getBookmark throws exceptions when the editor has not been focused
                                // possibly only in inline mode but I'm not taking chances
                                cursor = localEditor_1.selection.getBookmark(3);
                            }
                            catch (e) { /* ignore */ }
                        }
                        var valueCursor = _this.valueCursor;
                        localEditor_1.setContent(_this.props.value);
                        if (!_this.inline || localEditor_1.hasFocus()) {
                            for (var _i = 0, _a = [cursor, valueCursor]; _i < _a.length; _i++) {
                                var bookmark = _a[_i];
                                if (bookmark) {
                                    try {
                                        localEditor_1.selection.moveToBookmark(bookmark);
                                        _this.valueCursor = bookmark;
                                        break;
                                    }
                                    catch (e) { /* ignore */ }
                                }
                            }
                        }
                    });
                }
                if (this.props.disabled !== prevProps.disabled) {
                    var disabled = (_b = this.props.disabled) !== null && _b !== void 0 ? _b : false;
                    this.editor.setMode(disabled ? 'readonly' : 'design');
                }
            }
        }
    };
    Editor.prototype.componentDidMount = function () {
        var _a, _b, _c, _d, _e, _f;
        if (TinyMCE_1.getTinymce() !== null) {
            this.initialise();
        }
        else if (this.elementRef.current && this.elementRef.current.ownerDocument) {
            ScriptLoader_1.ScriptLoader.load(this.elementRef.current.ownerDocument, this.getScriptSrc(), (_b = (_a = this.props.scriptLoading) === null || _a === void 0 ? void 0 : _a.async) !== null && _b !== void 0 ? _b : false, (_d = (_c = this.props.scriptLoading) === null || _c === void 0 ? void 0 : _c.defer) !== null && _d !== void 0 ? _d : false, (_f = (_e = this.props.scriptLoading) === null || _e === void 0 ? void 0 : _e.delay) !== null && _f !== void 0 ? _f : 0, this.initialise);
        }
    };
    Editor.prototype.componentWillUnmount = function () {
        var _this = this;
        var editor = this.editor;
        if (editor) {
            editor.off(changeEvents(), this.handleEditorChange);
            editor.off(beforeInputEvent(), this.handleBeforeInput);
            editor.off('keypress', this.handleEditorChangeSpecial);
            editor.off('keydown', this.handleBeforeInputSpecial);
            editor.off('NewBlock', this.handleEditorChange);
            Object.keys(this.boundHandlers).forEach(function (eventName) {
                editor.off(eventName, _this.boundHandlers[eventName]);
            });
            this.boundHandlers = {};
            editor.remove();
            this.editor = undefined;
        }
    };
    Editor.prototype.render = function () {
        return this.inline ? this.renderInline() : this.renderIframe();
    };
    Editor.prototype.renderInline = function () {
        var _a = this.props.tagName, tagName = _a === void 0 ? 'div' : _a;
        return React.createElement(tagName, {
            ref: this.elementRef,
            id: this.id
        });
    };
    Editor.prototype.renderIframe = function () {
        return React.createElement('textarea', {
            ref: this.elementRef,
            style: { visibility: 'hidden' },
            name: this.props.textareaName,
            id: this.id
        });
    };
    Editor.prototype.getScriptSrc = function () {
        if (typeof this.props.tinymceScriptSrc === 'string') {
            return this.props.tinymceScriptSrc;
        }
        else {
            var channel = this.props.cloudChannel;
            var apiKey = this.props.apiKey ? this.props.apiKey : 'no-api-key';
            return "https://cdn.tiny.cloud/1/" + apiKey + "/tinymce/" + channel + "/tinymce.min.js";
        }
    };
    Editor.prototype.getInitialValue = function () {
        if (typeof this.props.initialValue === 'string') {
            return this.props.initialValue;
        }
        else if (typeof this.props.value === 'string') {
            return this.props.value;
        }
        else {
            return '';
        }
    };
    Editor.prototype.bindHandlers = function (prevProps) {
        var _this = this;
        if (this.editor !== undefined) {
            // typescript chokes trying to understand the type of the lookup function
            Utils_1.configHandlers(this.editor, prevProps, this.props, this.boundHandlers, function (key) { return _this.props[key]; });
            // check if we should monitor editor changes
            var isValueControlled = function (p) { return p.onEditorChange !== undefined || p.value !== undefined; };
            var wasControlled = isValueControlled(prevProps);
            var nowControlled = isValueControlled(this.props);
            if (!wasControlled && nowControlled) {
                this.editor.on(changeEvents(), this.handleEditorChange);
                this.editor.on(beforeInputEvent(), this.handleBeforeInput);
                this.editor.on('keydown', this.handleBeforeInputSpecial);
                this.editor.on('keyup', this.handleEditorChangeSpecial);
                this.editor.on('NewBlock', this.handleEditorChange);
            }
            else if (wasControlled && !nowControlled) {
                this.editor.off(changeEvents(), this.handleEditorChange);
                this.editor.off(beforeInputEvent(), this.handleBeforeInput);
                this.editor.off('keydown', this.handleBeforeInputSpecial);
                this.editor.off('keyup', this.handleEditorChangeSpecial);
                this.editor.off('NewBlock', this.handleEditorChange);
            }
        }
    };
    Editor.propTypes = EditorPropTypes_1.EditorPropTypes;
    Editor.defaultProps = {
        cloudChannel: '5'
    };
    return Editor;
}(React.Component));
exports.Editor = Editor;
