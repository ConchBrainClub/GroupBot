const http = require("http");

function exec(id, message, bot) {

    if(message.includes("天气")){

        let city = message.substring(0,message.indexOf("天气"));

        let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2e08eccb466e60a88dc1a757ebadd1e9`;

        http.get(api,(res)=>{

            let data = "";

            res.on("data",(chunk) => {
                data += chunk;
            });

            res.on("end",() => {
                bot.sendGroupMsg(id, data);
            });

            res.on("error",(err) => {
                bot.sendGroupMsg(id, err);
            })
        });
    }

}

module.exports = {exec};