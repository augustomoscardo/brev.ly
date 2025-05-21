import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/infra/http/server.ts'],
  outDir: 'dist',
  clean: true,
  format: ['esm'],
})
