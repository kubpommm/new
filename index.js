const express = require('express');
const app = express();
const fetch = require('node-fetch');

const REAL_WEBHOOK_URL = "https://discord.com/api/webhooks/1538562341044756585/B1d5bLJRrFFnWb37I3lQQ9TYN6weU0WVdYL4N-OdU377R1SrrtrXIj02iEWlJdwHujh_";
const disabledPlayers = ["Dandelion_myheartttt"];

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
            message: "ถูกปิดการใช้งานจากผู้พัฒนา!" 
        });
    }

   

    res.json({ allowed: true, message: "Success" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
