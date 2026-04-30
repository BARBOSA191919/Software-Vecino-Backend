import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import negocioRoutes from './modules/negocios/negocio.routes'

const app = express()

// Middlewares globales
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Rutas
app.use('/api/negocios', negocioRoutes)

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    project: 'Vecino API',
    version: '1.0.0'
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✓ Vecino API corriendo en puerto ${PORT}`)
})

export default app