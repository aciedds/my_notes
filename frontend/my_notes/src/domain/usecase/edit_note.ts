import type { Note } from "../entity/note";
import type { NoteRepository } from "../repository/note_repository";

export class EditNoteUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute(id: string, title: string, body: string): Promise<Note> {
    return this.noteRepository.editNote(id, title, body);
  }
}