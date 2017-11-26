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