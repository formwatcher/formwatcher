// Generated by CoffeeScript 1.3.1
((function(){var a={}.hasOwnProperty,b=function(b,c){function e(){this.constructor=b}for(var d in c)a.call(c,d)&&(b[d]=c[d]);return e.prototype=c.prototype,b.prototype=new 
e,b.__super__=c.prototype,b};Formwatcher.decorators.push(function(a){function c(){return c.__super__.constructor.apply(this,arguments)}return b(c,a),c.prototype.name="DatePicker",c.prototype.description="Shows a date picker to select a date."
,c.prototype.nodeNames=["INPUT"],c.prototype.classNames=["date"],c.prototype.strPad=function(a,b){b==null&&(b=2),a=a.toString();while(a.length<b)a="0"+a;return a},c.prototype.defaultOptions={months:null
,formatDate:function(a,b,c){return[a,this.strPad(b),this.strPad(c)].join("-")},weekStart:0,daysOfWeek:null},c.prototype.decorate=function(a){var b,c;return b={input:a},c=Formwatcher.deepExtend({date:new 
Date(a.val())},this.options),a.calender(c),b},c}(Formwatcher.Decorator))})).call(this);