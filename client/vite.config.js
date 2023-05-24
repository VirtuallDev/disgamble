import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('../server/private.key'),
      ca: fs.readFileSync('../server/ca_bundle.crt'),
      cert: fs.readFileSync('../server/certificate.crt'),
    },
    host: '0.0.0.0',
    port: 3001,
  },
  preview: {
    port: 8080,
  },
});
