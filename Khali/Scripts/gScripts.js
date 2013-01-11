/* ----------------------------------------------------------
				Global JavaScript functions

	For: Sammelana							Author: Subhajit
   ---------------------------------------------------------- */




/* ----------------------------------------------------------
				Define common functions
   ---------------------------------------------------------- */

// Declare Global Constants
var pwdMinLen = 6;
var vldtrUpdate = 100;

// Declare Basic string values
var expNum = "0123456789";
var expStr = "\"\'\n";
var expSpc = "\t\b\f\r";
var expSym = "`~!#$%^&*()=+{}[]|\\:;<>,?/";
var expEml = "@_-.";
var expAll = expNum + expStr + expSpc + expSym + expEml;

// Global Enumerations
var sbReport = {
	"Acceptable": 0,
	"AlreadyAccepted": 1,
	"Unacceptable": 2,
	"TooSmall": 3,
	"TooBig": 4,
	"TooEarly": 5,
	"TooLate": 6
};



/*
	----------------------------------------------------------------
						sbSammelanaGen
	----------------------------------------------------------------
*/

function sbStrContains(str, cnt) {
	for (var i = 0; i < cnt.length; i++) {
		if (str.indexOf(cnt.charAt(i)) >= 0) return true;
	}
	return false;
}
function sbStrContainsOnly(str, cnt) {
	for (var i = 0; i < str.length; i++) {
		if (cnt.indexOf(str.charAt(i)) < 0) return false;
	}
	return true;
}




/*
----------------------------------------------------------------
						sbSammelanaForm
----------------------------------------------------------------
*/

function sbVrfyEmail (email) {
	if (email.length < 6) return sbReport.Unacceptable;
	if (sbStrContains(email, "\"\'\n\\~`!#$%^&*()=+[]{}|:;,<>,?/")) return sbReport.Unacceptable;
	var Parts = email.split("@");
	if (Parts.length != 2) return sbReport.Unacceptable;
	if (Parts[0].length < 1 || Parts[1].length < 4) return sbReport.Unacceptable;
	Parts = Parts[1].split(".");
	if (Parts.length < 2) return sbReport.Unacceptable;
	for (var i=0 ; i < Parts.length - 1 ; i++)
	{
		if (Parts[i].length == 0) return sbReport.Unacceptable;
	}
	if (Parts[Parts.length - 1].length < 2) return sbReport.Unacceptable;
	return sbReport.Acceptable;
}
function sbVrfyPassword (pwd) {
	if (pwd.length < pwdMinLen) return sbReport.Unacceptable;
	return sbReport.Acceptable;
}
function sbVrfyName (name) {
	if (sbStrContains(name, "`~!@#$%^&*()-_=+[]{}|\\\"\':;<,>?/0123456789")) return sbReport.Unacceptable;
	return sbReport.Acceptable;
}
function sbVrfyGender (gndr) {
	if (gndr != "Male" && gndr != "Female") return sbReport.Unacceptable;
	return sbReport.Acceptable;
}
function sbVrfyDate (datestr) {
	try { var tmp = new Date(datestr); }
	catch(e) {return sbReport.Unacceptable;}
	return sbReport.Acceptable;
}
function sbVrfyAddress (addr) {
	if (sbStrContains(addr, "\'\"~!$%^?")) return sbReport.Unacceptable;
	return sbReport.Acceptable;
}
function sbVrfyPhone (phone) {
	if (phone.length > 16) return sbReport.Unacceptable;
	if (!sbStrContainsOnly(phone, "0123456789-+")) return sbReport.Unacceptable;
	return sbReport.Acceptable;
}
function sbVrfyNumber (num) {
	if (parseFloat(num) == NaN) return sbReport.Unacceptable;
	return sbReport.Acceptable;
}
function sbVrfyInteger (num) {
	if (!sbStrContainsOnly(num, "0123456789-+")) return sbReport.Unacceptable;
	if (parseInt(num) == NaN) return sbReport.Unacceptable;
	return sbReport.Acceptable;
}
function sbVrfyText(txt, typ, typd) {
	var len = txt.length;
	if (len < 1) return sbReport.TooSmall;
	switch (typ) {
		case "email":
			return sbVrfyEmail(txt);
		case "password":
			return sbVrfyPassword(txt);
		case "name":
			return sbVrfyName(txt);
		case "gender":
			return sbVrfyGender(txt);
		case "date":
			return sbVrfyDate(txt);
		case "address":
			return sbVrfyAddress(txt);
		case "phone":
			return sbVrfyPhone(txt);
		case "number":
			return sbVrfyNumber(txt);
		case "integer":
			return sbVrfyInteger(txt);
		case "match":
			if (txt != typd) return sbReport.Unacceptable;
			return sbReport.Acceptable;
	}
	return 0;
}




/*
----------------------------------------------------------------
					sbSammelanaFieldValidator
----------------------------------------------------------------
*/

// Add Field Validator
function sbAddFldVldtr(nameList, idEnum, vldPrefix) {
	for (var i = 0; i < nameList.length; i++) {
		$(idEnum[nameList[i]]).parent().after("<div id = '" + vldPrefix + nameList[i] + "' class='vld'></div>");
	}
}
// Field Validator using in-built invalid messages
function sbVldtFld(fld, typ, typd, vldtr_blnk, vldtr_inv) {
	var shwTm = vldtrShowTime;
	var txt = $(fld).val();
	var vldtNum = sbVrfyText((typeof (txt) == "undefined") ? "" : txt, typ, typd);
	switch (vldtNum) {
		case sbReport.Acceptable:
			if (vldtr_blnk != "") $(vldtr_blnk).hide(vldtrHideTime);
			if (vldtr_inv != "" && vldtr_inv != vldtr_blnk) $(vldtr_inv).hide(vldtrHideTime);
			break;
		case sbReport.TooSmall:
			if ($(vldtr_inv).css("display") != "none") shwTm = 0;
			if (vldtr_inv != "" && vldtr_inv != vldtr_blnk) $(vldtr_inv).hide();
			if (vldtr_blnk != "") $(vldtr_blnk).show(shwTm);
			break;
		case sbReport.Unacceptable:
			if ($(vldtr_blnk).css("display") != "none") shwTm = 0;
			if (vldtr_blnk != "" && vldtr_inv != vldtr_blnk) $(vldtr_blnk).hide();
			if (vldtr_inv != "") $(vldtr_inv).show(shwTm);
			break;
	}
	var valid = false;
	if (vldtNum == sbReport.Acceptable || (vldtNum == sbReport.TooSmall && vldtr_blnk == "") || (vldtNum == sbReport.Unacceptable && vldtr_inv == "")) valid = true;
	return valid;
}
// Field Validator using sent invalid messages
function sbVldtFldMsg(fld, typ, typd, vldtr, txt_blnk, txt_inv) {
	var txt = $(fld).val();
	var vldtNum = sbVrfyText((typeof (txt) == "undefined") ? "" : txt, typ, typd);
	switch (vldtNum) {
		case sbReport.Acceptable:
			$(vldtr).hide(vldtrUpdate);
			break;
		case sbReport.TooSmall:
			if (txt_blnk != "") { $(vldtr).text(txt_blnk); $(vldtr).show(vldtrUpdate); }
			else $(vldtr).hide(vldtrUpdate);
			break;
		case sbReport.Unacceptable:
			if (txt_inv != "") { $(vldtr).text(txt_inv); $(vldtr).show(vldtrUpdate); }
			else $(vldtr).hide(vldtrUpdate);
			break;
	}
	var valid = false;
	if (vldtNum == sbReport.Acceptable || (vldtNum == sbReport.TooSmall && txt_blnk == "") || (vldtNum == sbReport.Unacceptable && txt_inv == "")) valid = true;
	return valid;
}
// Field Validator using automatic invalid messages
function sbVldtFldMsgAuto(fld, typ, typd, vldtr) {
	return sbVldtFldMsg(fld, typ, typd, vldtr, "(this field cannot be left blank)", "(value entered in this field is invalid)");
}
// Field Validator using automatic invalid message for blank only
function sbVldtFldMsgAutoBlnk(fld, typ, typd, vldtr) {
	return sbVldtFldMsg(fld, typ, typd, vldtr, "(this field cannot be left blank)", "");
}
// Field Validator using automatic invalid message for invalidity only
function sbVldtFldMsgAutoInv(fld, typ, typd, vldtr) {
	return sbVldtFldMsg(fld, typ, typd, vldtr, "", "(value entered in this field is invalid)");
}

