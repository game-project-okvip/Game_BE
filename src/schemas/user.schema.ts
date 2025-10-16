export const createUserSchema = {
  body: {
    type: "object",
    required: ["username", "password", "role"],
    properties: {
      username: { type: "string" },
      password: { type: "string" },
      role: { type: "string" },
    }
  }
};

export const UserSchema = {
  querystring: {
    type: "object",
    properties: {
      id: { type: "string" }
    }
  }
};

export const updateUserSchema = {
  body: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      role: { type: "string" },
    }
  }
};

