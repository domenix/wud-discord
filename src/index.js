require('dotenv').config()
const express = require("express");
const router = express.Router();
const app = express();

const Discord = require('discord.js');
const client = new Discord.Client();

app.use(express.urlencoded({ extended: true }));
app.use("/", router, express.json());

messageBodyProps = {
    'currentVersion': 'Current version',
    'newVersion': 'New version'
}

client.login(`${process.env.DISCORD_TOKEN}`);

function getProps(body) {
    const containerName = body.name
    const currentVersion = body.image.tag.value
    const updateVersion = body.result.tag

    return { containerName, currentVersion, updateVersion }
}

function createVersionUpdateMessage(body, identifier) {
    // Parse text from WUD
    const containerName = body.name
    const currentVersion = body.image.tag.value
    const updateVersion = body.result.tag

    const message = new Discord.MessageEmbed()
        .setColor('#f3ecdc')
        .setTitle(identifier)
        .setDescription(`Container: ${containerName}`)
        .setThumbnail(`${process.env.THUMBNAIL_LINK}`)
        .addFields(
            { name: messageBodyProps.currentVersion, value: `${currentVersion}`, inline: true },
            { name: messageBodyProps.newVersion, value: `${updateVersion}`, inline: true },
        )
        .setTimestamp();

    return message;
}

async function messageExists(body, channel, identifier) {
    let bodyProps = getProps(body);

    const messages = await channel.messages.fetch();

    let returnValue = false;
    messages.some(msg => msg.embeds.filter(embed => embed.title === `${identifier}`).some(filteredEmbed => {
        currentVersionField = filteredEmbed.fields.find(field => field.name === `${messageBodyProps.currentVersion}`);
        newVersionField = filteredEmbed.fields.find(field => field.name === `${messageBodyProps.newVersion}`);

        if (currentVersionField.value === bodyProps.currentVersion && newVersionField.value === bodyProps.updateVersion) {
            returnValue = true;
            return returnValue;
        }
    }));

    return returnValue;
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    server = client.guilds.cache.find(g => g.name === `${process.env.SERVER_NAME}`);
    channel = server.channels.cache.find(ch => ch.name === `${process.env.CHANNEL_NAME}`);

    app.post('/new-version', (req, res) => {
        let body = req.body

        let identifier = 'New docker image version detected!'
        messageExists(body, channel, identifier).then(result => {
            if (!result) {
                console.log('There is no such message, creating...');
                channel.send(createVersionUpdateMessage(body, identifier));
            } else {
                console.log('There is such message, exiting...');
            }

            res.sendStatus(200);
        });
    });
})


let server = app.listen(8081, () => {
    let port = server.address().port
    console.log("App listening on port %s", port)
})
