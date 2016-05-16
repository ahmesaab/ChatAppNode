/**
 * Created by Ahmed on 3/19/2016.
 */

function ui()
{
    this.sideBar = $('#sidebar-wrapper');
    this.gameCanvs = $('#pokemonCanvas');
    this.mapLabel = $('#map-label');
    this.chatList = $('li');
    this.chatHistory = $('#chat-history');
    this.chatTextArea = $('#message-text-box');
    this.gameStatusElement = $('#game-socket-status');

    this.scaleGameCanvas = function()
    {
        var widthCell = window.innerWidth/navigationMap.width;
        var heightCell = window.innerHeight/navigationMap.height;

        var cellLength = widthCell < heightCell ? widthCell : heightCell;

        this.gameCanvs.width = cellLength * navigationMap.width ;
        this.gameCanvs.height = cellLength * navigationMap.height;

        return cellLength;
    }

    this.repositionSideBar = function()
    {
        this.sideBar.css({left:this.gameCanvs.css('marginLeft')});
    }

    this.updateMapNameUi = function(name)
    {
        this.mapLabel.text(name);
    }

    this.addMessageToChatHistory = function(msg,displayName,own)
    {
        var div;
        if(own)
        {
            div='<li><b><span style="color:#095bff">Me: </span></b>'+msg+'</li>'
        }
        else
        {
            div='<li><b><span style="color:#ff2c00">'+displayName+': </span></b>'+msg+'</li>'
        }
        this.chatHistory.append($(div));
        this.chatHistory.scrollTop(this.chatList.last().offset().top)
    }

    this.getChatHistory = function(mapId,count)
    {
        $(".chat").empty();
        $.ajax({
            url: '/rest/chatHistory?mapId='+mapId+'&count='+count,
            success: function(messages)
            {
                for(var i=0;i<messages.length;i++)
                {
                    addMessageToChatHistory(messages[i].content,messages[i].nickName,
                        localPlayer.nickName==messages[i].nickName)
                }
                setTimeout($('#chat-history').scrollTop($('li').last().offset().top),500);
            },
            error: function()
            {
                $("#serverMessage").text('Failed to fetch Chat History');
                $("#serverModal").modal('show')
            }
        });
    }

    this.focusChatTextArea = function()
    {
        this.chatTextArea.focus();
    }

    this.updateStatus = function(status)
    {
        if(status)
        {
            this.gameStatusElement.text('connected');
            this.gameStatusElement.css('color', 'green');
        }
        else
        {
            this.gameStatusElement.text('disconnected');
            this.gameStatusElement.css('color', 'red');
        }
    }

    this.alert =  function(message)
    {
        bootbox.alert(message);
    }

}
