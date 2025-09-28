// src/presentation/store/note_store.ts
import { defineStore } from 'pinia';
import type { Note } from '../../domain/entity/note';
import { NoteRepositoryImpl } from '../../data/repository/note_repository_impl';
import { GetAllNotesUseCase } from '../../domain/usecase/get_all_notes';
import { CreateNoteUseCase } from '../../domain/usecase/create_note';

// Inisialisasi use case
const noteRepository = new NoteRepositoryImpl();
const getAllNotesUseCase = new GetAllNotesUseCase(noteRepository);
const createNoteUseCase = new CreateNoteUseCase(noteRepository);

export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: [] as Note[],
    isLoading: false, // Untuk memuat daftar catatan
    isAdding: false, // Untuk proses menambah catatan
    error: null as string | null,
  }),
  actions: {
    async fetchNotes() {
      this.isLoading = true;
      try {
        this.notes = await getAllNotesUseCase.execute();
        this.error = null;
      } catch (e) {
        this.error = 'Gagal memuat catatan.';
      } finally {
        this.isLoading = false;
      }
    },
    async addNote(title: string, body: string) {
      this.isAdding = true;
      this.error = null;
      try {
        const newNote = await createNoteUseCase.execute(title, body);
        this.notes.unshift(newNote); // Tambahkan catatan baru di awal daftar
      } catch (e) {
        this.error = 'Gagal menambah catatan. Silakan coba lagi.';
      } finally {
        this.isAdding = false;
      }
    },
  },
});