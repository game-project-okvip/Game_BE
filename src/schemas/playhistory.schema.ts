
export const PlayHistorySchema = {
    querystring: {
    type: "object",
    properties: {
        name: { type: "string" },
        game: { type: "string" },
        status: { type: "string" },
        start: { type: "string" },
        end: { type: "string" }
    }
  }
}