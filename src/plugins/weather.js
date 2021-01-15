const http = require("http");

module.exports.exec = (sender,message,callback) => {

    let city = message.substring(0,message.indexOf("天气"));

    if(!city){
        return;
    }

    let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2e08eccb466e60a88dc1a757ebadd1e9`;

    http.get(api,(res)=>{

        let data = "";

        res.on("data",(chunk) => {
            data += chunk;
        });

        res.on("end",() => {
            callback(data);
        });

        res.on("error",(err) => {
            callback(err);
        })
    });

}