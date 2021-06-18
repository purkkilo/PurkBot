const { Client, MessageAttachment } = require("discord.js");
const client = new Client();
const { parse } = require("discord-command-parser");
const commands = ["hiscores", "clues", "bosses", "compare"];
const utils = require("./utils");
const osrs = require("./osrs");
const Canvas = require("canvas");

const applyText = (canvas, text) => {
  const context = canvas.getContext("2d");
  let fontSize = 70;

  do {
    context.font = `${(fontSize -= 10)}px sans-serif`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("(͡ ͡° ͜ つ ͡͡°)");
});

client.on("message", async (message) => {
  const parsed = parse(message, "!", { allowSpaceBeforeCommand: true });
  if (!parsed.success) return;

  if (parsed.command === "commands") {
    utils.showHelp(commands, message);
  }

  if (parsed.command === "hiscores") {
    osrs.getHiscores(parsed, message);
  }
  if (parsed.command === "clues") {
    osrs.getClues(parsed, message);
  }
  if (parsed.command === "bosses") {
    osrs.getBosses(parsed, message);
  }

  if (parsed.command === "compare") {
    osrs.comparePlayers(parsed, message);
  }

  if (parsed.command === "modes") {
    osrs.showModes(message);
  }

  if (parsed.command === "thebest") {
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext("2d");

    await Canvas.loadImage("./wallpaper.jpg")
      .then(async (background) => {
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = "#74037b";
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = "28px sans-serif";
        context.fillStyle = "#ffffff";
        context.fillText(
          `${message.author.username}, the bestest!`,
          canvas.width / 2.5,
          canvas.height / 1.8
        );

        context.font = applyText(canvas, `${message.author.username}!`);
        context.fillStyle = "#ffffff";

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        await Canvas.loadImage(
          message.author.displayAvatarURL({ format: "jpg" })
        )
          .then((avatar) => {
            context.drawImage(avatar, 25, 25, 200, 200);
            const attachment = new MessageAttachment(
              canvas.toBuffer(),
              "thebest.png"
            );
            message.channel.send(attachment);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

let token;

if (process.env.NODE_ENV === "production") {
  token = process.env.DISCORDJS_TOKEN;
} else {
  const config = require("./config.json");
  token = config.token;
}

client.login(token);
