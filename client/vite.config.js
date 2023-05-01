import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('../server/private.key'),
      cert: fs.readFileSync('../server/certificate.crt'),
    },
    host: true,
    port: 3001,
  },
  preview: {
    port: 8080,
  },
});
