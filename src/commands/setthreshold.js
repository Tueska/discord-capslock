import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export const data = [new SlashCommandBuilder().setName("threshold").setDescription("Sets the threshold of capitalized characters allowed per message").addIntegerOption(option => option.setName("threshold").setDescription("Sets the thershold in percent").setRequired(true)).setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)];

export default function Threshold(client, db) {
    client.on("interactionCreate", (interaction) => {
        if (interaction.isChatInputCommand() && interaction.commandName === "threshold") {
            if (!interaction.guild) {
                interaction.reply("This command can only be used in a guild");
                return;
            }

            // Check if the user has the required permissions
            if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                interaction.reply("You don't have the required permissions to use this command");
                return;
            }

            // Cap the threshold at 100% and 0%
            if (interaction.options.getInteger("threshold") > 100) {
                interaction.reply("The threshold can't be higher than 100%");
                return;
            } else if (interaction.options.getInteger("threshold") < 0) {
                interaction.reply("The threshold can't be lower than 0%");
                return;
            }

            // Set active state of the bot
            db.run('UPDATE guilds SET threshold = ? WHERE id = ?', [interaction.options.getInteger("threshold"), interaction.guild.id], (err) => {
                if (err) throw err;
                interaction.reply(`Set threshold to ${interaction.options.getInteger("threshold")}%!`);
            });

            return;
        }
    });
}