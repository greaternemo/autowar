// WAR.Registry
// For holding ur datas

WAR.Registry = function (wBase) {
    this.base = wBase;
    this.primeRegistry = {};
    
    
};

/*
WAR.Registry.prototype
*/

WAR.Registry.prototype.factory = function (eTemp) {
    return;
};

WAR.Registry.prototype.stdDeck = function () {
    return this.base.RefData.StdDeck.slice();
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