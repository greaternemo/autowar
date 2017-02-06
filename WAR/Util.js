// WAR.Util

WAR.Util = function (params) {};

/*
WAR.Util.prototype
*/

// returns a random integer between 0 and max-1
WAR.Util.prototype.rand = function (max) {
    return Math.floor(Math.random() * max);
};

WAR.Util.prototype.shuffle = function (aDeck) {
    let newDeck = [];
    while (aDeck.length) {
        newDeck.push(aDeck.splice(this.rand(aDeck.length), 1)[0]);
    }
    return newDeck;
};

WAR.Util.prototype.cap = function (nStr) {
    return nStr.charAt(0).toUpperCase() + nStr.slice(1);
};

WAR.Util.prototype.byId = function (elemId) {
    return document.getElementById(elemId);
};

WAR.Util.prototype.scrollToNew = function (panel) {
    panel.scrollTop = panel.scrollHeight - panel.clientHeight;
    return;
};

WAR.Util.prototype.depair = function (param) {
    // Returns an array containing the split elements.
    // Remember, if you just want X from string "X,Y"
    // use depair(param)[0] !
    return param.split(',');
};



/*
*
*
*
* Courtesy Space
*
*
*
*/