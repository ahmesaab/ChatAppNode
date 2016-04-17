/**
 * Created by Ahmed on 3/19/2016.
 */

function addMessageToGame(msg, displayName, player)
{
    var textBubble = new createjs.Container();

    var configWidth = 30;

    var fontSize = 20;
    var lineHeight = 22;

    var marginY = 15;
    var marginX = 10;


    var formattedMsg ='';
    var lineNum = 1;
    var maxCharachtersPerLine;

    var i=0;
    for(i;i<msg.length;i++)
    {
        if(i%configWidth==0 && i!=0)
        {
            if(msg[i]==' ')
            {
                formattedMsg+='\n';
                lineNum++;
                continue;
            }
            else if(msg[i-1]==' ')
            {
                formattedMsg = formattedMsg.substr(0, i-1) + '\n' + formattedMsg.substr(i-1+'\n'.length);
                lineNum++;
            }
            else
            {
                var j=i;
                for(j;j>0;j--)
                {
                    if(formattedMsg[j]==' ')
                    {
                        formattedMsg = formattedMsg.substr(0, j) + '\n' + formattedMsg.substr(j+'\n'.length);
                        break;
                    }
                }
                if(j==0)
                {
                    formattedMsg+='\n';
                }
                lineNum++;
            }
        }
        formattedMsg+=msg[i];
    }

    if(i<configWidth-1)
    {
        maxCharachtersPerLine = i;
    }
    else
    {
        maxCharachtersPerLine = configWidth-1;
    }


    var image = new Image();
    image.src = "images/chat-bubble.png"
    var sb = new createjs.ScaleBitmap(image, new createjs.Rectangle(15, 12, 3, 7));
    sb.x = player.grant.x-(maxCharachtersPerLine*12)-5;
    sb.y = player.grant.y-(lineHeight*lineNum)-30;
    sb.setDrawSize((maxCharachtersPerLine*12)+12+marginX,(lineHeight*lineNum)+lineHeight+fontSize+marginY);

    var text = new createjs.Text(formattedMsg, fontSize+"px Consolas", "#000000");
    text.x = sb.x + marginX;
    text.y = sb.y + marginY;
    text.lineHeight = lineHeight;

    textBubble.addChild(sb);
    textBubble.addChild(text);

    stage.addChild(textBubble);
    stage.update();

    createjs.Tween.get(textBubble).to({alpha: 0},1000*lineNum+4000).call(function(){
      stage.removeChild(textBubble);
    });

    $("#chatEntries").append('<div class="message"><p>' + displayName + ' : ' + msg + '</p></div>');
}

function addMessageToChatHistory(msg,displayName,own)
{
    var div;
    if(own)
    {
        div =
            '<li class="right clearfix">' +
                '<span class="chat-img pull-right">' +
                    '<img src="http://placehold.it/50/FA6F57/fff&amp;text=ME" alt="User Avatar" class="img-circle">' +
                '</span>' +
                '<div class="chat-body clearfix">' +
                    '<div class="header">' +
                        '<small class="text-muted">' +
                            '<span class="glyphicon glyphicon-time"></span>'+
                        '2 seconds ago' +
                        '</small>' +
                        '<strong class="pull-right primary-font">'+displayName +'</strong>'+
                    '</div>' +
                    '<p>'+msg+'</p>'+
                '</div>' +
            '</li>';
    }
    else
    {
        div = '<li class="left clearfix">' +
        '<span class="chat-img pull-left">' +
        '<img src="http://placehold.it/50/55C1E7/fff&amp;text='+displayName[0]+'" alt="User Avatar" class="img-circle">' +
        '</span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">'+displayName+'</strong>' +
        '<small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>2 seconds ago</small>' +
        '</div><p>'+msg+'</p></div></li>'
    }
    $('.chat').append($(div));
    $('.panel-body').scrollTop($('li').last().offset().top);
}
function updateMapNameUi(name)
{
    $('#world-name').text(name);
}

function getChatHistory(mapId,count)
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
        },
        error: function()
        {
            $("#serverMessage").text('Failed to fetch Chat History');
            $("#serverModal").modal('show')
        }
    });
}


function playerById(id)
{
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].socketId == id)
            return remotePlayers[i];
    };
    return false;
};