import { copyFileSync } from 'node:fs'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { globbySync } from 'globby'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'
import pkg from './package.json'

export default defineConfig({
  logLevel: 'warn',
  plugins: [
    dts({
      entryRoot: 'src',
      staticImport: true,
      exclude: ['**/*.stories.*', '**/*.test.*', '**/tests/*', '**/examples/*', '**/setup-test.ts'],
      afterBuild: () => {
        globbySync(['dist/**/*.d.ts', 'dist/**.d.ts']).map((file) => {
          copyFileSync(file, file.replace(/\.d\.ts$/, '.d.cts'))
        })
      },
    }),
    Vue(),
    VueJsx(),
  ],
  test: {
    setupFiles: 'src/setup-test.ts',
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
    },
    testTransformMode: {
      web: ['/.[tj]sx$/'],
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: globbySync(['src/**/index.ts', 'src/components/anatomy.ts']),
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})],
      output: [
        {
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
          entryFileNames: '[name].cjs',
        },
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
          entryFileNames: '[name].js',
        },
      ],
    },
  },
  resolve: {
    conditions: ['source'],
  },
})
