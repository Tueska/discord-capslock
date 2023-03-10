import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export const data = [new SlashCommandBuilder().setName("scoreboard").setDescription("Show the scoreboard for this server")];

export default async function Scoreboard(client, db) {
    client.on("interactionCreate", (interaction) => {
        if (interaction.isChatInputCommand() && interaction.commandName === "scoreboard") {
            // Check if the user is in a guild
            if (!interaction.guild) {
                interaction.reply("This command can only be used in a guild");
                return;
            }

            // Get scoreboard entries with same guild_id from databse, sort the entries by score and send them to the user cap at 10
            db.all('SELECT user_id, score FROM scoreboard WHERE guild_id = ? ORDER BY score DESC LIMIT 10', [interaction.guild.id], async (err, rows) => {
                if (err) throw err;
                if (!rows || rows.length === 0) {
                    interaction.reply("No scoreboard entries found");
                    return;
                }

                let scoreboard = "";

                for (let i = 0; i < rows.length; i++) {
                    scoreboard += `${i + 1}. <@${rows[i].user_id}> - ${rows[i].score}\n`;
                }

                interaction.reply({ content: scoreboard, ephemeral: true });
            });

            return;
        }
    });
}