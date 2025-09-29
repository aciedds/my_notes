// src/data/repository/note_repository_impl.ts
import type { Note } from '../../domain/entity/note';
import type { NoteRepository } from '../../domain/repository/note_repository';
import { getAllNotesApi, createNoteApi , editNoteApi, deleteNoteApi, getNoteByIdApi} from '../datasource/api_data_source';

export class NoteRepositoryImpl implements NoteRepository {
  async getAllNotes(): Promise<Note[]> {
    return getAllNotesApi();
  }

  async createNote(title: string, body: string): Promise<Note> {
    return createNoteApi(title, body);
  }

  async editNote(id: string, title: string, body: string): Promise<Note> {
    return editNoteApi(id, title, body);
  }

  async getNoteById(id: string): Promise<Note | null> {
    return getNoteByIdApi(id);
  }

  async deleteNote(id: string): Promise<void> {
    return deleteNoteApi(id);
  }
}