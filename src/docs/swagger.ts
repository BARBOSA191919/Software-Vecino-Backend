export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Vecino Backend API',
    version: '1.0.0',
    description:
      'Documentacion OpenAPI del backend actual. Incluye healthcheck y modulo de negocios.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local'
    }
  ],
  tags: [
    { name: 'Health', description: 'Estado de la API' },
    { name: 'Negocios', description: 'Gestion de negocios' }
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
    }
  }
}
