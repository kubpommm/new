const express = require('express');
const app = express();
const fetch = require('node-fetch');

const REAL_WEBHOOK_URL = "https://discord.com/api/webhooks/1538562341044756585/B1d5bLJRrFFnWb37I3lQQ9TYN6weU0WVdYL4N-OdU377R1SrrtrXIj02iEWlJdwHujh_";
const disabledPlayers = ["Dandelion_myheart"];

const notifiedPlayers = new Set();

app.get('/api/check-status', async (req, res) => {
    const playerName = req.query.player;
    const displayName = req.query.displayName || playerName;
    const userId = req.query.userId || "Unknown";
    const gameId = req.query.gameId || "Unknown";
    const jobId = req.query.jobId || "Unknown";

    if (!playerName) return res.json({ allowed: false });

    // 1. เช็คว่าโดนแบนไหม
    if (disabledPlayers.includes(playerName)) {
        return res.json({ 
            allowed: false, 
            message: "สคริปต์ของคุณถูกปิดการใช้งานจากผู้พัฒนา!" 
        });
    }

    // 2. ถ้ายังไม่เคยแจ้งเตือน ให้ส่ง Discord Embed สวยๆ
    if (!notifiedPlayers.has(playerName)) {
        const gameLink = `https://www.roblox.com/games/${gameId}`;
        const messageContent = `**👤 Name:**\n# ${displayName}`;

        const embedsData = [
            {
                "title": "🚀 มีคนรันสคริปต์แล้ว!",
                "color": 65280, // สีเขียว
                "fields": [
                    {
                        "name": "👤 Username:",
                        "value": playerName,
                        "inline": true
                    },
                    {
                        "name": "🆔 User ID:",
                        "value": String(userId),
                        "inline": true
                    },
                    {
                        "name": "🌐 ลิงก์เกม:",
                        "value": `[คลิกเพื่อเข้าเกม](${gameLink})`,
                        "inline": false
                    },
                    {
                        "name": "🔑 รหัสเซิร์ฟเวอร์ (JobId):",
                        "value": "```lua\ngame:GetService('TeleportService'):TeleportToPlaceInstance(" + gameId + ", \"" + jobId + "\", game.Players.LocalPlayer)\n```",
                        "inline": false
                    }
                ],
                "footer": {
                    "text": "ระบบติดตามการใช้งานสคริปต์ผ่านเซิร์ฟเวอร์กลาง"
                },
                "timestamp": new Date().toISOString()
            }
        ];

        try {
            await fetch(REAL_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: messageContent,
                    embeds: embedsData
                })
            });
            notifiedPlayers.add(playerName);
        } catch (err) {
            console.error("Webhook Error:", err);
        }
    }

    res.json({ allowed: true, message: "Success" });
});

setInterval(() => {
    notifiedPlayers.clear();
}, 3600000); // รีเซ็ตทุกๆ 1 ชั่วโมง

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
