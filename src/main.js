const { createClient } = require("oicq");
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

    if (!data.group_id) {
        return;
    }

    currentUser.forEach((user) => {
        if (user.id == data.sender.user_id) {
            if (new Date().getTime() < user.expires) {
                handlerMessage(data);
                return;
            }
            else{
                let index = currentUser.indexOf(user);
                currentUser.splice(index, 1);
            }
        }
    });

    let pattern = /\[(.*)]/;
    let info = pattern.exec(data.raw_message)[0];
    if (info.includes("@ConchBrainBot")) {
        handlerMessage(data, info);
    }

});

function handlerMessage(data, info) {
    console.log(data);
    let flag = false;
    currentUser.forEach((user) => {
        if(user.id == data.sender.user_id)
            flag = true;
    });

    if (!flag)
        currentUser.push({
            "id": data.sender.user_id,
            "expires": new Date().getTime() + 1000 * 60
        });

    let message = data.raw_message.replace(info, "").trim();

    if (new RegExp("再见|拜拜").test(message)) {
        currentUser.forEach((user) => {
            if (user.id == data.sender.user_id) {
                let index = currentUser.indexOf(user);
                currentUser.splice(index, 1);
                return;
            }
        });
        bot.sendGroupMsg(data.group_id, "拜拜" + data.sender.nickname);
        return;
    }

    let pluginConfigs = JSON.parse(fs.readFileSync("./src/pattern.json").toString());
    pluginConfigs.forEach((config) => {

        if (new RegExp(config.pattern).test(message)) {

            let plugin = require("./plugins/" + config.plugin);

            if (!plugin) {
                let index = pluginConfigs.indexOf(config.plugin);
                pluginConfigs.splice(index, 1);
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