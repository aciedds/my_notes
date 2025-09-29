import type { Note } from '../entity/note';
import type { NoteRepository } from '../repository/note_repository';

export class DeleteNoteUseCase {
  constructor(private noteRepository: NoteRepository) {}
  async execute(id: string): Promise<void> {
    return this.noteRepository.deleteNote(id);
  }
}