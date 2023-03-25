import { Client, EmbedBuilder } from 'discord.js';
import Scoreboard from './commands/scoreboard.js';
import Active from './commands/setactive.js';
import GracePeriod from './commands/setgrace.js';
import Threshold from './commands/setthreshold.js';
import ClearScoreboard from './commands/clearscoreboard.js';
import { config } from "dotenv";
config();
const client = new Client({ intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent", 'GuildWebhooks'] });
const token = process.env.DISCORD_TOKEN;

// import sqlite3 from 'sqlite3';
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./src/db.sqlite');

const userList = new Map();
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS guilds (id TEXT, active BOOLEAN, grace_period INTEGER, threshold INTEGER)');
    // create table scoreboard with guild_id (PK), user_id (PK), score
    db.run('CREATE TABLE IF NOT EXISTS scoreboard (guild_id TEXT, user_id TEXT, score INTEGER, PRIMARY KEY (guild_id, user_id))');
});

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Event when Server is joined
client.on('guildCreate', guild => {
    db.run('INSERT INTO guilds (id, active, grace_period, threshold) VALUES (?, ?, 5, 50)', [guild.id, true]);
    console.log('Joined a new guild: ' + guild.name);
});

client.on('guildDelete', guild => {
    db.run('DELETE FROM guilds WHERE id = ?', [guild.id]);
    console.log('Left a guild: ' + guild.name);
});

client.on('messageCreate', msg => {
    db.get('SELECT active, grace_period, threshold FROM guilds WHERE id = ?', [msg.guild.id], (err, row) => {
        if (err) {
            // Insert guild into database if it doesn't exist
            db.run('INSERT INTO guilds (id, active, grace_period, threshold) VALUES (?, ?, 5, 50)', [msg.guild.id, true]);
        }
        if (!row) {
            return;
        }

        if (!row.active) return;

        if (msg.author.bot || !/[a-zA-Z]/.test(msg.content)) return;

        // remove whitespace from msg.content
        const msgContent = msg.content.replace(/\s/g, '');
        const uppercaseCount = (msgContent.match(/[A-Z]/g) || []).length;
        const uppercasePercentage = uppercaseCount / msgContent.length;

        if (uppercasePercentage > row.threshold / 100 && msg.content.length > 5) {
            if (!userList.has(msg.author.id)) {
                userList.set(msg.author.id, Date.now());
                msg.react('eyes_anger:1083780292566843472');
                return;
            } else {
                if (Date.now() - userList.get(msg.author.id) < row.grace_period * 60 * 1000) {
                    userList.set(msg.author.id, Date.now());
                } else {
                    userList.set(msg.author.id, Date.now());
                    msg.react('eyes_anger:1083780292566843472');
                    return;
                }
            }


            const fakeMsg = msg.content.toLowerCase();

            // Set scoreboard entry for user or increment score
            db.run('INSERT INTO scoreboard (guild_id, user_id, score) VALUES (?, ?, 1) ON CONFLICT (guild_id, user_id) DO UPDATE SET score = score + 1', [msg.guild.id, msg.author.id]);
            // Create webhook in the channel the message was sent to send the message as the user who sent it originally
            msg.channel.createWebhook({ name: msg.author.username.toLowerCase(), avatar: msg.author.avatarURL() }).then(webhook => {
                if (msg.mentions.repliedUser) {
                    // Get the original message from recipient
                    msg.channel.messages.fetch(msg.reference.messageId).then(originalMsg => {
                        const embed = new EmbedBuilder({
                            author: {
                                name: originalMsg.author.username, iconURL: originalMsg.author.displayAvatarURL()
                            },
                            description: `[Reply to:](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.reference.messageId}) ${originalMsg.content}`,
                        });

                        // Send the embed with the message and fakeMsg as normal message above
                        webhook.send({ content: fakeMsg, embeds: [embed] }).then(() => {
                            msg.delete();
                            webhook.delete();
                        });
                    });
                } else {
                    webhook.send(fakeMsg).then(() => {
                        msg.delete();
                        webhook.delete();
                    });
                }
            });
        }
    });
});

// ----------------- COMMANDS -----------------
Scoreboard(client, db);
Active(client, db);
GracePeriod(client, db);
Threshold(client, db);
ClearScoreboard(client, db);

client.login(token);

