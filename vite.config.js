import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

function devApi() {
  let records = []
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api/records', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method === 'GET') {
          res.end(JSON.stringify(records))
          return
        }
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => (body += chunk))
          req.on('end', () => {
            try {
              records.push(JSON.parse(body || '{}'))
              res.statusCode = 201
              res.end(body)
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ message: 'Bad request' }))
            }
          })
          return
        }
        res.statusCode = 405
        res.end(JSON.stringify({ message: 'Method not allowed' }))
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    devApi(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Campus Reporter',
        short_name: 'Reporter',
        description: 'Report issues and observations around a large outdoor site.',
        start_url: '/',
        display: 'standalone',
        background_color: '#f5f6f8',
        theme_color: '#3f51b5',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}']
      }
    })
  ]
})
