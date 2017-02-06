// WAR.Arena

WAR.Arena = function () {
    this.p1 = {
        pName: 'P1',
        pStatus: 'READY',
        pDeck: [],
        pDiscard: [],
        pQueue: [],
        pStats: signal('byId', 'p1_stats'),
    };
    this.p2 = {
        pName: 'P2',
        pStatus: 'READY',
        pDeck: [],
        pDiscard: [],
        pQueue: [],
        pStats: signal('byId', 'p2_stats'),
    };
    this.battleCount = null;
};

/*
WAR.Arena.p1/p2.pStatus values can only be one of:
"READY"
"LAST_STAND"
"OUT_OF_CARDS"
*/

/*
WAR.Arena.prototype
*/

WAR.Arena.prototype.newWar = function (debug) {
    // Clear the player data
    this.p1.pStatus = "READY";
    this.p1.pDeck = [];
    this.p1.pDiscard = [];
    this.p1.pQueue = [];
    
    this.p2.pStatus = "READY";
    this.p2.pDeck = [];
    this.p2.pDiscard = [];
    this.p2.pQueue = [];
    
    // for testing
    this.battleCount = 0;
    
    if (debug) {
        // Debug setup for testing a weird error if the game
        // ended during a war
        this.p1.pDeck = [/*'Q,S', */'K,S', 'A,S'];
        this.p2.pDeck = ['J,H', 'Q,H', 'K,H', 'A,H'];
    } else {
        // Shuffle up a new deck and split it between both players
        let gNewDeck = signal("shuffle", signal("stdDeck"));
        // This should work, splitting a 52 card deck in half
        while (gNewDeck.length) {
            this.p1.pDeck.push(gNewDeck.pop());
            this.p2.pDeck.push(gNewDeck.pop());
        }
    }
    
    // ...I think that's it
    
};

WAR.Arena.prototype.battle = function () {
    this.battleCount++;
    let bCount = 0 + this.battleCount;
    let bResult = null;
    let bStart = "Starting battle " + bCount;
    signal('narrate', bStart);
    let flip = null;
    let fite = null;
    
    flip = this.flipCheck();
    
    if (flip == "GOOD_FLIP") {
        // TO BATTLE
        fite = this.clash();
        if (fite == "WAR") {
            // TO WAR
            fite = this.war();
            if (fite.loser) {
                this.playerLoss(fite);
                bResult = "GAME_OVER";
            }
        }
    } else {
        // Yes, we want to send both players to playerLoss
        this.playerLoss(flip)
        bResult = "GAME_OVER";
    }
    
    let bEnd = "Ending battle " + bCount;
    signal('narrate', bEnd);
    return bResult;
};

WAR.Arena.prototype.war = function () {
    let flip = null;
    let fite = null;
        
    // We attempt a triple flip, then clash
    flip = this.flipCheck();
    if (flip !== "GOOD_FLIP") {
        return flip;
    }
    
    flip = this.flipCheck();
    if (flip !== "GOOD_FLIP") {
        return flip;
    }
    
    flip = this.flipCheck();
    if (flip !== "GOOD_FLIP") {
        return flip;
    }
    
    fite = this.clash();
    if (fite == "WAR") {
        return this.war();
    } else {
        return fite;
    }
};

WAR.Arena.prototype.clash = function () {
    let pv1 = this.p1.pQueue[this.p1.pQueue.length-1].split(',')[0];
    let pv2 = this.p2.pQueue[this.p2.pQueue.length-1].split(',')[0];
    let vIdx = [
        '2', '3', '4', '5', '6', '7', '8', '9', 
        'X', 'J', 'Q', 'K', 'A'
    ];
    let victor = null;
    let pIdx1 = vIdx.indexOf(pv1);
    let pIdx2 = vIdx.indexOf(pv2);
    let battleMsg = null;
    
    if (pIdx1 < pIdx2) {
        battleMsg = 
          'Clash: ' + pv2 + ' vs ' + pv1 + '! P2 beats P1!';
        this.triumph(this.p2, this.p1);
        victor = this.p2;
    } else if (pIdx1 > pIdx2) {
        battleMsg =
          'Clash: ' + pv1 + ' vs ' + pv2 + '! P1 beats P2!';
        this.triumph(this.p1, this.p2);
        victor = this.p1;
    } else {
        battleMsg =
          'Clash: ' + pv1 + ' vs ' + pv2 + '! WAR!';
        victor = "WAR";
    }
    
    signal("narrate", battleMsg);
    return victor;
};

WAR.Arena.prototype.triumph = function (victor, loser) {
    while (loser.pQueue.length) {
        victor.pDiscard.push(loser.pQueue.shift());
    }
    while (victor.pQueue.length) {
        victor.pDiscard.push(victor.pQueue.shift());
    }
    this.updateStats();
};

WAR.Arena.prototype.hasAnyoneLost = function () {
    let bResult = {
        victor: null,
        loser: null,
    };
    if (this.hasPlayerLost(this.p1)) {
        bResult.victor = this.p2;
        bResult.loser = this.p1;
    } else if (this.hasPlayerLost(this.p2)) {
        bResult.victor = this.p1;
        bResult.loser = this.p2;
    } else {
        bResult = false;
    }
    return bResult;
};

WAR.Arena.prototype.hasPlayerLost = function (player) {
    if (player.pStatus == "OUT_OF_CARDS") {
        let bMsg =
          '' + player.pName + ' is out of cards! Game over!'
        signal('narrate', bMsg);
        return true;
    } else {
        return false;
    }
};

WAR.Arena.prototype.tryToFlip = function (player) {
    // If you run out of cards in your deck during a war
    // AND you have no discard to shuffle in,
    // EVEN IF you have cards in your queue,
    // you lose the game, as you've run out of material.
    if (player.pStatus == "LAST_STAND") {
        if (player.pDiscard.length) {
            this.discardToDeck(player);
        } else {
            player.pStatus = "OUT_OF_CARDS";
            return;
        }
    } else if (player.pDeck.length == 1) {
        if (!player.pDiscard.length) {
            let bMsg =
              '' + player.pName + ' is on their last stand!';
            signal("narrate", bMsg);
            player.pQueue.push(player.pDeck.pop());
            player.pStatus = "LAST_STAND";
            return;
        }
    } else if (!player.pDeck.length) {
        if (player.pDiscard.length) {
            this.discardToDeck(player);
        }
    }
    
    player.pQueue.push(player.pDeck.pop());
    player.pStatus = "READY";
};

WAR.Arena.prototype.discardToDeck = function (player) {
    while (player.pDiscard.length) {
        player.pDeck.push(player.pDiscard.pop());
    }
};

WAR.Arena.prototype.flipCheck = function () {
    this.tryToFlip(this.p1);
    this.tryToFlip(this.p2);
    this.updateStats();
    
    // If the flip is good, we return "GOOD_FLIP"
    // If not, we return the loser
    let bResult = this.hasAnyoneLost();
    if (!bResult) {
        return "GOOD_FLIP";
    } else {
        return bResult;
    }
};

WAR.Arena.prototype.playerLoss = function (bResult) {
    // get rekt
    let rekt = '' + bResult.victor.pName + ' wins!';
    // tell narrator
    signal('narrate', rekt);
    // stop game state?
    signal('endGame');
};

WAR.Arena.prototype.updateStats = function () {    
    this.p1.pStats.innerHTML = "P1:";
    this.p1.pStats.innerHTML += '\n' + "Deck: " + this.p1.pDeck.length;
    this.p1.pStats.innerHTML += '\n' + "Discard: " + this.p1.pDiscard.length;
    this.p1.pStats.innerHTML += '\n' + "Queue: " + this.p1.pQueue.length;
    
    this.p2.pStats.innerHTML = "P2:";
    this.p2.pStats.innerHTML += '\n' + "Deck: " + this.p2.pDeck.length;
    this.p2.pStats.innerHTML += '\n' + "Discard: " + this.p2.pDiscard.length;
    this.p2.pStats.innerHTML += '\n' + "Queue: " + this.p2.pQueue.length;
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