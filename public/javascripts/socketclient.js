

var socket = io.connect('http://localhost:2000');

function addMessage(msg, pseudo) {
   $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}

function sentMessage() {
   if ($('#messageInput').val() != "")
   {
      socket.emit('message', $('#messageInput').val());
      addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
      $('#messageInput').val('');
   }
}

function setPseudo() {
   if ($("#pseudoInput").val() != "")
   {
      socket.emit('setPseudo', $("#pseudoInput").val());
      $('#chatControls').show();
      $('#pseudoInput').hide();
      $('#pseudoSet').hide();
   }
}

socket.on('message', function(data) {
   addMessage(data['message'], data['pseudo']);
});

function getCookie(name) {
   var value = "; " + document.cookie;
   var parts = value.split("; " + name + "=");
   if (parts.length == 2) return parts.pop().split(";").shift();
}


$(function() {
   $("#chatControls").hide();
   $("#pseudoSet").click(function() {setPseudo()});
   $("#submit").click(function() {sentMessage();});
});