// --- 1. ตัวแปรเก็บสถานะของแต่ละคำสั่ง ---
let scareTriggers = {}; // เก็บสถานะของ Scare แยกตามชื่อผู้เล่น
let flingTriggers = {}; // เก็บสถานะของ Fling แยกตามชื่อผู้เล่น

// ==========================================
// 🔴 ส่วนของ JUMP SCARE
// ==========================================

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


// ==========================================
// 🔵 ส่วนของ FLING (กระเด็นขึ้นฟ้า) - เพิ่มใหม่ตรงนี้!
// ==========================================

// เมื่อบอท Discord สั่ง Fling
app.get('/api/trigger-fling', (req, res) => {
    let player = req.query.player;
    if (player) {
        flingTriggers[player] = true;
        res.json({ success: true, message: `Triggered fling for ${player}` });
    } else {
        res.status(400).json({ error: "Missing player name" });
    }
});

// Roblox เข้ามาเช็ค Fling
app.get('/api/check-fling', (req, res) => {
    let player = req.query.player;
    let isTriggered = flingTriggers[player] || false;
    res.json({ trigger: isTriggered });
});

// เคลียร์สถานะ Fling
app.get('/api/clear-fling', (req, res) => {
    let player = req.query.player;
    if (player) {
        flingTriggers[player] = false;
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Missing player name" });
    }
});
