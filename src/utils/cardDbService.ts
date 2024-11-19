import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CardData {
  id: number;
  importPath: string;
  title: string | null;
  height: string;
  componentProps: any;
}

class CardDbService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(process.cwd(), 'src', 'data', 'CardRepository.db');
    this.db = new Database(dbPath, { readonly: true });
  }

  getAllCards(): CardData[] {
    const stmt = this.db.prepare('SELECT * FROM cards');
    const cards = stmt.all() as CardData[];
    return cards.map(card => ({
      ...card,
      componentProps: JSON.parse(card.componentProps)
    }));
  }

  public searchCards(query: string | null): CardData[] {
    console.log('[DB] Starting search with query:', query);
    const normalizedQuery = query?.toLowerCase().trim() || '';
    
    try {
      if (!normalizedQuery) {
        console.log('[DB] Empty query, returning all cards');
        return this.getAllCards();
      }
      
      // Use SQL LIKE for more efficient searching
      const stmt = this.db.prepare(`
        SELECT c.*
        FROM cards c
        WHERE LOWER(c.importPath) LIKE ?
           OR LOWER(json_extract(c.componentProps, '$.title')) LIKE ?
           OR LOWER(c.title) LIKE ?
        ORDER BY 
          CASE 
            WHEN LOWER(c.importPath) = ? THEN 1
            WHEN LOWER(json_extract(c.componentProps, '$.title')) = ? THEN 1
            WHEN LOWER(c.title) = ? THEN 1
            ELSE 2
          END,
          length(c.importPath)
      `);
      
      const searchPattern = `%${normalizedQuery}%`;
      const exactMatch = normalizedQuery;
      
      const cards = stmt.all(
        searchPattern,
        searchPattern,
        searchPattern,
        exactMatch,
        exactMatch,
        exactMatch
      ) as CardData[];
      
      console.log('[DB] Found cards:', cards.length);
      
      return cards.map(card => ({
        ...card,
        componentProps: JSON.parse(card.componentProps)
      }));
    } catch (error) {
      console.error('[DB] Error searching cards:', error);
      throw error;
    }
  }

  close() {
    this.db.close();
  }
}

export default CardDbService;
