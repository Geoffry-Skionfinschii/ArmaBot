
import dotenv from 'dotenv'
import {Client, ApplicationCommandData, ApplicationCommandOptionData, ApplicationCommandOptionType, Guild, Embed} from 'discord.js';

dotenv.config();


const client = new Client({intents: ['GuildMembers']});


async function updateGuildCommands(guild: Guild) {
    guild.commands.create({
        name: "join",
        description: "Join the arma squad"
    });

    guild.commands.create({
        name: "leave",
        description: "Leave the arma squad"
    })
}

client.on(`ready`, async () => {

    console.log("Discord Online");

    let guild = client.guilds.cache.get(process.env.GUILD_ID!);
    console.log(guild);

    if(guild) {
        updateGuildCommands(guild);
    }
});

client.on(`interactionCreate`, async (interaction) => {
    if(interaction.isChatInputCommand()) {
        switch(interaction.commandName) {
            case "join":
                {
                    let id = process.env.ROLE_ID;
                    if(id) {
                        let role = await interaction.guild?.roles.fetch(id);
                        if(role && interaction.member) {
                            let member = await interaction.guild?.members.fetch(interaction.member?.user.id);
                            await member?.roles.add(role.id);
                            interaction.reply({ephemeral: false, content: `You have joined (${role})`});

                        } else {
                            interaction.reply({ephemeral: true, content: `Failed to join; role error`});

                        }
                    } else {
                        interaction.reply({ephemeral: true, content: `Failed to join; does not exist`});
                    }
                }
            break;
            case "leave":
                {
                    let id = process.env.ROLE_ID;
                    if(id) {
                        let role = await interaction.guild?.roles.fetch(id);
                        if(role && interaction.member) {
                            let member = await interaction.guild?.members.fetch(interaction.member?.user.id);
                            console.log(member);
                            console.log(role);
                            await member?.roles.remove(role.id);
                            interaction.reply({ephemeral: false, content: `You have left (${role})`});

                        } else {
                            interaction.reply({ephemeral: true, content: `Failed to leave; role error`});

                        }
                    } else {
                        interaction.reply({ephemeral: true, content: `Failed to leave; does not exist`});
                    }
                }
            break;
        }
    }
});

client.login(process.env.DISCORD_TOKEN);