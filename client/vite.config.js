import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('../server.key'),
      cert: fs.readFileSync('../server.cert'),
    },
    host: true,
    port: 3001,
    history: {
      // enable HTML5 history API fallback
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
  },
  preview: {
    port: 8080,
  },
});
