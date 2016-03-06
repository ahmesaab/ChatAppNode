/**
 * Created by Ahmed on 3/6/2016.
 */

function Message(id,userID,conversationId,content,displayName) {
    this.id = id;
    this.userID = userID;
    this.conversationId = conversationId;
    this.content = content;
    this.displayName = displayName;
}

module.exports = Message;