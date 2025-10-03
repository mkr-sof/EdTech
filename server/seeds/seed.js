const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
});

const seed = async () => {
    const sql = `
CREATE TABLE IF NOT EXISTS ideas (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    votes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS voters (
    ip TEXT PRIMARY KEY,
    votes_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    idea_id INTEGER NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    ip TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(idea_id, ip)
);

INSERT INTO ideas (title, description) VALUES
('Logic Adventure Quests', 'Create a series of engaging quests and challenges to develop logical thinking in children.'),
('Adaptive Difficulty Levels', 'Automatically adjust tasks to match each child’s knowledge level and progress.'),
('Gamified Tournaments', 'Host online tournaments and competitions for kids around the world.'),
('Parent Analytics Dashboard', 'Provide parents with a dashboard showing progress, insights, and personalized recommendations.'),
('Personalized Avatars', 'Allow kids to customize characters and avatars as rewards for completing tasks.'),
('International Platform', 'Add multilingual support to expand into new markets.'),
('AI Learning Companion', 'Integrate an AI tutor to give hints, tips, and explanations tailored to each child.'),
('Offline Mode', 'Allow children to access lessons and games without an internet connection.'),
('Achievement Collections', 'Introduce badges, trophies, and achievement tracking to motivate kids.'),
('Creative Puzzle Builder', 'Enable kids to create their own puzzles and challenges for peers to solve.'),
('Daily Brain Workout', 'Offer daily mini-challenges to keep kids engaged consistently.'),
('Social Learning Circles', 'Create safe online groups where kids can collaborate and compete with friends.');
    `;
    try{
        await pool.query('BEGIN');
        await pool.query(sql);
        await pool.query('COMMIT');
        console.log('Database seeded successfully');
    }catch(err){
        await pool.query('ROLLBACK');
        throw err;
    }finally{
        await pool.end();
    }

}
seed();




