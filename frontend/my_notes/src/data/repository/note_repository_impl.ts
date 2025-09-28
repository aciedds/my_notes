// src/data/repository/note_repository_impl.ts
import type { Note } from '../../domain/entity/note';
import type { NoteRepository } from '../../domain/repository/note_repository';
import { getAllNotesApi, createNoteApi } from '../datasource/api_data_source';

export class NoteRepositoryImpl implements NoteRepository {
  async getAllNotes(): Promise<Note[]> {
    return getAllNotesApi();
  }

  async createNote(title: string, body: string): Promise<Note> {
    return createNoteApi(title, body);
  }
}