let scareTriggers = {}; // เก็บสถานะของ Scare แยกตามชื่อผู้เล่น

// เมื่อบอท Discord สั่ง Jumpscare
app.get('/api/trigger-scare', (req, res) => {
    let player = req.query.player;
    if (player) {
        scareTriggers[player] = true;
        res.json({ success: true, message: `Triggered scare for ${player}` });
    } else {
        res.status(400).json({ error: "Missing player name" });
    }
});

// Roblox เข้ามาเช็ค Jump Scare
app.get('/api/check-scare', (req, res) => {
    let player = req.query.player;
    let isTriggered = scareTriggers[player] || false;
    res.json({ trigger: isTriggered });
});

// เคลียร์สถานะ Jump Scare
app.get('/api/clear-scare', (req, res) => {
    let player = req.query.player;
    if (player) {
        scareTriggers[player] = false;
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Missing player name" });
    }
});
