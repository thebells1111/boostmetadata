import sqlite3 from "sqlite3";

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

export const add = (metadata) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO metadata (id, jpt, type) VALUES (?, ?, ?)`;
    db.run(query, [metadata.id, metadata.jpt, metadata.type], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const getAll = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM metadata`;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const get = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM metadata WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const save = (metadata) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO metadata (id, jpt, type)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        jpt = excluded.jpt,
        type = excluded.type
    `;
    db.run(query, [metadata.id, metadata.jpt, metadata.type], (err) => {
      if (err) reject(err);
      else resolve(metadata);
    });
  });
};

export const update = (id, updatedData) => {
  return new Promise((resolve, reject) => {
    const updates = [];
    const values = [];

    if (updatedData.jpt !== undefined) {
      updates.push("jpt = ?");
      values.push(updatedData.jpt);
    }
    if (updatedData.type !== undefined) {
      updates.push("type = ?");
      values.push(updatedData.type);
    }

    values.push(id);

    const query = `
      UPDATE metadata
      SET ${updates.join(", ")}
      WHERE id = ?
    `;

    db.run(query, values, function (err) {
      if (err) reject(err);
      else resolve(this.changes > 0 ? get(id) : null);
    });
  });
};

export const deleteMetadata = (id) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM metadata WHERE id = ?`;
    db.run(query, [id], function (err) {
      if (err) reject(err);
      else resolve(this.changes > 0); // `this.changes` indicates the number of rows affected
    });
  });
};
