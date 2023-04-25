import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('../server/server.key'),
      cert: fs.readFileSync('../server/server.crt'),
    },
    host: '0.0.0.0',
    port: 3001,
  },
  preview: {
    port: 8080,
  },
});
