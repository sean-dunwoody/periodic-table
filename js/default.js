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


// YUI stuff
YUI().use('node', 'event', 'anim', 'anim-base', 'transition', 'io', 'tabview', function(Y) {

	var tabviews = {};
	var tableElements = Y.all('.periodic-table td[id]');
	
	function complete(id, o, tabbedContent, atomicNumber) {
		var id = id; // Transaction ID.
		var data = o.responseText; // Response data.
		tabbedContent.setHTML(data);
		if (!tabviews[atomicNumber]) {
			tabviews[atomicNumber] = new Y.TabView({
				srcNode: '#tabs-'+atomicNumber
			});
			tabviews[atomicNumber].render();
		}

		var nextButton = tabbedContent.one('.next');
		nextButton.on("click", function(e) {
			tabbedContent.setStyle('margin-left', '-240px');
		});				
		//var prevButton = this.one('.previous');	
	};
	
	tableElements.each(
		function() {

			var extraContent  = this.one('.further-information');
			var tabbedContent = this.one('.tabs-container');

			this.on("click", function(e) {
				if(extraContent.hasClass('further-information-expanded')) {
					return;
				}
				var atomicNumber = this.get('id');
				var uri = "dynamicLoad.php?AtomicNumber="+atomicNumber;
				extraContent.addClass("further-information-expanded");
				extraContent.transition({
					duration: 0.32, // seconds
					easing: 'ease-in',
					top: '-110px',
					right: '-110px',
					bottom: '-110px',
					left: '-110px',
					color: {
						delay: 0.32,
						duration: 0.24,
						value: '#000',
						easing: 'ease-in'
					}
				});
				Y.on('io:complete', complete, Y, tabbedContent, atomicNumber);
				var request = Y.io(uri);	

			});
			this.on('clickoutside', function () {
				extraContent.transition({
					duration: 0.3, // seconds
					easing: 'ease-out',
					bottom: '0px',
					left: '0px',
					right: '0px',
					top: '0px',
					color: 'transparent'
				}, function () {
					this.removeClass('further-information-expanded');
				});
				
			});
			
		}
	);

	
});

