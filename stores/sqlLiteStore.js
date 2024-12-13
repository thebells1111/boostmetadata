const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./metadata.db");

// Initialize the database table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS metadata (
      id TEXT PRIMARY KEY,
      jpt TEXT NOT NULL,
      type TEXT NOT NULL
    )
  `);
});

module.exports = {
  add: (metadata) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO metadata (id, jpt, type) VALUES (?, ?, ?)`;
      db.run(query, [metadata.id, metadata.jpt, metadata.type], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM metadata`;
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM metadata WHERE id = ?`;
      db.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0); // `this.changes` indicates the number of rows affected
      });
    });
  },
};
