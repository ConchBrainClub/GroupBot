/*
sender
type:object
=================
age:年龄
area:'洛阳'
level:群等级
nickname:'qq昵称'
sex:'male/female'
user_id:qq号
*/

/*
message
type:string
=================
消息内容
*/

/*
callback
type:function
=================
para:replay 回复内容
*/

module.exports.exec = (sender, message, callback) => {
    callback("你好 " + sender.nickname);
}