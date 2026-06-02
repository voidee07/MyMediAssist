import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    // Explicitly point to the PostCSS config we fixed
    postcss: './postcss.config.cjs',
  },
});
