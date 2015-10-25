var navigationContainer = document.getElementById("navigation-container-inner");
var searchInput = document.createElement("input");

var elements = document.getElementsByClassName("el");
var elementHeadings = document.getElementsByClassName("heading");
headingNumber = elementHeadings.length;
var elementNumber = elements.length;


searchInput.setAttribute("type", "search");
searchInput.setAttribute("autofocus", "true");
searchInput.setAttribute("placeholder", "Search Elements");
searchInput.classList.add("table-search");
// add a class to the body so we know the search functionality is enabled
document.body.classList.add("search-enabled")
searchInput.addEventListener("input", function(event) {
	if(searchInput.value.length > 0) {
		document.body.classList.add("filtering-active");
		
		for(var i = 0; i < (elementNumber - 1); i++) {
			var symbol  = elements[i].getElementsByClassName("heading");
			var heading = elements[i].getElementsByClassName("heading-full");
			var matched = false;

			if(symbol[0]) {
				if(symbol[0].innerHTML.toLowerCase().indexOf(searchInput.value.toLowerCase()) !== -1) {
					matched = true;
				}
			}
			if(heading[0]) {
				if(heading[0].innerHTML.toLowerCase().indexOf(searchInput.value.toLowerCase()) !== -1) {
					matched = true;
				}
			}

			if(matched === true) {
				elements[i].classList.add("el-highlighted");
			} else {
				elements[i].classList.remove("el-highlighted");
			}
		}
	} else {
		document.body.classList.remove("filtering-active");
		for(var i = 0; i < (headingNumber - 1); i++) {
			elementHeadings[i].parentNode.classList.remove("el-highlighted");
		}
	}
});
searchInput.addEventListener("keydown", function(event) {
	// if the enter key is pressed, and only one element is filtered out, open said element
	if(event.keyCode === 13) {
		var highlightedElements = document.getElementsByClassName("el-highlighted");
		if(highlightedElements.length === 1) {
			highlightedElements[0].click();
			highlightedElements[0].focus();
		}
	}
});
navigationContainer.appendChild(searchInput);