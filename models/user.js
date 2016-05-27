/**
 * Created by Ahmed on 3/8/2016.
 */

function User(id,firstName,lastName,nickName,shape,color,x,y,roomId,status,facebookId,speed,frameRate)
{
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.shape = shape;
    this.color = color;
    this.x = x;
    this.y = y;
    this.roomId = roomId;
    this.status = status;
    this.facebookId = facebookId;
    this.speed = speed;
    this.frameRate = frameRate;
}

module.exports = User;