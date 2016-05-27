/**
 * Created by Ahmed on 3/6/2016.
 */

function Message(id,map,content,user,timeStamp) {
    this.id = id;
    this.map = map;
    this.content = content;
    this.user = user;
    this.timeStamp = timeStamp;
}

module.exports = Message;