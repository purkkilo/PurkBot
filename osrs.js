const { hiscores } = require("osrs-json-api");
const { createEmbed, capitalize, colors } = require("./utils");

const gamemode = "main";
const gamemodes = ["main", "iron", "uim", "hcim", "dmm", "sdmm", "dmmt"];

function getClues(parsed, message) {
  if (parsed.arguments.length < 1) {
    return message.channel.send(
      "Command usage: ***!clues <username> <mode>***"
    );
  } else {
    let mode = gamemode;
    let player = parsed.arguments[0];
    if (parsed.arguments.length > 1) {
      if (gamemodes.includes(parsed.arguments[1])) {
        mode = parsed.arguments[1];
      } else {
        return message.channel.send(
          "Not a valid gamemode! Check correct spelling of modes from !modes"
        );
      }
    }

    message.channel
      .send(
        createEmbed(
          "Getting clues from api",
          "Should take around 1-10s",
          colors.YELLOW,
          [],
          true
        )
      )
      .then((sentMessage) => {
        hiscores
          .getPlayer(player, mode)
          .then((response) => {
            let clues = [];
            Object.keys(response.clues).forEach((key) => {
              clues.push({
                name: `${capitalize(key)} (Rank #${
                  response.clues[key].rank > -1
                    ? response.clues[key].rank
                    : "Undefined"
                })`,
                value: `Completed: ${
                  response.clues[key].score > -1
                    ? response.clues[key].score
                    : "No clues completed"
                }`,
              });
            });
            const embed = createEmbed(
              player,
              "Completed clues",
              colors.GOLD,
              clues
            );
            sentMessage.edit(embed);
          })
          .catch((error) => {
            sentMessage.edit(
              createEmbed("Error", error.message, colors.RED, [
                {
                  name: "Command Usage:",
                  value: "!clues <username> <mode>",
                },
              ])
            );
          });
      });
  }
}

function getBosses(parsed, message) {
  if (parsed.arguments.length < 1) {
    return message.channel.send(
      "Command usage: ***!bosses <username> <mode> <boss>*** where mode and boss is optional (mode defaults to **main** and boss to **all**)"
    );
  } else {
    let mode = gamemode;
    let player = parsed.arguments[0];
    if (parsed.arguments.length > 1) {
      if (gamemodes.includes(parsed.arguments[1])) {
        mode = parsed.arguments[1];
      } else {
        return message.channel.send(
          "Not a valid gamemode! Check correct spelling of modes from !modes"
        );
      }
    }

    message.channel
      .send(
        createEmbed(
          "Getting bosses from api",
          "Should take around 1-10s",
          colors.YELLOW,
          [],
          true
        )
      )
      .then((sentMessage) => {
        hiscores
          .getPlayer(player, mode)
          .then((response) => {
            if (parsed.arguments.length > 2 && parsed.arguments[2] !== "all") {
              let boss = "";
              parsed.arguments.splice(0, 2);
              boss = parsed.arguments.join(" ");
              if (response.bosses[boss]) {
                sentMessage.edit(
                  createEmbed(player, capitalize(boss), colors.GREEN, [
                    {
                      name: "Rank",
                      value: "#" + response.bosses[boss].rank,
                    },
                    {
                      name: "Score",
                      value: parseInt(
                        response.bosses[boss].score
                      ).toLocaleString(),
                    },
                  ])
                );
              } else {
                sentMessage.edit(
                  `Boss name invalid! Try one of these:\n\`\`\`fix\n${Object.keys(
                    response.bosses
                  ).join("\n")}\`\`\``
                );
              }
            } else {
              let allBosses = [];
              Object.keys(response.bosses).forEach((key) => {
                allBosses.push({
                  name: `${capitalize(key)} (Rank #${
                    response.bosses[key].rank > -1
                      ? response.bosses[key].rank
                      : "Undefined"
                  })`,
                  value: `Score: ${
                    response.bosses[key].score > -1
                      ? response.bosses[key].score
                      : "0"
                  }`,
                });
              });
              const embed = createEmbed(
                player,
                "Slayed bosses (1/2)",
                colors.GREEN,
                allBosses
              );
              let index = Object.keys(response.bosses).findIndex(
                (element) => element === "Kree'Arra"
              );
              const embed2 = createEmbed(
                player,
                "Slayed bosses (2/2)",
                colors.GREEN,
                allBosses.splice(0, index + 1)
              );
              sentMessage.edit(embed);
              message.channel.send(embed2);
            }
          })
          .catch((error) => {
            sentMessage.edit(
              createEmbed("Error", error.message, colors.RED, [
                {
                  name: "Command Usage:",
                  value:
                    "!bosses <username> <mode> <boss>*** where mode and boss is optional (mode defaults to **main** and boss to **all**)",
                },
              ])
            );
          });
      });
  }
}

function getHiscores(parsed, message) {
  if (parsed.arguments.length < 1) {
    return message.channel.send(
      "Command usage: ***!hiscores <username> <mode> <skill>*** where mode and skill is optional (mode defaults to **main** and skill to **all**)"
    );
  } else {
    let mode = gamemode;
    let player = parsed.arguments[0];
    if (parsed.arguments.length > 1) {
      if (gamemodes.includes(parsed.arguments[1])) {
        mode = parsed.arguments[1];
      } else {
        return message.channel.send(
          "Not a valid gamemode! Check correct spelling of modes from !modes"
        );
      }
    }

    message.channel
      .send(
        createEmbed(
          "Getting hiscores from api",
          "Should take around 1-10s",
          colors.YELLOW,
          [],
          true
        )
      )
      .then((sentMessage) => {
        hiscores
          .getPlayer(player, mode)
          .then((response) => {
            if (parsed.arguments.length > 2 && parsed.arguments[2] !== "all") {
              let skill = parsed.arguments[2];
              if (response.skills[skill]) {
                sentMessage.edit(
                  createEmbed(player, capitalize(skill), colors.GREEN, [
                    {
                      name: "Rank",
                      value: "#" + response.skills[skill].rank,
                    },
                    { name: "Level", value: response.skills[skill].level },
                    {
                      name: "Xp",
                      value:
                        parseInt(response.skills[skill].xp).toLocaleString() +
                        " xp",
                    },
                  ])
                );
              } else {
                sentMessage.edit(
                  `Skill name invalid! Try one of these:\n\`\`\`fix\n${Object.keys(
                    response.skills
                  ).join("\n")}\`\`\``
                );
              }
            } else {
              let skills = [];
              Object.keys(response.skills).forEach((key) => {
                skills.push({
                  name: `${capitalize(key)} (Rank #${
                    response.skills[key].rank > -1
                      ? response.skills[key].rank
                      : "Undefined"
                  })`,
                  value: `Level: ${response.skills[key].level} | XP: ${parseInt(
                    response.skills[key].xp
                  ).toLocaleString()} xp`,
                });
              });
              const embed = createEmbed(
                player,
                "Hiscores",
                colors.GREEN,
                skills
              );
              sentMessage.edit(embed);
            }
          })
          .catch((error) => {
            sentMessage.edit(
              createEmbed("Error", error.message, colors.RED, [
                {
                  name: "Command Usage:",
                  value:
                    "!hiscores <username> <mode> <skill>*** where mode and skill is optional (mode defaults to **main** and skill to **all**)",
                },
              ])
            );
          });
      });
  }
}

function comparePlayers(parsed, message) {
  if (parsed.arguments.length < 2) {
    return message.channel.send(
      "Command usage: ***!compare <username1> <username2> <mode> <skill>*** where mode and skill is optional (mode defaults to **main** and skill defaults to **all**)"
    );
  } else {
    let mode = gamemode;
    let player = parsed.arguments[0];
    let player2 = parsed.arguments[1];

    if (parsed.arguments.length > 2) {
      if (gamemodes.includes(parsed.arguments[2])) {
        mode = parsed.arguments[2];
      } else {
        return message.channel.send(
          "Not a valid gamemode! Check correct spelling of modes from !modes"
        );
      }
    }

    message.channel
      .send(
        createEmbed(
          "Getting hiscores from api",
          "Should take around 2-20s",
          colors.YELLOW,
          [],
          true
        )
      )
      .then(async (sentMessage) => {
        let playerData, player2Data;
        await hiscores
          .getPlayer(player, mode)
          .then((response) => {
            playerData = response.skills;
          })
          .catch((error) => {
            return sentMessage.edit(
              createEmbed(
                "Error",
                `**${player}** ` + error.message,
                colors.RED,
                [
                  {
                    name: "Command Usage:",
                    value:
                      "!compare <username1> <username2> <mode> <skill>*** where mode and skill is optional (mode defaults to **main** and skill defaults to **all**)",
                  },
                ]
              )
            );
          });
        await hiscores
          .getPlayer(player2, mode)
          .then((response) => {
            player2Data = response.skills;
          })
          .catch((error) => {
            return message.channel.send(
              createEmbed(
                "Error",
                `**${player2}** ` + error.message,
                colors.RED,
                [
                  {
                    name: "Command Usage:",
                    value:
                      "!compare <username1> <username2> <mode> <skill>*** where mode and skill is optional (mode defaults to **main** and skill defaults to **all**)",
                  },
                ]
              )
            );
          });
        if (playerData && player2Data) {
          if (parsed.arguments.length > 3 && parsed.arguments[3] !== "all") {
            let skill = parsed.arguments[3];
            if (playerData[skill]) {
              let playerSkill = playerData[skill];
              let player2Skill = player2Data[skill];
              let rank = parseInt(playerSkill.rank);
              let level = parseInt(playerSkill.level);
              let xp = parseInt(playerSkill.xp);
              let rank2 = parseInt(player2Skill.rank);
              let level2 = parseInt(player2Skill.level);
              let xp2 = parseInt(player2Skill.xp);
              let rankMessage, levelMessage, xpMessage;
              // Check rank
              if (rank < rank2) {
                rankMessage = `**#${rank.toLocaleString()}** > #${rank2.toLocaleString()} | (${player} +${(
                  rank2 - rank
                ).toLocaleString()})`;
              } else {
                rankMessage = `#${rank.toLocaleString()} < **#${rank2.toLocaleString()}** | (${player2} +${(
                  rank - rank2
                ).toLocaleString()})`;
              }
              // Check level
              if (level > level2) {
                levelMessage = `**${level}** > ${level2} | (${player} +${
                  level - level2
                })`;
              } else if (level === level2) {
                levelMessage = `**${level}** = ${level2}**`;
              } else {
                levelMessage = `${level} < **${level2}** | (${player2} +${
                  level2 - level
                })`;
              }
              // Check xp
              if (xp > xp2) {
                xpMessage = `**${xp.toLocaleString()}** xp > ${xp2.toLocaleString()} xp (${player} +${(
                  xp - xp2
                ).toLocaleString()} xp)`;
              } else if (xp === xp2) {
                xpMessage = `**${xp.toLocaleString()}** xp = **${xp2.toLocaleString()}** xp`;
              } else {
                xpMessage = `${xp.toLocaleString()} xp < **${xp2.toLocaleString()}** xp (${player2} +${(
                  xp2 - xp
                ).toLocaleString()} xp)`;
              }

              sentMessage.edit(
                createEmbed(
                  `${player} vs. ${player2}`,
                  capitalize(skill),
                  colors.GREEN,
                  [
                    {
                      name: "Rank",
                      value: rankMessage,
                    },
                    {
                      name: "Level",
                      value: levelMessage,
                    },
                    {
                      name: "Xp",
                      value: xpMessage,
                    },
                  ]
                )
              );
            } else {
              return sentMessage.edit(
                `${"Skill name invalid! Try one of these:\n"}**${Object.keys(
                  playerData
                ).join("**\n")}`
              );
            }
          } else {
            let skills = [];
            Object.keys(playerData).forEach((key) => {
              let playerSkill = playerData[key];
              let player2Skill = player2Data[key];
              let xp = parseInt(playerSkill.xp);
              let xp2 = parseInt(player2Skill.xp);
              let xpMessage;

              // Check xp
              if (xp > xp2) {
                xpMessage = `**${xp.toLocaleString()}** xp > ${xp2.toLocaleString()} xp (${player} +${(
                  xp - xp2
                ).toLocaleString()} xp)`;
              } else if (xp === xp2) {
                xpMessage = `**${xp.toLocaleString()}** xp = **${xp2.toLocaleString()}** xp`;
              } else {
                xpMessage = `${xp.toLocaleString()} xp < **${xp2.toLocaleString()}** xp (${player2} +${(
                  xp2 - xp
                ).toLocaleString()} xp)`;
              }
              skills.push({
                name: capitalize(key),
                value: xpMessage,
              });
            });
            const embed = createEmbed(
              `${player} vs. ${player2}`,
              "All hiscores",
              colors.GREEN,
              skills
            );
            sentMessage.edit(embed);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        message.channel.send(
          createEmbed("Error", error.message, colors.RED, [
            {
              name: "Command Usage:",
              value:
                "!compare <username1> <username2> <mode> <skill>*** where mode and skill is optional (mode defaults to **main** and skill defaults to **all**)",
            },
          ])
        );
      });
  }
}

function showModes(message) {
  message.channel.send(`\`\`\`fix\n${gamemodes.join("\n")}\`\`\``);
}

module.exports = {
  getClues,
  getBosses,
  getHiscores,
  comparePlayers,
  showModes,
};
