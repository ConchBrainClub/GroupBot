const {createClient} = require("oicq");
const fs = require("fs");
const weather = require("./plugins/weather");

let info = JSON.parse(fs.readFileSync("config.json"));

const bot = createClient(info.account);

bot.on("system.login.slider", () => {
  process.stdin.once("data", input => {
    bot.sliderLogin(input);
  });
});

bot.on("message", data => {

  console.log(data);

  if (data.group_id > 0 && data.raw_message.includes("@ConchBrainBot")){

    let message = data.raw_message.substring(data.raw_message.indexOf("]") + 1).trim();
    weather.exec(data.group_id,message,bot);
  }

});

bot.login(info.password);