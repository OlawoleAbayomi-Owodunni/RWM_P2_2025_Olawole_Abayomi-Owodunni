import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@ayola/stats-visualizer': resolve(__dirname, '../packages/stats-visualizer/src/index.ts')
		}
	}
});
