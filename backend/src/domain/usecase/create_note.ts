import { type Note } from '../entity/note';
import { type NoteRepository } from '../repository/note_repository';

export class CreateNoteUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(title: string, body: string): Promise<Note> {
    return this.noteRepository.createNote(title, body);
  }
}