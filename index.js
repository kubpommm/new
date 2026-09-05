const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

let scareStatus = {};
let flingStatus = {}; // เก็บสถานะการกระเด็น (Fling) แยกตามชื่อผู้เล่น

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`[Bot] Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();

    -- 1. คำสั่ง Jump Scare เดิม
    if (command === '!scare') {
        const targetPlayer = args[0];
        if (!targetPlayer) {
            return message.reply('❌ กรุณาระบุชื่อผู้เล่นด้วย เช่น `!scare PlayerName`');
        }

        scareStatus[targetPlayer] = true;
        message.reply(`👻 สั่ง Jump Scare ใส่ผู้เล่น **${targetPlayer}** เรียบร้อยแล้ว!`);
    }

    -- 2. คำสั่ง Fling เพิ่มเข้ามาใหม่
    else if (command === '!fling') {
        const targetPlayer = args[0];
        if (!targetPlayer) {
            return message.reply('❌ กรุณาระบุชื่อผู้เล่นด้วย เช่น `!fling PlayerName`');
        }

        flingStatus[targetPlayer] = true;
        message.reply(`💨 สั่งดีดตัวผู้เล่น **${targetPlayer}** ขึ้นฟ้าแล้ว!`);
    }
});

-- API สำหรับ Jump Scare
app.get('/api/check-scare', (req, res) => {
    const player = req.query.player;
    if (!player) return res.json({ trigger: false });

    const isTriggered = scareStatus[player] || false;
    res.json({ trigger: isTriggered });
});

app.get('/api/clear-scare', (req, res) => {
    const player = req.query.player;
    if (player) {
        scareStatus[player] = false;
    }
    res.json({ success: true });
});

-- API สำหรับ Fling (เพิ่มเข้ามาใหม่)
app.get('/api/check-fling', (req, res) => {
    const player = req.query.player;
    if (!player) return res.json({ trigger: false });

    const isTriggered = flingStatus[player] || false;
    res.json({ trigger: isTriggered });
});

app.get('/api/clear-fling', (req, res) => {
    const player = req.query.player;
    if (player) {
        flingStatus[player] = false;
    }
    res.json({ success: true });
});

app.get('/', (req, res) => {
    res.send('Discord Scare & Fling Bot is running!');
});

app.listen(PORT, () => {
    console.log(`[Server] Server is running on port ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
