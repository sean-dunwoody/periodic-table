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

// Get all of the elements in the tabld
var elements = document.getElementsByClassName('element');

// loop the elements and add appropriate event listeners
var l = elements.length;
var i = 0;
var openedElements = [];
for(i; i<l; i++) {
	elements[i].addEventListener('click', function(event) {
		event.stopPropagation();
		var elementId = this.id;		 // this is the ID of the HTML element
		var htmlElementId = this.id - 1; // as the array is zero indexed, to refer to the array item we need to -1 from the HTML ID (it's dirty but I'm not sure there's a better way)
		// Instantiate a new element if one has not already been instantiated
		if(!elements[htmlElementId].classList.contains('element-expanded')) {
			openedElements.push(new element(elementId));
			this.classList.add('element-loaded', 'element-focus'); // add a class we can use to detect if an ajax request has been made in the past
		}
		// focus the current element
		var focusedElements = document.getElementsByClassName('element-focus');
		while (focusedElements.length) {
			focusedElements[0].classList.remove('element-focus');
		}
		elements[htmlElementId].classList.add('element-focus');
	}, false);
}

// Code for closing elements (could do with changing)
document.body.addEventListener('click', function(event) {
	try {
		// hide the element
		var lastOpened = openedElements[openedElements.length-1];
		console.log(lastOpened);
		lastOpened.close();
		// remove the element from the opened array
		openedElements.pop();
	} catch(ex) {
		console.log("No items expanded!");
	}
}, false);


// Needs Refactoring
var elementsKey = document.getElementsByClassName("key-element");
var l = elementsKey.length;
var i = 0;
for(i; i<l; i++) {
	elementsKey[i].addEventListener('mouseover', function(event) {
		var highlightedElements = document.getElementsByClassName(this.id);
		var le = highlightedElements.length;
		console.log(le);
		var ie = 0;
		for(ie; ie<le; ie++) {
			highlightedElements[ie].classList.add("element-highlighted");
		}
	}, false);

	elementsKey[i].addEventListener('mouseout', function(event) {
		var highlightedElements = document.getElementsByClassName(this.id);
		var le = highlightedElements.length;
		var ie = 0;
		for(ie; ie<le; ie++) {
			highlightedElements[ie].classList.remove("element-highlighted");
		}
	}, false);
}
function element(elementId) {
	// so we can reference variables inside handlers
	// http://stackoverflow.com/questions/10656119/javascript-get-reference-to-parent-object-class-from-event-handler
	var _self = this;

	this.id = elementId;
	this.container = document.getElementById(this.id);

	// canvas functions
	this.isOdd = function(someNumber){
		return (someNumber%2 == 1) ? true : false;
	};
	this.draw = function(aNumber, aWeight) {
		var protons  = aNumber;
		var neutrons = Math.round(aWeight) - aNumber;
		var nucleons = protons + Math.round(neutrons);
		var rows     = Math.ceil(Math.sqrt(nucleons));
		var cols     = Math.ceil(Math.sqrt(nucleons));
		var radius   = 70 / (Math.round(Math.sqrt(nucleons)));
		var circumference = radius * 2;
		for(var i=1; i<rows+1; i++) {
			for(var j=1;j<cols+1;j++) {
				if(this.isOdd(j) && protons>0) {
					this.ctx.fillStyle = "#ff0000";	
					protons--;
				}
				else if(neutrons>0) {
					this.ctx.fillStyle = "#0000ff";
					neutrons--;	
				}
				else if(neutrons+protons==0) {
					this.ctx.fillStyle = "transparent";		
				}
				this.ctx.beginPath();
				this.ctx.arc( j*circumference, i*circumference, radius, 0, Math.PI*2, false );
				this.ctx.fill();
			}
		}
	}
	this.close = function() {
		this.container.classList.remove("element-expanded");
	}

	this.bindExtraTab = function() {
		var tabId = 'tabs-container-inner-' + this.jsonElement.AtomicNumber;
		this.extraTabs = new simpleTabs(tabId)
	}


	// this is one hell of a constructor...
	// For CSS styling purposes (expands the element)
	this.container.classList.add("element-expanded");
	if(!this.container.classList.contains('element-loaded')) {
		// get the JSON data for this element
		this.jsonUrl = 'http://periodic-table.local/element/' + this.id + '.json';
		this.jsonData = httpGet(this.jsonUrl);
		this.jsonParsed = JSON.parse(this.jsonData.response);
		this.jsonElement = this.jsonParsed.element;

		// Populate the HTML with information gleaned from the JSON data
	    this.furtherInformation = this.container.getElementsByClassName('further-information').item(0);

	    var propertiesText = '';
	    var propertiesLength = this.jsonElement.PhysicalProperties.length;
	    for(var i = 0; i < propertiesLength; i++) {
	    	propertiesText += '<p><strong>' + this.jsonElement.PhysicalProperties[i].Property[0] + '</strong> ' + this.jsonElement.PhysicalProperties[i].Property[1] + '</p>';
	    }
	    this.furtherInformation.innerHTML =  '<div class="tabs-container" id="'+ this.jsonElement.AtomicNumber +'">'
	    		+' <div class="tab-container">'
	    		+' 	<span class="arrow next" id="nextTab-'+ this.jsonElement.AtomicNumber +'">next</span>'
	   			+' 	<span class="heading">'+ this.jsonElement.ElementName +'</span>'
	   			+' 	<div class="content">'
	   			+'		<div class="information">'
	   			+'			<p>'
	   			+'				<strong>Atomic number:</strong>'
	   			+'				'+ this.jsonElement.AtomicNumber
				+'			</p>'
				+'			<p>'
				+'				<strong>Atomic Weight</strong>'
	   			+'				'+ this.jsonElement.AtomicWeight
				+'			</p>'
				+'			<p>'
				+'				<strong>Protons</strong>'
	   			+'				'+ this.jsonElement.AtomicNumber
				+'			</p>'
				+'			<p>'
				+'				<strong>Neutrons</strong>'
	   			+'				'+ (Math.ceil(this.jsonElement.AtomicWeight) - this.jsonElement.AtomicNumber)
				+'			</p>'
				+'			<p>'
				+'				<strong>Electrons</strong>'
	   			+'				'+ this.jsonElement.AtomicNumber
				+'			</p>'
				+			propertiesText
				+' 		</div>'
	   			+'	</div>'
				+'  <a href="'+ this.jsonElement.MoreInfoLink +'" class="explore-link" target="_blank">More Information</a>'
				+'	</div>'
			+' 	<div class="tab-container">'
			+' 		<span class="arrow prev" id="prevTab-'+ this.jsonElement.AtomicNumber +'">previous</span>'
			+'		<div class="tabs-container-inner content" id="tabs-container-inner-'+ this.jsonElement.AtomicNumber +'">'
			+'			<ul class="tabs-navigation">'
			+'				<li><a href="#'+ this.jsonElement.AtomicNumber +'-tab-1" class="tab-link tab-1">Description</a></li>'
			+'				<li><a href="#'+ this.jsonElement.AtomicNumber +'-tab-2" class="tab-link tab-2">Visualise</a></li>'
			//+'				<li><a href="#'+ this.jsonElement.AtomicNumber +'-tab-3" class="tab-link tab-3">Tab Three</a></li>'
			+'			</ul>'
			+'			<ul class="tabs-content">'
			+'				<li class="tab-content tab-1 tab-visible" id="'+ this.jsonElement.AtomicNumber +'-tab-1">' + this.jsonElement.BriefDescription + '</li>'
			+'				<li class="tab-content tab-2 tab-visible" id="'+ this.jsonElement.AtomicNumber +'-tab-2"><canvas id="visualise-'+ this.jsonElement.AtomicNumber +'" width="260" height="210"></canvas><p>Red = Proton | Blue = Neutron</li>'
			//+'				<li class="tab-content tab-3 tab-visible" id="'+ this.jsonElement.AtomicNumber +'-tab-3">Tab three content</li>'
			+'			</ul>'
			+'		</div>'
			+'	</div>'
		+'	</div>';

		// Create canvas
		this.canvas = document.getElementById("visualise-" + this.jsonElement.AtomicNumber);
		if(this.canvas.getContext) {
			this.ctx = this.canvas.getContext('2d');
			var width  = this.canvas.clientWidth;
			var height = this.canvas.clientHeight;
			this.draw(this.jsonElement.AtomicNumber, this.jsonElement.AtomicWeight);
		} else {
			// Browsers that don't support canvas
			console.log("Your browser doesn't support the HTML canvas feature :( sorry");
		}

		this.tabContainer = this.container.getElementsByClassName("tabs-container")[0];

		// Bind the top right more/less info link
		document.getElementById('nextTab-'+ this.jsonElement.AtomicNumber).addEventListener('click', function(event) {
			event.stopPropagation();
			_self.bindExtraTab();
			_self.tabContainer.classList.add("tab-expanded");
			_self.tabContainer.setAttribute("style", "margin-left: -100%");
		}, false);
		// If the viewer is on a mobile device, there won't be a click event, so bind the extra info on load
		if(screen.width > 400) {
			this.bindExtraTab();
		}
		document.getElementById('prevTab-'+ this.jsonElement.AtomicNumber).addEventListener('click', function(event) {
			event.stopPropagation();
			_self.tabContainer.classList.remove("tab-expanded");
			_self.tabContainer.setAttribute("style", "margin-left: 0");
		}, false);
	}

}
function simpleTabs(containerId) {
	var _self = this;
	this.container = document.getElementById(containerId);
	this.tabLinks = this.container.getElementsByClassName("tab-link");
	this.tabContents = this.container.getElementsByClassName("tab-content");
	
	this.numTabs = this.tabLinks.length;

	this.showTab = function(tabLink) {
		// returns something like #tab-1
		var tabHash = tabLink.hash;
		// We need to strip the # out so we can use it for a selector
		var tabId = tabHash.substr(1, tabHash.length)
		var tabShow = document.getElementById(tabId);
		this.hideTabs();
		tabLink.classList.add("tab-selected");
		tabShow.classList.add("tab-visible");
	}

	this.hideTabs = function() {
		for(var i = 0; i < this.numTabs; i++) {
			this.tabLinks[i].classList.remove("tab-selected");
			this.tabContents[i].classList.remove("tab-visible");
		}
	}

	// Class Constructor
	for(var i = 0; i < this.numTabs; i++) {
		this.tabLinks[i].addEventListener("click", function(event) {
  			event.stopPropagation();
			event.preventDefault();
			_self.showTab(this)
		});
		// Hide all tabs but the first one
		this.hideTabs();
		this.showTab(this.tabLinks[0]);
	}
}