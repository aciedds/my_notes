// src/shared/container.ts
import { PostgresDataSource } from '../data/datasource/postgres_data_source';
import { NoteRepositoryImpl } from '../data/repository/note_repository_impl';
import { CreateNoteUseCase } from '../domain/usecase/create_note';
import { GetAllNotesUseCase } from '../domain/usecase/get_all_notes';
import { EditNoteUseCase } from '../domain/usecase/edit_note';
import { DeleteNoteUseCase } from '../domain/usecase/delete_note';
import { GetNoteByIdUseCase } from '../domain/usecase/get_note_by_id';

const postgresDataSource = new PostgresDataSource();
const noteRepository = new NoteRepositoryImpl(postgresDataSource);

export const getAllNotesUseCase = new GetAllNotesUseCase(noteRepository);
export const createNoteUseCase = new CreateNoteUseCase(noteRepository);
export const editNoteUseCase = new EditNoteUseCase(noteRepository);
export const deleteNoteUseCase = new DeleteNoteUseCase(noteRepository);
export const getNoteByIdUseCase = new GetNoteByIdUseCase(noteRepository);