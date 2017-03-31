if(!this.webrtc){
	this.webrtc = {};
}
if(!this.webrtc.app){
	this.webrtc.app = {};
}
(function(){
    this.webrtc.views = {
        'login':"<div class='login-view'>" +
                    "<div class='title'>Gensler Webinar</div>" + 
                    "<div class='user-name'><input placeholder='Enter your name' type='text'/></div>" + 
                    "<button class='button-primary login-button'>Login</button>" +
                "</div>",

        'localView':"<div class='local-view-div'>" +
                      "<span class='local-user-name'></span>" +
                      "<video  autoplay id='localVideoId' class='local-video'></video>" +
                      "<video  autoplay id='remoteVideoId' class='remote-video'></video>" +
                      "<div class='call-button'>" +
                         "<input type='text' placeholder='Enter callee's Name>" +
                         "<button class='button-primary call-user'>Call</button>" +
                      "</div>" +
                    "</div>"       
    };
})(this.webrtc);