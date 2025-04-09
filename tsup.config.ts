import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',             // Main library entry point
    'src/transports/stdio.ts',  // Entry point for the stdio binary
    'src/transports/sse.ts',    // Entry point for the sse binary
  ],
  format: ['esm', 'cjs'], // Output both ES Modules and CommonJS formats
  dts: true,              // Generate .d.ts files for types
  splitting: false,       // Keep each entry point as a single file
  sourcemap: true,        // Generate sourcemaps for debugging
  clean: true,            // Clean the 'dist' directory before building
  outDir: 'dist',         // Specify the output directory
  // Add the necessary shebang for Node.js CLI tools
  banner: (ctx) => {
    // Get the base name of the output chunk (e.g., 'stdio', 'sse', 'index')
    const chunkName = ctx.name;

    // Check if the chunk name corresponds to one of the executables
    // and if the format is one that needs the shebang
    if (chunkName && (chunkName.includes('stdio') || chunkName.includes('sse')) && (ctx.format === 'esm' || ctx.format === 'cjs')) {
      return {
        js: '#!/usr/bin/env node',
      };
    }
    // Otherwise, return an empty object (no banner)
    return {};
  },
  // Mark dependencies as external to fix module resolution issues
  external: ['@modelcontextprotocol/sdk', 'zod', 'razorpay', 'express', 'cors', 'node:util'],
  treeshake: true, // Enable tree shaking
  // Add moduleResolution option to work with ESM imports
  esbuildOptions: (options) => {
    options.resolveExtensions = ['.ts', '.js'];
  }
});
