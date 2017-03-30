if(!this.webrtc){
	this.webrtc = {};
}
if(!this.webrtc.app){
	this.webrtc.app = {};
}
(function(){
    this.webrtc.views = {
        'login':"<div class='login-view'>" +
                    "<div class='title'>Gensler</div>" + 
                    "<div class='user-name'><input placeholder='Enter your name' type='text'/></div>" + 
                    "<button class='button-primary login-button'>Login</button>" +
                "</div>",

        'localView':"<div class='local-view-div'>" +
                      "<span class='local-user-name'></span>" +
                      "<video  autoplay id='localVideoId' class='local-video'></video>" +
                    "</div>",

        'remoteView':"<div class='remote-view-div'>" +
                      "<span class='remote-user-name'></span>" +
                    "</div>"        
    };
})(this.webrtc);