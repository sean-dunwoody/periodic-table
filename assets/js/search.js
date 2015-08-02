var navigationContainer = document.getElementById("navigation-container-inner");
var searchInput = document.createElement("input");

var elementHeadings = document.getElementsByClassName("heading");
headingNumber = elementHeadings.length;


searchInput.setAttribute("type", "search");
searchInput.setAttribute("autofocus", "true");
searchInput.classList.add("table-search");
// add a class to the body so we know the search functionality is enabled
document.body.classList.add("search-enabled")
searchInput.addEventListener("input", function(event) {
	if(searchInput.value.length > 0) {
		document.body.classList.add("search-active");
		
		for(var i = 0; i < (headingNumber - 1); i++) {
			if(elementHeadings[i].innerHTML.toLowerCase().indexOf(searchInput.value.toLowerCase()) !== -1) {
				elementHeadings[i].parentNode.classList.add("matched");
			} else {
				elementHeadings[i].parentNode.classList.remove("matched");
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