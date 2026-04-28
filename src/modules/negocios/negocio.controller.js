const negocioService = require('./negocio.service')

const crearNegocio = async (req, res) => {
    try {
        const usuarioId = req.usuario.id
        const negocio = await negocioService.crearNegocio(usuarioId, req.body)
        res.status(201).json({
            success: true,
            mensaje: 'Negocio creado exitosamente',
            data: negocio
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            mensaje: error.message
        })
    }
}

const obtenerNegocios = async (req, res) => {
    try {
        const filtros = {
            categoria: req.query.categoria,
            ciudad: req.query.ciudad
        }
        const negocios = await negocioService.obtenerNegocios(filtros)
        res.status(200).json({
            success: true,
            total: negocios.length,
            data: negocios
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: error.message
        })
    }
}

const obtenerMisNegocios = async (req, res) => {
    try {
        const usuarioId = req.usuario.id
        const negocios = await negocioService.obtenerMisNegocios(usuarioId)
        res.status(200).json({
            success: true,
            total: negocios.length,
            data: negocios
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: error.message
        })
    }
}

const obtenerNegocioPorId = async (req, res) => {
    try {
        const negocio = await negocioService.obtenerNegocioPorId(req.params.id)
        res.status(200).json({
            success: true,
            data: negocio
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            mensaje: error.message
        })
    }
}

const actualizarNegocio = async (req, res) => {
    try {
        const usuarioId = req.usuario.id
        const negocio = await negocioService.actualizarNegocio(
            req.params.id,
            usuarioId,
            req.body
        )
        res.status(200).json({
            success: true,
            mensaje: 'Negocio actualizado exitosamente',
            data: negocio
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            mensaje: error.message
        })
    }
}

const eliminarNegocio = async (req, res) => {
    try {
        const usuarioId = req.usuario.id
        await negocioService.eliminarNegocio(req.params.id, usuarioId)
        res.status(200).json({
            success: true,
            mensaje: 'Negocio eliminado exitosamente'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            mensaje: error.message
        })
    }
}

module.exports = {
    crearNegocio,
    obtenerNegocios,
    obtenerMisNegocios,
    obtenerNegocioPorId,
    actualizarNegocio,
    eliminarNegocio
}