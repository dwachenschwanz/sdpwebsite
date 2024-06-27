var listMonths = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
var listShortMonths = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
var firstWeekDay = "Sun";
var listWeekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
var listShortWeekdays = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
var DateMasks = new Array(26);
    DateMasks["d"] = 0;
    DateMasks["dd"] = 2;
    DateMasks["m"] = 0;
    DateMasks["mm"] = 2;
    DateMasks["mmm"] = 3;
    DateMasks["mmmm"] = 0;
    DateMasks["M"] = 0;
    DateMasks["MM"] = 2;
    DateMasks["MMM"] = 3;
    DateMasks["MMMM"] = 0;
    DateMasks["yy"] = 2;
    DateMasks["yyyy"] = 4;
    DateMasks["h"] = 0;
    DateMasks["hh"] = 2;
    DateMasks["H"] = 0;
    DateMasks["HH"] = 2;
    DateMasks["n"] = 0;
    DateMasks["nn"] = 2;
    DateMasks["s"] = 0;
    DateMasks["ss"] = 2;
    DateMasks["am/pm"] = 2;
    DateMasks["AM/PM"] = 2;
    DateMasks["A/P"] = 1;
    DateMasks["a/p"] = 1;
    DateMasks["w"] = 0;
    DateMasks["q"] = 0;
    DateMasks["S"] = 0;
function geckoGetRv()
{
  if (navigator.product != 'Gecko')
  {
    return -1;
  }
  var rvValue = 0;
  var ua      = navigator.userAgent.toLowerCase();
  var rvStart = ua.indexOf('rv:');
  var rvEnd   = ua.indexOf(')', rvStart);
  var rv      = ua.substring(rvStart+3, rvEnd);
  var rvParts = rv.split('.');
  var exp     = 1;
  for (var i = 0; i < rvParts.length; i++)
  {
    var val = parseInt(rvParts[i]);
    rvValue += val / exp;
    exp *= 100;
  }
  return rvValue;
}
function isInArray(strValue, arrArray)
{
  var intResult = -1;
  for ( var j = 0; j < arrArray.length && (strValue != arrArray[j]); j++ );
  if ( j != arrArray.length )
    intResult = j;    
  return intResult;
}
function parseDateFormat(strMask)
{
  var UNDEF;
  var arrResult = new Array();             
  if (strMask == "" || typeof(strMask) == "undefined")
    return arrResult;
  var arrMaskTokens = new Array(
  "d", "w", "m", "M", "q", "y", "h", "H", "n", "s", 
  "dd", "ww", "mm", "MM", "yy", "hh", "HH", "nn", "ss", "S",
  "ddd", "mmm", "MMM", "A/P", "a/p", "dddd", "mmmm", "MMMM", 
  "yyyy", "AM/PM", "am/pm", "LongDate", "LongTime", 
  "ShortDate", "ShortTime", "GeneralDate");
  var arrMaskTokensFirstLetters = new Array("d", "w", "m", "M",
  "q", "y", "h", "H", "n", "s", "A", "a", "L", "S", "G");
  var strMaskLength = strMask.length;
  var i = 0, intMaskPosition = 0;
  var arrMask = new Array();
  var strToken = "";
  while (i < strMaskLength)
  {
  if (strMask.charAt(i) == "\\")
  {
    strToken += strMask.charAt(++i);
    i ++;
  }
  else if (strMask.charAt(i) == "'")
  {
    i ++;
    while ((i < strMask.length) && (strMask.charAt(i) != "'"))
    strToken += strMask.charAt(i++);
    i ++;
  }
  else
  {
    var j = isInArray(strMask.charAt(i), arrMaskTokensFirstLetters);
    if ( j != -1 )
    {
    var k;
    for (k = (arrMaskTokens.length - 1); k >= 0 && 
      strMask.slice(i, i + arrMaskTokens[k].length) != arrMaskTokens[k]; k--);
    if (k != -1)
    {
      if (strToken.length > 0)
      {
      if ( isInArray(strToken, arrMaskTokens) == -1)
        arrMask[intMaskPosition ++] = strToken;
      else
        arrMask[intMaskPosition ++] = "\\" + strToken;
      strToken = "";
      }
      arrMask[intMaskPosition ++] = arrMaskTokens[k];
      i += arrMaskTokens[k].length;
    }
    else
    {
      strToken = strMask.charAt(i);
      i ++;
    }
    }
    else
    {
    strToken += strMask.charAt(i);
    i ++;
    }
  }
  }
  if (strToken.length > 0)
  {
  if ( isInArray(strToken, arrMaskTokens) == -1)
    arrMask[intMaskPosition ++] = strToken;
  else
    arrMask[intMaskPosition ++] = "\\" + strToken;
  strToken = "";
  }
  arrResult = arrMask;
  return arrResult;
}
function getDayOfYear(year, month, day)
{
  var firstDay = new Date(year, 0, 1);
  var date = new Date(year, month, day);
  return (date-firstDay)/(1000*60*60*24);
}
function get12Hour(hoursNumber)
{
  if (hoursNumber == 0)
    hoursNumber = 12;
  else if (hoursNumber > 12)
    hoursNumber = hoursNumber - 12;
  return hoursNumber;
}
function addZero(value, resultLength)
{
  var countZero = resultLength - String(value).length;
  var result = String(value);
  for (var i=0; i<countZero; i++)
    result = "0" + result;
  return result;
}
function getAMPM(HoursNumber, AnteMeridiem, PostMeridiem)
{
  if (HoursNumber >= 0 && HoursNumber < 12)
    return AnteMeridiem;
  else
    return PostMeridiem;
}
function formatDate(dateToFormat, parsedFormat)
{
  var resultArray = new Array(parsedFormat.length);
  for (var i=0; i<parsedFormat.length; i++)
  {
    switch (parsedFormat[i]) 
    {
      case "d": 
        resultArray[i] = dateToFormat.getDate(); 
        break;
      case "w":
        resultArray[i] = dateToFormat.getDay()+1;
        break;
      case "m": case "M": 
        resultArray[i] = dateToFormat.getMonth()+1;
        break;
      case "q": 
        resultArray[i] = Math.floor((dateToFormat.getMonth()+4)/4);
        break;
      case "y": 
        resultArray[i] = getDayOfYear(dateToFormat.getFullYear(), dateToFormat.getMonth(), dateToFormat.getDate());
        break;
      case "h": 
        resultArray[i] = get12Hour(dateToFormat.getHours());
        break;
      case "H": 
        resultArray[i] = dateToFormat.getHours();
        break;
      case "n": 
        resultArray[i] = dateToFormat.getMinutes();
        break;
      case "s": 
        resultArray[i] = dateToFormat.getSeconds();
        break;
      case "dd": 
        resultArray[i] = addZero(dateToFormat.getDate(), 2);
        break;
      case "ww": 
        resultArray[i] = Math.floor(getDayOfYear(dateToFormat.getFullYear(), dateToFormat.getMonth(), dateToFormat.getDate())/7)+1;
        break;
      case "mm": case "MM": 
        resultArray[i] = addZero(dateToFormat.getMonth()+1, 2);
        break;
      case "yy": 
        resultArray[i] = String(dateToFormat.getFullYear()).substr(2);
        break;
      case "hh": 
        resultArray[i] = addZero(get12Hour(dateToFormat.getHours()), 2);
        break;
      case "HH": 
        resultArray[i] = addZero(dateToFormat.getHours(), 2);
        break;
      case "nn": 
        resultArray[i] = addZero(dateToFormat.getMinutes(), 2);
        break;
      case "ss": 
        resultArray[i] = addZero(dateToFormat.getSeconds(), 2);
        break;
      case "S": 
        resultArray[i] = "000";
        break;
      case "ddd": 
        resultArray[i] = listShortWeekdays[dateToFormat.getDay()];
        break;
      case "mmm": case "MMM": 
        resultArray[i] = listShortMonths[dateToFormat.getMonth()];
        break;
      case "A/P": 
        resultArray[i] = getAMPM(dateToFormat.getHours(), "A", "P");
        break;
      case "a/p": 
        resultArray[i] = getAMPM(dateToFormat.getHours(), "a", "p");
        break;
      case "dddd": 
        resultArray[i] = listWeekdays[dateToFormat.getDay()];
        break;
      case "mmmm": case "MMMM": 
        resultArray[i] = listMonths[dateToFormat.getMonth()];
        break;
      case "yyyy": 
        resultArray[i] = dateToFormat.getFullYear();
        break;
      case "AM/PM": 
        resultArray[i] = getAMPM(dateToFormat.getHours(), "AM", "PM");
        break;
      case "am/pm": 
        resultArray[i] = getAMPM(dateToFormat.getHours(), "am", "pm");
        break;
      case ":": 
        resultArray[i] = ":";
        break;
      case "LongDate": 
        resultArray[i] = formatDate(dateToFormat, parseDateFormat("dddd, mmmm dd, yyyy"));
        break;
      case "LongTime": 
        resultArray[i] = formatDate(dateToFormat, parseDateFormat("h:nn:ss AM/PM"));
        break;
      case "ShortDate": 
        resultArray[i] = formatDate(dateToFormat, parseDateFormat("m/d/yy"));
        break;
      case "ShortTime": 
        resultArray[i] = formatDate(dateToFormat, parseDateFormat("H:nn"));
        break;
      case "GeneralDate": 
        resultArray[i] = formatDate(dateToFormat, parseDateFormat("m/d/yy hh:nn AM/PM"));
        break;
      default:
        if (String(parsedFormat[i]).charAt(0)=="\\")
        resultArray[i] = String(parsedFormat[i]).substr(0);
      else
        resultArray[i] = parsedFormat[i];
    }
  }
  return resultArray.join("");
}
function parseDate(dateToParse, parsedMask)
{
  var resultDate, resultDateArray = new Array(8);
  var MaskPart, MaskLength, TokenLength;
  var IsError;
  var DatePosition, MaskPosition;
  var Delimiter, BeginDelimiter;
  var MonthNumber, MonthName;
  var DatePart;
  var IS_DATE_POS, YEAR_POS, MONTH_POS, DAY_POS, IS_TIME_POS, HOUR_POS, MINUTE_POS, SECOND_POS;
  IS_DATE_POS = 0;  YEAR_POS = 1;  MONTH_POS = 2;  DAY_POS = 3;
  IS_TIME_POS = 4;  HOUR_POS = 5;  MINUTE_POS = 6;  SECOND_POS = 7;
  if (!parsedMask)
  {
    resultDate = null;
  }
  else if (parsedMask[0] == "GeneralDate" && String(dateToParse)!="")
    resultDate = parseDate(dateToParse, parseDateFormat("m/d/yy hh:nn AM/PM"));
  else if (parsedMask[0] == "LongDate" && String(dateToParse)!="")
    resultDate = parseDate(dateToParse, parseDateFormat("dddd, mmmm dd, yyyy"));
  else if (parsedMask[0] == "ShortDate" && String(dateToParse)!="")
    resultDate = parseDate(dateToParse, parseDateFormat("m/d/yy"));
  else if (parsedMask[0] == "LongTime" && String(dateToParse)!="")
    resultDate = parseDate(dateToParse, parseDateFormat("h:nn:ss AM/PM"));
  else if (parsedMask[0] == "ShortTime" && String(dateToParse)!="")
    resultDate = parseDate(dateToParse, parseDateFormat("H:nn"));
  else if (String(dateToParse) == "") resultDate = null;
  else
  {
    DatePosition = 0;
    MaskPosition = 0;
    MaskLength = parsedMask.length;
    IsError = false;
    resultDateArray[IS_DATE_POS] = false;
    resultDateArray[IS_TIME_POS] = false;
    resultDateArray[YEAR_POS] = 0;  resultDateArray[MONTH_POS] = 12;  resultDateArray[DAY_POS] = 1;
    resultDateArray[HOUR_POS] = 0;  resultDateArray[MINUTE_POS] = 0;  resultDateArray[SECOND_POS] = 0;
    while ((MaskPosition < MaskLength) && !IsError)
    {
      MaskPart = parsedMask[MaskPosition];
      if (DateMasks[MaskPart] != null)
      {
        TokenLength = DateMasks[MaskPart];
        if (TokenLength > 0)
        {
          DatePart = String(dateToParse).substr(DatePosition, TokenLength);
          DatePosition = DatePosition + TokenLength;
        }else
        {
          if (MaskPosition < MaskLength)
          {
            Delimiter = parsedMask[MaskPosition + 1];
            BeginDelimiter = dateToParse.indexOf(Delimiter, DatePosition);
            if (BeginDelimiter == -1)
            {
              return null;
            }else 
            {
              DatePart = String(dateToParse).substr(DatePosition, BeginDelimiter - DatePosition);
              DatePosition = BeginDelimiter;
            }
          }else DatePart = String(dateToParse).substr(DatePosition);
        }
        switch (MaskPart)
        {
          case "d": case "dd":
            resultDateArray[DAY_POS] = Math.floor(DatePart);
            resultDateArray[IS_DATE_POS] = true;
            break;
          case "m": case "mm": case "M": case "MM":
            resultDateArray[MONTH_POS] = Math.floor(DatePart);
            resultDateArray[IS_DATE_POS] = true;
            break;
          case "mmm": case "mmmm": case "MMM": case "MMMM":
            MonthNumber = 0;
            MonthName = String(DatePart).toUpperCase();
            if (MaskPart == "mmm") 
              MonthNamesArray = listMonths;
            else
              MonthNamesArray = listShortMonths;
            while (MonthNumber < 11 && String(MonthNamesArray[MonthNumber]).toUpperCase() != MonthName)
            {
              MonthNumber = MonthNumber + 1;
            }
            if (MonthNumber == 11) 
            {
              if (String(MonthNamesArray[11]).toUpperCase() != MonthName) 
              {
                return null;
              }
            }
            resultDateArray[MONTH_POS] = MonthNumber + 1;
            resultDateArray[IS_DATE_POS] = true;
            break;
          case "yy": 
                  var last2Digits = Math.floor(DatePart);
            var centuryDigits = (last2Digits>=50)?1900:2000;
            resultDateArray[YEAR_POS] = centuryDigits + last2Digits;
            resultDateArray[IS_DATE_POS] = true;
            break;
          case "yyyy":
            resultDateArray[YEAR_POS] = Math.floor(DatePart);
            resultDateArray[IS_DATE_POS] = true;
            break;
          case "h": case "hh":
            if (Math.floor(DatePart) == 12) 
              resultDateArray[HOUR_POS] = 0;
            else 
              resultDateArray[HOUR_POS] = Math.floor(DatePart);
            resultDateArray[IS_TIME_POS] = true;
			break;
          case "H": case "HH":
            resultDateArray[HOUR_POS] = Math.floor(DatePart);
            resultDateArray[IS_TIME_POS] = true;
            break;
          case "n": case "nn":
            resultDateArray[MINUTE_POS] = Math.floor(DatePart);
            resultDateArray[IS_TIME_POS] = true;
            break;
          case "s": case "ss":
            resultDateArray[SECOND_POS] = Math.floor(DatePart);
            resultDateArray[IS_TIME_POS] = true;
            break;
          case "am/pm": case "a/p": case "AM/PM": case "A/P": 
            if (String(DatePart).toLowerCase().charAt(0) == "p") 
              resultDateArray[HOUR_POS] = resultDateArray[HOUR_POS] + 12;
            else if (String(DatePart).toLowerCase().charAt(0) == "a")
              resultDateArray[HOUR_POS] = resultDateArray[HOUR_POS];
            resultDateArray[IS_TIME_POS] = true;
			break;
          case "w": case "q": case "S":
            break;
        }
      }else DatePosition = DatePosition + parsedMask[MaskPosition].length;
      MaskPosition = MaskPosition + 1
    }
    if (resultDateArray[IS_DATE_POS] && resultDateArray[IS_TIME_POS]) 
    {
      resultDate = new Date(resultDateArray[YEAR_POS], resultDateArray[MONTH_POS] - 1, resultDateArray[DAY_POS], resultDateArray[HOUR_POS], resultDateArray[MINUTE_POS], resultDateArray[SECOND_POS]);
    }else if (resultDateArray[IS_DATE_POS])
    {
      resultDate = new Date(resultDateArray[YEAR_POS], resultDateArray[MONTH_POS] - 1, resultDateArray[DAY_POS]);
    }else if (resultDateArray[IS_DATE_POS])
    {
      resultDate = new Date(0, 0, 0, resultDateArray[HOUR_POS], resultDateArray[MINUTE_POS], resultDateArray[SECOND_POS]);
    }
  }
  return resultDate;
}
function checkDateRange(date)
{
  var minDate = new Date(1753, 0, 1);
  var maxDate = new Date(9999, 11, 31);
  if (date < minDate) return minDate;
  if (date > maxDate) return maxDate;
  return date;
}
var DatePickerObject = new Object();
var datepickerControl = null;
var datepickerDocumentTop = null;
var datepickerDocumentTime = null;
var datepickerDocumentBottom = null;
var datepickerSource = "";
var blankCell = "";
var DatePickerBegin = "";
var DatePickerTime = "";
var DatePickerEnd = "";
var ShowTimes = 0;
var ShowSeconds = 0;
var ShowAMPM = 0;
var disableEvents = false;
var disableUnload = false;
var isNav = false;
var isIE  = false;
if (navigator.appName == "Netscape") 
{
  isNav = true;
}
else 
{
  isIE = true;
}
selectedLanguage = navigator.language;
function setDateField(dateField) 
{
  datepickerControl = eval(dateField);
  setInitialDate(datepickerControl.value);
  datepickerDocumentTop    = buildTop();
  datepickerDocumentTime    = buildTime();
  datepickerDocumentBottom = buildBottom();
}
function setInitialDate(inDate) 
{
  var date = parseDate(inDate, parseDateFormat(DatePickerObject.format));
  if (date) date = checkDateRange(date);
  if (isNaN(date) || !date) 
  {
	date = new Date();
  }
  DatePickerObject.selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  DatePickerObject.selectedDay  = date.getDate();
  date.setDate(1);
  DatePickerObject.currentMonth = date.getMonth();
  DatePickerObject.currentYear = date.getFullYear();
  DatePickerObject.currentHour    = date.getHours();
  getAmPm();
  SetHour(date.getHours());
  DatePickerObject.currentMinute    = date.getMinutes(); 
  DatePickerObject.currentSecond    = date.getSeconds(); 
}
function detectDateType(parsedFormat)
{
  var resultArray = new Array(parsedFormat.length);
  for (var i=0; i<parsedFormat.length; i++)
  {
    switch (parsedFormat[i]) 
    {
      case "h": case "hh": 
        ShowTimes = 1;
		ShowAMPM = 1;
		break;
	  case "H": case "HH": 
        ShowTimes = 1;
		break;
	  case "n": case "nn":
        ShowTimes = 1;
		break;
      case "s": case "ss":
        ShowSeconds = 1;
        break;
      case "A/P": case "a/p": case "AM/PM": case "am/pm": 
        ShowAMPM = 1;
        break;
      case "LongTime": 
        ShowTimes = 1;
		ShowSeconds = 1;
		ShowAMPM = 1;
        break;
      case "GeneralDate": 
        ShowTimes = 1;
		ShowAMPM = 1;
        break;
    }
  }
}
function showDatePicker(object_name, form_name, form_control) 
{
  disableEvents = false;
  DatePickerObject = eval(object_name);
  if (typeof(DatePickerObject)!="object" || !DatePickerObject) return;
  ShowTimes = 0;
  ShowSeconds = 0;
  ShowAMPM = 0;
  detectDateType(parseDateFormat(DatePickerObject.format));  
  DatePickerObject.control          = String("document."+form_name+"."+form_control);
  DatePickerObject.themePath        = DatePickerObject.style;
  DatePickerObject.selectedDate     = new Date();
  DatePickerObject.selectedDay      = 1;
  DatePickerObject.currentMonth     = DatePickerObject.selectedDate.getMonth();
  DatePickerObject.currentYear      = DatePickerObject.selectedDate.getFullYear();
  DatePickerObject.currentHour    = DatePickerObject.selectedDate.getHours(); 
  getAmPm();
  SetHour(DatePickerObject.selectedDate.getHours());
  DatePickerObject.currentMinute    = DatePickerObject.selectedDate.getMinutes(); 
  DatePickerObject.currentSecond    = DatePickerObject.selectedDate.getSeconds(); 
  if (DatePickerObject.themePath.lastIndexOf("/")!=-1)
    DatePickerObject.themePath = DatePickerObject.themePath.substr(0,DatePickerObject.themePath.lastIndexOf("/")+1);
  else if (DatePickerObject.themePath.lastIndexOf("\\")!=-1)
    DatePickerObject.themePath = DatePickerObject.themePath.substr(0,DatePickerObject.themePath.lastIndexOf("\\")+1);
  buildDatePickerParts();
  setDateField(DatePickerObject.control);
  datepickerSource = datepickerDocumentBottom;
  if (typeof(top.newWinDatePickerObject) != "object") 
  {
    var datepickerURL = DatePickerObject.relativePathPart?DatePickerObject.relativePathPart+"DatePicker.html":"DatePicker.html";
    var w_left = Math.ceil(screen.width/2-120);
    var w_top = Math.ceil(screen.height/2-110);
    top.newWinDatePickerObject = window.open(datepickerURL+"?random="+Math.random(), "DatePickerWindow", "dependent=yes,left="+w_left+",top="+w_top+",width=250,height=210,screenX=200,screenY=300,titlebar=yes, center: yes, help: no, resizable: yes, status: no");
  }
  top.newWinDatePickerObject.focus();
}
function buildTop() 
{
  var imgPrevYear = DatePickerObject.themePath+"PrevYear.gif";
  var imgPrevMonth = DatePickerObject.themePath+"PrevMonth.gif";
  var imgNextMonth = DatePickerObject.themePath+"NextMonth.gif";
  var imgNextYear = DatePickerObject.themePath+"NextYear.gif";
  var datepickerDocument =
      "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0 WIDTH=100%>" +
      "<TR>" +
      "<TD>" +
      "<A " +
      "HREF=\"javascript:parent.opener.setPreviousYear()\"><IMG SRC=\""+imgPrevYear+"\" BORDER=\"0\"></A><A " +
      "HREF=\"javascript:parent.opener.setPreviousMonth()\"><IMG SRC=\""+imgPrevMonth+"\" BORDER=\"0\"></A>" +      
      "</TD>" +
      "<TD NOBR WIDTH=\"100%\">" +      
      "<CENTER>" +
      "<LABEL ID=\"labelMonth\">"+listMonths[DatePickerObject.currentMonth]+"</LABEL>&nbsp;<LABEL ID=\"labelYear\">"+DatePickerObject.currentYear+"</LABEL>" +
      "</CENTER>" +
      "</TD>" +
      "<TD>" +
      "<A " +
      "HREF=\"javascript:parent.opener.setNextMonth()\"><IMG SRC=\""+imgNextMonth+"\" BORDER=\"0\"></A><A " +
      "HREF=\"javascript:parent.opener.setNextYear()\"><IMG SRC=\""+imgNextYear+"\" BORDER=\"0\"></A>" +
      "</TD>" +
      "</TR>" +
      "</TABLE>";
  return datepickerDocument;
}
function buildTime()
{
	var imin; var imax;
	DatePickerTime = "";
	if (ShowTimes == 0) return "";
	DatePickerTime = "<form><tr><td colspan='7' align='center'>";
	
	DatePickerTime +="<select class='AdminInput' name='hour'  onchange='parent.opener.SetHour(this.value);'>";
	if(ShowAMPM == 1) {
		imin=1; imax=12;
	} else {
		imin=0; imax = 23;
	}
	for(var i=imin; i<=imax; i++) {
		DatePickerTime += "<option value='"+i+"' ";
		if(i==DatePickerObject.currentHour) {
			DatePickerTime += "Selected"; }
		DatePickerTime += ">" + i + "</option>";
	}
	DatePickerTime += "</select>";	
	
	DatePickerTime +=" : ";
	
	DatePickerTime +="<select class='AdminInput' name='minute'  onchange='parent.opener.SetMinute(this.value);'>";
	imin=0; imax=59;
	for(var i=imin; i<=imax; i++) {
		DatePickerTime += "<option value='"+i+"' ";
		if(i==DatePickerObject.currentMinute) {
			DatePickerTime += "Selected"; }
		DatePickerTime += ">" + i + "</option>";
	}
	DatePickerTime += "</select>";
				
	if (ShowSeconds == 1) {
		DatePickerTime +="<select class='AdminInput' name='second'  onchange='parent.opener.SetSecond(this.value);'>";
		imin=0; imax=59;
		for(var i=imin; i<=imax; i++) {
			DatePickerTime += "<option value='"+i+"' ";
			if(i==DatePickerObject.currentSecond) {
				DatePickerTime += "Selected"; }
			DatePickerTime += ">" + i + "</option>";
		}
		DatePickerTime += "</select>";
	}
	if (ShowAMPM == 1) {
		var SelectAm =(DatePickerObject.AMorPM=='AM')? "Selected":"";
		var SelectPm =(DatePickerObject.AMorPM=='PM')? "Selected":"";				
		DatePickerTime +="&nbsp;&nbsp;<select class='AdminInput' name=\"ampm\" onchange=\"parent.opener.SetAmPm(this.options[this.selectedIndex].value)\">";
		DatePickerTime +="<option "+SelectAm+" value=\"AM\">AM</option>";
		DatePickerTime +="<option "+SelectPm+" value=\"PM\">PM</option>";
		DatePickerTime +="</select>";
	}	
		
	DatePickerTime +="\n</td>\n</tr></form>";				
	return DatePickerTime;
}
function buildBottom() 
{
  var datepickerDocument = (isNav?"<HTML>" + "<HEAD>" +
      "<LINK REL=\"stylesheet\" TYPE=\"text/css\" HREF=\""+DatePickerObject.style+"\">" +
      "<TITLE> Date Picker </TITLE>" +
      "</HEAD>" +
      "<BODY TOPMARGIN='0' LEFTMARGIN='0' ONUNLOAD='parent.opener.UnLoad();'>":"") + "<center>" + DatePickerTime + "</center>" + DatePickerBegin.replace(/{datepickerDocumentTop}/, datepickerDocumentTop);
	
  month   = DatePickerObject.currentMonth;
  year    = DatePickerObject.currentYear;
  var date = new Date();
  var selectedDay = DatePickerObject.selectedDay;
  var i   = 0;
  var days = getDaysInMonth();
  if (selectedDay > days) 
    selectedDay = days;
  var firstOfMonth = new Date (year, month, 1);
  var startingPos  = firstOfMonth.getDay() - firstWeekDayIndex;
  if (startingPos<0) startingPos += 7;
  days += startingPos;
  var columnCount = 0;
  for (i = 0; i < startingPos; i++) 
  {
    datepickerDocument += blankCell;
    columnCount++;
  }
  var currentDay = 0;
  var dayType    = "weekday";
  var dayBackground = "";
  for (i = startingPos; i < days; i++) 
  {
    var paddingChar = "&nbsp;";
    dayBackground = "";
    if (i-startingPos+1 < 10) 
      padding = "&nbsp;&nbsp;";
    else 
      padding = "&nbsp;";
    currentDay = i-startingPos+1;
    var currentDate = DatePickerObject.selectedDate;
    if (currentDay == selectedDay && month==currentDate.getMonth() && year==currentDate.getFullYear())
    {
      dayType = "selectedDay";
      dayBackground = "selectedDay";
    }
    else if (currentDay == date.getDate() && month==date.getMonth() && year==date.getFullYear())
    {
      dayType = "today";
      dayBackground = "today";
    }
    else 
    {
      dayType = "weekDay";
    }
    if ((columnCount + firstWeekDayIndex) % 7 == 0 || (columnCount + firstWeekDayIndex) % 7 == 6)
    {
      datepickerDocument += "<TD align=center class=\""+(dayBackground?dayBackground:"weekend")+"\">" +
                "<a class=\"" + dayType + "\" href=\"javascript:parent.opener.returnDate(" + 
                currentDay + ")\">" + padding + currentDay + paddingChar + "</a></TD>";
    }
    else 
    {
      datepickerDocument += "<TD align=center class=\""+(dayBackground?dayBackground:"workday")+"\">" +
                "<a class=\"" + dayType + "\" href=\"javascript:parent.opener.returnDate(" + 
                currentDay + ")\">" + padding + currentDay + paddingChar + "</a></TD>";
    }
    columnCount++;
    if (columnCount % 7 == 0) 
      datepickerDocument += "</TR><TR>";
  }
  for (i=days; i<(startingPos<0?42+startingPos:42); i++)
  {
    datepickerDocument += blankCell;
    columnCount++;
    if (columnCount % 7 == 0) 
    {
      datepickerDocument += "</TR>";
      if (i<(startingPos<0?41+startingPos:41)) datepickerDocument += "<TR>";
    }
  }
  datepickerDocument += DatePickerEnd + (isNav?"</BODY>" + "</HTML>":"");
  return datepickerDocument;
}
function writeDatePicker()
{
  datepickerDocumentTop    = buildTop();
  datepickerDocumentTime    = buildTime();
  datepickerDocumentBottom = buildBottom();
  disableUnload = true;
  top.newWinDatePickerObject.document.open();
  top.newWinDatePickerObject.document.write(datepickerDocumentBottom);
  top.newWinDatePickerObject.document.close();
  disableUnload = false;
}
function setToday()
{
  var date = new Date();
  DatePickerObject.currentMonth = date.getMonth();
  DatePickerObject.currentYear = date.getFullYear();
  DatePickerObject.currentHour      = date.getHours(); 
  DatePickerObject.currentMinute    = date.getMinutes(); 
  DatePickerObject.currentSecond    = date.getSeconds(); 
  if (ShowTimes > 0) date.setHours(DatePickerObject.currentHour, DatePickerObject.currentMinute, DatePickerObject.currentSecond, 0);
  returnDate(date.getDate());
}
function setPreviousYear()
{
  var year = DatePickerObject.currentYear - 1;
  var date = new Date();
  date.setFullYear(year);
  date = checkDateRange(date);
  year = date.getFullYear();
  DatePickerObject.currentYear = year;
  writeDatePicker();
}
function setPreviousMonth()
{
  var year  = DatePickerObject.currentYear;
  var month = DatePickerObject.currentMonth;
  if (month == 0)
  {
    month = 11;
    if (year > 1000)
    {
      year--;
      var date = new Date();
      date.setFullYear(year);
      date = checkDateRange(date);
      year = date.getFullYear();
      DatePickerObject.currentYear = year;
    }
  }else 
  {
    month--;
  }
  DatePickerObject.currentMonth = month;
  writeDatePicker();
}
function setNextMonth()
{
  var year = DatePickerObject.currentYear;
  var month = DatePickerObject.currentMonth;
  if (month == 11)
  {
    month = 0;
    year++;
    var date = new Date();
    date.setFullYear(year);
    date = checkDateRange(date);
    year = date.getFullYear();
    DatePickerObject.currentYear = year;
  } else
  {
    month++;
  }
  DatePickerObject.currentMonth = month;
  writeDatePicker();
}
function setNextYear()
{
  var year  = DatePickerObject.currentYear + 1;
  var date = new Date();
  date.setFullYear(year);
  date = checkDateRange(date);
  year = date.getFullYear();
  DatePickerObject.currentYear = year;
	writeDatePicker();
}
function getDaysInMonth()
{
  var days;
  var month = DatePickerObject.currentMonth+1;
  var year  = DatePickerObject.currentYear;
  if (month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12)
  {
    days=31;
  }
  else if (month==4 || month==6 || month==9 || month==11) 
  {
    days=30;
  }
  else if (month==2)  
  {
    if (isLeapYear(year))
    {
      days=29;
    }
    else 
    {
      days=28;
    }
  }
  return (days);
}
function isLeapYear (Year)
{
  if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0))
    return true;
  else 
    return false;
}
function createWeekdayList()
{
  firstWeekDayIndex = 0;
  newWeekdayArray = new Array(7);
  newWeekdayList = new Array(7);
  for (var i=0; i<listShortWeekdays.length; i++)
    if (listShortWeekdays[i]==firstWeekDay) firstWeekDayIndex = i;
  for (var i=firstWeekDayIndex; i<listShortWeekdays.length; i++)
  {
      newWeekdayArray[i-firstWeekDayIndex] = listShortWeekdays[i];
      newWeekdayList[i-firstWeekDayIndex] = listWeekdays[i];
  }
  for (var i=0; i<firstWeekDayIndex; i++)
  {
      newWeekdayArray[7-firstWeekDayIndex-i] = listShortWeekdays[i];
      newWeekdayList[7-firstWeekDayIndex-i] = listWeekdays[i];
  }
  var weekdays = "<TR>";
  for (i in listShortWeekdays)
  {
      weekdays += "<TH class=\"calendar\" align=\"center\">" + newWeekdayArray[i] + "</TH>";
  }
  weekdays += "</TR>";
  return weekdays;
}
function buildDatePickerParts()
{
  weekdays = createWeekdayList();
  blankCell = "<TD align=center class=\"workday\">&nbsp;&nbsp;&nbsp;</TD>";
  DatePickerBegin =
      (isNav?"":"<HTML>" +
      "<HEAD>" +
      "<LINK REL=\"stylesheet\" TYPE=\"text/css\" HREF=\""+DatePickerObject.style+"\">" +
      "<TITLE> Date Picker </TITLE>" +
      "</HEAD>" +
      "<BODY TOPMARGIN='0' LEFTMARGIN='0' ONUNLOAD='parent.opener.UnLoad();'>") + "<CENTER>";
  DatePickerBegin += "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0><TR><TD>{datepickerDocumentTop}</TD></TR><TR><TD ALIGN=CENTER VALIGN=TOP>";
  DatePickerBegin += "<TABLE CELLPADDING=0 CELLSPACING=1 CLASS=\"Table\">" + weekdays + "<TR>";
  DatePickerEnd = "";
  DatePickerEnd += "</TABLE>";
  DatePickerEnd +=
      "</TABLE>" +
      (isNav?"<FORM NAME='calTable' onSubmit='return false;'>":"") + 
      "<TABLE BORDER='0'>" + 
      (isNav?"":"<FORM NAME='calTable' onSubmit='return false;'>") +
      "<TD>";
      DatePickerEnd += "<INPUT TYPE='button' CLASS='CalendarButtons' NAME='today' VALUE='";
	  if(ShowTimes == 1) {
		  DatePickerEnd += "Now";
		  DatePickerEnd +="' onClick=\"parent.opener.setToday()\">";
		  //DatePickerEnd += "&nbsp;<INPUT TYPE='button' CLASS='CalendarButtons' NAME='return' VALUE='Update' onClick=\"parent.opener.returnDate(" + DatePickerObject.selectedDate.getDate() + ")\">";
	  } else {
		  DatePickerEnd += "Today";
		  DatePickerEnd +="' onClick=\"parent.opener.setToday()\">";
	  }
      DatePickerEnd += "</TD>" + 
      (isNav?"":"</FORM>")+
      "</TABLE>" +
      (isNav?"</FORM>":"")+
      "</CENTER>" +
      "</HTML>";
}
function returnDate(inDay)
{
  disableEvents = true;
  var date = new Date(DatePickerObject.currentYear, DatePickerObject.currentMonth, 1);
  date.setDate(inDay);
 if (ShowTimes > 0) date.setHours(DatePickerObject.currentHour,DatePickerObject.currentMinute,DatePickerObject.currentSecond,0);
  if (date) date = checkDateRange(date);
  var dateFormat = DatePickerObject.format;
  var outDate = formatDate(date, parseDateFormat(dateFormat));
  datepickerControl.value = String(outDate).replace(/\s*$/, "");
  if (datepickerControl.type!="hidden") datepickerControl.focus();
  top.newWinDatePickerObject.close()
  top.newWinDatePickerObject = '';
}
function UnLoad()
{
  if (disableUnload) return;
  disableEvents = true;
  top.newWinDatePickerObject = '';
}
function SetHour(intHour)
{	
	var MaxHour;
	var MinHour;
	
	if (ShowAMPM == 0)
	{	MaxHour=23;MinHour=0}
	else if (ShowAMPM == 1)
	{	MaxHour=12;MinHour=1}
	
	if (intHour<10) IntHour = '0' + intHour;
	//var HourExp=new RegExp("^\\d$\\d$");
	
	if ( (parseInt(intHour,10)<=MaxHour) && (parseInt(intHour,10)>=MinHour))
	{	
		if ((ShowAMPM == 1) && (DatePickerObject.AMorPM=="PM"))
		{
			if (parseInt(intHour,10)==12)
				DatePickerObject.currentHour=12;
			else	
				DatePickerObject.currentHour=parseInt(intHour,10)+12;
		}	
		else if ((ShowAMPM == 1) && (DatePickerObject.AMorPM=="AM"))
		{
			if (intHour==12)
				intHour-=12;
			DatePickerObject.currentHour=parseInt(intHour,10);
		}
		else
			DatePickerObject.currentHour=parseInt(intHour,10);
	}
}
function SetMinute(intMin)
{
	
	//var MinExp=new RegExp("^\\d\\d$");
	
	if ( (intMin<60))
		DatePickerObject.currentMinute=intMin;
					
}
function SetSecond(intSec)
{	
	//var SecExp=new RegExp("^\\d\\d$");
	
	if ( (intSec<60))
			DatePickerObject.currentSecond=intSec;
	
}
function SetAmPm(pvalue)
{
	DatePickerObject.AMorPM=pvalue;
	if (pvalue=="PM")
	{
		DatePickerObject.currentHour=(parseInt(DatePickerObject.currentHour,10))+12;
		if (DatePickerObject.currentHour==24)
			DatePickerObject.currentHour=12;
	}	
	else if (pvalue=="AM"){ if (DatePickerObject.currentHour>12) DatePickerObject.currentHour-=12;	}
}
function getAmPm()
{
	if (ShowAMPM > 0){
	 if (DatePickerObject.currentHour > 12)
		{
			DatePickerObject.currentHour-=12;
		    DatePickerObject.AMorPM='PM';
		} else { DatePickerObject.AMorPM='AM';}
	}
}
var listMonths = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
var listShortMonths = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
var firstWeekDay = "Sun";
var listWeekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
var listShortWeekdays = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
var DateMasks = new Array(28);
    DateMasks["d"] = 0;
    DateMasks["dd"] = 2;
    DateMasks["ddd"] = 0;
    DateMasks["dddd"] = 0;
    DateMasks["m"] = 0;
    DateMasks["mm"] = 2;
    DateMasks["mmm"] = 3;
    DateMasks["mmmm"] = 0;
    DateMasks["M"] = 0;
    DateMasks["MM"] = 2;
    DateMasks["MMM"] = 3;
    DateMasks["MMMM"] = 0;
    DateMasks["yy"] = 2;
    DateMasks["yyyy"] = 4;
    DateMasks["h"] = 0;
    DateMasks["hh"] = 2;
    DateMasks["H"] = 0;
    DateMasks["HH"] = 2;
    DateMasks["n"] = 0;
    DateMasks["nn"] = 2;
    DateMasks["s"] = 0;
    DateMasks["ss"] = 2;
    DateMasks["am/pm"] = 2;
    DateMasks["AM/PM"] = 2;
    DateMasks["A/P"] = 1;
    DateMasks["a/p"] = 1;
    DateMasks["w"] = 0;
    DateMasks["q"] = 0;
    DateMasks["S"] = 0;
function geckoGetRv()
{
  if (navigator.product != 'Gecko')
  {
    return -1;
  }
  var rvValue = 0;
  var ua      = navigator.userAgent.toLowerCase();
  var rvStart = ua.indexOf('rv:');
  var rvEnd   = ua.indexOf(')', rvStart);
  var rv      = ua.substring(rvStart+3, rvEnd);
  var rvParts = rv.split('.');
  var exp     = 1;
  for (var i = 0; i < rvParts.length; i++)
  {
    var val = parseInt(rvParts[i]);
    rvValue += val / exp;
    exp *= 100;
  }
  return rvValue;
}
function isInArray(strValue, arrArray)
{
  var intResult = -1;
  for ( var j = 0; j < arrArray.length && (strValue != arrArray[j]); j++ );
  if ( j != arrArray.length )
    intResult = j;    
  return intResult;
}
function parseDateFormat(strMask)
{
  var UNDEF;
  var arrResult = new Array();             
  if (strMask == "" || typeof(strMask) == "undefined")
    return arrResult;
  var arrMaskTokens = new Array(
  "d", "w", "m", "M", "q", "y", "h", "H", "n", "s", 
  "dd", "ww", "mm", "MM", "yy", "hh", "HH", "nn", "ss", "S",
  "ddd", "mmm", "MMM", "A/P", "a/p", "dddd", "mmmm", "MMMM", 
  "yyyy", "AM/PM", "am/pm", "LongDate", "LongTime", 
  "ShortDate", "ShortTime", "GeneralDate");
  var arrMaskTokensFirstLetters = new Array("d", "w", "m", "M",
  "q", "y", "h", "H", "n", "s", "A", "a", "L", "S", "G");
  var strMaskLength = strMask.length;
  var i = 0, intMaskPosition = 0;
  var arrMask = new Array();
  var strToken = "";
  while (i < strMaskLength)
  {
  if (strMask.charAt(i) == "\\")
  {
    strToken += strMask.charAt(++i);
    i ++;
  }
  else if (strMask.charAt(i) == "'")
  {
    i ++;
    while ((i < strMask.length) && (strMask.charAt(i) != "'"))
    strToken += strMask.charAt(i++);
    i ++;
  }
  else
  {
    var j = isInArray(strMask.charAt(i), arrMaskTokensFirstLetters);
    if ( j != -1 )
    {
    var k;
    for (k = (arrMaskTokens.length - 1); k >= 0 && 
      strMask.slice(i, i + arrMaskTokens[k].length) != arrMaskTokens[k]; k--);
    if (k != -1)
    {
      if (strToken.length > 0)
      {
      if ( isInArray(strToken, arrMaskTokens) == -1)
        arrMask[intMaskPosition ++] = strToken;
      else
        arrMask[intMaskPosition ++] = "\\" + strToken;
      strToken = "";
      }
      arrMask[intMaskPosition ++] = arrMaskTokens[k];
      i += arrMaskTokens[k].length;
    }
    else
    {
      strToken = strMask.charAt(i);
      i ++;
    }
    }
    else
    {
    strToken += strMask.charAt(i);
    i ++;
    }
  }
  }
  if (strToken.length > 0)
  {
  if ( isInArray(strToken, arrMaskTokens) == -1)
    arrMask[intMaskPosition ++] = strToken;
  else
    arrMask[intMaskPosition ++] = "\\" + strToken;
  strToken = "";
  }
  arrResult = arrMask;
  return arrResult;
}
function getDayOfYear(year, month, day)
{
  var firstDay = new Date(year, 0, 1);
  var date = new Date(year, month, day);
  return (date-firstDay)/(1000*60*60*24);
}
function get12Hour(hoursNumber)
{
  if (hoursNumber == 0)
    hoursNumber = 12;
  else if (hoursNumber > 12)
    hoursNumber = hoursNumber - 12;
  return hoursNumber;
}
function addZero(value, resultLength)
{
  var countZero = resultLength - String(value).length;
  var result = String(value);
  for (var i=0; i<countZero; i++)
    result = "0" + result;
  return result;
}
function getAMPM(HoursNumber, AnteMeridiem, PostMeridiem)
{
  if (HoursNumber >= 0 && HoursNumber < 12)
    return AnteMeridiem;
  else
    return PostMeridiem;
}
function formatDate(dateToFormat, parsedFormat)
{
  var resultArray = new Array(parsedFormat.length);
  for (var i=0; i<parsedFormat.length; i++)
  {
    switch (parsedFormat[i]) 
    {
      case "d": 
        resultArray[i] = dateToFormat.getDate(); 
        break;
      case "w":
        resultArray[i] = dateToFormat.getDay()+1;
        break;
      case "m": case "M": 
        resultArray[i] = dateToFormat.getMonth()+1;
        break;
      case "q": 
        resultArray[i] = Math.floor((dateToFormat.getMonth()+4)/4);
        break;
      case "y": 
        resultArray[i] = getDayOfYear(dateToFormat.getFullYear(), dateToFormat.getMonth(), dateToFormat.getDate());
        break;
      case "h": 
        resultArray[i] = "0";//get12Hour(dateToFormat.getHours());
        break;
      case "H": 
        resultArray[i] = "0";//dateToFormat.getHours();
        break;
      case "n": 
        resultArray[i] = "00";//dateToFormat.getMinutes();
        break;
      case "s": 
        resultArray[i] = "00";//dateToFormat.getSeconds();
        break;
      case "dd": 
        resultArray[i] = addZero(dateToFormat.getDate(), 2);
        break;
      case "ww": 
        resultArray[i] = Math.floor(getDayOfYear(dateToFormat.getFullYear(), dateToFormat.getMonth(), dateToFormat.getDate())/7)+1;
        break;
      case "mm": case "MM": 
        resultArray[i] = addZero(dateToFormat.getMonth()+1, 2);
        break;
      case "yy": 
        resultArray[i] = String(dateToFormat.getFullYear()).substr(2);
        break;
      case "hh": 
        resultArray[i] = "00";//addZero(get12Hour(dateToFormat.getHours()), 2);
        break;
      case "HH": 
        resultArray[i] = "00";//addZero(dateToFormat.getHours(), 2);
        break;
      case "nn": 
        resultArray[i] = "00";//addZero(dateToFormat.getMinutes(), 2);
        break;
      case "ss": 
        resultArray[i] = "00";//addZero(dateToFormat.getSeconds(), 2);
        break;
      case "S": 
        resultArray[i] = "000";//"000";
        break;
      case "ddd": 
        resultArray[i] = listShortWeekdays[dateToFormat.getDay()];
        break;
      case "mmm": case "MMM": 
        resultArray[i] = listShortMonths[dateToFormat.getMonth()];
        break;
      case "A/P": 
        resultArray[i] = "A";//getAMPM(dateToFormat.getHours(), "A", "P");
        break;
      case "a/p": 
        resultArray[i] = "a";//getAMPM(dateToFormat.getHours(), "a", "p");
        break;
      case "dddd": 
        resultArray[i] = listWeekdays[dateToFormat.getDay()];
        break;
      case "mmmm": case "MMMM": 
        resultArray[i] = listMonths[dateToFormat.getMonth()];
        break;
      case "yyyy": 
        resultArray[i] = dateToFormat.getFullYear();
        break;
      case "AM/PM": 
        resultArray[i] = "AM";//getAMPM(dateToFormat.getHours(), "AM", "PM");
        break;
      case "am/pm": 
        resultArray[i] = "am";//getAMPM(dateToFormat.getHours(), "am", "pm");
        break;
      case ":": 
        resultArray[i] = ":";
        break;
      case "LongDate": 
        resultArray[i] = formatDate(dateToFormat, parseDateFormat("dddd, mmmm dd, yyyy"));
        break;
      case "LongTime": 
        resultArray[i] = formatDate(dateToFormat, parseDateFormat("h:nn:ss AM/PM"));
        break;
      case "ShortDate": 
        resultArray[i] = formatDate(dateToFormat, parseDateFormat("m/d/yy"));
        break;
      case "ShortTime": 
        resultArray[i] = formatDate(dateToFormat, parseDateFormat("H:nn"));
        break;
      case "GeneralDate": 
        resultArray[i] = formatDate(dateToFormat, parseDateFormat("m/d/yy hh:nn AM/PM"));
        break;
      default:
        if (String(parsedFormat[i]).charAt(0)=="\\")
        resultArray[i] = String(parsedFormat[i]).substr(0);
      else
        resultArray[i] = parsedFormat[i];
    }
  }
  return resultArray.join("");
}
function parseDate(dateToParse, parsedMask)
{
  var resultDate, resultDateArray = new Array(8);
  var MaskPart, MaskLength, TokenLength;
  var IsError;
  var DatePosition, MaskPosition;
  var Delimiter, BeginDelimiter;
  var MonthNumber, MonthName;
  var DatePart;
  var IS_DATE_POS, YEAR_POS, MONTH_POS, DAY_POS, IS_TIME_POS, HOUR_POS, MINUTE_POS, SECOND_POS;
  IS_DATE_POS = 0;  YEAR_POS = 1;  MONTH_POS = 2;  DAY_POS = 3;
  IS_TIME_POS = 4;  HOUR_POS = 5;  MINUTE_POS = 6;  SECOND_POS = 7;
  if (!parsedMask)
  {
    resultDate = null;
  }
  else if (parsedMask[0] == "GeneralDate" && String(dateToParse)!="")
    resultDate = parseDate(dateToParse, parseDateFormat("m/d/yy hh:nn AM/PM"));
  else if (parsedMask[0] == "LongDate" && String(dateToParse)!="")
    resultDate = parseDate(dateToParse, parseDateFormat("dddd, mmmm dd, yyyy"));
  else if (parsedMask[0] == "ShortDate" && String(dateToParse)!="")
    resultDate = parseDate(dateToParse, parseDateFormat("m/d/yy"));
  else if (parsedMask[0] == "LongTime" && String(dateToParse)!="")
    resultDate = parseDate(dateToParse, parseDateFormat("h:nn:ss AM/PM"));
  else if (parsedMask[0] == "ShortTime" && String(dateToParse)!="")
    resultDate = parseDate(dateToParse, parseDateFormat("H:nn"));
  else if (String(dateToParse) == "") resultDate = null;
  else
  {
    DatePosition = 0;
    MaskPosition = 0;
    MaskLength = parsedMask.length;
    IsError = false;
    resultDateArray[IS_DATE_POS] = false;
    resultDateArray[IS_TIME_POS] = false;
    resultDateArray[YEAR_POS] = 0;  resultDateArray[MONTH_POS] = 12;  resultDateArray[DAY_POS] = 1;
    resultDateArray[HOUR_POS] = 0;  resultDateArray[MINUTE_POS] = 0;  resultDateArray[SECOND_POS] = 0;
    while ((MaskPosition < MaskLength) && !IsError)
    {
      MaskPart = parsedMask[MaskPosition];
      if (DateMasks[MaskPart] != null)
      {
        TokenLength = DateMasks[MaskPart];
        if (TokenLength > 0)
        {
          DatePart = String(dateToParse).substr(DatePosition, TokenLength);
          DatePosition = DatePosition + TokenLength;
        }else
        {
          if (MaskPosition < MaskLength)
          {
            Delimiter = parsedMask[MaskPosition + 1];
            BeginDelimiter = dateToParse.indexOf(Delimiter, DatePosition);
            if (BeginDelimiter == -1)
            {
              return null;
            }else 
            {
              DatePart = String(dateToParse).substr(DatePosition, BeginDelimiter - DatePosition);
              DatePosition = BeginDelimiter;
            }
          }else DatePart = String(dateToParse).substr(DatePosition);
        }
        switch (MaskPart)
        {
          case "d": case "dd":
            resultDateArray[DAY_POS] = Math.floor(DatePart);
            resultDateArray[IS_DATE_POS] = true;
            break;
          case "m": case "mm": case "M": case "MM":
            resultDateArray[MONTH_POS] = Math.floor(DatePart);
            resultDateArray[IS_DATE_POS] = true;
            break;
          case "mmm": case "mmmm": case "MMM": case "MMMM":
            MonthNumber = 0;
            MonthName = String(DatePart).toUpperCase();
            if (MaskPart == "mmm") 
              MonthNamesArray = listMonths;
            else
              MonthNamesArray = listShortMonths;
            while (MonthNumber < 11 && String(MonthNamesArray[MonthNumber]).toUpperCase() != MonthName)
            {
              MonthNumber = MonthNumber + 1;
            }
            if (MonthNumber == 11) 
            {
              if (String(MonthNamesArray[11]).toUpperCase() != MonthName) 
              {
                return null;
              }
            }
            resultDateArray[MONTH_POS] = MonthNumber + 1;
            resultDateArray[IS_DATE_POS] = true;
            break;
          case "yy": 
                  var last2Digits = Math.floor(DatePart);
            var centuryDigits = (last2Digits>=50)?1900:2000;
            resultDateArray[YEAR_POS] = centuryDigits + last2Digits;
            resultDateArray[IS_DATE_POS] = true;
            break;
          case "yyyy":
            resultDateArray[YEAR_POS] = Math.floor(DatePart);
            resultDateArray[IS_DATE_POS] = true;
            break;
          case "h": case "hh":
            if (Math.floor(DatePart) == 12) 
              resultDateArray[HOUR_POS] = 0;
            else 
              resultDateArray[HOUR_POS] = Math.floor(DatePart);
            resultDateArray[IS_TIME_POS] = true;
            break;
          case "H": case "HH":
            resultDateArray[HOUR_POS] = Math.floor(DatePart);
            resultDateArray[IS_TIME_POS] = true;
            break;
          case "n": case "nn":
            resultDateArray[MINUTE_POS] = Math.floor(DatePart);
            resultDateArray[IS_TIME_POS] = true;
            break;
          case "s": case "ss":
            resultDateArray[SECOND_POS] = Math.floor(DatePart);
            resultDateArray[IS_TIME_POS] = true;
            break;
          case "am/pm": case "a/p": case "AM/PM": case "A/P":
            if (String(DatePart).toLowerCase().charAt(0) == "p") 
              resultDateArray[HOUR_POS] = resultDateArray[HOUR_POS] + 12;
            else if (String(DatePart).toLowerCase().charAt(0) == "a")
              resultDateArray[HOUR_POS] = resultDateArray[HOUR_POS];
            resultDateArray[IS_TIME_POS] = true;
            break;
          case "w": case "q": case "S":
            break;
        }
      }else DatePosition = DatePosition + parsedMask[MaskPosition].length;
      MaskPosition = MaskPosition + 1
    }
    if (resultDateArray[IS_DATE_POS] && resultDateArray[IS_TIME_POS]) 
    {
      resultDate = new Date(resultDateArray[YEAR_POS], resultDateArray[MONTH_POS] - 1, resultDateArray[DAY_POS], resultDateArray[HOUR_POS], resultDateArray[MINUTE_POS], resultDateArray[SECOND_POS]);
    }else if (resultDateArray[IS_DATE_POS])
    {
      resultDate = new Date(resultDateArray[YEAR_POS], resultDateArray[MONTH_POS] - 1, resultDateArray[DAY_POS]);
    }else if (resultDateArray[IS_DATE_POS])
    {
      resultDate = new Date(0, 0, 0, resultDateArray[HOUR_POS], resultDateArray[MINUTE_POS], resultDateArray[SECOND_POS]);
    }
  }
  return resultDate;
}
function checkDateRange(date)
{
  var minDate = new Date(1753, 0, 1);
  var maxDate = new Date(9999, 11, 31);
  if (date < minDate) return minDate;
  if (date > maxDate) return maxDate;
  return date;
}
var DatePickerObject = new Object();
var disableEvents = false;
var disableUnload = false;
var isNav = false;
var isIE  = false;
if (navigator.appName == "Netscape") 
{
  isNav = true;
}
else 
{
  isIE = true;
}
selectedLanguage = navigator.language;
function setDateField(dateField) 
{
  datepickerControl = eval(dateField);
  setInitialDate(datepickerControl.value);
  datepickerDocumentTop    = buildTop();
  datepickerDocumentBottom = buildBottom();
}
function setInitialDate(inDate) 
{
  var date = parseDate(inDate, parseDateFormat(DatePickerObject.format));
  if (date) date = checkDateRange(date);
  if (isNaN(date) || !date) 
  {
    date = new Date();
  }
  DatePickerObject.selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  DatePickerObject.selectedDay  = date.getDate();
  date.setDate(1);
  DatePickerObject.currentMonth = date.getMonth();
  DatePickerObject.currentYear = date.getFullYear();
}
function showDatePicker(object_name, form_name, form_control) 
{
  disableEvents = false;
  DatePickerObject = eval(object_name);
  if (typeof(DatePickerObject)!="object" || !DatePickerObject) return;
  DatePickerObject.control          = String("document."+form_name+"."+form_control);
  DatePickerObject.themePath        = DatePickerObject.style;
  DatePickerObject.selectedDate     = new Date();
  DatePickerObject.selectedDay      = 1;
  DatePickerObject.currentMonth     = DatePickerObject.selectedDate.getMonth();
  DatePickerObject.currentYear      = DatePickerObject.selectedDate.getFullYear();
  if (DatePickerObject.themePath.lastIndexOf("/")!=-1)
    DatePickerObject.themePath = DatePickerObject.themePath.substr(0,DatePickerObject.themePath.lastIndexOf("/")+1);
  else if (DatePickerObject.themePath.lastIndexOf("\\")!=-1)
    DatePickerObject.themePath = DatePickerObject.themePath.substr(0,DatePickerObject.themePath.lastIndexOf("\\")+1);
  buildDatePickerParts();
  setDateField(DatePickerObject.control);
  datepickerSource = datepickerDocumentBottom;
  try{
    top.newWinDatePickerObject.focus();
  }catch(e){
    top.newWinDatePickerObject = null;
  }
  if (typeof(top.newWinDatePickerObject) != "object" || (typeof(top.newWinDatePickerObject) == "object" && top.newWinDatePickerObject == null)) 
  {
    var datepickerURL = DatePickerObject.relativePathPart?DatePickerObject.relativePathPart+"DatePicker.html":"DatePicker.html";
    var w_left = Math.ceil(screen.width/2-120);
    var w_top = Math.ceil(screen.height/2-110);
    top.newWinDatePickerObject = window.open(datepickerURL+"?random="+Math.random(), "DatePickerWindow", "dependent=yes,left="+w_left+",top="+w_top+",width=250,height=210,screenX=200,screenY=300,titlebar=yes, center: yes, help: no, resizable: yes, status: no");
  }
}
function buildTop() 
{
  var imgPrevYear = DatePickerObject.themePath+"PrevYear.gif";
  var imgPrevMonth = DatePickerObject.themePath+"PrevMonth.gif";
  var imgNextMonth = DatePickerObject.themePath+"NextMonth.gif";
  var imgNextYear = DatePickerObject.themePath+"NextYear.gif";
  var datepickerDocument =
      "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0 WIDTH=100%>" +
      "<TR>" +
      "<TD>" +
      "<A " +
      "HREF=\"javascript:parent.opener.setPreviousYear()\"><IMG SRC=\""+imgPrevYear+"\" BORDER=\"0\"></A><A " +
      "HREF=\"javascript:parent.opener.setPreviousMonth()\"><IMG SRC=\""+imgPrevMonth+"\" BORDER=\"0\"></A>" +      
      "</TD>" +
      "<TD NOBR WIDTH=\"100%\">" +      
      "<CENTER>" +
      "<LABEL ID=\"labelMonth\">"+listMonths[DatePickerObject.currentMonth]+"</LABEL>&nbsp;<LABEL ID=\"labelYear\">"+DatePickerObject.currentYear+"</LABEL>" +
      "</CENTER>" +
      "</TD>" +
      "<TD>" +
      "<A " +
      "HREF=\"javascript:parent.opener.setNextMonth()\"><IMG SRC=\""+imgNextMonth+"\" BORDER=\"0\"></A><A " +
      "HREF=\"javascript:parent.opener.setNextYear()\"><IMG SRC=\""+imgNextYear+"\" BORDER=\"0\"></A>" +
      "</TD>" +
      "</TR>" +
      "</TABLE>";
  return datepickerDocument;
}
function buildBottom() 
{
  var datepickerDocument = (isNav?"<HTML>" + "<HEAD>" +
      "<LINK REL=\"stylesheet\" TYPE=\"text/css\" HREF=\""+DatePickerObject.style+"\">" +
      "<TITLE> Date Picker </TITLE>" +
      "</HEAD>" +
      "<BODY TOPMARGIN='0' LEFTMARGIN='0' ONUNLOAD='parent.opener.UnLoad();'>":"") + DatePickerBegin.replace(/{datepickerDocumentTop}/, datepickerDocumentTop);
  month   = DatePickerObject.currentMonth;
  year    = DatePickerObject.currentYear;
  var date = new Date();
  var selectedDay = DatePickerObject.selectedDay;
  var i   = 0;
  var days = getDaysInMonth();
  if (selectedDay > days) 
    selectedDay = days;
  var firstOfMonth = new Date (year, month, 1);
  var startingPos  = firstOfMonth.getDay() - firstWeekDayIndex;
  if (startingPos<0) startingPos += 7;
  days += startingPos;
  var columnCount = 0;
  for (i = 0; i < startingPos; i++) 
  {
    datepickerDocument += blankCell;
    columnCount++;
  }
  var currentDay = 0;
  var dayType    = "weekday";
  var dayBackground = "";
  for (i = startingPos; i < days; i++) 
  {
    var paddingChar = "&nbsp;";
    dayBackground = "";
    if (i-startingPos+1 < 10) 
      padding = "&nbsp;&nbsp;";
    else 
      padding = "&nbsp;";
    currentDay = i-startingPos+1;
    var currentDate = DatePickerObject.selectedDate;
    if (currentDay == selectedDay && month==currentDate.getMonth() && year==currentDate.getFullYear())
    {
      dayType = "selectedDay";
      dayBackground = "selectedDay";
    }
    else if (currentDay == date.getDate() && month==date.getMonth() && year==date.getFullYear())
    {
      dayType = "today";
      dayBackground = "today";
    }
    else 
    {
      dayType = "weekDay";
    }
    if ((columnCount + firstWeekDayIndex) % 7 == 0 || (columnCount + firstWeekDayIndex) % 7 == 6)
    {
      datepickerDocument += "<TD align=center class=\""+(dayBackground?dayBackground:"weekend")+"\">" +
                "<a class=\"" + dayType + "\" href=\"javascript:parent.opener.returnDate(" + 
                currentDay + ")\">" + padding + currentDay + paddingChar + "</a></TD>";
    }
    else 
    {
      datepickerDocument += "<TD align=center class=\""+(dayBackground?dayBackground:"workday")+"\">" +
                "<a class=\"" + dayType + "\" href=\"javascript:parent.opener.returnDate(" + 
                currentDay + ")\">" + padding + currentDay + paddingChar + "</a></TD>";
    }
    columnCount++;
    if (columnCount % 7 == 0) 
      datepickerDocument += "</TR><TR>";
  }
  for (i=days; i<(startingPos<0?42+startingPos:42); i++)
  {
    datepickerDocument += blankCell;
    columnCount++;
    if (columnCount % 7 == 0) 
    {
      datepickerDocument += "</TR>";
      if (i<(startingPos<0?41+startingPos:41)) datepickerDocument += "<TR>";
    }
  }
  datepickerDocument += DatePickerEnd + (isNav?"</BODY>" + "</HTML>":"");
  return datepickerDocument;
}
function writeDatePicker()
{
  datepickerDocumentTop    = buildTop();
  datepickerDocumentBottom = buildBottom();
  disableUnload = true;
  top.newWinDatePickerObject.document.open();
  top.newWinDatePickerObject.document.write(datepickerDocumentBottom);
  top.newWinDatePickerObject.document.close();
  disableUnload = false;
}
function setToday()
{
  var date = new Date();
  DatePickerObject.currentMonth = date.getMonth();
  DatePickerObject.currentYear = date.getFullYear();
  returnDate(date.getDate());
}
function setPreviousYear()
{
  var year = DatePickerObject.currentYear - 1;
  var date = new Date();
  date.setFullYear(year);
  date = checkDateRange(date);
  year = date.getFullYear();
  DatePickerObject.currentYear = year;
  writeDatePicker();
}
function setPreviousMonth()
{
  var year  = DatePickerObject.currentYear;
  var month = DatePickerObject.currentMonth;
  if (month == 0)
  {
    month = 11;
    if (year > 1000)
    {
      year--;
      var date = new Date();
      date.setFullYear(year);
      date = checkDateRange(date);
      year = date.getFullYear();
      DatePickerObject.currentYear = year;
    }
  }else 
  {
    month--;
  }
  DatePickerObject.currentMonth = month;
  writeDatePicker();
}
function setNextMonth()
{
  var year = DatePickerObject.currentYear;
  var month = DatePickerObject.currentMonth;
  if (month == 11)
  {
    month = 0;
    year++;
    var date = new Date();
    date.setFullYear(year);
    date = checkDateRange(date);
    year = date.getFullYear();
    DatePickerObject.currentYear = year;
  } else
  {
    month++;
  }
  DatePickerObject.currentMonth = month;
  writeDatePicker();
}
function setNextYear()
{
  var year  = DatePickerObject.currentYear + 1;
  var date = new Date();
  date.setFullYear(year);
  date = checkDateRange(date);
  year = date.getFullYear();
  DatePickerObject.currentYear = year;
	writeDatePicker();
}
function getDaysInMonth()
{
  var days;
  var month = DatePickerObject.currentMonth+1;
  var year  = DatePickerObject.currentYear;
  if (month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12)
  {
    days=31;
  }
  else if (month==4 || month==6 || month==9 || month==11) 
  {
    days=30;
  }
  else if (month==2)  
  {
    if (isLeapYear(year))
    {
      days=29;
    }
    else 
    {
      days=28;
    }
  }
  return (days);
}
function isLeapYear (Year)
{
  if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0))
    return true;
  else 
    return false;
}
function createWeekdayList()
{
  firstWeekDayIndex = 0;
  newWeekdayArray = new Array(7);
  newWeekdayList = new Array(7);
  for (var i=0; i<listShortWeekdays.length; i++)
    if (listShortWeekdays[i]==firstWeekDay) firstWeekDayIndex = i;
  for (var i=firstWeekDayIndex; i<listShortWeekdays.length; i++)
  {
      newWeekdayArray[i-firstWeekDayIndex] = listShortWeekdays[i];
      newWeekdayList[i-firstWeekDayIndex] = listWeekdays[i];
  }
  for (var i=0; i<firstWeekDayIndex; i++)
  {
      newWeekdayArray[7-firstWeekDayIndex-i] = listShortWeekdays[i];
      newWeekdayList[7-firstWeekDayIndex-i] = listWeekdays[i];
  }
  var weekdays = "<TR>";
  for (i in listShortWeekdays)
  {
      weekdays += "<TH class=\"calendar\" align=\"center\">" + newWeekdayArray[i] + "</TH>";
  }
  weekdays += "</TR>";
  return weekdays;
}
function buildDatePickerParts()
{
  weekdays = createWeekdayList();
  blankCell = "<TD align=center class=\"workday\">&nbsp;&nbsp;&nbsp;</TD>";
  DatePickerBegin =
      (isNav?"":"<HTML>" +
      "<HEAD>" +
      "<LINK REL=\"stylesheet\" TYPE=\"text/css\" HREF=\""+DatePickerObject.style+"\">" +
      "<TITLE> Date Picker </TITLE>" +
      "</HEAD>" +
      "<BODY TOPMARGIN='0' LEFTMARGIN='0' ONUNLOAD='parent.opener.UnLoad();'>") + "<CENTER>";
  DatePickerBegin += "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0><TR><TD>{datepickerDocumentTop}</TD></TR><TR><TD ALIGN=CENTER VALIGN=TOP>";
  DatePickerBegin += "<TABLE CELLPADDING=0 CELLSPACING=1 CLASS=\"Table\">" + weekdays + "<TR>";
  DatePickerEnd = "";
  DatePickerEnd += "</TABLE>";
  DatePickerEnd +=
      "</TABLE>" +
      (isNav?"<FORM NAME='calTable' onSubmit='return false;'>":"") + 
      "<TABLE BORDER='0'>" + 
      (isNav?"":"<FORM NAME='calTable' onSubmit='return false;'>") +
      "<TD>" +
      "<INPUT TYPE='button' CLASS='CalendarButtons' NAME='today' VALUE='Today' onClick=\"parent.opener.setToday()\">" + 
      "</TD>" + 
      (isNav?"":"</FORM>")+
      "</TABLE>" +
      (isNav?"</FORM>":"")+
      "</CENTER>" +
      "</HTML>";
}
function returnDate(inDay)
{
  disableEvents = true;
  var date = new Date(DatePickerObject.currentYear, DatePickerObject.currentMonth, 1);
  date.setDate(inDay);
  if (date) date = checkDateRange(date);
  var dateFormat = DatePickerObject.format;
  var outDate = formatDate(date, parseDateFormat(dateFormat));
  datepickerControl.value = String(outDate).replace(/\s*$/, "");
  if (datepickerControl.type!="hidden") datepickerControl.focus();
  top.newWinDatePickerObject.close()
  top.newWinDatePickerObject = null;
}
function UnLoad()
{
  if (disableUnload) return;
  disableEvents = true;
  top.newWinDatePickerObject = null;
}