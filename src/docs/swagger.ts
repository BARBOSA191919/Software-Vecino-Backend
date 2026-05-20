export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Vecino Backend API',
    version: '1.0.0',
    description:
      'Documentacion OpenAPI del backend actual. Incluye healthcheck y modulos de negocios y productos.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local'
    }
  ],
  tags: [
    { name: 'Health', description: 'Estado de la API' },
    { name: 'Negocios', description: 'Gestion de negocios' },
    { name: 'Productos', description: 'Gestion de productos' },
    { name: 'Pedidos', description: 'Gestion de pedidos' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'OK' },
          project: { type: 'string', example: 'Vecino API' },
          version: { type: 'string', example: '1.0.0' }
        }
      },
      Negocio: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '5e7c4763-5de2-4d56-91dc-c8f4a2784f62' },
          usuario_id: { type: 'string', example: '4cfdc5fb-39f5-4e0b-9a5f-5ea663f0d35a' },
          nombre: { type: 'string', example: 'Panaderia La Esquina' },
          descripcion: { type: 'string', example: 'Pan fresco todo el dia' },
          categoria: { type: 'string', example: 'Alimentos' },
          direccion: { type: 'string', example: 'Calle 10 # 12-34' },
          ciudad: { type: 'string', example: 'Armenia' },
          horario: { type: 'string', example: 'L-V 07:00 - 19:00' },
          imagen_url: { type: 'string', nullable: true, example: null },
          activo: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      NegocioInput: {
        type: 'object',
        required: ['nombre', 'categoria', 'direccion'],
        properties: {
          nombre: { type: 'string', example: 'Panaderia La Esquina' },
          descripcion: { type: 'string', example: 'Pan artesanal y cafeteria' },
          categoria: { type: 'string', example: 'Alimentos' },
          direccion: { type: 'string', example: 'Calle 10 # 12-34' },
          ciudad: { type: 'string', example: 'Armenia' },
          horario: { type: 'string', example: 'L-V 07:00 - 19:00' },
          imagen_url: { type: 'string', nullable: true, example: null }
        }
      },
      ProductoNegocio: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '5e7c4763-5de2-4d56-91dc-c8f4a2784f62' },
          nombre: { type: 'string', example: 'Panaderia La Esquina' },
          categoria: { type: 'string', example: 'Alimentos' },
          ciudad: { type: 'string', example: 'Armenia' }
        }
      },
      Producto: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'c4703140-880b-47ba-9015-7b94acdd07aa' },
          negocio_id: { type: 'string', example: '5e7c4763-5de2-4d56-91dc-c8f4a2784f62' },
          nombre: { type: 'string', example: 'Pandebono tradicional' },
          descripcion: { type: 'string', example: 'Pandebono artesanal horneado el mismo dia' },
          precio: { type: 'number', example: 3500 },
          imagen_url: { type: 'string', example: 'https://images.vecino.app/pandebono.jpg' },
          activo: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          negocio: { $ref: '#/components/schemas/ProductoNegocio' }
        }
      },
      ProductoInput: {
        type: 'object',
        required: ['negocio_id', 'nombre', 'descripcion', 'precio', 'imagen_url'],
        properties: {
          negocio_id: { type: 'string', example: '5e7c4763-5de2-4d56-91dc-c8f4a2784f62' },
          nombre: { type: 'string', example: 'Pandebono tradicional' },
          descripcion: { type: 'string', example: 'Pandebono artesanal horneado el mismo dia' },
          precio: { type: 'number', example: 3500 },
          imagen_url: { type: 'string', example: 'https://images.vecino.app/pandebono.jpg' }
        }
      },
      ApiSuccess: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          mensaje: { type: 'string', example: 'Operacion exitosa' }
        }
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          mensaje: { type: 'string', example: 'Error en la solicitud' }
        }
      },
      Pedido: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '5e7c4763-5de2-4d56-91dc-c8f4a2784f62' },
          usuario_id: { type: 'string', example: '4cfdc5fb-39f5-4e0b-9a5f-5ea663f0d35a' },
          negocio_id: { type: 'string', example: '5e7c4763-5de2-4d56-91dc-c8f4a2784f62' },
          total: { type: 'number', example: 25000 },
          estado: { type: 'string', enum: ['pendiente', 'confirmado', 'en_preparacion', 'en_camino', 'entregado'], example: 'pendiente' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          negocio: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              nombre: { type: 'string', example: 'Ferretería Vecino' },
              direccion: { type: 'string', example: 'Calle Falsa 123' }
            }
          }
        }
      },
      DetallePedido: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          pedido_id: { type: 'string' },
          producto_id: { type: 'string' },
          cantidad: { type: 'number', example: 2 },
          precio_unitario: { type: 'number', example: 25000 },
          subtotal: { type: 'number', example: 50000 },
          created_at: { type: 'string', format: 'date-time' },
          producto: {
            type: 'object',
            properties: {
              nombre: { type: 'string', example: 'Martillo de Acero' },
              imagen_url: { type: 'string' }
            }
          }
        }
      },
      HistorialEstado: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          pedido_id: { type: 'string' },
          estado_anterior: { type: 'string', nullable: true },
          estado_nuevo: { type: 'string' },
          fecha_cambio: { type: 'string', format: 'date-time' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      ActualizarEstadoInput: {
        type: 'object',
        required: ['estado'],
        properties: {
          estado: {
            type: 'string',
            enum: ['pendiente', 'confirmado', 'en_preparacion', 'en_camino', 'entregado'],
            example: 'confirmado'
          }
        }
      },
      CrearPedidoInput: {
        type: 'object',
        required: ['negocio_id', 'items'],
        properties: {
          negocio_id: { type: 'string', example: '5e7c4763-5de2-4d56-91dc-c8f4a2784f62' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['producto_id', 'cantidad'],
              properties: {
                producto_id: { type: 'string', example: 'c4703140-880b-47ba-9015-7b94acdd07aa' },
                cantidad: { type: 'number', example: 2 }
              }
            }
          }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verificar estado del servicio',
        responses: {
          '200': {
            description: 'API operativa',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' }
              }
            }
          }
        }
      }
    },
    '/api/negocios': {
      get: {
        tags: ['Negocios'],
        summary: 'Listar negocios activos',
        parameters: [
          {
            in: 'query',
            name: 'categoria',
            schema: { type: 'string' }
          },
          {
            in: 'query',
            name: 'ciudad',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Listado de negocios',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    total: { type: 'number', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Negocio' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Negocios'],
        summary: 'Crear negocio',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NegocioInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Negocio creado',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Negocio' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': {
            description: 'Error de validacion',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/api/negocios/mis-negocios': {
      get: {
        tags: ['Negocios'],
        summary: 'Listar negocios del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Listado de negocios del usuario',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    total: { type: 'number', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Negocio' }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/api/negocios/{id}': {
      get: {
        tags: ['Negocios'],
        summary: 'Obtener negocio por id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Negocio encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Negocio' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'No encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Negocios'],
        summary: 'Actualizar negocio',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NegocioInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Negocio actualizado',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Negocio' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': {
            description: 'Error en la solicitud',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Negocios'],
        summary: 'Eliminar negocio (borrado logico)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Negocio eliminado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccess' }
              }
            }
          },
          '400': {
            description: 'Error en la solicitud',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/api/productos': {
      get: {
        tags: ['Productos'],
        summary: 'Listar productos publicados',
        responses: {
          '200': {
            description: 'Listado de productos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    total: { type: 'number', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Producto' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Productos'],
        summary: 'Publicar producto',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductoInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Producto publicado',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Producto' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': {
            description: 'Error de validacion',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/api/productos/mis-productos': {
      get: {
        tags: ['Productos'],
        summary: 'Listar productos del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Listado de productos del comerciante',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    total: { type: 'number', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Producto' }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/api/pedidos': {
      post: {
        tags: ['Pedidos'],
        summary: 'Crear un nuevo pedido',
        description: 'Crea un nuevo pedido con los productos especificados',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CrearPedidoInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Pedido creado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        pedido: { $ref: '#/components/schemas/Pedido' },
                        detalles: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/DetallePedido' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Error de validación',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/api/pedidos/mis-pedidos': {
      get: {
        tags: ['Pedidos'],
        summary: 'Listar pedidos del usuario autenticado (HU-06)',
        description: 'Obtiene el historial de pedidos del consumidor autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Listado de pedidos del usuario',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Pedido' }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/api/pedidos/{id}': {
      get: {
        tags: ['Pedidos'],
        summary: 'Obtener detalle de un pedido',
        description: 'Obtiene el detalle completo de un pedido incluyendo productos',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID del pedido'
          }
        ],
        responses: {
          '200': {
            description: 'Detalle del pedido',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        pedido: { $ref: '#/components/schemas/Pedido' },
                        detalles: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/DetallePedido' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Pedido no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/api/pedidos/{id}/historial': {
      get: {
        tags: ['Pedidos'],
        summary: 'Obtener historial de estados de un pedido',
        description: 'Obtiene el historial de cambios de estado de un pedido',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID del pedido'
          }
        ],
        responses: {
          '200': {
            description: 'Historial de estados',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/HistorialEstado' }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/api/pedidos/negocio/{negocioId}': {
      get: {
        tags: ['Pedidos'],
        summary: 'Listar pedidos de un negocio',
        description: 'Obtiene los pedidos de un negocio específico (para comerciantes)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'negocioId',
            required: true,
            schema: { type: 'string' },
            description: 'ID del negocio'
          }
        ],
        responses: {
          '200': {
            description: 'Listado de pedidos del negocio',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Pedido' }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '403': {
            description: 'No tienes permiso para ver estos pedidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/api/pedidos/{id}/estado': {
      put: {
        tags: ['Pedidos'],
        summary: 'Actualizar estado de un pedido (HU-09)',
        description: 'Actualiza el estado de un pedido (solo para el dueño del negocio)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID del pedido'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ActualizarEstadoInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Estado actualizado',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccess' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Pedido' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': {
            description: 'Error de validacion',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '403': {
            description: 'No tienes permiso para modificar este pedido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '404': {
            description: 'Pedido no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    }
  }
}
