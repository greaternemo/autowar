// WAR.Narrator

WAR.Narrator = function (params) {
    this.mPanel = signal("byId", "msg_panel");
    this.mFeed = signal("byId", "msg_feed");
};

WAR.Narrator.prototype.narrate = function (params) {
    this.buildMsg();
    this.addLine(params);
};

WAR.Narrator.prototype.buildMsg = function (params) {
    
}

WAR.Narrator.prototype.addLine = function (line) {
    this.mFeed.innerHTML += "\n" + line;
    signal("scrollToNew", this.mPanel);
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