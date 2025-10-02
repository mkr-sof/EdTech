// check.js
const { Pool } = require('pg');
const pool = new Pool({ user:'postgres', database:'edtech', password:'Mkr-sof407559' });
(async () => {
  const res = await pool.query('SELECT id, title FROM ideas ORDER BY id;');
  console.log(res.rows);
  await pool.end();
})();
