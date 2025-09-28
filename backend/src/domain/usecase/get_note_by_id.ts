import {type Note} from '../entity/note';
import {type NoteRepository} from '../repository/note_repository';

export class GetNoteByIdUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}
  async execute(id: string): Promise<Note | null> {
    return this.noteRepository.getNoteById(id);
  }
}