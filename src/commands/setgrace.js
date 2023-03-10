import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export const data = [new SlashCommandBuilder().setName("grace").setDescription("Sets the grace period").addIntegerOption(option => option.setName("minutes").setDescription("Sets the amount of time in Minutes").setRequired(true)).setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)];

export default function GracePeriod(client, db) {
    client.on("interactionCreate", (interaction) => {
        if (interaction.isChatInputCommand() && interaction.commandName === "grace") {
            if (!interaction.guild) {
                interaction.reply("This command can only be used in a guild");
                return;
            }

            // Check if the user has the required permissions
            if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                interaction.reply("You don't have the required permissions to use this command");
                return;
            }

            // Set active state of the bot
            db.run('UPDATE guilds SET grace_period = ? WHERE id = ?', [interaction.options.getInteger("minutes"), interaction.guild.id], (err) => {
                if (err) throw err;
                interaction.reply(`Set grace period to to ${interaction.options.getInteger("minutes")} minutes!`);
            });

            return;
        }
    });
}