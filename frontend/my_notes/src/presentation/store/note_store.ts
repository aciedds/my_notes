import { defineStore } from 'pinia';
import type { Note } from '../../domain/entity/note';
import { NoteRepositoryImpl } from '../../data/repository/note_repository_impl';
import { GetAllNotesUseCase } from '../../domain/usecase/get_all_notes';
import { CreateNoteUseCase } from '../../domain/usecase/create_note';
import { EditNoteUseCase } from '../../domain/usecase/edit_note';
import { DeleteNoteUseCase } from '../../domain/usecase/delete_note';
import { GetNoteByIdUseCase } from '../../domain/usecase/get_note_by_id';

// Inisialisasi use case
const noteRepository = new NoteRepositoryImpl();
const getAllNotesUseCase = new GetAllNotesUseCase(noteRepository);
const createNoteUseCase = new CreateNoteUseCase(noteRepository);
const editNoteUseCase = new EditNoteUseCase(noteRepository);
const deleteNoteUseCase = new DeleteNoteUseCase(noteRepository);
const getNoteByIdUseCase = new GetNoteByIdUseCase(noteRepository);

export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: [] as Note[],
    isLoading: false,       // Untuk memuat daftar catatan awal
    isProcessing: false,    // Untuk aksi (tambah, edit, hapus)
    isFetchingDetails: false, // Untuk mengambil detail catatan sebelum edit
    error: null as string | null,
  }),
  actions: {
    async fetchNotes() {
      this.isLoading = true;
      this.error = null;
      try {
        this.notes = await getAllNotesUseCase.execute();
      } catch (e) {
        this.error = 'Gagal memuat catatan.';
      } finally {
        this.isLoading = false;
      }
    },
    
    async addNote(title: string, body: string) {
      this.isProcessing = true;
      this.error = null;
      try {
        const newNote = await createNoteUseCase.execute(title, body);
        this.notes.unshift(newNote);
      } catch (e) {
        this.error = 'Gagal menambah catatan. Silakan coba lagi.';
      } finally {
        this.isProcessing = false;
      }
    },

    async editNote (id: string, title: string, body: string) {
      this.isProcessing = true;
      this.error = null;
      try {
        const updatedNote = await editNoteUseCase.execute(id, title, body);
        const noteIndex = this.notes.findIndex((note) => note.id === id);
        if (noteIndex !== -1) {
          this.notes[noteIndex] = updatedNote;
        }
      } catch (e) {
        this.error = 'Gagal memperbarui catatan. Silakan coba lagi.';
      } finally {
        this.isProcessing = false;
      }
    },

    async deleteNote(id: string) {
      this.isProcessing = true;
      this.error = null;
      try {
        await deleteNoteUseCase.execute(id);
        this.notes = this.notes.filter((note) => note.id !== id);
      } catch (e) {
        this.error = 'Gagal menghapus catatan. Silakan coba lagi.';
      } finally {
        this.isProcessing = false;
      }
    },

    async getNoteById(id: string): Promise<Note | undefined> {
      this.isFetchingDetails = true;
      this.error = null;
      try {
        const note = await getNoteByIdUseCase.execute(id);
        return note ?? undefined;
      } catch (e) {
        this.error = 'Gagal mendapatkan detail catatan. Silakan coba lagi.';
      } finally {
        this.isFetchingDetails = false;
      }
    },
  },
});