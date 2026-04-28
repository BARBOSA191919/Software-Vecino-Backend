require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// Middlewares globales
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Rutas
app.use('/api/negocios', require('./modules/negocios/negocio.routes'))

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

module.exports = app