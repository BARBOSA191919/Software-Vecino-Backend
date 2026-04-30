import { Request, Response, NextFunction } from 'express'
import supabase from '../config/database'

interface UsuarioAuth {
  id: string
  email: string
  rol?: string
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAuth
    }
  }
}

export const verificarToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        mensaje: 'Token no proporcionado'
      })
      return
    }

    const token = authHeader.split(' ')[1]

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({
        success: false,
        mensaje: 'Token inválido o expirado'
      })
      return
    }

    req.usuario = {
      id: user.id,
      email: user.email || '',
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