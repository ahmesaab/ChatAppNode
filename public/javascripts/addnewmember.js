/**
 * Created by Ahmed on 3/9/2016.
 */

function addNewMember(chatId)
{
    var memberId=prompt("Please enter new Member ID", "ex:3");
    if(memberId!==null)
    {
        var urlString = '/rest/newMemberConversation?userId='+memberId+'&chatId='+chatId;
        $.ajax({
            url: urlString,
            success: function(result)
            {
                alert('New Member Added!');
            },
            error: function()
            {
                alert("An error has occurred! Try Again!");
            }
        });
    }
}
