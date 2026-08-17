const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// ⚠️ ใส่ลิงก์ Discord Webhook จริงของคุณที่นี่
const REAL_WEBHOOK_URL = "ใส่ลิงก์_Discord_Webhook_ของคุณที่นี่";

// ⚠️ รายชื่อคนที่ต้องการ "ปิดการใช้งานสคริปต์" (ใส่ชื่อ Roblox ของคนนั้นลงไป)
const disabledPlayers = ["ชื่อคนที่จะปิดการใช้งาน"];

// API สำหรับเช็คสถานะและรับข้อมูลจากเกม
app.post('/api/check-status', async (req, res) => {
    const playerName = req.body.player;

    if (!playerName) {
        return res.status(400).json({ allowed: false, error: "Missing player name" });
    }

    // 1. เช็คว่าชื่อนี้อยู่ในรายชื่อที่ถูกสั่งปิดไหม
    if (disabledPlayers.includes(playerName)) {
        return res.json({ 
            allowed: false, 
            message: "สคริปต์ของคุณถูกปิดการใช้งานจากผู้พัฒนา!" 
        });
    }

    // 2. ถ้าปกติ ให้ส่งเข้า Discord Webhook และอนุญาตให้ใช้งานต่อ
    const messageContent = `🚀 มีผู้เล่นชื่อ: **${playerName}** กำลังใช้งานสคริปต์ของคุณ!`;

    try {
        await fetch(REAL_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: messageContent })
        });

        res.json({ allowed: true, message: "Success" });
    } catch (error) {
        res.status(500).json({ allowed: false, error: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});