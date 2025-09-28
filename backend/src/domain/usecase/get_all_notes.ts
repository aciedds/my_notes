import { type Note } from '../entity/note';
import { type NoteRepository } from '../repository/note_repository';

export class GetAllNotesUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(): Promise<Note[]> {
    return this.noteRepository.getAllNotes();
  }
}