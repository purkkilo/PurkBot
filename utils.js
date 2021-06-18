const { MessageEmbed } = require("discord.js");
const colors = {
  DEFAULT: "#000000",
  AQUA: "#1ABC9C",
  DARK_AQUA: "#11806A",
  GREEN: "#2ECC71",
  DARK_GREEN: "#1F8B4C",
  BLUE: "#3498DB",
  DARK_BLUE: "#206694",
  PURPLE: "#9B59B6",
  DARK_PURPLE: "#71368A",
  LUMINOUS_VIVID_PINK: "#E91E63",
  DARK_VIVID_PINK: "#AD1457",
  GOLD: "#F1C40F",
  DARK_GOLD: "#C27C0E",
  ORANGE: "#E67E22",
  DARK_ORANGE: "#A84300",
  RED: "#E74C3C",
  DARK_RED: "#992D22",
  GREY: "#95A5A6",
  DARK_GREY: "#979C9F",
  DARKER_GREY: "#7F8C8D",
  LIGHT_GREY: "#BCC0C0",
  NAVY: "#4495E",
  DARK_NAVY: "#2C3E50",
  YELLOW: "#FFFF00",
};

function showHelp(commands, message) {
  let msg = "\n";
  commands.forEach((command) => {
    msg += "**!" + command + "**\n";
  });
  msg +=
    "***Type the command name to get more info for the specific command.***";
  message.channel.send(msg);
}

function createEmbed(title, description, color, fields, isLoading) {
  const embed = new MessageEmbed()
    // Set the title of the field
    .setTitle(title)
    .setDescription(description)
    .setColor(color);

  if (fields.length) {
    embed.addFields(fields);
  }

  if (isLoading) {
    embed.setImage(
      "https://media.tenor.com/images/a742721ea2075bc3956a2ff62c9bfeef/tenor.gif"
    );
  }
  return embed;
}

function capitalize(string) {
  let lower = string.toLowerCase().substring(1);
  let first = string.charAt(0).toUpperCase();
  return `${first}${lower}`;
}

module.exports = {
  colors,
  capitalize,
  createEmbed,
  showHelp,
};
