// src/presentation/routes.ts
import { Server, type Request, type ResponseToolkit } from '@hapi/hapi';
import { createNoteUseCase, getAllNotesUseCase, deleteNoteUseCase, editNoteUseCase, getNoteByIdUseCase } from '../shared/container';

export const registerRoutes = (server: Server) => {
  server.route({
    method: 'GET',
    path: '/notes',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const notes = await getAllNotesUseCase.execute();
        return h.response(notes).code(200);
      } catch (error) {
        // Penanganan error sederhana
        return h.response({ message: 'Internal Server Error' }).code(500);
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/notes',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { title, body } = request.payload as { title: string, body: string };
        const newNote = await createNoteUseCase.execute(title, body);
        return h.response(newNote).code(201);
      } catch (error) {
        return h.response({ message: 'Internal Server Error' }).code(500);
      }
    },
  });

  server.route({
    method: 'DELETE',
    path: '/notes/{id}',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { id } = request.params;
        await deleteNoteUseCase.execute(id);
        return h.response().code(204);
      } catch (error) {
        return h.response({ message: 'Internal Server Error' }).code(500);
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/notes/{id}',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { id } = request.params;
        const { title, body } = request.payload as { title: string, body: string };
        const updatedNote = await editNoteUseCase.execute(id, title, body);
        return h.response(updatedNote).code(200);
      } catch (error) {
        return h.response({ message: 'Internal Server Error' }).code(500);
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/notes/{id}',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { id } = request.params;
        const note = await getNoteByIdUseCase.execute(id);
        return h.response(note!).code(200);
      } catch (error) {
        return h.response({ message: 'Internal Server Error' }).code(500);
      }
    },
  });
};