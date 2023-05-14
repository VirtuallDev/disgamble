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
    host: '0.0.0.0',
    port: 3001,
    onError: (err) => {
      try {
        fs.appendFileSync('error.log', `${new Date().toLocaleString()} - ${err}\n`);
      } catch (e) {
        console.error(`Failed to log error: ${e}`);
      }
      console.error(err);
    },
  },
  preview: {
    port: 8080,
  },
});
