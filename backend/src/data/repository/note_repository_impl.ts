// src/data/repository/note_repository_impl.ts
import { type Note } from '../../domain/entity/note';
import { type NoteRepository } from '../../domain/repository/note_repository';
import { PostgresDataSource } from '../datasource/postgres_data_source';
import { v4 as uuidv4 } from 'uuid'; // Kita butuh library untuk generate ID unik

// jalankan: npm install uuid && npm install @types/uuid --save-dev

export class NoteRepositoryImpl implements NoteRepository {
  constructor(private readonly dataSource: PostgresDataSource) {}

  async getAllNotes(): Promise<Note[]> {
    const result = await this.dataSource.query('SELECT * FROM notes ORDER BY "createdAt" DESC');
    return result.rows;
  }

  async createNote(title: string, body: string): Promise<Note> {
    const newNote: Note = {
      id: uuidv4(),
      title,
      body,
      createdAt: new Date(),
    };

    const queryText = 'INSERT INTO notes(id, title, body, "createdAt") VALUES($1, $2, $3, $4) RETURNING *';
    const values = [newNote.id, newNote.title, newNote.body, newNote.createdAt];

    const result = await this.dataSource.query(queryText, values);
    return result.rows[0];
  }

  async editNote(id: string, title: string, body: string): Promise<Note> {
    const queryText = 'UPDATE notes SET title = $1, body = $2 WHERE id = $3 RETURNING *';
    const values = [title, body, id];

    const result = await this.dataSource.query(queryText, values);
    return result.rows[0];
  }

  async getNoteById(id: string): Promise<Note | null> {
    const queryText = 'SELECT * FROM notes WHERE id = $1';
    const values = [id];

    const result = await this.dataSource.query(queryText, values);
    return result.rows[0] || null;
  }

  async deleteNote(id: string): Promise<void> {
    const queryText = 'DELETE FROM notes WHERE id = $1';
    const values = [id];

    await this.dataSource.query(queryText, values);
  }
}