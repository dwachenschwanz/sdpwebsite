var isNN = (navigator.appName.indexOf("Netscape") != -1);
var isIE = (navigator.appName.indexOf("Microsoft") != -1);
var IEVersion = (isIE ? getIEVersion() : 0);
var NNVersion = (isNN ? getNNVersion() : 0);
var EditableGrid = false;
var disableValidation = false;
function functionExists(functionName)
{
  var exists = true;
  try{
    exists = typeof(eval(functionName))=="function";
  }catch(e){
    exists = false;
  }
  return exists;
}
function ccsShowError(control, msg)
{
  alert(msg);
  control.focus();
  return false;
}
function getNNVersion()
{
  var userAgent = window.navigator.userAgent;
  var isMajor = parseInt(window.navigator.appVersion);
  var isMinor = parseFloat(window.navigator.appVersion);
  if (isMajor == 2) return 2;
  if (isMajor == 3) return 3;
  if (isMajor == 4) return 4;
  if (isMajor == 5) 
  {
    if (userAgent.toLowerCase().indexOf('netscape')!=-1)
    {
      isMajor = parseInt(userAgent.substr(userAgent.toLowerCase().indexOf('netscape')+9));
      if (isMajor>0) return isMajor;
    }
    return 6;
  }
  return isMajor;
}
function getIEVersion()
{
  var userAgent = window.navigator.userAgent;
  var MSIEPos = userAgent.indexOf("MSIE");
  return (MSIEPos > 0 ? parseInt(userAgent.substring(MSIEPos+5, userAgent.indexOf(".", MSIEPos))) : 0);
}
function inputMasking(evt)
{
  if (isIE && IEVersion > 4)
  {
    if (window.event.altKey) return false;
    if (window.event.ctrlKey) return false;
    if (typeof(this.ccsInputMask) == "string")
    {
      var mask = this.ccsInputMask;
      var keycode = window.event.keyCode;
      this.value = applyMask(keycode, mask, this.value);
    }
    return (window.event.keyCode==13?true:false);
  } else if (isNN && NNVersion<6)
  {
    if (evt.ALT_MASK) return false;
    if (evt.CONTROL_MASK) return false;
    if (typeof(this.ccsInputMask) == "string")
    {
      var mask = this.ccsInputMask;
      var keycode = evt.which;
      this.value = applyMask(keycode, mask, this.value);
    }
    return (evt.which==13?true:false);
  } else if (isNN && NNVersion==6)
  {
    if (evt.altKey) return false;
    if (evt.ctrlKey) return false;
    var cancelKey = evt.which==13;
    if (typeof(this.ccsInputMask) == "string")
    {
      var mask = this.ccsInputMask;
      var keycode = evt.which;
      if (keycode >= 32)
        this.value = applyMaskToValue(mask, this.value);
    }
    return cancelKey || evt.which==13;
  } else if (isNN && NNVersion==7)
  {
    if (evt.altKey) return false;
    if (evt.ctrlKey) return false;
    var cancelKey = evt.which==13;
    if (typeof(this.ccsInputMask) == "string")
    {
      var mask = this.ccsInputMask;
      var keycode = evt.which;
      cancelKey = keycode < 32;
      if (!cancelKey)
        this.value = applyMask(keycode, mask, this.value);
    }
    return cancelKey || evt.which==13;
  } else
    return true;
}
function applyMaskToValue(mask, value)
{
  var oldValue = String(value);
  var newValue = "";
  for (var i=0; i<oldValue.length; i++)
  {
    newValue = applyMask(oldValue.charCodeAt(i), mask, newValue);
  }
  return newValue;
}
function applyMask(keycode, mask, value)
{
  var digit = (keycode >= 48 && keycode <= 57);
  var plus = (keycode == 43);
  var dash = (keycode == 45);
  var space = (keycode == 32);
  var uletter = (keycode >= 65 && keycode <= 90);
  var lletter = (keycode >= 97 && keycode <= 122);
  var pos = value.length;
  switch(mask.charAt(pos))
  {
    case "0":
      if (digit)
        value += String.fromCharCode(keycode);
      break;
    case "L":
      if (uletter || lletter)
        value += String.fromCharCode(keycode);
      break;
    default:
      var isMatchMask = (String.fromCharCode(keycode) == mask.charAt(pos));
      while (pos < mask.length && mask.charAt(pos) != "0" && mask.charAt(pos) != "L")
        value += mask.charAt(pos++);
      if (!isMatchMask && pos < mask.length)
        value = applyMask(keycode, mask, value);
  }  
  return value;
}
function validate_control(control)
{
/*
ccsCaption - string
ccsErrorMessage - string
ccsRequired - boolean
ccsMinLength - integer
ccsMaxLength - integer
ccsRegExp - string
ccsValidator - validation function
ccsInputMask - string
*/
  if (disableValidation) return true;
  var errorMessage = control.ccsErrorMessage;
  var customErrorMessage = (typeof(errorMessage) != "undefined");
  if (typeof(control.ccsRequired) == "boolean" && control.ccsRequired)
    if (control.value == "")
      return ccsShowError(control, customErrorMessage ? errorMessage :
        "" + control.ccsCaption + " is required.");
  if (typeof(control.ccsMinLength) == "number")
    if (control.value != "" && control.value.length < parseInt(control.ccsMinLength))
      return ccsShowError(control, customErrorMessage ? errorMessage :
        "The length in field " + control.ccsCaption + " can't be less than " + parseInt(control.ccsMinLength) + " symbols.");
  if (typeof(control.ccsMaxLength) == "number")
    if (control.value != "" && control.value.length > parseInt(control.ccsMaxLength))
      return ccsShowError(control, customErrorMessage ? errorMessage :
        "The length in field " + control.ccsCaption + " can't be greater than " + parseInt(control.ccsMaxLength) + " symbols.");
  if (typeof(control.ccsInputMask) == "string")
  {
    var mask = control.ccsInputMask;
    var maskRE = new RegExp(stringToRegExp(mask).replace(/0/g,"\\d").replace(/L/g,"[A-Za-z]"), "i");
    if (control.value != "" && (control.value.search(maskRE) == -1))
      return ccsShowError(control, customErrorMessage ? errorMessage :
        "" + control.ccsCaption + " is not valid.");
  }
  if (typeof(control.ccsRegExp) == "string")
    if (control.value != "" && (control.value.search(new RegExp(control.ccsRegExp, "i")) == -1))
      return ccsShowError(control, customErrorMessage ? errorMessage :
        "" + control.ccsCaption + " is not valid.");
  if (typeof(control.ccsDateFormat) == "string")
  {
    if (control.value != "" && !checkDate(control.value, control.ccsDateFormat))
      return ccsShowError(control, customErrorMessage ? errorMessage :
        "" + control.ccsCaption + " is not valid. Use the following format: "+control.ccsDateFormat);
  }
  if (typeof(control.ccsValidator) == "function")
    if (!control.ccsValidator())
      return ccsShowError(control, customErrorMessage ? errorMessage :
        "" + control.ccsCaption + " is not valid.");
  return true;
}
function stringToRegExp(string, arg)
{
  var str = String(string);
  str = str.replace(/\\/g,"\\\\");
  str = str.replace(/\//g,"\\/");
  str = str.replace(/\./g,"\\.");
  str = str.replace(/\(/g,"\\(");
  str = str.replace(/\)/g,"\\)");
  str = str.replace(/\[/g,"\\[");
  str = str.replace(/\]/g,"\\]");
  return str;
}
function checkDate(dateValue, dateFormat)
{
  var DateMasks = new Array(
                    new Array("MMMM", "[a-z]+"),
                    new Array("mmmm", "[a-z]+"),
                    new Array("yyyy", "[0-9]{4}"),
                    new Array("MMM", "[a-z]+"),
                    new Array("mmm", "[a-z]+"),
                    new Array("HH", "([0-1][0-9]|2[0-4])"),
                    new Array("hh", "(0[1-9]|1[0-2])"),
                    new Array("dd", "([0-2][0-9]|3[0-1])"),
                    new Array("MM", "(0[1-9]|1[0-2])"),
                    new Array("mm", "(0[1-9]|1[0-2])"),
                    new Array("yy", "[0-9]{2}"),
                    new Array("nn", "[0-5][0-9]"),
                    new Array("ss", "[0-5][0-9]"),
                    new Array("w", "[1-7]"),
                    new Array("d", "([1-9]|[1-2][0-9]|3[0-1])"),
                    new Array("y", "([1-2][0-9]{0,2}|3([0-5][0-9]|6[0-5]))"),
                    new Array("H", "(00|0?[1-9]|1[0-9]|2[0-4])"),
                    new Array("h", "(0?[1-9]|1[0-2])"),
                    new Array("M", "(0?[1-9]|1[0-2])"),
                    new Array("m", "(0?[1-9]|1[0-2])"),
                    new Array("n", "[0-5]?[0-9]"),
                    new Array("s", "[0-5]?[0-9]"),
                    new Array("q", "[1-4]")
                  );
  var regExp = "^"+stringToRegExp(dateFormat)+"$";
  for (var i=0; i<DateMasks.length; i++)
  {
    regExp = regExp.replace(DateMasks[i][0], DateMasks[i][1]);
  }
  var regExp = new RegExp(regExp,"i");
  return String(dateValue).search(regExp)!=-1;
}
function validate_row(rowId, form)
{
  var result = true;
  var isInsert = false;
  if (disableValidation) return true;
  if(typeof(eval(form + "EmptyRows")) == "number")
    if(eval(form + "Elements").length - rowId <= eval(form + "EmptyRows"))
      isInsert = true;
    for (var i = 0; i < eval(form + "Elements")[rowId].length && isInsert; i++)
      isInsert = GetValue(eval(form + "Elements")[rowId][i]) == "";
  if(isInsert) return true;
  if(typeof(eval(form + "DeleteControl")) == "number")
    {
      var control = eval(form + "Elements")[rowId][eval(form + "DeleteControl")];
      if(control.type == "checkbox")
        if(control.checked == true ) return true;
      if(control.type == "hidden")
        if(control.value != "" ) return true;
    }
  for (var i = 0; i < eval(form + "Elements")[rowId].length && (result = validate_control(eval(form + "Elements")[rowId][i])); i++);
  return result;
}
function GetValue(control) {
    if (typeof(control.value) == "string") {
        return control.value;
    }
    if (typeof(control.tagName) == "undefined" && typeof(control.length) == "number") {
        var j;
        for (j=0; j < control.length; j++) {
            var inner = control[j];
            if (typeof(inner.value) == "string" && (inner.type != "radio" || inner.status == true)) {
                return inner.value;
            }
        }
    }
    else {
        return GetValueRecursive(control);
    }
    return "";
}
function GetValueRecursive(control)
{
    if (typeof(control.value) == "string" && (control.type != "radio" || control.status == true)) {
        return control.value;
    }
    var i, val;
    for (i = 0; i<control.children.length; i++) {
        val = GetValueRecursive(control.children[i]);
        if (val != "") return val;
    }
    return "";
}
function validate_form(form)
{
  var result = true;
  if (disableValidation) return true;
  if(typeof(form) == "object" && String(form.tagName).toLowerCase()!="form" && form.form!=null) form = form.form;
  if(typeof(form) == "object" && document.getElementById(form.name + "Elements")) {
    if (typeof(eval(form.name + "Elements")) == "object") 
      for (var j = 0; j < eval(form.name + "Elements").length && result; j++) result = validate_row(j, form.name);
    else 
      for (var i = 0; i < form.elements.length && (result = validate_control(form.elements[i])); i++);
  }else if(typeof(form) == "string" && document.getElementById(form.name + "Elements"))
  {
    if(typeof(eval(form + "Elements")) == "object"){
      for (var j = 0; j < eval(form + "Elements").length && result; j++)
        result = validate_row(j, form);
    }
  }else if (typeof(form) == "object")
          for (var i = 0; i < form.elements.length && (result = validate_control(form.elements[i])); i++);
        else	
          for (var i = 0; i < document.forms[form].elements.length && (result = validate_control(document.forms[form].elements[i])); i++);
  return result;
}
function forms_onload()
{
  var forms = document.forms;
  var i, j, elm, form;
  for(i = 0; i < forms.length; i++)
  {
    form = forms[i];
    if (typeof(form.onLoad) == "function") form.onLoad();
    for (j = 0; j < form.elements.length; j++)
    {
      elm = form.elements[j];
      if (typeof(elm.onLoad) == "function") elm.onLoad();
    }
  }
  return true;
}
function check_and_bind(element,event,func) {
  var htmlElement = eval(element);
  if (htmlElement) {
    if (typeof(htmlElement)=="object" && !htmlElement.tagName && htmlElement.length > 0)
    {
      for (var i=0; i < htmlElement.length; i++)
        eval(element+"["+i+'].'+event+'='+func);
    }else eval(element+'.'+event+'='+func);
  }
}
function MM_findObj(n, d) { 
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}
function MM_validateForm() { 
  var i,p,q,nm,test,num,min,max,errors='',args=MM_validateForm.arguments;
  for (i=0; i<(args.length-2); i+=3) { test=args[i+2]; val=MM_findObj(args[i]);
    if (val) { nm=val.name; if ((val=val.value)!="") {
      if (test.indexOf('isEmail')!=-1) { p=val.indexOf('@');
        if (p<1 || p==(val.length-1)) errors+='- '+nm+' must contain an e-mail address.\n';
      } else if (test!='R') { num = parseFloat(val);
        if (isNaN(val)) errors+='- '+nm+' must contain a number.\n';
        if (test.indexOf('inRange') != -1) { p=test.indexOf(':');
          min=test.substring(8,p); max=test.substring(p+1);
          if (num<min || max<num) errors+='- '+nm+' must contain a number between '+min+' and '+max+'.\n';
    } } } else if (test.charAt(0) == 'R') errors += '- '+nm+' is required.\n'; }
  } if (errors) alert('The following error(s) occurred:\n'+errors);
  document.MM_returnValue = (errors == '');
}
function YY_checkform() { 
  var a=YY_checkform.arguments,oo=true,v='',s='',err=false,r,o,at,o1,t,i,j,ma,rx,cd,cm,cy,dte,at;
  for (i=1; i<a.length;i=i+4){
    if (a[i+1].charAt(0)=='#'){r=true; a[i+1]=a[i+1].substring(1);}else{r=false}
    o=MM_findObj(a[i].replace(/\[\d+\]/ig,""));
    o1=MM_findObj(a[i+1].replace(/\[\d+\]/ig,""));
    v=o.value;t=a[i+2];
    if (o.type=='text'||o.type=='password'||o.type=='hidden'){
      if (r&&v.length==0){err=true}
      if (v.length>0)
      if (t==1){ 
        ma=a[i+1].split('_');if(isNaN(v)||v<ma[0]/1||v > ma[1]/1){err=true}
      } else if (t==2){
        rx=new RegExp("^[\\w\.=-]+@[\\w\\.-]+\\.[a-zA-Z]{2,4}$");if(!rx.test(v))err=true;
      } else if (t==3){ 
        ma=a[i+1].split("#");at=v.match(ma[0]);
        if(at){
          cd=(at[ma[1]])?at[ma[1]]:1;cm=at[ma[2]]-1;cy=at[ma[3]];
          dte=new Date(cy,cm,cd);
          if(dte.getFullYear()!=cy||dte.getDate()!=cd||dte.getMonth()!=cm){err=true};
        }else{err=true}
      } else if (t==4){ 
        ma=a[i+1].split("#");at=v.match(ma[0]);if(!at){err=true}
      } else if (t==5){ 
            if(o1.length)o1=o1[a[i+1].replace(/(.*\[)|(\].*)/ig,"")];
            if(!o1.checked){err=true}
      } else if (t==6){ 
            if(v!=MM_findObj(a[i+1]).value){err=true}
      }
    } else
    if (!o.type&&o.length>0&&o[0].type=='radio'){
          at = a[i].match(/(.*)\[(\d+)\].*/i);
          o2=(o.length>1)?o[at[2]]:o;
      if (t==1&&o2&&o2.checked&&o1&&o1.value.length/1==0){err=true}
      if (t==2){
        oo=false;
        for(j=0;j<o.length;j++){oo=oo||o[j].checked}
        if(!oo){s+='* '+a[i+3]+'\n'}
      }
    } else if (o.type=='checkbox'){
      if((t==1&&o.checked==false)||(t==2&&o.checked&&o1&&o1.value.length/1==0)){err=true}
    } else if (o.type=='select-one'||o.type=='select-multiple'){
      if(t==1&&o.selectedIndex/1==0){err=true}
    }else if (o.type=='textarea'){
      if(v.length<a[i+1]){err=true}
    }
    if (err){s+='* '+a[i+3]+'\n'; err=false}
  }
  if (s!=''){alert('The required information is incomplete or contains errors:\t\t\t\t\t\n\n'+s)}
  document.MM_returnValue = (s=='');
}
function CheckUncheckAll(form, fieldname, checked)
{
	for (i = 0; i < form.elements.length; i++) {
		 //alert(form.elements[i].name);
		 if(form.elements[i].name.indexOf(fieldname)==0) {
		   form.elements[i].checked = checked;
		 }
	}
}
function SelectUnselectAll(form, fieldname, checked)
{
	for (i = 0; i < form.elements.length; i++) {
		 //alert(form.elements[i].name);
		 if(form.elements[i].name.indexOf(fieldname)==0) {
		   for(j=0; j<form.elements[i].options.length; j++) {
				form.elements[i].options[j].selected = checked;
			 }			 
		 }
	}
}
function popUp(url, width, height)
{
 var x = window.open(url,'popUpWindow','resizable,width=' + width + ',height=' + height);
 x.moveTo((screen.width-width)/2, (screen.height-height-100)/2);
 x.opener = self;
}
var hideTableRows = true;
function toggleRows(tableId, tagId){
	tbl = document.getElementById(tableId);
	tag = document.getElementById(tagId);
	var len = tbl.rows.length;
	var vStyle = (hideTableRows)? "none":"";
	for(i=1 ; i< len; i++){
		 tbl.rows[i].style.display = vStyle;
	 }
	if(hideTableRows)
		tag.innerHTML = "more";
	else
		tag.innerHTML = "less";
	hideTableRows= !hideTableRows;
}
function isInteger(s) {
	var i;
	s = s.toString();
	if (s.length == 0) { return false; }
	for (i = 0; i < s.length; i++) {
		var c = s.charAt(i);
		if (isNaN(c)) {
			return false;
		}
	}
	return true;
}