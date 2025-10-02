require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 4000;

//middlewares
app.use(cors());
app.use(express.json());
// Enable 'trust proxy' to get the correct client IP address when behind a proxy
app.set('trust proxy', true);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

function normalizeIp(raw){
    if(!raw) return 'unknown'; //or null?
    const ip = raw.split(',')[0].trim();
    return ip.startsWith('::ffff:') ? ip.split('::ffff:')[1] : ip;
}

// Routes
app.get('/api/ideas', async (req, res) => {
    const rawIp = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
    const ip = normalizeIp(rawIp);

    try{
        const q = 
        `
        SELECT idea.id, idea.title, idea.description, idea.votes_count,
        EXISTS (SELECT 1 FROM votes vote Where vote.idea_id = idea.id AND vote.ip = $1)
        AS voted from ideas idea
        ORDER BY idea.votes_count DESC, idea.id;
        `;
        const {rows} = await pool.query(q, [ip]);
        res.json(rows);
    }catch (err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/ideas/:id/vote', async (req, res) => {
    const ideaId = parseInt(req.params.id, 10);
    if (Number.isNaN(ideaId)) return res.status(400).jsin({ error: 'bad_idea_id' });

    const rawIp = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
    const ip = normalizeIp(rawIp);

    try {
        await pool.query('BEGIN');
        await pool.query('INSERT INTO votes (idea_id, ip) VALUES ($1, $2)', [ideaId, ip]);
        await pool.query('COMMIT');
        await pool.query('UPDATE ideas SET votes_count = votes_count + 1 WHERE id = $1', [ideaId]);

        return res.json({success: true});
    }catch (err){
        if (err.code === '23505'){ //unique_violation
            return res.status(409).json({error: 'alredy_voted'})};

            if(err.message && err.message.includes('vote_limit_exceeded')) {
                return res.status(409).json({error: 'vote_limit_exceeded'});
            }
            console.error('DB error:', err);
            return res.status(500).json({error: 'internal_error'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

