// src/domain/usecase/create_note.ts
import type { Note } from '../entity/note';
import type { NoteRepository } from '../repository/note_repository';

export class CreateNoteUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  execute(title: string, body: string): Promise<Note> {
    return this.noteRepository.createNote(title, body);
  }
}