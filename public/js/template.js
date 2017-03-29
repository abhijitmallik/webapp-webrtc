if(!this.webrtc){
	this.webrtc = {};
}
if(!this.webrtc.app){
	this.webrtc.app = {};
}
(function(){
    this.webrtc.views = {
        'localView':"<div class='local-view-div'>" +
                      "<span class='local-user-name'>ABHIJIT</span>" +
                    "</div>",

        'remoteView':"<div class='remote-view-div'>" +
                      "<span class='remote-user-name'>VICKY</span>" +
                    "</div>"        
    };
})(this.webrtc);