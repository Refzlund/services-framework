import type { UserConfig } from 'vite'
import dts from 'vite-plugin-dts'

const config: UserConfig = {
	build: {
		outDir: './.dist',
		lib: {
			entry: './src/index.ts',
			name: 'service-framework',
			fileName: 'index',
		}
	},
	plugins: [dts()],
}

export default config