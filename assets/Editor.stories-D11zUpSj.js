import{r as b,R as p}from"./index-6otl1p8d.js";var w={exports:{}},R,M;function me(){if(M)return R;M=1;var r="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return R=r,R}var x,K;function ye(){if(K)return x;K=1;var r=me();function n(){}function o(){}return o.resetWarningCache=n,x=function(){function t(c,l,a,d,h,u){if(u!==r){var m=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw m.name="Invariant Violation",m}}t.isRequired=t;function i(){return t}var s={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:i,element:t,elementType:t,instanceOf:i,node:t,objectOf:i,oneOf:i,oneOfType:i,shape:i,exact:i,checkPropTypes:o,resetWarningCache:n};return s.PropTypes=s,s},x}var U;function ge(){return U||(U=1,w.exports=ye()()),w.exports}var e=ge();const ue={onActivate:e.func,onAddUndo:e.func,onBeforeAddUndo:e.func,onBeforeExecCommand:e.func,onBeforeGetContent:e.func,onBeforeRenderUI:e.func,onBeforeSetContent:e.func,onBeforePaste:e.func,onBlur:e.func,onChange:e.func,onClearUndos:e.func,onClick:e.func,onContextMenu:e.func,onCommentChange:e.func,onCompositionEnd:e.func,onCompositionStart:e.func,onCompositionUpdate:e.func,onCopy:e.func,onCut:e.func,onDblclick:e.func,onDeactivate:e.func,onDirty:e.func,onDrag:e.func,onDragDrop:e.func,onDragEnd:e.func,onDragGesture:e.func,onDragOver:e.func,onDrop:e.func,onExecCommand:e.func,onFocus:e.func,onFocusIn:e.func,onFocusOut:e.func,onGetContent:e.func,onHide:e.func,onInit:e.func,onInput:e.func,onKeyDown:e.func,onKeyPress:e.func,onKeyUp:e.func,onLoadContent:e.func,onMouseDown:e.func,onMouseEnter:e.func,onMouseLeave:e.func,onMouseMove:e.func,onMouseOut:e.func,onMouseOver:e.func,onMouseUp:e.func,onNodeChange:e.func,onObjectResizeStart:e.func,onObjectResized:e.func,onObjectSelected:e.func,onPaste:e.func,onPostProcess:e.func,onPostRender:e.func,onPreProcess:e.func,onProgressState:e.func,onRedo:e.func,onRemove:e.func,onReset:e.func,onSaveContent:e.func,onSelectionChange:e.func,onSetAttrib:e.func,onSetContent:e.func,onShow:e.func,onSubmit:e.func,onUndo:e.func,onVisualAid:e.func,onSkinLoadError:e.func,onThemeLoadError:e.func,onModelLoadError:e.func,onPluginLoadError:e.func,onIconsLoadError:e.func,onLanguageLoadError:e.func,onScriptsLoad:e.func,onScriptsLoadError:e.func},ve={apiKey:e.string,licenseKey:e.string,id:e.string,inline:e.bool,init:e.object,initialValue:e.string,onEditorChange:e.func,value:e.string,tagName:e.string,tabIndex:e.number,cloudChannel:e.string,plugins:e.oneOfType([e.string,e.array]),toolbar:e.oneOfType([e.string,e.array]),disabled:e.bool,textareaName:e.string,tinymceScriptSrc:e.oneOfType([e.string,e.arrayOf(e.string),e.arrayOf(e.shape({src:e.string,async:e.bool,defer:e.bool}))]),rollback:e.oneOfType([e.number,e.oneOf([!1])]),scriptLoading:e.shape({async:e.bool,defer:e.bool,delay:e.number}),...ue},P=r=>typeof r=="function",_=r=>r in ue,N=r=>r.substr(2),Ce=(r,n,o,t,i,s,c)=>{const l=Object.keys(i).filter(_),a=Object.keys(s).filter(_),d=l.filter(u=>s[u]===void 0),h=a.filter(u=>i[u]===void 0);d.forEach(u=>{const m=N(u),f=c[m];o(m,f),delete c[m]}),h.forEach(u=>{const m=t(r,u),f=N(u);c[f]=m,n(f,m)})},be=(r,n,o,t,i)=>Ce(i,r.on.bind(r),r.off.bind(r),(s,c)=>l=>{var a;return(a=s(c))==null?void 0:a(l,r)},n,o,t);let V=0;const fe=r=>{const n=Date.now(),o=Math.floor(Math.random()*1e9);return V++,r+"_"+o+V+String(n)},A=r=>r!==null&&(r.tagName.toLowerCase()==="textarea"||r.tagName.toLowerCase()==="input"),F=r=>typeof r>"u"||r===""?[]:Array.isArray(r)?r:r.split(" "),Ee=(r,n)=>F(r).concat(F(n)),qe=()=>window.InputEvent&&typeof InputEvent.prototype.getTargetRanges=="function",Se=r=>{if(!("isConnected"in Node.prototype)){let n=r,o=r.parentNode;for(;o!=null;)n=o,o=n.parentNode;return n===r.ownerDocument}return r.isConnected},j=(r,n)=>{r!==void 0&&(r.mode!=null&&typeof r.mode=="object"&&typeof r.mode.set=="function"?r.mode.set(n):r.setMode(n))},Te=(r,n,o)=>{const t=r.createElement("script");t.referrerPolicy="origin",t.type="application/javascript",t.id=n.id,t.src=n.src,t.async=n.async??!1,t.defer=n.defer??!1;const i=()=>{t.removeEventListener("load",i),t.removeEventListener("error",s),o(n.src)},s=c=>{t.removeEventListener("load",i),t.removeEventListener("error",s),o(n.src,c)};t.addEventListener("load",i),t.addEventListener("error",s),r.head&&r.head.appendChild(t)},ke=r=>{let n={};const o=(c,l)=>{const a=n[c];a.done=!0,a.error=l;for(const d of a.handlers)d(c,l);a.handlers=[]};return{loadScripts:(c,l,a)=>{const d=f=>a!==void 0?a(f):console.error(f);if(c.length===0){d(new Error("At least one script must be provided"));return}let h=0,u=!1;const m=(f,g)=>{u||(g?(u=!0,d(g)):++h===c.length&&l())};for(const f of c){const g=n[f.src];if(g)g.done?m(f.src,g.error):g.handlers.push(m);else{const O=fe("tiny-");n[f.src]={id:O,src:f.src,done:!1,error:null,handlers:[m]},Te(r,{id:O,...f},o)}}},deleteScripts:()=>{var c;for(const l of Object.values(n)){const a=r.getElementById(l.id);a!=null&&a.tagName==="SCRIPT"&&((c=a.parentNode)==null||c.removeChild(a))}n={}},getDocument:()=>r}},Ie=()=>{const r=[],n=i=>{let s=r.find(c=>c.getDocument()===i);return s===void 0&&(s=ke(i),r.push(s)),s};return{loadList:(i,s,c,l,a)=>{const d=()=>n(i).loadScripts(s,l,a);c>0?setTimeout(d,c):d()},reinitialize:()=>{for(let i=r.pop();i!=null;i=r.pop())i.deleteScripts()}}},Le=Ie(),z=r=>{const n=r;return n&&n.tinymce?n.tinymce:null},B="change keyup compositionend setcontent CommentChange",D=class D extends b.Component{constructor(n){var o;super(n),this.rollbackTimer=void 0,this.valueCursor=void 0,this.rollbackChange=()=>{const t=this.editor,i=this.props.value;t&&i&&i!==this.currentContent&&t.undoManager.ignore(()=>{if(t.setContent(i),this.valueCursor&&(!this.inline||t.hasFocus()))try{t.selection.moveToBookmark(this.valueCursor)}catch{}}),this.rollbackTimer=void 0},this.handleBeforeInput=t=>{if(this.props.value!==void 0&&this.props.value===this.currentContent&&this.editor&&(!this.inline||this.editor.hasFocus()))try{this.valueCursor=this.editor.selection.getBookmark(3)}catch{}},this.handleBeforeInputSpecial=t=>{(t.key==="Enter"||t.key==="Backspace"||t.key==="Delete")&&this.handleBeforeInput(t)},this.handleEditorChange=t=>{const i=this.editor;if(i&&i.initialized){const s=i.getContent();this.props.value!==void 0&&this.props.value!==s&&this.props.rollback!==!1&&(this.rollbackTimer||(this.rollbackTimer=window.setTimeout(this.rollbackChange,typeof this.props.rollback=="number"?this.props.rollback:200))),s!==this.currentContent&&(this.currentContent=s,P(this.props.onEditorChange)&&this.props.onEditorChange(s,i))}},this.handleEditorChangeSpecial=t=>{(t.key==="Backspace"||t.key==="Delete")&&this.handleEditorChange(t)},this.initialise=(t=0)=>{var l,a;const i=this.elementRef.current;if(!i)return;if(!Se(i)){if(t===0)setTimeout(()=>this.initialise(1),1);else if(t<100)setTimeout(()=>this.initialise(t+1),100);else throw new Error("tinymce can only be initialised when in a document");return}const s=z(this.view);if(!s)throw new Error("tinymce should have been loaded into global scope");const c={...this.props.init,selector:void 0,target:i,readonly:this.props.disabled,inline:this.inline,plugins:Ee((l=this.props.init)==null?void 0:l.plugins,this.props.plugins),toolbar:this.props.toolbar??((a=this.props.init)==null?void 0:a.toolbar),...this.props.licenseKey?{license_key:this.props.licenseKey}:{},setup:d=>{this.editor=d,this.bindHandlers({}),this.inline&&!A(i)&&d.once("PostRender",h=>{d.setContent(this.getInitialValue(),{no_events:!0})}),this.props.init&&P(this.props.init.setup)&&this.props.init.setup(d)},init_instance_callback:d=>{const h=this.getInitialValue();this.currentContent=this.currentContent??d.getContent(),this.currentContent!==h&&(this.currentContent=h,d.setContent(h),d.undoManager.clear(),d.undoManager.add(),d.setDirty(!1));const u=this.props.disabled??!1;j(this.editor,u?"readonly":"design"),this.props.init&&P(this.props.init.init_instance_callback)&&this.props.init.init_instance_callback(d)}};this.inline||(i.style.visibility=""),A(i)&&(i.value=this.getInitialValue()),s.init(c)},this.id=this.props.id||fe("tiny-react"),this.elementRef=b.createRef(),this.inline=this.props.inline??((o=this.props.init)==null?void 0:o.inline)??!1,this.boundHandlers={}}get view(){var n;return((n=this.elementRef.current)==null?void 0:n.ownerDocument.defaultView)??window}componentDidUpdate(n){if(this.rollbackTimer&&(clearTimeout(this.rollbackTimer),this.rollbackTimer=void 0),this.editor&&(this.bindHandlers(n),this.editor.initialized)){if(this.currentContent=this.currentContent??this.editor.getContent(),typeof this.props.initialValue=="string"&&this.props.initialValue!==n.initialValue)this.editor.setContent(this.props.initialValue),this.editor.undoManager.clear(),this.editor.undoManager.add(),this.editor.setDirty(!1);else if(typeof this.props.value=="string"&&this.props.value!==this.currentContent){const o=this.editor;o.undoManager.transact(()=>{let t;if(!this.inline||o.hasFocus())try{t=o.selection.getBookmark(3)}catch{}const i=this.valueCursor;if(o.setContent(this.props.value),!this.inline||o.hasFocus()){for(const s of[t,i])if(s)try{o.selection.moveToBookmark(s),this.valueCursor=s;break}catch{}}})}if(this.props.disabled!==n.disabled){const o=this.props.disabled??!1;j(this.editor,o?"readonly":"design")}}}componentDidMount(){var n,o,t,i;if(z(this.view)!==null)this.initialise();else if(Array.isArray(this.props.tinymceScriptSrc)&&this.props.tinymceScriptSrc.length===0)(o=(n=this.props).onScriptsLoadError)==null||o.call(n,new Error("No `tinymce` global is present but the `tinymceScriptSrc` prop was an empty array."));else if((t=this.elementRef.current)!=null&&t.ownerDocument){const s=()=>{var l,a;(a=(l=this.props).onScriptsLoad)==null||a.call(l),this.initialise()},c=l=>{var a,d;(d=(a=this.props).onScriptsLoadError)==null||d.call(a,l)};Le.loadList(this.elementRef.current.ownerDocument,this.getScriptSources(),((i=this.props.scriptLoading)==null?void 0:i.delay)??0,s,c)}}componentWillUnmount(){const n=this.editor;n&&(n.off(B,this.handleEditorChange),n.off(this.beforeInputEvent(),this.handleBeforeInput),n.off("keypress",this.handleEditorChangeSpecial),n.off("keydown",this.handleBeforeInputSpecial),n.off("NewBlock",this.handleEditorChange),Object.keys(this.boundHandlers).forEach(o=>{n.off(o,this.boundHandlers[o])}),this.boundHandlers={},n.remove(),this.editor=void 0)}render(){return this.inline?this.renderInline():this.renderIframe()}beforeInputEvent(){return qe()?"beforeinput SelectionChange":"SelectionChange"}renderInline(){const{tagName:n="div"}=this.props;return b.createElement(n,{ref:this.elementRef,id:this.id,tabIndex:this.props.tabIndex})}renderIframe(){return b.createElement("textarea",{ref:this.elementRef,style:{visibility:"hidden"},name:this.props.textareaName,id:this.id,tabIndex:this.props.tabIndex})}getScriptSources(){var c,l;const n=(c=this.props.scriptLoading)==null?void 0:c.async,o=(l=this.props.scriptLoading)==null?void 0:l.defer;if(this.props.tinymceScriptSrc!==void 0)return typeof this.props.tinymceScriptSrc=="string"?[{src:this.props.tinymceScriptSrc,async:n,defer:o}]:this.props.tinymceScriptSrc.map(a=>typeof a=="string"?{src:a,async:n,defer:o}:a);const t=this.props.cloudChannel;return[{src:`https://cdn.tiny.cloud/1/${this.props.apiKey?this.props.apiKey:"no-api-key"}/tinymce/${t}/tinymce.min.js`,async:n,defer:o}]}getInitialValue(){return typeof this.props.initialValue=="string"?this.props.initialValue:typeof this.props.value=="string"?this.props.value:""}bindHandlers(n){if(this.editor!==void 0){be(this.editor,n,this.props,this.boundHandlers,s=>this.props[s]);const o=s=>s.onEditorChange!==void 0||s.value!==void 0,t=o(n),i=o(this.props);!t&&i?(this.editor.on(B,this.handleEditorChange),this.editor.on(this.beforeInputEvent(),this.handleBeforeInput),this.editor.on("keydown",this.handleBeforeInputSpecial),this.editor.on("keyup",this.handleEditorChangeSpecial),this.editor.on("NewBlock",this.handleEditorChange)):t&&!i&&(this.editor.off(B,this.handleEditorChange),this.editor.off(this.beforeInputEvent(),this.handleBeforeInput),this.editor.off("keydown",this.handleBeforeInputSpecial),this.editor.off("keyup",this.handleEditorChangeSpecial),this.editor.off("NewBlock",this.handleEditorChange))}}};D.propTypes=ve,D.defaultProps={cloudChannel:"7"};let y=D;y.__docgenInfo={description:"@see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/ TinyMCE React Technical Reference}",methods:[],displayName:"Editor",props:{cloudChannel:{defaultValue:{value:"'7'",computed:!1},description:"",type:{name:"string"},required:!1},apiKey:{description:"",type:{name:"string"},required:!1},licenseKey:{description:"",type:{name:"string"},required:!1},id:{description:"",type:{name:"string"},required:!1},inline:{description:"",type:{name:"bool"},required:!1},init:{description:"",type:{name:"object"},required:!1},initialValue:{description:"",type:{name:"string"},required:!1},onEditorChange:{description:"",type:{name:"func"},required:!1},value:{description:"",type:{name:"string"},required:!1},tagName:{description:"",type:{name:"string"},required:!1},tabIndex:{description:"",type:{name:"number"},required:!1},plugins:{description:"",type:{name:"union",value:[{name:"string"},{name:"array"}]},required:!1},toolbar:{description:"",type:{name:"union",value:[{name:"string"},{name:"array"}]},required:!1},disabled:{description:"",type:{name:"bool"},required:!1},textareaName:{description:"",type:{name:"string"},required:!1},tinymceScriptSrc:{description:"",type:{name:"union",value:[{name:"string"},{name:"arrayOf",value:{name:"string"}},{name:"arrayOf",value:{name:"shape",value:{src:{name:"string",required:!1},async:{name:"bool",required:!1},defer:{name:"bool",required:!1}}}}]},required:!1},rollback:{description:"",type:{name:"union",value:[{name:"number"},{name:"enum",value:[{value:"false",computed:!1}]}]},required:!1},scriptLoading:{description:"",type:{name:"shape",value:{async:{name:"bool",required:!1},defer:{name:"bool",required:!1},delay:{name:"number",required:!1}}},required:!1},onActivate:{description:"",type:{name:"func"},required:!1},onAddUndo:{description:"",type:{name:"func"},required:!1},onBeforeAddUndo:{description:"",type:{name:"func"},required:!1},onBeforeExecCommand:{description:"",type:{name:"func"},required:!1},onBeforeGetContent:{description:"",type:{name:"func"},required:!1},onBeforeRenderUI:{description:"",type:{name:"func"},required:!1},onBeforeSetContent:{description:"",type:{name:"func"},required:!1},onBeforePaste:{description:"",type:{name:"func"},required:!1},onBlur:{description:"",type:{name:"func"},required:!1},onChange:{description:"",type:{name:"func"},required:!1},onClearUndos:{description:"",type:{name:"func"},required:!1},onClick:{description:"",type:{name:"func"},required:!1},onContextMenu:{description:"",type:{name:"func"},required:!1},onCommentChange:{description:"",type:{name:"func"},required:!1},onCompositionEnd:{description:"",type:{name:"func"},required:!1},onCompositionStart:{description:"",type:{name:"func"},required:!1},onCompositionUpdate:{description:"",type:{name:"func"},required:!1},onCopy:{description:"",type:{name:"func"},required:!1},onCut:{description:"",type:{name:"func"},required:!1},onDblclick:{description:"",type:{name:"func"},required:!1},onDeactivate:{description:"",type:{name:"func"},required:!1},onDirty:{description:"",type:{name:"func"},required:!1},onDrag:{description:"",type:{name:"func"},required:!1},onDragDrop:{description:"",type:{name:"func"},required:!1},onDragEnd:{description:"",type:{name:"func"},required:!1},onDragGesture:{description:"",type:{name:"func"},required:!1},onDragOver:{description:"",type:{name:"func"},required:!1},onDrop:{description:"",type:{name:"func"},required:!1},onExecCommand:{description:"",type:{name:"func"},required:!1},onFocus:{description:"",type:{name:"func"},required:!1},onFocusIn:{description:"",type:{name:"func"},required:!1},onFocusOut:{description:"",type:{name:"func"},required:!1},onGetContent:{description:"",type:{name:"func"},required:!1},onHide:{description:"",type:{name:"func"},required:!1},onInit:{description:"",type:{name:"func"},required:!1},onInput:{description:"",type:{name:"func"},required:!1},onKeyDown:{description:"",type:{name:"func"},required:!1},onKeyPress:{description:"",type:{name:"func"},required:!1},onKeyUp:{description:"",type:{name:"func"},required:!1},onLoadContent:{description:"",type:{name:"func"},required:!1},onMouseDown:{description:"",type:{name:"func"},required:!1},onMouseEnter:{description:"",type:{name:"func"},required:!1},onMouseLeave:{description:"",type:{name:"func"},required:!1},onMouseMove:{description:"",type:{name:"func"},required:!1},onMouseOut:{description:"",type:{name:"func"},required:!1},onMouseOver:{description:"",type:{name:"func"},required:!1},onMouseUp:{description:"",type:{name:"func"},required:!1},onNodeChange:{description:"",type:{name:"func"},required:!1},onObjectResizeStart:{description:"",type:{name:"func"},required:!1},onObjectResized:{description:"",type:{name:"func"},required:!1},onObjectSelected:{description:"",type:{name:"func"},required:!1},onPaste:{description:"",type:{name:"func"},required:!1},onPostProcess:{description:"",type:{name:"func"},required:!1},onPostRender:{description:"",type:{name:"func"},required:!1},onPreProcess:{description:"",type:{name:"func"},required:!1},onProgressState:{description:"",type:{name:"func"},required:!1},onRedo:{description:"",type:{name:"func"},required:!1},onRemove:{description:"",type:{name:"func"},required:!1},onReset:{description:"",type:{name:"func"},required:!1},onSaveContent:{description:"",type:{name:"func"},required:!1},onSelectionChange:{description:"",type:{name:"func"},required:!1},onSetAttrib:{description:"",type:{name:"func"},required:!1},onSetContent:{description:"",type:{name:"func"},required:!1},onShow:{description:"",type:{name:"func"},required:!1},onSubmit:{description:"",type:{name:"func"},required:!1},onUndo:{description:"",type:{name:"func"},required:!1},onVisualAid:{description:"",type:{name:"func"},required:!1},onSkinLoadError:{description:"",type:{name:"func"},required:!1},onThemeLoadError:{description:"",type:{name:"func"},required:!1},onModelLoadError:{description:"",type:{name:"func"},required:!1},onPluginLoadError:{description:"",type:{name:"func"},required:!1},onIconsLoadError:{description:"",type:{name:"func"},required:!1},onLanguageLoadError:{description:"",type:{name:"func"},required:!1},onScriptsLoad:{description:"",type:{name:"func"},required:!1},onScriptsLoadError:{description:"",type:{name:"func"},required:!1}},composes:["Partial"]};const v="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc",C=`
<h2>Full-featured rich text editing experience</h2>
<p>No matter what you're building, TinyMCE has got you covered.</p>
`.trim(),he={plugins:{control:{type:"text"}},toolbar:{control:{type:"text"}},cloudChannel:{control:{type:"text"}},rollback:{control:{type:"number"}}},we={title:"Editor",component:y,parameters:{actions:{disable:!0}}},E={args:{apiKey:v,initialValue:C},argTypes:he},q={args:{apiKey:v,initialValue:C,inline:!0},argTypes:he,render:r=>p.createElement("div",{style:{paddingTop:"100px"}},p.createElement(y,{...r}))},S={render:()=>{const[r,n]=p.useState(C);return p.createElement("div",null,p.createElement(y,{apiKey:v,value:r,onEditorChange:o=>{n(o)}}),p.createElement("textarea",{style:{width:"100%",height:"200px"},value:r,onChange:o=>n(o.target.value)}))}},T={render:()=>p.createElement(y,{apiKey:v,value:"<p>This value is <strong>fixed</strong> and can not be <em>changed</em>.</p>"})},k={render:()=>{const[n,o]=p.useState("<p>This field can only take 50 characters.</p>"),[t,i]=p.useState(0),s=(a,d)=>{i(d.getContent({format:"text"}).length)},c=(a,d)=>{const h=d.getContent({format:"text"}).length;h<=50&&(o(a),i(h))},l=(a,d)=>{d.getContent({format:"text"}).length>50&&a.preventDefault()};return p.createElement("div",null,p.createElement(y,{apiKey:v,value:n,onEditorChange:c,onBeforeAddUndo:l,onInit:s}),p.createElement("p",null,"Remaining: ",50-t))}},I={render:()=>{const[r,n]=p.useState(!0),o=()=>n(t=>!t);return p.createElement("div",null,p.createElement(y,{apiKey:v,initialValue:C,disabled:r}),p.createElement("button",{onClick:o},r?"Enable Editor":"Disable Editor"))}},L={name:'Cloud Channel Set To "6-dev"',render:()=>p.createElement("div",null,p.createElement(y,{apiKey:v,cloudChannel:"6-dev",initialValue:C}),p.createElement("p",null,'Refresh the page to ensure a load from the "6-dev" channel'))};var H,W,G;E.parameters={...E.parameters,docs:{...(H=E.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    apiKey,
    initialValue
  },
  argTypes
}`,...(G=(W=E.parameters)==null?void 0:W.docs)==null?void 0:G.source}}};var J,$,Y;q.parameters={...q.parameters,docs:{...(J=q.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    apiKey,
    initialValue,
    inline: true
  },
  argTypes,
  render: args => <div style={{
    paddingTop: '100px'
  }}>
      <Editor {...args as IAllProps} />
    </div>
}`,...(Y=($=q.parameters)==null?void 0:$.docs)==null?void 0:Y.source}}};var Q,X,Z;S.parameters={...S.parameters,docs:{...(Q=S.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => {
    const [data, setData] = React.useState(initialValue);
    return <div>
        <Editor apiKey={apiKey} value={data} onEditorChange={e => {
        setData(e);
      }} />
        <textarea style={{
        width: '100%',
        height: '200px'
      }} value={data} onChange={e => setData(e.target.value)} />
      </div>;
  }
}`,...(Z=(X=S.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var ee,ne,te;T.parameters={...T.parameters,docs:{...(ee=T.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <Editor apiKey={apiKey} value='<p>This value is <strong>fixed</strong> and can not be <em>changed</em>.</p>' />
}`,...(te=(ne=T.parameters)==null?void 0:ne.docs)==null?void 0:te.source}}};var re,ie,oe;k.parameters={...k.parameters,docs:{...(re=k.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => {
    const sizeLimit = 50;
    const [data, setData] = React.useState('<p>This field can only take 50 characters.</p>');
    const [len, setLen] = React.useState(0);
    const handleInit = (evt: unknown, editor: TinyMCEEditor) => {
      setLen(editor.getContent({
        format: 'text'
      }).length);
    };
    const handleUpdate = (value: string, editor: TinyMCEEditor) => {
      const length = editor.getContent({
        format: 'text'
      }).length;
      if (length <= sizeLimit) {
        setData(value);
        setLen(length);
      }
    };
    const handleBeforeAddUndo = (evt: EditorEvent<Events.EditorEventMap['BeforeAddUndo']>, editor: TinyMCEEditor) => {
      const length = editor.getContent({
        format: 'text'
      }).length;
      // note that this is the opposite test as in handleUpdate
      // because we are determining when to deny adding an undo level
      if (length > sizeLimit) {
        evt.preventDefault();
      }
    };
    return <div>
        <Editor apiKey={apiKey} value={data} onEditorChange={handleUpdate} onBeforeAddUndo={handleBeforeAddUndo} onInit={handleInit} />
        <p>Remaining: {sizeLimit - len}</p>
      </div>;
  }
}`,...(oe=(ie=k.parameters)==null?void 0:ie.docs)==null?void 0:oe.source}}};var se,ae,ce;I.parameters={...I.parameters,docs:{...(se=I.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => {
    const [disabled, setDisabled] = React.useState(true);
    const toggleDisabled = () => setDisabled(prev => !prev);
    return <div>
        <Editor apiKey={apiKey} initialValue={initialValue} disabled={disabled} />
        <button onClick={toggleDisabled}>
          {disabled ? 'Enable Editor' : 'Disable Editor'}
        </button>
      </div>;
  }
}`,...(ce=(ae=I.parameters)==null?void 0:ae.docs)==null?void 0:ce.source}}};var de,le,pe;L.parameters={...L.parameters,docs:{...(de=L.parameters)==null?void 0:de.docs,source:{originalSource:`{
  name: 'Cloud Channel Set To "6-dev"',
  render: () => <div>
      <Editor apiKey={apiKey} cloudChannel='6-dev' initialValue={initialValue} />
      <p>Refresh the page to ensure a load from the "6-dev" channel</p>
    </div>
}`,...(pe=(le=L.parameters)==null?void 0:le.docs)==null?void 0:pe.source}}};const Re=["IframeEditor","InlineEditor","ControlledInput","ControlledInputFixed","ControlledInputLimitLength","ToggleDisabledProp","CloudChannelSetTo5Dev"];export{L as CloudChannelSetTo5Dev,S as ControlledInput,T as ControlledInputFixed,k as ControlledInputLimitLength,E as IframeEditor,q as InlineEditor,I as ToggleDisabledProp,Re as __namedExportsOrder,we as default};
