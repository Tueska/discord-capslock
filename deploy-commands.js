#! node_modules/.bin/ts-node-esm
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "dotenv";
config();

import { data as Scoreboard } from "./src/commands/scoreboard.js";
import { data as Active } from "./src/commands/setactive.js";
import { data as GracePeriod } from "./src/commands/setgrace.js";
import { data as Threshold } from "./src/commands/setthreshold.js";
import { data as ClearScoreboard } from "./src/commands/clearscoreboard.js";

const commands = {
    global: [...Scoreboard, ...Active, ...GracePeriod, ...Threshold, ...ClearScoreboard],
};

const clientId = process.env.DISCORD_CLIENTID;
const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        for (const [guildId, guildCommands] of Object.entries(commands)) {
            console.log(`Refreshing application commands for ${guildId}`);
            try {
                if (guildId === "global") {
                    await rest.put(Routes.applicationCommands(clientId), { body: guildCommands });
                } else {
                    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: guildCommands });
                }
            } catch (err) {
                if ((err).code !== 50001) throw err;
                console.error("Missing permission for " + guildId);
            }
        }

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();