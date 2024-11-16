import {
	defineConfig
} from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
	// base: 'https://xxx.com/',
	plugins: [uni()],
	server: {
		proxy: {
			'/devHost': {
				target: 'http://test-api.hzmodi.cn',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/devHost/, '')
			}
		}
	}
});