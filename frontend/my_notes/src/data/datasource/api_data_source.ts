// src/data/datasource/api_data_source.ts
import axios from 'axios';
import type { Note } from '../../domain/entity/note';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // URL API backend Anda
  headers: { 'Content-Type': 'application/json' },
});

export async function getAllNotesApi(): Promise<Note[]> {
  const response = await apiClient.get('/notes');
  return response.data;
}

export async function createNoteApi(title: string, body: string): Promise<Note> {
  const response = await apiClient.post('/notes', { title, body });
  return response.data;
}