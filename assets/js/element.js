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
	    		+' <div class="tab-container tab-container-brief">'
	   			+' 	<span class="heading">'+ this.jsonElement.ElementName +'</span>'
	    		+' 	<span class="arrow next" id="nextTab-'+ this.jsonElement.AtomicNumber +'">More Info</span>'
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
				+'  <a href="'+ this.jsonElement.MoreInfoLink +'" class="explore-link" target="_blank">Wikipedia Article</a>'
				+'	</div>'
			+' 	<div class="tab-container tab-container-further">'
			+' 		<span class="arrow prev" id="prevTab-'+ this.jsonElement.AtomicNumber +'">Less Info</span>'
			+'		<div class="tabs-container-inner content" id="tabs-container-inner-'+ this.jsonElement.AtomicNumber +'">'
			+'			<ul class="tabs-navigation">'
			+'				<li><a href="#'+ this.jsonElement.AtomicNumber +'-tab-1" class="tab-link tab-1">Description</a></li>'
			+'				<li><a href="#'+ this.jsonElement.AtomicNumber +'-tab-2" class="tab-link tab-2">Visualise</a></li>'
			//+'				<li><a href="#'+ this.jsonElement.AtomicNumber +'-tab-3" class="tab-link tab-3">Tab Three</a></li>'
			+'			</ul>'
			+'			<ul class="tabs-content">'
			+'				<li class="tab-content tab-1 tab-visible" id="'+ this.jsonElement.AtomicNumber +'-tab-1">' + this.jsonElement.BriefDescription + '</li>'
			+'				<li class="tab-content tab-2 tab-visible" id="'+ this.jsonElement.AtomicNumber +'-tab-2"><canvas id="visualise-'+ this.jsonElement.AtomicNumber +'" width="250" height="190"></canvas><p>Red = Proton | Blue = Neutron</li>'
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
			_self.container.classList.add("tab-expanded");
		}, false);
		// If the viewer is on a mobile device, there won't be a click event, so bind the extra info on load
		if(screen.width > 400) {
			this.bindExtraTab();
		}
		document.getElementById('prevTab-'+ this.jsonElement.AtomicNumber).addEventListener('click', function(event) {
			event.stopPropagation();
			_self.container.classList.remove("tab-expanded");
		}, false);
	}
	
	// For CSS styling purposes (expands the element)
	this.container.classList.add("el-expanded");

}