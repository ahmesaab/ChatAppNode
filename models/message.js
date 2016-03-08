/**
 * Created by Ahmed on 3/6/2016.
 */

function Message(id,conversation,content,user) {
    this.id = id;
    this.conversation = conversation;
    this.content = content;
    this.user = user;
}

module.exports = Message;