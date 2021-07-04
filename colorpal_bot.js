require('dotenv').config();
const {genImage} = require('./color_tests');
const Discord = require("discord.js");

const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
  else if (msg.content === "colorpal") {
    
    genImage();
    const colorAttach = new Discord.MessageAttachment('image.png');
    msg.reply('', colorAttach);

  }
});

client.login(process.env.TOKEN);