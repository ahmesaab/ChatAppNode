/**
 * Created by Ahmed on 3/9/2016.
 */

function addNewConversation()
{
    var title=prompt("Please enter new ChatRoom title", "ex:Thursday Party!");
    if(title!==null)
    {
        var urlString = '/rest/newConversation?title='+title;
        $.ajax({
            url: urlString,
            success: function(result)
            {
                alert('New Chat Added!');
            },
            error: function()
            {
                alert("An error has occurred! Try Again!");
            }
        });
    }
}
