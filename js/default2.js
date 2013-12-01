// canvas functions
var isOdd = function(someNumber){
	return (someNumber%2 == 1) ? true : false;
};
function draw(aNumber, aWeight) {
	var protons  = aNumber;
	var neutrons = Math.round(aWeight)-aNumber;
	var nucleons = protons+Math.round(neutrons);
	var rows   = Math.round(Math.sqrt(nucleons));
	var cols   = Math.ceil(Math.sqrt(nucleons));
	var radius = 55/(Math.ceil(Math.sqrt(nucleons)));
	var circumference = radius*2;
	for(var i=1;i<rows+1;i++) {
		for(var j=1;j<cols+1;j++) {
			if(isOdd(j) && protons>0) {
				ctx.fillStyle = "#ff0000";	
				protons--;
			}
			else if(neutrons>0) {
				ctx.fillStyle = "#0000ff";
				neutrons--;	
			}
			else if(neutrons+protons==0) {
				ctx.fillStyle = "#ffffff";		
			}
			ctx.beginPath();
			ctx.arc( j*circumference, i*circumference, radius, 0, Math.PI*2, false );
			ctx.fill();
		}
	}
}

// AJAX function for getting the json data
function httpGet(theUrl) {
	var xmlHttp = null;
	if(window.XMLHttpRequest) {
		// normal browsers
		console.log("normal browsers");
		xmlHttp = new XMLHttpRequest();
		xmlHttp.open('GET', theUrl, false);
		xmlHttp.send();
		return xmlHttp;
	}
	else if (window.XDomainRequest) {
		// for IE8/9 support
		console.log("IE8/9 support");
		xmlHttp = new XDomainRequest();
		xmlHttp.open("get", theUrl);
		xmlHttp.send();
		return xmlHttp;
	}
	
	if(window.DOMParser) {
		// for IE9+ and other browsers
		console.log("for IE9+ and other browsers");
		var parser = new DOMParser();
		var doc = parser.parseFromString(xmlHttp.responseText, 'text/xml');
		return doc;
	}
	else {
		// for IE8-
		console.log("for IE8-");
		var xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
		xmlDocument.async = false;
		xmlDocument.loadXML(xmlHttp.responseText);
		return xmlDocument;
	}
}


var elements = document.getElementsByClassName("element");

document.body.addEventListener('click', function(event) {
	try {
		var firstItem = document.getElementsByClassName("element-expanded").item(0);
		firstItem.className = firstItem.className.replace( /(?:^|\s)element-expanded(?!\S)/ , '' );
	} catch(ex) {
		console.log("No items expanded!");
	}
}, false);

// loop the elements and add appropriate event listeners
var l =elements.length;
var i = 0
for(i; i<l; i++) {
	elements[i].addEventListener('click', function(event) {
		event.stopPropagation();
		var jsonUrl = 'http://periodic-table.local/element/' + this.id + '.json';
		var jsonData = httpGet(jsonUrl);
		var jsonParsed = JSON.parse(jsonData.response);
		var jsonElement = jsonParsed.element[0];

		this.className = this.className + " element-expanded";
	    var furtherInformation = this.getElementsByClassName('further-information').item(0);
	    furtherInformation.innerHTML =  '<div class="tabs-container">'
	    		+' <div class="tab-container">'
	    		+' 	<span class="next" id="nextTab'+ jsonElement.ElementName +'">'
	    		+'		<img src="/images/arrows.png" alt="Two arrows pointing to the right" />'
	   			+' 	</span>'
	   			+' 	<span class="heading">'+ jsonElement.ElementName +'</span>'
	   			+' 	<div class="content">'
	   			+'		<div class="information">'
	   			+'			<p>'
	   			+'				<strong>Atomic number:</strong>'
	   			+'				'+ jsonElement.AtomicNumber
   				+'			</p>'
   				+'			<p>'
   				+'				<strong>Atomic Weight</strong>'
	   			+'				'+ jsonElement.AtomicWeight
				+'			</p>'
   				+'			<p>'
   				+'				<strong>Protons</strong>'
	   			+'				'+ jsonElement.Protons
				+'			</p>'
   				+'			<p>'
   				+'				<strong>Neutrons</strong>'
	   			+'				'+ jsonElement.Neutrons
				+'			</p>'
   				+'			<p>'
   				+'				<strong>Electrons</strong>'
	   			+'				'+ jsonElement.Electrons
				+'			</p>'
   				+'			<p>'
   				+'				<strong>BoilingPoint</strong>'
	   			+'				'+ jsonElement.BoilingPoint
				+'			</p>'
   				+'			<p>'
   				+'				<strong>MeltingPoint</strong>'
	   			+'				'+ jsonElement.MeltingPoint
				+'			</p>'
				+' 		</div>'
	   			+'	</div>'
   				+'  <a href="'+ jsonElement.MoreInfoLink +'" class="explore-link" target="_blank">More Information</a>'
   			+'	</div>'
    		+' 	<div class="tab-container">'
    		+' 		<span class="next" id="prevTab'+ jsonElement.ElementName +'">'
    		+'			<img src="/images/arrows.png" alt="Two arrows pointing to the right" />'
   			+' 		</span>'
   			+' 		<div class="content">'
    		+'			<p>Tab 2 content here</p>'
			+' 		</div>'
   			+'	</div>'
		+'	</div>';

		document.getElementById('nextTab'+ jsonElement.ElementName).addEventListener('click', function(event) {
			event.stopPropagation();
			// this feels wrong, must be a better way
			var test = this.parentElement.parentElement;
			test.className = test.className + " lelelelele";
			test.setAttribute("style", "margin-left: -285px");
		}, false);
		document.getElementById('prevTab'+ jsonElement.ElementName).addEventListener('click', function(event) {
			event.stopPropagation();
			// this feels wrong, must be a better way
			var test = this.parentElement.parentElement;
			test.className = test.className + " lelelelele";
			test.setAttribute("style", "margin-left: 0");
		}, false);
	}, false);
}


// MAJORLY NEED REFACTORING!!!!!!!
var elementsKey = document.getElementsByClassName("key-element");
var l =elementsKey.length;
var i = 0;
for(i; i<l; i++) {
	elementsKey[i].addEventListener('mouseover', function(event) {
		var highlightedElements = document.getElementsByClassName(this.id);
		console.log(highlightedElements);
		var le =highlightedElements.length;
		console.log(le);
		var ie = 0;
		for(ie; ie<le; ie++) {
			highlightedElements[ie].className = highlightedElements[ie].className + ' element-highlighted';
		}
	});

	elementsKey[i].addEventListener('mouseout', function(event) {
		var highlightedElements = document.getElementsByClassName(this.id);
		var le =highlightedElements.length;
		var ie = 0;
		for(ie; ie<le; ie++) {
			highlightedElements[ie].className = highlightedElements[ie].className.replace( /(?:^|\s)element-highlighted(?!\S)/ , '' );
		}
	});
}