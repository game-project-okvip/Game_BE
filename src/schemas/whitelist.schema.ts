export const createWhitelistSchema = {
  body: {
    type: "object",
    required: ["ip"],
    additionalProperties: false,
    properties: {
      ip: {
        anyOf: [
          { type: "string", format: "ipv4" },
          { type: "string", format: "ipv6" }
        ]
      },
      description: { type: "string" },
      createBy: { type: "string" },
    },
  },
};

export const updateWhitelistSchema = {
  querystring: {
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
      id: { type: "string" },
    },
  },
  body: {
    type: "object",
    additionalProperties: false,
    properties: {
      ip: {
        anyOf: [
          { type: "string", format: "ipv4" },
          { type: "string", format: "ipv6" }
        ]
      },
      description: { type: "string" },
      updateBy: { type: "string" },
    },
  },
};

export const deleteWhitelistSchema = {
  querystring: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
};
