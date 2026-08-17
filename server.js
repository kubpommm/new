const express = require('express');
const app = express();

app.use(express.json());

// ⚠️ ใส่ลิงก์ Discord Webhook จริงของคุณที่นี่
const REAL_WEBHOOK_URL = "https://discord.com/api/webhooks/1538562341044756585/B1d5bLJRrFFnWb37I3lQQ9TYN6weU0WVdYL4N-OdU377R1SrrtrXIj02iEWlJdwHujh_";

// ⚠️ รายชื่อคนที่ต้องการ "ปิดการใช้งานสคริปต์"
const disabledPlayers = ["ชื่อคนที่จะปิดการใช้งาน"];

// API สำหรับเช็คสถานะและส่ง Webhook
app.post('/api/check-status', async (req, res) => {
    const playerName = req.body.player;

    if (!playerName) {
        return res.status(400).json({ allowed: false, error: "Missing player name" });
    }

    // 1. เช็คว่าชื่อนี้โดนแบนไหม
    if (disabledPlayers.includes(playerName)) {
        return res.json({ 
            allowed: false, 
            message: "สคริปต์ของคุณถูกปิดการใช้งานจากผู้พัฒนา!" 
        });
    }

    // 2. ส่งข้อความเข้า Discord Webhook
    const messageContent = `🚀 มีผู้เล่นชื่อ: **${playerName}** กำลังใช้งานสคริปต์ของคุณ!`;

    try {
        await fetch(REAL_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: messageContent })
        });

        res.json({ allowed: true, message: "Success" });
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ allowed: false, error: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
