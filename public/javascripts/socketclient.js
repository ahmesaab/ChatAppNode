var getConversationIDFromUrl = function() {
   var sPageURL = decodeURIComponent(window.location)
   var URLs = sPageURL.split('/');
   return URLs[URLs.length-1].split('?')[0];
};


function addMessage(msg, pseudo) {
   $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}

function sentMessage(socket) {
   if ($('#messageInput').val() != "")
   {
      socket.emit('message', $('#messageInput').val());
      addMessage($('#messageInput').val(), 'Me', new Date().toISOString(), true);
      $('#messageInput').val('');
   }
}


window.onload = function() {

   init();
   animate();

   var chatSocket = io.connect('http://localhost:2000/chat?chatId='+getConversationIDFromUrl(),{'forceNew':true});

   chatSocket.on('connect', function() {
      var statusElement = $('#chatSocketStatus');
      statusElement.text(' (connected)');
      statusElement.css('color', 'green');
   });

   chatSocket.on('disconnect', function() {
      var statusElement = $('#chatSocketStatus');
      statusElement.text(' (disconnected)');
      statusElement.css('color', 'red');
   });

   chatSocket.on('message', function(data) {
      addMessage(data['message'], data['pseudo']);
   });

   $(function() {
      $('#chatControls').show();
      $("#submit").click(function() {sentMessage(chatSocket);});
   });

   $("#messageInput").keyup(function(event){
      if(event.keyCode == 13){
         $("#submit").click();
      }
   });


}


