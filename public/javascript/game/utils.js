/**
 * Created by Ahmed on 3/19/2016.
 */

function addMessageToUi(msg, displayName, player)
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

function updateMapNameUi(name)
{
    $('#world-name').text(name);
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