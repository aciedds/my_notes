// src/domain/repository/note_repository.ts
import type { Note } from '../entity/note';

export interface NoteRepository {
  createNote(title: string, body: string): Promise<Note>;
  getAllNotes(): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | null>;
  editNote(id: string, title: string, body: string): Promise<Note>;
  deleteNote(id: string): Promise<void>;
}