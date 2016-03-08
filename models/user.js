/**
 * Created by Ahmed on 3/8/2016.
 */

function User(id,firstName,lastName,nickName,shape,color) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.shape = shape;
    this.color = color;
}

module.exports = User;