// WAR.Router

WAR.Router = function (wBase) {
    this.base = wBase;
    this.routes = {};
};

WAR.Router.prototype.import = function (oType, oRef) {
    let oRoutes = this.base.Routes[oType].slice();
    while (oRoutes.length) {
        this.routes[oRoutes.pop()] = oRef;
    }
};

WAR.Router.prototype.reroute = function (rSig, rParams) {
    return this.routes[rSig][rSig](rParams);
};

/*
ARE YOU KIDDING ME IS THIS SERIOUSLY IT?
ugh.
*/


/*
*
*
*
* Courtesy Space
*
*
*
*/