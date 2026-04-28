const supabase = require('../../config/database')

const crearNegocio = async (datos) => {
    const { data, error } = await supabase
        .from('negocios')
        .insert([datos])
        .select()
        .single()

    if (error) throw error
    return data
}

const obtenerNegocios = async (filtros = {}) => {
    let query = supabase
        .from('negocios')
        .select('*')
        .eq('activo', true)

    if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria)
    }

    if (filtros.ciudad) {
        query = query.eq('ciudad', filtros.ciudad)
    }

    const { data, error } = await query
    if (error) throw error
    return data
}

const obtenerNegocioPorId = async (id) => {
    const { data, error } = await supabase
        .from('negocios')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

const obtenerNegociosPorUsuario = async (usuarioId) => {
    const { data, error } = await supabase
        .from('negocios')
        .select('*')
        .eq('usuario_id', usuarioId)

    if (error) throw error
    return data
}

const actualizarNegocio = async (id, datos) => {
    const { data, error } = await supabase
        .from('negocios')
        .update({ ...datos, updated_at: new Date() })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

const eliminarNegocio = async (id) => {
    const { data, error } = await supabase
        .from('negocios')
        .update({ activo: false })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

module.exports = {
    crearNegocio,
    obtenerNegocios,
    obtenerNegocioPorId,
    obtenerNegociosPorUsuario,
    actualizarNegocio,
    eliminarNegocio
}