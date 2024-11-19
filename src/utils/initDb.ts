import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'src', 'data', 'CardRepository.db');

// Ensure the data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const db = new Database(dbPath);

// Create cards table
db.exec(`
  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    importPath TEXT NOT NULL,
    title TEXT,
    height TEXT NOT NULL,
    componentProps TEXT NOT NULL
  );
`);

// Load initial data from SelectedCards.json
const selectedCardsPath = path.join(process.cwd(), 'src', 'data', 'SelectedCards.json');
const selectedCards = JSON.parse(fs.readFileSync(selectedCardsPath, 'utf-8'));

// Insert initial data
const insert = db.prepare(`
  INSERT INTO cards (importPath, title, height, componentProps)
  VALUES (@importPath, @title, @height, @componentProps)
`);

// Begin transaction
const insertMany = db.transaction((cards) => {
  for (const card of cards) {
    insert.run({
      importPath: card.importPath,
      title: card.title || null,
      height: card.height,
      componentProps: JSON.stringify(card.componentProps)
    });
  }
});

// Check if data already exists
const count = db.prepare('SELECT COUNT(*) as count FROM cards').get();
if (count.count === 0) {
  insertMany(selectedCards.cards);
  console.log('Initial data loaded into database');
}

db.close();
