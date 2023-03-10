import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export const data = [new SlashCommandBuilder().setName("clearscoreboard").setDescription("Clears the scoreboard").setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)];

export default function ClearScoreboard(client, db) {
    client.on("interactionCreate", (interaction) => {
        if (interaction.isChatInputCommand() && interaction.commandName === "clearscoreboard") {
            // Set active state of the bot
            if (!interaction.guild) {
                interaction.reply("This command can only be used in a guild");
                return;
            }

            // Check if the user has the required permissions
            if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                interaction.reply("You don't have the required permissions to use this command");
                return;
            }

            // Clear scoreboard entries with same guild_id from databse
            db.run('DELETE FROM scoreboard WHERE guild_id = ?', [interaction.guild.id], (err) => {
                if (err) throw err;
                interaction.reply("Cleared scoreboard");
            });

            return;
        }
    });
}