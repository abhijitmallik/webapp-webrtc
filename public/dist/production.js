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
if(!this.webrtc){
	this.webrtc = {};
}
if(!this.webrtc.app){
	this.webrtc.app = {};
}
(function(){
	var self = this;
	var connection = null;
	var connectedUser = "";
	var stream = "";
	var yourConnection ="";
	connection = new WebSocket('ws://'+window.location.host);
	$(".login-div").append(this.webrtc.views.login);

    var send = function(message){
		if (connectedUser) {
		    message.name = connectedUser;
		}
		connection.send(JSON.stringify(message));
	};
	var hasUserMedia = function() {
	  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	  return !!navigator.getUserMedia;
	};

	var hasRTCPeerConnection = function() {
	  window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
	  window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
	  window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;
	  return !!window.RTCPeerConnection;
	};

	var setupPeerConnection = function(stream) {
	  var configuration = {
	    "iceServers": [{ "url": "stun:stun.1.google.com:19302" }]
	  };
	  yourConnection = new RTCPeerConnection(configuration);

	  // Setup stream listening
	  yourConnection.addStream(stream);
	  yourConnection.onaddstream = function (e) {
	   // theirVideo.src = window.URL.createObjectURL(e.stream);
	  };

	  // Setup ice handling
	  yourConnection.onicecandidate = function (event) {
	    if (event.candidate) {
	      send({
	        type: "candidate",
	        candidate: event.candidate
	      });
	    }
	  };
	};

    
	var startConnection = function(){
        if (hasUserMedia()) {
		    navigator.getUserMedia({ video: true, audio: true }, function (myStream) {
		      var localVideo = document.querySelector('#localVideoId');
		      stream = myStream;
		      localVideo.src = window.URL.createObjectURL(stream);

		      if (hasRTCPeerConnection()) {
		          //setupPeerConnection(stream);
		      } else {
		        alert("Sorry, your browser does not support WebRTC.");
		      }
		    }, function (error) {
		      console.log(error);
		    });
		  } else {
		    alert("Sorry, your browser does not support WebRTC.");
		}
	};

    var flipScreen = function(){
      $(".login-div").empty();
      $(".local-video-div").append(this.webrtc.views.localView);
      startConnection();
	};

	var onLogin = function(success){
        if (success === false) {
            alert("Login unsuccessful, please try a different name.");
		 }else{
            flipScreen();
		 }
	};
	var initConnection = function(){
		var self = this;
        connection.onmessage = function (message) {
		console.log("Got message", message.data);
	    var data = JSON.parse(message.data);
			switch(data.type) {
			    case "login":
			      onLogin(data.success);
			      break;
			   /* case "offer":
			      onOffer(data.offer, data.name);
			      break;
			    case "answer":
			      onAnswer(data.answer);
			      break;
			    case "candidate":
			      onCandidate(data.candidate);
			      break;
			    case "leave":
			      onLeave();
			      break;*/
			    default:
			      break;
			}
	    };
	};

	$(".login-div").find('button').click(function(e){
        var userName = $(".login-div").find('input').val();
        if(userName.trim() !== ""){
        	connectedUser = userName;
        	initConnection();
        	send({
		      type: "login",
		      name: userName
		    });
        	
        }
	});
	
})(this.webrtc);