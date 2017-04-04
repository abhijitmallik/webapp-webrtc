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
	var otherUser = ""; 
	var remoteVideo = "";
	connection = new WebSocket('wss://'+window.location.host);
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
	    remoteVideo = document.querySelector('#remoteVideoId');
	    remoteVideo.src = window.URL.createObjectURL(e.stream);
	    $("#localVideoId").removeClass("local-video");
	    $("#localVideoId").addClass("remote-video");
	    $("#remoteVideoId").removeClass("remote-video");
	    $("#remoteVideoId").addClass("local-video");
	    //.local-video-div .remote-video
	    $(".local-video-div").find(".remote-video").show();
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
		      $('.local-user-name').text(connectedUser);

		      if (hasRTCPeerConnection()) {
		           setupPeerConnection(stream);
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

	var startPeerConnection = function(otherUser){
        connectedUser = otherUser;

		// Begin the offer
		yourConnection.createOffer(function (offer) {
		    send({
		      type: "offer",
		      offer: offer
		    });
		    yourConnection.setLocalDescription(offer);
		  }, function (error) {
		    alert("An error has occurred.");
		});
	};

	var callEvent = function(){
		$(".local-video-div").find("button").click(function(e){
		        //otherUser
		        otherUser = $('.local-view-div').find('input').val();
		        if(otherUser.trim() !== ""){
		        	startPeerConnection(otherUser);
		        }
		});
	};

    var flipScreen = function(){
      $(".login-div").empty();
      $(".local-video-div").append(this.webrtc.views.localView);
      callEvent();
      startConnection();
	};

	var onLogin = function(success){
        if (success === false) {
            alert("Login unsuccessful, please try a different name.");
		 }else{
            flipScreen();
		 }
	};
	var onOffer = function(offer,name){
        connectedUser = name;

        yourConnection.setRemoteDescription(new RTCSessionDescription(offer));

		yourConnection.createAnswer(function (answer) {
		    yourConnection.setLocalDescription(answer);
		    send({
		      type: "answer",
		      answer: answer
		    });
		  }, function (error) {
		    alert("An error has occurred");
		  });
	};
	var onAnswer =  function(answer) {
      yourConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };

    var onCandidate = function(candidate) {
     yourConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    var onLeave = function() {
	  connectedUser = null;
	  remoteVideo.src = null;
	  yourConnection.close();
	  yourConnection.onicecandidate = null;
	  yourConnection.onaddstream = null;
	  setupPeerConnection(stream);
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
			    case "offer":
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
			      break;
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