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

const http = require("http");

module.exports.exec = (sender, message, callback) => {

    let city = message.substring(0, message.indexOf("天气"));

    if (!city) {
        return;
    }

    let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2e08eccb466e60a88dc1a757ebadd1e9&lang=zh_cn`;

    http.get(api, (res) => {

        let data = "";

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {

            try {
                
                let weather = JSON.parse(data);

                let replay = 
`${weather.weather[0].description}
最高温度${Math.round(weather.main.temp_max - 272.15)}
最低温度${Math.round(weather.main.temp_min - 272.15)}
风速${weather.wind.speed}`;

                callback(replay);
                
            } catch (error) {}

        });

        res.on("error", (err) => {
            callback(err);
        })
    });

}