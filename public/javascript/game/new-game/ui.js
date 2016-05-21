/**
 * Created by Ahmed on 3/19/2016.
 */

ui =
{
    getGameCanvas: function()
    {
        return $('#pokemonCanvas')[0];
    },

    scaleGameCanvas:function(mapWidth,mapHeight)
    {
        var canvas = $('#pokemonCanvas')[0];

        var widthCell = window.innerWidth / mapWidth;
        var heightCell = window.innerHeight/ mapHeight;

        var cellLength = widthCell < heightCell ? widthCell : heightCell;

        canvas.width = cellLength * mapWidth;
        canvas.height = cellLength * mapHeight;

        return cellLength;
    },

    repositionSideBar:function()
    {
        $('#sidebar-wrapper').css({left:$('#pokemonCanvas').css('marginLeft')});
        $('#message-text-box').focus();
    },

    updateMapNameUi:function(name)
    {
        $('#map-label').text(name);
    },

    addMessageToChatHistory:function(msg,displayName,own)
    {
        var chatHistory = $('#chat-history');
        var div;
        if(own)
        {
            div='<li><b><span style="color:#095bff">Me: </span></b>'+msg+'</li>'
        }
        else
        {
            div='<li><b><span style="color:#ff2c00">'+displayName+': </span></b>'+msg+'</li>'
        }
        chatHistory.append($(div));
        chatHistory.scrollTop($('li').last().offset().top)
    },

    updateStatus:function(status)
    {
        var gameSocketStatus = $('#game-socket-status');
        if(status)
        {
            gameSocketStatus.text('connected');
            gameSocketStatus.css('color', 'green');
        }
        else
        {
            gameSocketStatus.text('disconnected');
            gameSocketStatus.css('color', 'red');
        }
    },
    alert:function(message)
    {
        bootbox.alert(message);
    },

    enterEvent:function()
    {
        var messageTextBox = $('#message-text-box');
        var message = messageTextBox.val();
        if(message==='')
        {
            $("#wrapper").toggleClass("toggled");
            messageTextBox.focus();
            return false;
        }
        else
        {
            messageTextBox.val('');
            return message;
        }
    }
};
