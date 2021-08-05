require('dotenv').config()
const express = require("express");
const router = express.Router();
const app = express();

// TODO - don't send message if it already exists on Discord

const Discord = require('discord.js');
const client = new Discord.Client();

app.use(express.urlencoded({ extended: true }));
app.use("/", router, express.json());

client.login(`${process.env.DISCORD_TOKEN}`);

function createVersionUpdateMessage(body) {
    // Parse text from WUD
    const containerName = body.name
    const currentVersion = body.image.tag.value
    const updateVersion = body.result.tag

    const message = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('New docker image version detected!')
	.setDescription(`Container: ${containerName}`)
	.setThumbnail('https://www.docker.com/sites/default/files/d8/2019-07/vertical-logo-monochromatic.png')
	.addFields(
		{ name: 'Current version', value: `${currentVersion}`, inline: true },
        { name: '\u200B', value: '→', inline: true },
		{ name: 'New version', value: `${updateVersion}`, inline: true },
	)
	.setTimestamp();

    return message;
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    server = client.guilds.cache.find(g => g.name === `${process.env.SERVER_NAME}`);
    channel = server.channels.cache.find(ch => ch.name === `${process.env.CHANNEL_NAME}`);

    app.post('/new-version', (req, res) => {
        channel.send(createVersionUpdateMessage(req.body));

        console.log('Msg sent');
        res.sendStatus(200);
    });
})


let server = app.listen(8081, () => {
    let port = server.address().port
    console.log("App listening on port %s", port)
})
