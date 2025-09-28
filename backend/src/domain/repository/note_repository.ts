// src/domain/entity/note.ts
import { type Note } from '../entity/note';

export interface NoteRepository {
  createNote(title: string, body: string): Promise<Note>;
  editNote(id: string, title: string, body: string): Promise<Note>;
  getAllNotes(): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | null>;
  deleteNote(id: string): Promise<void>;
}