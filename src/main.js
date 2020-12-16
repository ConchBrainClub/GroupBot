const oicq = require("oicq");
const fs = require("fs");

let info = JSON.parse(fs.readFileSync("config.json"));

let bot = oicq.createClient(info.account);

bot.on("system.login.captcha", ()=>{
  process.stdin.once("data", input=>{
    bot.captchaLogin(input);
  });
});

bot.on("message", data=>{
  console.log(data);
  if(data.message_type == "group" && data.group_id == 1091165646) {
    bot.sendGroupMsg(data.group_id, data.raw_message);
  }
});

bot.login(info.password);