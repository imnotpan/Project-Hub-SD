import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default ({ mode }:{mode:string}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [react()],
    server: {
      open: false,
      watch: {
        usePolling: Boolean(process.env.VITE_DEVELOPMENT),
      },
      host: true, 
      strictPort: true,
      port: 5173,
    }
  })
  
}
