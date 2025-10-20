
export const PlayerTransctionSchema = {
    querystring: {
    type: "object",
    properties: {
        name: { type: "string" },
        type: { type: "string" },
        start: { type: "string" },
        end: { type: "string" }
    }
  }
}