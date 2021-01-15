const {createClient} = require("oicq");
const fs = require("fs");

let info = JSON.parse(fs.readFileSync("config.json"));
let currentUser = new Array();

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

  if(currentUser.includes(data.sender.user_id)){
    handlerMessage(data);
    return;
  }

  let pattern = /\[(.*)]/;
  let info = pattern.exec(data.raw_message)[0];
  if(info.includes("@ConchBrainBot")){
    handlerMessage(data,info);
  }

});

function handlerMessage(data,info){
  console.log(data);
  if(!currentUser.includes(data.sender.user_id))
    currentUser.push(data.sender.user_id);

  let message = data.raw_message.replace(info,"").trim();

  if(new RegExp("再见|拜拜").test(message)){
    let index = currentUser.indexOf(data.sender.user_id);
    currentUser.splice(index,1);
    bot.sendGroupMsg(data.group_id, "拜拜" + data.sender.nickname);
    return;
  }

  let pluginConfigs = JSON.parse(fs.readFileSync("./src/pattern.json").toString());
  pluginConfigs.forEach((config) => {

    if(new RegExp(config.pattern).test(message)){

      let plugin = require("./plugins/" + config.plugin);

      if(!plugin){
        let index = pluginConfigs.indexOf(config.plugin);
        pluginConfigs.splice(index,1);
        fs.writeFileSync("./src/pattern.json", JSON.stringify(pluginConfigs));
        return;
      }

      plugin.exec(data.sender, message, (replay) => {
        bot.sendGroupMsg(data.group_id, replay);
      });

    }
  });
}

bot.login(info.password);