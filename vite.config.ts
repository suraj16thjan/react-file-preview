import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [
        react(),
        dts({
          include: ['src/lib'],
          outDirs: 'dist',
          entryRoot: 'src/lib',
          tsconfigPath: './tsconfig.app.json',
          compilerOptions: {
            noEmit: false,
            declaration: true,
          },
        }),
      ],
      build: {
        lib: {
          entry: import.meta.dirname + '/src/lib/index.ts',
          formats: ['es'],
          fileName: 'index',
        },
        rollupOptions: {
          external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            // optional deps — consumer installs only what they need
            '@react-three/fiber',
            '@react-three/drei',
            'three',
            'jszip',
            'mammoth',
            'xlsx',
            // required deps — resolved from node_modules, not bundled
            'highlight.js',
            'highlight.js/lib/core',
            'marked',
            'papaparse',
          ],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
        outDir: 'dist',
        sourcemap: false,
        copyPublicDir: false,
      },
    }
  }

  return {
    plugins: [react()],
  }
})
