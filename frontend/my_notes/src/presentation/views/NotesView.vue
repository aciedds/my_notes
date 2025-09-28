<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useNoteStore } from '../store/note_store';
import { storeToRefs } from 'pinia';

const noteStore = useNoteStore();
const { notes, isLoading, isAdding, error } = storeToRefs(noteStore);

const newTitle = ref('');
const newBody = ref('');

// Ambil data saat komponen pertama kali dimuat
onMounted(() => {
  noteStore.fetchNotes();
});

const handleSubmit = async () => {
  if (!newTitle.value || !newBody.value) return;

  await noteStore.addNote(newTitle.value, newBody.value);
  
  // Reset form hanya jika penambahan berhasil (tidak ada error)
  if (!noteStore.error) {
    newTitle.value = '';
    newBody.value = '';
  }
};
</script>

<template>
  <div class="container">
    <h1>📝 Aplikasi Catatan Vue</h1>

    <div v-if="error" class="error-box">{{ error }}</div>
    
    <form @submit.prevent="handleSubmit" class="note-form">
      <input 
        v-model="newTitle" 
        placeholder="Judul Catatan" 
        required 
        :disabled="isAdding" 
      />
      <textarea 
        v-model="newBody" 
        placeholder="Tulis catatanmu di sini..." 
        required 
        :disabled="isAdding"
      ></textarea>
      
      <button type="submit" :disabled="isAdding">
        {{ isAdding ? 'Menyimpan...' : 'Tambah Catatan' }}
      </button>
    </form>

    <div v-if="isLoading" class="loading">Memuat catatan...</div>

    <div v-else class="notes-grid">
      <div v-for="note in notes" :key="note.id" class="note-card">
        <h3>{{ note.title }}</h3>
        <p>{{ note.body }}</p>
        <small>{{ new Date(note.createdAt).toLocaleString('id-ID') }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}
.note-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}
input, textarea {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}
button {
  padding: 0.75rem;
  background-color: #41b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #34a06f;
}
button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}
.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
}
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
.note-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.error-box {
  background-color: #ffdddd;
  border: 1px solid #ff0000;
  color: #D8000C;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}
</style>