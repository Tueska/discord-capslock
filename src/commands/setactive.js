import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export const data = [new SlashCommandBuilder().setName("active").setDescription("Activates the bot").addBooleanOption(option => option.setName("active").setDescription("Set the active state of the bot").setRequired(true)).setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)];

export default function Active(client, db) {
    client.on("interactionCreate", (interaction) => {
        if (interaction.isChatInputCommand() && interaction.commandName === "active") {
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

            db.run('UPDATE guilds SET active = ? WHERE id = ?', [interaction.options.getBoolean("active"), interaction.guild.id], (err) => {
                if (err) throw err;
                interaction.reply(`Set active state to ${interaction.options.getBoolean("active")}`);
            });

            return;
        }
    });
}