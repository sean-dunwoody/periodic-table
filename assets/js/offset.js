function findPos(obj) {
    var curleft = 0, curtop = 0, curRight = 0;
    var objectWidth = obj.offsetWidth;
    var screenWidth = screen.width;
    if (obj.offsetParent) {
        do {
            curleft  += obj.offsetLeft;
            curtop   += obj.offsetTop;

        } while (obj = obj.offsetParent);

    	// compute distance to right edge of screen
        curRight = screenWidth - (curleft + objectWidth);

        return { x: curleft, y: curtop, r: curRight };
    }
    return undefined;
}