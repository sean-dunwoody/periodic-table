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
/*! responsive-nav.js 1.0.32
 * https://github.com/viljamis/responsive-nav.js
 * http://responsive-nav.com
 *
 * Copyright (c) 2014 @viljamis
 * Available under the MIT license
 */

(function (document, window, index) {

  "use strict";

  var responsiveNav = function (el, options) {

    var computed = !!window.getComputedStyle;
    
    // getComputedStyle polyfill
    if (!computed) {
      window.getComputedStyle = function(el) {
        this.el = el;
        this.getPropertyValue = function(prop) {
          var re = /(\-([a-z]){1})/g;
          if (prop === "float") {
            prop = "styleFloat";
          }
          if (re.test(prop)) {
            prop = prop.replace(re, function () {
              return arguments[2].toUpperCase();
            });
          }
          return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        };
        return this;
      };
    }
    /* exported addEvent, removeEvent, getChildren, setAttributes, addClass, removeClass, forEach */
    // fn arg can be an object or a function, thanks to handleEvent
    // read more at: http://www.thecssninja.com/javascript/handleevent
    var addEvent = function (el, evt, fn, bubble) {
        if ("addEventListener" in el) {
          // BBOS6 doesn't support handleEvent, catch and polyfill
          try {
            el.addEventListener(evt, fn, bubble);
          } catch (e) {
            if (typeof fn === "object" && fn.handleEvent) {
              el.addEventListener(evt, function (e) {
                // Bind fn as this and set first arg as event object
                fn.handleEvent.call(fn, e);
              }, bubble);
            } else {
              throw e;
            }
          }
        } else if ("attachEvent" in el) {
          // check if the callback is an object and contains handleEvent
          if (typeof fn === "object" && fn.handleEvent) {
            el.attachEvent("on" + evt, function () {
              // Bind fn as this
              fn.handleEvent.call(fn);
            });
          } else {
            el.attachEvent("on" + evt, fn);
          }
        }
      },
    
      removeEvent = function (el, evt, fn, bubble) {
        if ("removeEventListener" in el) {
          try {
            el.removeEventListener(evt, fn, bubble);
          } catch (e) {
            if (typeof fn === "object" && fn.handleEvent) {
              el.removeEventListener(evt, function (e) {
                fn.handleEvent.call(fn, e);
              }, bubble);
            } else {
              throw e;
            }
          }
        } else if ("detachEvent" in el) {
          if (typeof fn === "object" && fn.handleEvent) {
            el.detachEvent("on" + evt, function () {
              fn.handleEvent.call(fn);
            });
          } else {
            el.detachEvent("on" + evt, fn);
          }
        }
      },
    
      getChildren = function (e) {
        if (e.children.length < 1) {
          throw new Error("The Nav container has no containing elements");
        }
        // Store all children in array
        var children = [];
        // Loop through children and store in array if child != TextNode
        for (var i = 0; i < e.children.length; i++) {
          if (e.children[i].nodeType === 1) {
            children.push(e.children[i]);
          }
        }
        return children;
      },
    
      setAttributes = function (el, attrs) {
        for (var key in attrs) {
          el.setAttribute(key, attrs[key]);
        }
      },
    
      addClass = function (el, cls) {
        if (el.className.indexOf(cls) !== 0) {
          el.className += " " + cls;
          el.className = el.className.replace(/(^\s*)|(\s*$)/g,"");
        }
      },
    
      removeClass = function (el, cls) {
        var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
        el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g,"");
      },
    
      // forEach method that passes back the stuff we need
      forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
          callback.call(scope, i, array[i]);
        }
      };

    var nav,
      opts,
      navToggle,
      styleElement = document.createElement("style"),
      htmlEl = document.documentElement,
      hasAnimFinished,
      isMobile,
      navOpen;

    var ResponsiveNav = function (el, options) {
        var i;

        // Default options
        this.options = {
          animate: true,                    // Boolean: Use CSS3 transitions, true or false
          transition: 284,                  // Integer: Speed of the transition, in milliseconds
          label: "Menu",                    // String: Label for the navigation toggle
          insert: "before",                 // String: Insert the toggle before or after the navigation
          customToggle: "",                 // Selector: Specify the ID of a custom toggle
          closeOnNavClick: false,           // Boolean: Close the navigation when one of the links are clicked
          openPos: "relative",              // String: Position of the opened nav, relative or static
          navClass: "nav-collapse",         // String: Default CSS class. If changed, you need to edit the CSS too!
          navActiveClass: "js-nav-active",  // String: Class that is added to <html> element when nav is active
          jsClass: "js",                    // String: 'JS enabled' class which is added to <html> element
          init: function(){},               // Function: Init callback
          open: function(){},               // Function: Open callback
          close: function(){}               // Function: Close callback
        };

        // User defined options
        for (i in options) {
          this.options[i] = options[i];
        }

        // Adds "js" class for <html>
        addClass(htmlEl, this.options.jsClass);

        // Wrapper
        this.wrapperEl = el.replace("#", "");

        // Try selecting ID first
        if (document.getElementById(this.wrapperEl)) {
          this.wrapper = document.getElementById(this.wrapperEl);

        // If element with an ID doesn't exist, use querySelector
        } else if (document.querySelector(this.wrapperEl)) {
          this.wrapper = document.querySelector(this.wrapperEl);

        // If element doesn't exists, stop here.
        } else {
          throw new Error("The nav element you are trying to select doesn't exist");
        }

        // Inner wrapper
        this.wrapper.inner = getChildren(this.wrapper);

        // For minification
        opts = this.options;
        nav = this.wrapper;

        // Init
        this._init(this);
      };

    ResponsiveNav.prototype = {

      // Public methods
      destroy: function () {
        this._removeStyles();
        removeClass(nav, "closed");
        removeClass(nav, "opened");
        removeClass(nav, opts.navClass);
        removeClass(nav, opts.navClass + "-" + this.index);
        removeClass(htmlEl, opts.navActiveClass);
        nav.removeAttribute("style");
        nav.removeAttribute("aria-hidden");

        removeEvent(window, "resize", this, false);
        removeEvent(document.body, "touchmove", this, false);
        removeEvent(navToggle, "touchstart", this, false);
        removeEvent(navToggle, "touchend", this, false);
        removeEvent(navToggle, "mouseup", this, false);
        removeEvent(navToggle, "keyup", this, false);
        removeEvent(navToggle, "click", this, false);

        if (!opts.customToggle) {
          navToggle.parentNode.removeChild(navToggle);
        } else {
          navToggle.removeAttribute("aria-hidden");
        }
      },

      toggle: function () {
        if (hasAnimFinished === true) {
          if (!navOpen) {
            this.open();
          } else {
            this.close();
          }
        }
      },

      open: function () {
        if (!navOpen) {
          removeClass(nav, "closed");
          addClass(nav, "opened");
          addClass(htmlEl, opts.navActiveClass);
          addClass(navToggle, "active");
          nav.style.position = opts.openPos;
          setAttributes(nav, {"aria-hidden": "false"});
          navOpen = true;
          opts.open();
        }
      },

      close: function () {
        if (navOpen) {
          addClass(nav, "closed");
          removeClass(nav, "opened");
          removeClass(htmlEl, opts.navActiveClass);
          removeClass(navToggle, "active");
          setAttributes(nav, {"aria-hidden": "true"});

          if (opts.animate) {
            hasAnimFinished = false;
            setTimeout(function () {
              nav.style.position = "absolute";
              hasAnimFinished = true;
            }, opts.transition + 10);
          } else {
            nav.style.position = "absolute";
          }

          navOpen = false;
          opts.close();
        }
      },

      resize: function () {
        if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {

          isMobile = true;
          setAttributes(navToggle, {"aria-hidden": "false"});

          // If the navigation is hidden
          if (nav.className.match(/(^|\s)closed(\s|$)/)) {
            setAttributes(nav, {"aria-hidden": "true"});
            nav.style.position = "absolute";
          }

          this._createStyles();
          this._calcHeight();
        } else {

          isMobile = false;
          setAttributes(navToggle, {"aria-hidden": "true"});
          setAttributes(nav, {"aria-hidden": "false"});
          nav.style.position = opts.openPos;
          this._removeStyles();
        }
      },

      handleEvent: function (e) {
        var evt = e || window.event;

        switch (evt.type) {
        case "touchstart":
          this._onTouchStart(evt);
          break;
        case "touchmove":
          this._onTouchMove(evt);
          break;
        case "touchend":
        case "mouseup":
          this._onTouchEnd(evt);
          break;
        case "click":
          this._preventDefault(evt);
          break;
        case "keyup":
          this._onKeyUp(evt);
          break;
        case "resize":
          this.resize(evt);
          break;
        }
      },

      // Private methods
      _init: function () {
        this.index = index++;

        addClass(nav, opts.navClass);
        addClass(nav, opts.navClass + "-" + this.index);
        addClass(nav, "closed");
        hasAnimFinished = true;
        navOpen = false;

        this._closeOnNavClick();
        this._createToggle();
        this._transitions();
        this.resize();

        // IE8 hack
        var self = this;
        setTimeout(function () {
          self.resize();
        }, 20);

        addEvent(window, "resize", this, false);
        addEvent(document.body, "touchmove", this, false);
        addEvent(navToggle, "touchstart", this, false);
        addEvent(navToggle, "touchend", this, false);
        addEvent(navToggle, "mouseup", this, false);
        addEvent(navToggle, "keyup", this, false);
        addEvent(navToggle, "click", this, false);

        // Init callback
        opts.init();
      },

      _createStyles: function () {
        if (!styleElement.parentNode) {
          styleElement.type = "text/css";
          document.getElementsByTagName("head")[0].appendChild(styleElement);
        }
      },

      _removeStyles: function () {
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      },

      _createToggle: function () {
        if (!opts.customToggle) {
          var toggle = document.createElement("a");
          toggle.innerHTML = opts.label;
          setAttributes(toggle, {
            "href": "#",
            "class": "nav-toggle"
          });

          if (opts.insert === "after") {
            nav.parentNode.insertBefore(toggle, nav.nextSibling);
          } else {
            nav.parentNode.insertBefore(toggle, nav);
          }

          navToggle = toggle;
        } else {
          var toggleEl = opts.customToggle.replace("#", "");

          if (document.getElementById(toggleEl)) {
            navToggle = document.getElementById(toggleEl);
          } else if (document.querySelector(toggleEl)) {
            navToggle = document.querySelector(toggleEl);
          } else {
            throw new Error("The custom nav toggle you are trying to select doesn't exist");
          }
        }
      },

      _closeOnNavClick: function () {
        if (opts.closeOnNavClick && "querySelectorAll" in document) {
          var links = nav.querySelectorAll("a"),
            self = this;
          forEach(links, function (i, el) {
            addEvent(links[i], "click", function () {
              if (isMobile) {
                self.toggle();
              }
            }, false);
          });
        }
      },

      _preventDefault: function(e) {
        if (e.preventDefault) {
          e.preventDefault();
          e.stopPropagation();
        } else {
          e.returnValue = false;
        }
      },

      _onTouchStart: function (e) {
        e.stopPropagation();
        if (opts.insert === "after") {
          addClass(document.body, "disable-pointer-events");
        }
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.touchHasMoved = false;
        removeEvent(navToggle, "mouseup", this, false);
      },

      _onTouchMove: function (e) {
        if (Math.abs(e.touches[0].clientX - this.startX) > 10 ||
        Math.abs(e.touches[0].clientY - this.startY) > 10) {
          this.touchHasMoved = true;
        }
      },

      _onTouchEnd: function (e) {
        this._preventDefault(e);
        if (!this.touchHasMoved) {
          if (e.type === "touchend") {
            this.toggle();
            if (opts.insert === "after") {
              setTimeout(function () {
                removeClass(document.body, "disable-pointer-events");
              }, opts.transition + 300);
            }
            return;
          } else {
            var evt = e || window.event;
            // If it isn't a right click
            if (!(evt.which === 3 || evt.button === 2)) {
              this.toggle();
            }
          }
        }
      },

      _onKeyUp: function (e) {
        var evt = e || window.event;
        if (evt.keyCode === 13) {
          this.toggle();
        }
      },

      _transitions: function () {
        if (opts.animate) {
          var objStyle = nav.style,
            transition = "max-height " + opts.transition + "ms";

          objStyle.WebkitTransition = transition;
          objStyle.MozTransition = transition;
          objStyle.OTransition = transition;
          objStyle.transition = transition;
        }
      },

      _calcHeight: function () {
        var savedHeight = 0;
        for (var i = 0; i < nav.inner.length; i++) {
          savedHeight += nav.inner[i].offsetHeight;
        }
        var innerStyles = "." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened{max-height:" + savedHeight + "px !important}";

        if (styleElement.styleSheet) {
          styleElement.styleSheet.cssText = innerStyles;
        } else {
          styleElement.innerHTML = innerStyles;
        }

        innerStyles = "";
      }

    };

    return new ResponsiveNav(el, options);

  };

  window.responsiveNav = responsiveNav;

}(document, window, 0));
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
		this.container.classList.remove("el-expanded", "el-focus");
	}

	this.bindExtraTab = function() {
		var tabId = 'tabs-container-inner-' + this.jsonElement.AtomicNumber;
		this.extraTabs = new simpleTabs(tabId)
	}


	// this is one hell of a constructor...
	if(!this.container.classList.contains('el-loaded')) {
		// get the JSON data for this element
		this.jsonUrl = 'http://periodic-table.local/element/' + this.id + '.json';
		this.jsonData = httpGet(this.jsonUrl);
		this.jsonParsed = JSON.parse(this.jsonData.response);
		this.jsonElement = this.jsonParsed.element;

		// Populate the HTML with information gleaned from the JSON data

		// Create the container for the data
	    this.furtherInformation = document.createElement("div"); //this.container.getElementsByClassName('further-information').item(0);
	    this.furtherInformation.className = "further-information";
	    this.container.appendChild(this.furtherInformation);

	    var propertiesText = '';
	    var propertiesLength = this.jsonElement.PhysicalProperties.length;
	    for(var i = 0; i < propertiesLength; i++) {
	    	propertiesText += '<p><strong>' + this.jsonElement.PhysicalProperties[i].Property[0] + '</strong> ' + this.jsonElement.PhysicalProperties[i].Property[1] + ' <abbr title="'+ this.jsonElement.PhysicalProperties[i].PropertyType[0] +'">' + this.jsonElement.PhysicalProperties[i].PropertyType[1] + '</abbr></p>';
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
	   			+'				'+ (Math.round(this.jsonElement.AtomicWeight) - this.jsonElement.AtomicNumber)
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
	
	// For CSS styling purposes (expands the element)
	this.container.classList.add("el-expanded");

}

// Setup the responsive navigation menu
var navigation = responsiveNav(".nav-collapse");

// Get all of the elements in the table
var elements = document.getElementsByClassName('el');
// Get the "close all elements" button
var closeAll = document.getElementById('element-close');

// loop the elements and add appropriate event listeners
var l = elements.length;
var i = 0;
var openedElements = [];
var focusedElements;
for(i; i<l; i++) {
	elements[i].addEventListener('click', function(event) {
		event.stopPropagation();
		var elementId = this.id;		 // this is the ID of the HTML element
		var htmlElementId = this.id - 1; // as the array is zero indexed, to refer to the array item we need to -1 from the HTML ID (it's dirty but I'm not sure there's a better way)
		console.log(htmlElementId);
		// Instantiate a new element if one has not already been instantiated
		if(!elements[htmlElementId].classList.contains('el-expanded')) {
			openedElements.push(new element(elementId));
			console.log(this.id);
			this.classList.add('el-focus', 'el-loaded'); // add a class we can use to detect if an ajax request has been made in the past
			console.log(this.classList);
		}
		// focus the current element
		focusedElements = document.getElementsByClassName('el-focus');
		while (focusedElements.length) {
			focusedElements[0].classList.remove('el-focus');
		}
		console.log(elements[htmlElementId]);
		this.classList.add('el-focus');
		closeAll.classList.add('visible');
	}, false);
}
console.log(openedElements);

// Code for closing all elements at once
closeAll.addEventListener('click', function(event) {
	event.preventDefault();
	var numElements = openedElements.length;
	for(var i = numElements - 1; i >= 0; i--) {
		openedElements[i].close();
		// this seems ineffecient, but apparently it's (probably) the best way in our circumstances
		// see http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript for more
		openedElements.pop();
	}
	closeAll.classList.remove('visible');
}, false);
// Code for closing elements (could do with changing)
document.body.addEventListener('click', function(event) {
	try {
		// hide the element
		var lastOpened = openedElements[openedElements.length-1];
		lastOpened.close();
		// remove the element from the opened array
		openedElements.pop();
		// if there are now no open elements then hide the close button
		if(openedElements.length == 0) {
			closeAll.classList.remove('visible');
		}
	} catch(ex) {
		// No items expanded!
	}
}, false);


// Needs Refactoring
var elementsKey = document.getElementsByClassName("key-el");
var l = elementsKey.length;
var i = 0;
for(i; i<l; i++) {
	elementsKey[i].addEventListener('mouseover', function(event) {
		var highlightedElements = document.getElementsByClassName(this.id);
		var le = highlightedElements.length;
		var ie = 0;
		for(ie; ie<le; ie++) {
			highlightedElements[ie].classList.add("el-highlighted");
		}
	}, false);

	elementsKey[i].addEventListener('mouseout', function(event) {
		var highlightedElements = document.getElementsByClassName(this.id);
		var le = highlightedElements.length;
		var ie = 0;
		for(ie; ie<le; ie++) {
			highlightedElements[ie].classList.remove("el-highlighted");
		}
	}, false);
}