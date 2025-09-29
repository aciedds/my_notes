<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useNoteStore } from '../store/note_store';
import { storeToRefs } from 'pinia';
import type { Note } from '../../domain/entity/note'; // Impor tipe Note untuk konsistensi

// --- Pinia Store Setup ---
const noteStore = useNoteStore();
const { notes, isLoading, isProcessing, isFetchingDetails, error } = storeToRefs(noteStore);

// --- State Lokal Komponen ---
const newTitle = ref('');
const newBody = ref(''); // Diubah dari newContent

const editingNoteId = ref<string | null>(null);
const editingTitle = ref('');
const editingBody = ref(''); // Diubah dari editingContent

const noteToDelete = ref<{ id: string; title: string } | null>(null);

const loadingDetailsId = ref<string | null>(null);

// --- Lifecycle Hook ---
onMounted(() => {
  noteStore.fetchNotes();
});

// --- Handlers ---
const handleAddNote = async () => {
  // Menggunakan newBody
  if (!newTitle.value || !newBody.value) return;
  // Mengirim newBody
  await noteStore.addNote(newTitle.value, newBody.value);
  if (!noteStore.error) {
    newTitle.value = '';
    newBody.value = '';
  }
};

// Menggunakan tipe Note langsung dari domain
const startEditing = (note: Note) => {
  editingNoteId.value = note.id;
  editingTitle.value = note.title;
  editingBody.value = note.body; // Menggunakan note.body
};

const handleStartEditing = async (noteId: string) => {
  loadingDetailsId.value = noteId;
  try {
    const noteToEdit = await noteStore.getNoteById(noteId);
    if (noteToEdit) {
      startEditing(noteToEdit);
    }
  } finally {
    loadingDetailsId.value = null;
  }
};

const cancelEditing = () => {
  editingNoteId.value = null;
};

const saveEdit = () => {
  if (!editingNoteId.value) return;
  // Mengirim editingBody
  noteStore.editNote(editingNoteId.value, editingTitle.value, editingBody.value);
  editingNoteId.value = null;
};

const openDeleteModal = (note: Note) => {
  noteToDelete.value = { id: note.id, title: note.title };
};

const closeDeleteModal = () => {
  noteToDelete.value = null;
};

const confirmDelete = () => {
  if (!noteToDelete.value) return;
  noteStore.deleteNote(noteToDelete.value.id);
  closeDeleteModal();
};
</script>

<template>
  <div class="container">
    <h1>📝 Aplikasi Catatan Vue & Pinia</h1>

    <div v-if="error" class="error-box">{{ error }}</div>
    
    <form @submit.prevent="handleAddNote" class="note-form">
      <input 
        v-model="newTitle" 
        placeholder="Judul Catatan" 
        required 
        :disabled="isProcessing" 
      />
      <textarea 
        v-model="newBody" placeholder="Tulis catatanmu di sini..." 
        rows="4"
        required 
        :disabled="isProcessing"
      ></textarea>
      
      <button type="submit" :disabled="isProcessing">
        {{ isProcessing ? 'Memproses...' : 'Tambah Catatan' }}
      </button>
    </form>

    <div v-if="isLoading" class="loading">Memuat catatan... ⏳</div>

    <div v-else>
      <ul v-if="notes.length > 0" class="note-list">
        <li v-for="note in notes" :key="note.id" class="note-card">

          <div v-if="editingNoteId === note.id" class="edit-form">
            <input v-model="editingTitle" class="edit-input" placeholder="Judul" />
            <textarea v-model="editingBody" class="edit-textarea" rows="4" placeholder="Konten"></textarea> <div class="edit-actions">
              <button @click="saveEdit" class="action-button save-button">Simpan</button>
              <button @click="cancelEditing" class="action-button cancel-button">Batal</button>
            </div>
          </div>
          
          <template v-else>
            <div class="note-content">
              <h3>{{ note.title }}</h3>
              <p>{{ note.body }}</p> <small>Dibuat pada: {{ new Date(note.createdAt).toLocaleString('id-ID') }}</small>
            </div>
            <div class="note-actions">
              <button 
                class="action-button edit-button" 
                @click="handleStartEditing(note.id)"
                :disabled="isFetchingDetails"
              >
                <span v-if="loadingDetailsId === note.id">⏳</span>
                <span v-else>✏️ Edit</span>
              </button>
              <button 
                class="action-button delete-button" 
                @click="openDeleteModal(note)"
                :disabled="isFetchingDetails"
              >
                🗑️ Hapus
              </button>
            </div>
          </template>

        </li>
      </ul>
      <div v-else class="empty-state">
        <p>Belum ada catatan. Silakan buat yang pertama!</p>
      </div>
    </div>
  </div>

  <div v-if="noteToDelete" class="modal-overlay" @click.self="closeDeleteModal">
    <div class="modal-box">
      <h3>Konfirmasi Hapus</h3>
      <p>Apakah Anda yakin ingin menghapus catatan berjudul "<strong>{{ noteToDelete.title }}</strong>"?</p>
      <div class="modal-actions">
        <button @click="closeDeleteModal" class="action-button cancel-button">Batal</button>
        <button @click="confirmDelete" class="action-button delete-button">Ya, Hapus</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style tidak ada perubahan, jadi tetap sama */
.container { max-width: 700px; margin: 2rem auto; padding: 1rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; border-radius: 12px; }
h1 { text-align: center; color: #2c3e50; }
.note-form { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
input, textarea { padding: 0.75rem; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; font-family: inherit; }
textarea { resize: vertical; }
button { padding: 0.75rem; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: bold; transition: background-color 0.2s, transform 0.1s; }
button:hover { transform: translateY(-2px); }
button:disabled { background-color: #bdc3c7; cursor: not-allowed; transform: none; }
form button { background-color: #41b883; }
form button:hover:enabled { background-color: #34a06f; }
.loading, .empty-state { text-align: center; font-size: 1.2rem; color: #7f8c8d; padding: 2rem; }
.note-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.25rem; }
.note-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: box-shadow 0.3s; }
.note-card:hover { box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
.note-card, .edit-form { display: flex; justify-content: space-between; align-items: flex-start; }
.note-content { flex-grow: 1; margin-right: 1rem; }
.note-content h3 { margin-top: 0; }
.note-content p { white-space: pre-wrap; word-break: break-word; }
.note-content small { color: #95a5a6; }
.note-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
.action-button { padding: 0.5rem 1rem; font-size: 0.9rem; }
.edit-button { background-color: #f39c12; }
.edit-button:hover:enabled { background-color: #e67e22; }
.delete-button { background-color: #e74c3c; }
.delete-button:hover:enabled { background-color: #c0392b; }
.error-box { background-color: #ffdddd; border: 1px solid #ff0000; color: #D8000C; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; }
.edit-form { width: 100%; flex-direction: column; }
.edit-input, .edit-textarea { width: 100%; margin-bottom: 0.75rem; box-sizing: border-box; }
.edit-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
.save-button { background-color: #2980b9; }
.save-button:hover:enabled { background-color: #2471a3; }
.cancel-button { background-color: #7f8c8d; }
.cancel-button:hover:enabled { background-color: #616A6B; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-box { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 90%; max-width: 400px; text-align: center; }
.modal-box h3 { margin-top: 0; }
.modal-actions { margin-top: 1.5rem; display: flex; justify-content: center; gap: 1rem; }
</style>