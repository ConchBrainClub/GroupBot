const {createClient} = require("oicq");
const uin = 123456789;
const bot = createClient(uin);

bot.on("system.login.captcha", ()=>{
  process.stdin.once("data", input=>{
    bot.captchaLogin(input);
  });
});

bot.on("message", data=>{
  console.log(data);
  if (data.group_id > 0)
    bot.sendGroupMsg(data.group_id, "hello");
  else
    bot.sendPrivateMsg(data.user_id, "hello");
});

const password = "password";
bot.login(password);