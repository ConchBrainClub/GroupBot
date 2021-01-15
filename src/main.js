const {createClient} = require("oicq");
const fs = require("fs");

let info = JSON.parse(fs.readFileSync("config.json"));

const bot = createClient(info.account);

bot.on("system.login.slider", () => {
  process.stdin.once("data", input => {
    bot.sliderLogin(input);
  });
});

bot.on("message", data => {

  if(!data.group_id){
    return;
  }

  let pattern = /\[(.*)]/;
  let info = pattern.exec(data.raw_message)[0];

  if(!info.includes("@ConchBrainBot")){
    return;
  }

  console.log(data);

  let message = data.raw_message.replace(info,"").trim();

  let pluginConfigs = JSON.parse(fs.readFileSync("./src/pattern.json").toString());
  pluginConfigs.forEach((config) => {

    if(new RegExp(config.pattern).test(message)){
      require("./plugins/" + config.plugin).exec(data.sender, message, (replay) => {
        bot.sendGroupMsg(data.group_id, replay);
      })
    }
  });

});

bot.login(info.password);