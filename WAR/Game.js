// WAR.Game

WAR.Game = function () {
    // Acceptable values:
    // true
    // false
    this.gameState = false;
    
    // Acceptable values:
    // "READY"
    // "BATTLING"
    // "GAME_OVER"
    this.battleState = null;
    
    // Acceptable values:
    // false
    // true
    this.loopState = false;
    this.loopInterval = null;
    this.loopSpeed = 'SLOW';
    this.ctrl = signal("byId", "ctrl_loop");
    this.spd = signal("byId", "loop_speed");
    
    this.startGame();
};

/*
WAR.Game.prototype
*/

WAR.Game.prototype.startGame = function () {
    this.gameState = true;
    this.battleState = "READY";
    // Commented out debug flag for newWar
    signal("newWar"/*, true*/);
    
    if (this.loopSpeed == "SLOW") {
        this.loopInterval = setInterval(signal, 500, "playTurn");
    } else if (this.loopSpeed == "FAST") {
        this.loopInterval = setInterval(signal, (1000/30), "playTurn");
    }

};

WAR.Game.prototype.endGame = function () {
    clearInterval(this.loopInterval);
    this.gameState = false;
    this.loopState = false;
    this.ctrl.innerHTML = "Start New Game";
};

WAR.Game.prototype.startNewGame = function () {
    this.ctrl.innerHTML = "Pause Game"
    this.loopState = true;
    return this.startGame();
};

WAR.Game.prototype.toggleLoop = function () {
    if (this.ctrl.innerHTML == "Start New Game") {
        return this.startNewGame();
    }
    
    if (this.loopState) {
        this.loopState = false;
        this.ctrl.innerHTML = "Start Game";
    } else {
        this.loopState = true;
        this.ctrl.innerHTML = "Pause Game";
    }
};

WAR.Game.prototype.toggleLoopSpeed = function () {
    if (this.loopInterval) {
        if (this.loopSpeed == "SLOW") {
            this.loopSpeed = "FAST";
            this.spd.innerHTML = "Slow Down";
            clearInterval(this.loopInterval);
            this.loopInterval = setInterval(signal, (1000/30), "playTurn");
        } else if (this.loopSpeed == "FAST") {
            this.loopSpeed = "SLOW";
            this.spd.innerHTML = "Speed Up";
            clearInterval(this.loopInterval);
            this.loopInterval = setInterval(signal, 500, "playTurn");
        }
    }
};

WAR.Game.prototype.playTurn = function () {
    if (!this.loopState) {
        return;
    }
    
    if (this.battleState == "READY") {
        // We don't stop the loop, it keeps iterating.
        // We just set a flag to say "don't battle again
        // until the current battle is done and no player
        // has lost yet"
        this.battleState = "BATTLING";
        
        let battleResult = signal("battle");
        if (battleResult == "GAME_OVER") {
            this.battleState = "GAME_OVER";
            return this.endGame();
        } else {
            this.battleState = "READY";
            return;
        }
    } else {
        return;
    }
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