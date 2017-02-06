// WAR
// Seriously, like the card game War

var WAR = {
    // Core bits
    wRouter: null,
    wRegistry: null,
    
    // Systems
    wArena: null,
    wGame: null,
    wNarr: null,
    wUtil: null,
};

WAR.init = function () {
    WAR.wRouter = new WAR.Router(WAR.BASE);

    WAR.wRegistry = new WAR.Registry(WAR.BASE);
    WAR.wRouter.import('Registry', WAR.wRegistry);

    WAR.wUtil = new WAR.Util();
    WAR.wRouter.import('Util', WAR.wUtil);

    WAR.wArena = new WAR.Arena();
    WAR.wRouter.import('Arena', WAR.wArena);

    WAR.wGame = new WAR.Game();
    WAR.wRouter.import('Game', WAR.wGame);

    WAR.wNarr = new WAR.Narrator();
    WAR.wRouter.import('Narrator', WAR.wNarr);
}

function signal(rSig, rParams) {
    return WAR.wRouter.reroute(rSig, rParams);
}



// hurk



/*
*
*
*
* Courtesy Space
*
*
*
*/