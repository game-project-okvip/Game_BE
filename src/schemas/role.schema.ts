export const roleCreateSchema = {
  body: {
    type: 'object',
    required: ['site', 'role'],
    properties: {
      role: { type: 'string' },
      isSuperAdmin: { type: 'boolean' },
      permission: {
        type: 'object',
        patternProperties: {
          '.*': {
            type: 'object',
            properties: {
              GET: { type: 'boolean' },
              POST: { type: 'boolean' },
              PATCH: { type: 'boolean' },
              DELETE: { type: 'boolean' }
            },
            additionalProperties: false
          }
        },
        additionalProperties: false
      }
    }
  }
};

export const roleUpdateSchema = {
  querystring: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    properties: {
      role: {
        anyOf: [
          { type: 'string' },
          { type: 'null' }
        ]
      },
      isSuperAdmin: { type: 'boolean' },
      permission: {
        anyOf: [
          {
            type: 'object',
            patternProperties: {
              '.*': {
                type: 'object',
                properties: {
                  GET: { type: 'boolean' },
                  POST: { type: 'boolean' },
                  PATCH: { type: 'boolean' },
                  DELETE: { type: 'boolean' }
                },
                additionalProperties: false
              }
            },
            additionalProperties: false
          },
          { type: 'null' }
        ]
      }
    }
  }
};

