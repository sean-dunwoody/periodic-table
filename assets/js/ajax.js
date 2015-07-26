// AJAX function for getting the json data
function httpGet(theUrl) {
	var xmlHttp = null;
	if(window.XMLHttpRequest) {
		// normal browsers
		xmlHttp = new XMLHttpRequest();
		xmlHttp.open('GET', theUrl, false);
		xmlHttp.send();
		return xmlHttp;
	}
	else if (window.XDomainRequest) {
		// for IE8/9 support
		xmlHttp = new XDomainRequest();
		xmlHttp.open("get", theUrl);
		xmlHttp.send();
		return xmlHttp;
	}
	
	if(window.DOMParser) {
		// for IE9+ and other browsers
		var parser = new DOMParser();
		var doc = parser.parseFromString(xmlHttp.responseText, 'text/xml');
		return doc;
	}
	else {
		// for IE8-
		var xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
		xmlDocument.async = false;
		xmlDocument.loadXML(xmlHttp.responseText);
		return xmlDocument;
	}
}