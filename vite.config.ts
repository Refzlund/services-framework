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
	test: {
		watch: false,
		include: ['./src/**/*.test.ts'],
		typecheck: {
			include: ['./src/**/*.ts', './src/**/*.test.ts'],
			tsconfig: 'tsconfig.json'
		}
	},
}

export default config