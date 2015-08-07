var navigationContainer = document.getElementById("navigation-container-inner");
var searchInput = document.createElement("input");

var elements = document.getElementsByClassName("el");
var elementHeadings = document.getElementsByClassName("heading");
headingNumber = elementHeadings.length;
var elementNumber = elements.length;


searchInput.setAttribute("type", "search");
searchInput.setAttribute("autofocus", "true");
searchInput.classList.add("table-search");
// add a class to the body so we know the search functionality is enabled
document.body.classList.add("search-enabled")
searchInput.addEventListener("input", function(event) {
	if(searchInput.value.length > 0) {
		document.body.classList.add("search-active");
		
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
				elements[i].classList.add("matched");
			} else {
				elements[i].classList.remove("matched");
			}
		}
	} else {
		document.body.classList.remove("search-active");
		for(var i = 0; i < (headingNumber - 1); i++) {
			elementHeadings[i].parentNode.classList.remove("matched");
		}
	}
})
navigationContainer.appendChild(searchInput);