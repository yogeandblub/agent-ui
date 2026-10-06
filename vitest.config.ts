import { defineConfig } from 'vitest/config';

// One test run for the whole repo. Each package is its own Vitest project so the React
// package gets a DOM while the logic packages (schema, policy, machines, runtimes) stay in Node.
export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      {
        test: {
          name: 'logic',
          environment: 'node',
          include: [
            'packages/{tokens,schema,policy,machines,runtime-mock,runtime-live,figma-sync}/src/**/*.test.ts',
            'scripts/**/*.test.ts',
          ],
        },
      },
      {
        test: {
          name: 'react',
          environment: 'jsdom',
          globals: true,
          include: ['packages/react/src/**/*.test.{ts,tsx}'],
          setupFiles: ['packages/react/vitest.setup.ts'],
        },
      },
    ],
  },
});
