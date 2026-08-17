const express = require('express');
const app = express();

const REAL_WEBHOOK_URL = "https://discord.com/api/webhooks/1538562341044756585/B1d5bLJRrFFnWb37I3lQQ9TYN6weU0WVdYL4N-OdU377R1SrrtrXIj02iEWlJdwHujh_";
const disabledPlayers = ["ชื่อคนที่จะปิดการใช้งาน"];

// เปลี่ยนจาก app.post เป็น app.get เพื่อให้ Roblox ยิงลิงก์ตรงๆ ได้ง่ายขึ้น
app.get('/api/check-status', async (req, res) => {
    const playerName = req.query.player; // รับชื่อผ่านลิงก์ เช่น ?player=ชื่อคนเล่น

    if (!playerName) {
        return res.json({ allowed: false, error: "Missing player name" });
    }

    if (disabledPlayers.includes(playerName)) {
        return res.json({ 
            allowed: false, 
            message: "สคริปต์ของคุณถูกปิดการใช้งานจากผู้พัฒนา!" 
        });
    }

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
