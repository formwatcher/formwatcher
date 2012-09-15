// Generated by CoffeeScript 1.3.3
(function(){var e,t,n,r,i=[].slice,s={}.hasOwnProperty,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype
,e.prototype=new r,e.__super__=t.prototype,e};e=ender,e.ender({fwData:function(e,t){var n;return this.data("_formwatcher")==null&&this.data("_formwatcher",{}),e==null?this:(n=this.data("_formwatcher"),
t!=null?(n[e]=t,this.data("_formwatcher",n),this):n[e])}},!0),r="input, textarea, select, button",t={version:"2.1.10-dev",debugging:!1,debug:function(){if(this.debugging&&(typeof console!=="undefined"&&
console!==null?console.debug:void 0)!=null)return console.debug.apply(console,arguments)},getErrorsElement:function(t,n){var r,i;i=t.input,i.attr("name")&&(r=e("#"+i.attr("name")+"-errors")),(r!=null?r
.length:void 0)||!i.attr("id")||(r=e("#"+i.attr("id")+"-errors"));if(!r||!r.length)r=e.create("<small />"),i.attr("name")&&r.attr("id",i.attr("name")+"-errors"),r.insertAfter(i);return r.hide().addClass
("errors").addClass("fw-errors")},deepExtend:function(){var e,t,n,r,o,u,a;n=arguments[0],e=2<=arguments.length?i.call(arguments,1):[];if(n==null)return{};for(u=0,a=e.length;u<a;u++){r=e[u];for(t in r){
if(!s.call(r,t))continue;o=r[t],n[t]==null||typeof o!="object"?n[t]=o:n[t]=this.deepExtend(n[t],o)}}return n},getLabel:function(t,n){var r,i,s;r=t.input,r.attr("id")&&(i=e("label[for="+r.attr("id")+"]"
),i.length||(i=undefined));if(!i&&n){s=r.parent();if(s.get(0).nodeName==="LABEL")i=e("span",s).first(),i.length===0&&(i=void 0);else{i=r.previous();if(!i.length||i.get(0).nodeName!=="LABEL"||i.attr("for"
)!=null)i=void 0}}return i},changed:function(e,n){var r;r=e.input;if(!r.fwData("forceValidationOnChange")&&r.attr("type")==="checkbox"&&r.fwData("previouslyChecked")===!!r[0].checked||r.fwData("previousValue"
)===r.val())return;r.fwData("forceValidationOnChange",!1),this.setPreviousValueToCurrentValue(e),r.attr("type")==="checkbox"&&r.fwData("initialyChecked")!==!!r[0].checked||r.attr("type")!=="checkbox"&&
r.fwData("initialValue")!==r.val()?t.setChanged(e,n):t.unsetChanged(e,n);if(n.options.validate)return n.validateElements(e)},setChanged:function(e,n){var r,i,o;o=e.input;if(o.fwData("changed"))return;for(
i in e){if(!s.call(e,i))continue;r=e[i],r.addClass("changed")}o.fwData("changed",!0),n.options.submitUnchanged||t.restoreName(e);if(n.options.submitOnChange&&n.options.ajax)return n.submitForm()},unsetChanged
:function(e,n){var r,i,o;o=e.input;if(!o.fwData("changed"))return;for(i in e){if(!s.call(e,i))continue;r=e[i],r.removeClass("changed")}o.fwData("changed",!1);if(!n.options.submitUnchanged)return t.removeName
(e)},storeInitialValue:function(e){var t;return t=e.input,t.attr("type")==="checkbox"?t.fwData("initialyChecked",!!t[0].checked):t.fwData("initialValue",t.val()),this.setPreviousValueToInitialValue(e)}
,restoreInitialValue:function(e){var t;return t=e.input,t.attr("type")==="checkbox"?t.attr("checked",t.fwData("initialyChecked")):t.val(t.fwData("initialValue")),this.setPreviousValueToInitialValue(e)}
,setPreviousValueToInitialValue:function(e){var t;return t=e.input,t.attr("type")==="checkbox"?t.fwData("previouslyChecked",t.fwData("initialyChecked")):t.fwData("previousValue",t.fwData("initialValue"
))},setPreviousValueToCurrentValue:function(e){var t;return t=e.input,t.attr("type")==="checkbox"?t.fwData("previouslyChecked",!!t[0].checked):t.fwData("previousValue",t.val())},removeName:function(e){
var t;t=e.input;if(t.attr("type")==="checkbox")return;return t.fwData("name")||t.fwData("name",t.attr("name")||""),t.attr("name","")},restoreName:function(e){var t;t=e.input;if(t.attr("type")==="checkbox"
)return;return t.attr("name",t.fwData("name"))},decorators:[],decorate:function(e,n){var r,i,s,o,u;i=null,u=e.decorators;for(s=0,o=u.length;s<o;s++){r=u[s];if(r.accepts(n)){i=r;break}}return i?(t.debug
('Decorator "'+i.name+'" found for input field "'+n.attr("name")+'".'),i.decorate(n)):{input:n}},validators:[],currentWatcherId:0,watchers:[],add:function(e){return this.watchers[e.id]=e},get:function(
e){return this.watchers[e]},getAll:function(){return this.watchers},scanDocument:function(){var r,i,s,o=this;i=function(r){var i,s,u;r=e(r);if(r.fwData("watcher"))return;return s=r.attr("id"),u=s!=null&&
t.options[s]!=null?t.options[s]:{},i=r.data("fw"),i&&(u=o.deepExtend(u,JSON.parse(i))),new n(r,u)},e("form[data-fw]").each(function(e){return i(e)}),s=[];for(r in t.options)s.push(i(e("#"+r)));return s
},watch:function(t,r){return e.domReady(function(){return new n(t,r)})}},t._ElementWatcher=function(){function e(e){var n;this.watcher=e,this.options=t.deepExtend({},this.defaultOptions,(n=e.options[this
.name])!=null?n:{})}return e.prototype.name="No name",e.prototype.description="No description",e.prototype.nodeNames=null,e.prototype.classNames=[],e.prototype.defaultOptions={},e.prototype.options=null
,e.prototype.accepts=function(e){var t,n,r,i,s,o,u,a,f,l,c;if(this.watcher.options[this.name]!=null&&this.watcher.options[this.name]===!1)return!1;r=!1,i=e.get(0).nodeName,l=this.nodeNames;for(o=0,a=l.
length;o<a;o++){s=l[o];if(i===s){r=!0;break}}if(!r)return!1;n=!0,c=this.classNames;for(u=0,f=c.length;u<f;u++){t=c[u];if(!e.hasClass(t)){n=!1;break}}return n},e}(),t.Decorator=function(e){function t(){
return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.decorate=function(e,t){return{input:t}},t}(t._ElementWatcher),t.Validator=function(e){function t(){return t.__super__.constructor
.apply(this,arguments)}return o(t,e),t.prototype.nodeNames=["INPUT","TEXTAREA","SELECT"],t.prototype.validate=function(e,t){return!0},t.prototype.sanitize=function(e){return e},t}(t._ElementWatcher),t.
defaultOptions={ajax:!1,ajaxMethod:null,validate:!0,submitOnChange:!1,submitUnchanged:!0,submitFormIfAllUnchanged:!1,resetFormAfterSubmit:!1,automatchLabel:!0,responseCheck:function(e){return!e},onSubmit
:function(){},onSuccess:function(e){},onError:function(e){return alert(e)},onComplete:function(e){}},t.options={},n=function(){function n(n,i){var s,o,u,a,f,l,c,h,p,d,v,m=this;this.form=typeof n=="string"?
e("#"+n):e(n);if(this.form.length<1)throw"Form element not found.";if(this.form.length>1)throw"More than one form was found.";if(this.form.get(0).nodeName!=="FORM")throw"The element was not a form.";this
.allElements=[],this.id=t.currentWatcherId++,t.add(this),this.observers={},this.form.fwData("watcher",this),this.form.fwData("originalAction",this.form.attr("action")||"").attr("action","javascript:undefined;"
),this.options=t.deepExtend({},t.defaultOptions,i||{}),this.decorators=[],this.validators=[],p=t.decorators;for(f=0,c=p.length;f<c;f++)s=p[f],this.decorators.push(new s(this));d=t.validators;for(l=0,h=
d.length;l<h;l++)o=d[l],this.validators.push(new o(this));this.options.ajaxMethod===null&&(this.options.ajaxMethod=(v=this.form.attr("method"))!=null?v.toLowerCase():void 0);switch(this.options.ajaxMethod
){case"post":case"put":case"delete":break;default:this.options.ajaxMethod="get"}this.observe("submit",this.options.onSubmit),this.observe("success",this.options.onSuccess),this.observe("error",this.options
.onError),this.observe("complete",this.options.onComplete),e(r,this.form).each(function(n){var r,i,s,o,u,a,f,l,c,h,p,d;n=e(n);if(!n.fwData("initialized")){if(n.attr("type")==="hidden")return n.fwData("forceSubmission"
,!0);i=t.decorate(m,n),i.input.get()!==n.get()&&(i.input.attr("class",n.attr("class")),n=i.input),i.label||(u=t.getLabel(i,m.options.automatchLabel),u&&(i.label=u)),i.errors||(s=t.getErrorsElement(i,!0
),i.errors=s),m.allElements.push(i),n.fwData("validators",[]),p=m.validators;for(c=0,h=p.length;c<h;c++)l=p[c],l.accepts(n,m)&&(t.debug('Validator "'+l.name+'" found for input field "'+n.attr("name")+'".'
),n.fwData("validators").push(l));t.storeInitialValue(i);if(n.val()===null||!n.val())for(o in i)r=i[o],r.addClass("empty");m.options.submitUnchanged||t.removeName(i),a=function(){return t.changed(i,m)}
,f=function(){return m.validateElements(i,!0)},d=[];for(o in i)r=i[o],d.push(function(e){var t=this;return e.on("focus",function(){return e.addClass("focus")}),e.on("blur",function(){return e.removeClass
("focus")}),e.on("change",a),e.on("blur",a),e.on("keyup",f)}(r));return d}}),a=e("input[type=submit], button[type=''], button[type='submit'], button:not([type])",this.form),u=e.create('<input type="hidden" name="" value="" />'
),this.form.append(u),a.each(function(t){return t=e(t),t.click(function(e){var n,r,i,s;return t[0].tagName==="BUTTON"?(r=t.text(),t.text(""),n=(i=t.val())!=null?i:"",t.text(r)):n=(s=t.val())!=null?s:""
,u.attr("name",t.attr("name")||"").val(n),m.submitForm(),e.stopPropagation()})})}return n.prototype.callObservers=function(){var e,t,n,r,s,o,u;t=arguments[0],e=2<=arguments.length?i.call(arguments,1):[
],o=this.observers[t],u=[];for(r=0,s=o.length;r<s;r++)n=o[r],u.push(n.apply(this,e));return u},n.prototype.observe=function(e,t){return this.observers[e]===undefined&&(this.observers[e]=[]),this.observers
[e].push(t),this},n.prototype.stopObserving=function(e,t){var n;return this.observers[e]=function(){var r,i,s,o;s=this.observers[e],o=[];for(r=0,i=s.length;r<i;r++)n=s[r],n!==t&&o.push(n);return o}.call
(this),this},n.prototype.enableForm=function(){return e(r,this.form).removeAttr("disabled")},n.prototype.disableForm=function(){return e(r,this.form).attr("disabled","disabled")},n.prototype.submitForm=
function(e){var t=this;if(!this.options.validate||this.validateForm())return this.callObservers("submit"),this.form.addClass("submitting"),this.options.ajax?(this.disableForm(),this.submitAjax()):(this
.form.attr("action",this.form.fwData("originalAction")),setTimeout(function(){return t.form.submit(),t.disableForm()},1),!1)},n.prototype.validateForm=function(){var e,t,n,r,i;t=!0,i=this.allElements;for(
n=0,r=i.length;n<r;n++)e=i[n],this.validateElements(e)||(t=!1);return t},n.prototype.validateElements=function(e,n){var r,i,o,u,a,f,l,c,h,p,d,v,m;o=e.input,a=!0;if(o.fwData("validators").length){if(!n||!
o.fwData("lastValidatedValue")||o.fwData("lastValidatedValue")!==o.val()){o.fwData("lastValidatedValue",o.val()),t.debug("Validating input "+o.attr("name")),o.fwData("validationErrors",[]),v=o.fwData("validators"
);for(c=0,p=v.length;c<p;c++){l=v[c];if(o.val()===""&&l.name!=="Required"){t.debug("Validating "+l.name+". Field was empty so continuing.");continue}t.debug("Validating "+l.name),f=l.validate(l.sanitize
(o.val()),o);if(f!==!0){a=!1,o.fwData("validationErrors").push(f);break}}if(a){e.errors.html("").hide();for(i in e){if(!s.call(e,i))continue;r=e[i],r.addClass("validated"),r.removeClass("error")}n&&e.input
.fwData("forceValidationOnChange",!0)}else{for(i in e){if(!s.call(e,i))continue;r=e[i],r.removeClass("validated")}if(!n){e.errors.html(o.fwData("validationErrors").join("<br />")).show();for(i in e){if(!
s.call(e,i))continue;r=e[i],r.addClass("error")}}}}if(!n&&a){u=o.fwData("lastValidatedValue"),m=o.fwData("validators");for(h=0,d=m.length;h<d;h++)l=m[h],u=l.sanitize(u);o.val(u)}}else for(i in e){if(!s
.call(e,i))continue;r=e[i],r.addClass("validated")}return a},n.prototype.submitAjax=function(){var n,i,s,o=this;return t.debug("Submitting form via AJAX."),i={},n=0,s=0,e(r,this.form).each(function(t,r
){var s,u;t=e(t);if(t[0].nodeName==="BUTTON"||t[0].nodeName==="INPUT"&&(t.attr("type").toLowerCase()==="submit"||t.attr("type").toLowerCase()==="button"))return;if(t.fwData("forceSubmission")||t.attr("type"
)&&t.attr("type").toLowerCase()==="checkbox"||t.fwData("changed")||o.options.submitUnchanged)if(t.attr("type")!=="checkbox"||t.get(0).checked)return n++,s=(u=t.attr("name"))!=null?u:"unnamedInput_"+r,i
[s]=t.val()}),n===0&&!this.options.submitFormIfAllUnchanged?setTimeout(function(){return o.enableForm(),o.ajaxSuccess()},1):e.ajax({url:this.form.fwData("originalAction"),method:this.options.ajaxMethod
,data:i,type:"text",error:function(e){return o.callObservers("error",e.response)},success:function(e){return o.enableForm(),o.options.responseCheck(e.response)?(o.callObservers("success",e.response),o.
ajaxSuccess()):o.callObservers("error",e.response)},complete:function(e){return o.form.removeClass("submitting"),o.callObservers("complete",e.response)}})},n.prototype.ajaxSuccess=function(){var e,n,r,
i,s,o,u,a;u=this.allElements,a=[];for(s=0,o=u.length;s<o;s++)n=u[s],t.unsetChanged(n,this),this.options.resetFormAfterSubmit?t.restoreInitialValue(n):t.storeInitialValue(n),i=n.input.val()===null||!n.input
.val(),a.push(function(){var t;t=[];for(r in n)e=n[r],i?t.push(e.addClass("empty")):t.push(e.removeClass("empty"));return t}());return a},n}(),typeof window!="undefined"&&window!==null&&(window.Formwatcher=
t,window.Watcher=n),e.domReady(function(){return t.scanDocument()})}).call(this);// Generated by CoffeeScript 1.3.3
(function(){var e,t={}.hasOwnProperty,n=function(e,n){function i(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return i.prototype=n.prototype,e.prototype=new 
i,e.__super__=n.prototype,e};e=function(e){return e.replace(/^\s.*\s$/,"")},Formwatcher.validators.push(function(t){function r(){return r.__super__.constructor.apply(this,arguments)}return n(r,t),r.prototype
.name="Integer",r.prototype.description="Makes sure a value is an integer",r.prototype.classNames=["validate-integer"],r.prototype.validate=function(e){return e.replace(/\d*/,"")!==""?"Has to be a number."
:!0},r.prototype.sanitize=function(t){return e(t)},r}(Formwatcher.Validator)),Formwatcher.validators.push(function(t){function r(){return r.__super__.constructor.apply(this,arguments)}return n(r,t),r.prototype
.name="Required",r.prototype.description="Makes sure the value is not blank (nothing or spaces).",r.prototype.classNames=["required"],r.prototype.validate=function(t,n){return n.attr("type")==="checkbox"&&!
n.is(":checked")||!e(t)?"Can not be blank.":!0},r}(Formwatcher.Validator)),Formwatcher.validators.push(function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return n(t,e),t.prototype
.name="NotZero",t.prototype.description="Makes sure the value is not 0.",t.prototype.classNames=["not-zero"],t.prototype.validate=function(e){var t;return t=parseInt(e),!isNaN(t)&&t===0?"Can not be 0."
:!0},t}(Formwatcher.Validator)),Formwatcher.validators.push(function(t){function r(){return r.__super__.constructor.apply(this,arguments)}return n(r,t),r.prototype.name="Email",r.prototype.description="Makes sure the value is an email."
,r.prototype.classNames=["validate-email"],r.prototype.validate=function(e){var t;return t=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
,e.match(t)?!0:"Must be a valid email address."},r.prototype.sanitize=function(t){return e(t)},r}(Formwatcher.Validator)),Formwatcher.validators.push(function(t){function r(){return r.__super__.constructor
.apply(this,arguments)}return n(r,t),r.prototype.name="Float",r.prototype.description="Makes sure a value is a float",r.prototype.classNames=["validate-float"],r.prototype.defaultOptions={decimalMark:","
},r.prototype.validate=function(e){var t;return t=new RegExp("\\d+(\\"+this.options.decimalMark+"\\d+)?"),e.replace(t,"")!==""?"Has to be a number.":!0},r.prototype.sanitize=function(t){return t.indexOf
(".")>=0&&t.indexOf(",")>=0&&(t.lastIndexOf(",")>t.lastIndexOf(".")?t=t.replace(/\./g,""):t=t.replace(/\,/g,"")),t.indexOf(",")>=0&&(t=t.replace(/\,/g,".")),t.indexOf(".")!==t.lastIndexOf(".")&&(t=t.replace
(/\./g,"")),t=t.replace(/\./g,this.options.decimalMark),e(t)},r}(Formwatcher.Validator))}).call(this);// Generated by CoffeeScript 1.3.3
(function(){var e,t={}.hasOwnProperty,n=function(e,n){function i(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return i.prototype=n.prototype,e.prototype=new 
i,e.__super__=n.prototype,e};e=ender,Formwatcher.decorators.push(function(t){function r(){return r.__super__.constructor.apply(this,arguments)}return n(r,t),r.prototype.name="Hint",r.prototype.description="Displays a hint in an input field."
,r.prototype.nodeNames=["INPUT","TEXTAREA"],r.prototype.defaultOptions={auto:!0,removeTrailingColon:!0,color:"#aaa"},r.prototype.decParseInt=function(e){return parseInt(e,10)},r.prototype.accepts=function(
e){if(r.__super__.accepts.call(this,e))if(e.data("hint")!=null||this.options.auto&&Formwatcher.getLabel({input:e},this.watcher.options.automatchLabel))return!0;return!1},r.prototype.decorate=function(t
){var n,r,i,s,o,u,a,f,l,c,h,p,d=this;i={input:t},o=t.data("hint");if(o==null||!o){f=Formwatcher.getLabel(i,this.watcher.options.automatchLabel);if(!f)throw"The hint was empty, but there was no label.";
i.label=f,f.hide(),o=f.html(),this.options.removeTrailingColon&&(o=o.replace(/\s*\:\s*$/,""))}return Formwatcher.debug("Using hint: "+o),p=e.create('<span style="display: inline-block; position: relative;" />'
),p.insertAfter(t),p.append(t),a={left:t[0].offsetLeft,top:t[0].offsetTop,width:t[0].offsetWidth,height:t[0].offsetHeight},l=this.decParseInt(t.css("paddingLeft"))+this.decParseInt(a.left)+this.decParseInt
(t.css("borderLeftWidth"))+2+"px",h=this.decParseInt(t.css("paddingTop"))+this.decParseInt(a.top)+this.decParseInt(t.css("borderTopWidth"))+"px",u=e.create("<span />").html(o).css({position:"absolute",
display:"none",top:h,left:l,fontSize:t.css("fontSize"),lineHeight:t.css("lineHeight"),fontFamily:t.css("fontFamily"),color:this.options.color}).addClass("hint").on("click",function(){return t[0].focus(
)}).insertAfter(t),s=100,t.focusin(function(){if(t.val()==="")return u.animate({opacity:.4,duration:s})}),t.focusout(function(){if(t.val()==="")return u.animate({opacity:1,duration:s})}),n=function(){return t
.val()===""?u.show():u.hide()},t.keyup(n),t.keypress(function(){return setTimeout(function(){return n()},1)}),t.keydown(function(){return setTimeout(function(){return n()},1)}),t.change(n),c=10,r=function(
){return n(),setTimeout(function(){return r()},c),c*=2,c=c>1e4?1e4:c},r(),i},r}(Formwatcher.Decorator))}).call(this);