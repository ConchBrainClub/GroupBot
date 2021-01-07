const {createClient} = require("oicq");
const fs = require("fs");

let info = JSON.parse(fs.readFileSync("config.json"));

const bot = createClient(info.account);

//监听并输入滑动验证码ticket
bot.on("system.login.slider", ()=>{
  process.stdin.once("data", input=>{
    bot.sliderLogin(input);
  });
});

bot.on("message", data=>{
  console.log(data);
  if (data.group_id > 0)
    bot.sendGroupMsg(data.group_id, "hello");
  else
    bot.sendPrivateMsg(data.user_id, "hello");
});

bot.login(info.password); 