import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false, // preserve dist/*.d.ts from build:types
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Crealievs',
      formats: ['es', 'cjs'],
      fileName: (format) => `crealievs.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'lucide-react',
        '@floating-ui/react-dom',
        'lottie-react',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
    sourcemap: true,
    // Note: CSS is built separately via build:css script
  },
});
