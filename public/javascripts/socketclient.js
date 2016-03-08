var getConversationIDFromUrl = function() {
   var sPageURL = decodeURIComponent(window.location)
   var URLs = sPageURL.split('/');
   return URLs[URLs.length-1].split('?')[0];
};

var socket = io.connect('http://localhost:2000/chat?chatId='+getConversationIDFromUrl());

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

socket.on('message', function(data) {
   addMessage(data['message'], data['pseudo']);
});


$(function() {
   $('#chatControls').show();
   $("#submit").click(function() {sentMessage();});
});

//var getUrlParameter = function(sParam) {
//   var sPageURL = decodeURIComponent(window.location.search.substring(1)),
//       sURLVariables = sPageURL.split('&'),
//       sParameterName,
//       i;
//
//   for (i = 0; i < sURLVariables.length; i++) {
//      sParameterName = sURLVariables[i].split('=');
//
//      if (sParameterName[0] === sParam) {
//         return sParameterName[1] === undefined ? true : sParameterName[1];
//      }
//   }
//};