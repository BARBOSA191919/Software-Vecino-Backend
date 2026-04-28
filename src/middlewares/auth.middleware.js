const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
)

const verificarToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                mensaje: 'Token no proporcionado'
            })
        }

        const token = authHeader.split(' ')[1]

        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            return res.status(401).json({
                success: false,
                mensaje: 'Token inválido o expirado'
            })
        }

        req.usuario = {
            id: user.id,
            email: user.email,
            rol: user.user_metadata?.rol
        }

        next()

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al verificar autenticación'
        })
    }
}

module.exports = { verificarToken }