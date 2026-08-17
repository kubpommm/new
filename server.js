const express = require('express');
const app = express();

-- 🛑 รายชื่อ Username ที่ต้องการแบน/ปิดการใช้งาน
const disabledPlayers = ["banpalyer"];

app.get('/api/check-ban', (req, res) => {
    const playerName = req.query.player;

    if (!playerName) {
        return res.json({ allowed: true });
    }

    // ถ้าชื่อตรงกับคนโดนแบน ส่งคำสั่งบล็อกกลับไป
    if (disabledPlayers.includes(playerName)) {
        return res.json({ 
            allowed: false, 
            message: "สคริปต์ถูกปิดการใช้งานจากผู้พัฒนา" 
        });
    }

    // ถ้าปกติ อนุญาตให้เล่นต่อ
    res.json({ allowed: true, message: "Success" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Ban-check server is running on port ${PORT}`);
});
