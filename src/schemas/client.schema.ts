export const transactionSchema = {
  body: {
    type: "object",
    required: ["account", "amount", "type"],
    properties: {
      account: { type: "string" },
      amount: { type: "string" },
      type: { type: "string", enum: ["Deposit", "Withdraw"] },
    }
  }
};

export const playHistorySchema = {
  body: {
    type: "object",
    required: ["account", "game", "status", "amount"],
    properties: {
      account: { type: "string" },
      game: { type: "string" },
      status: { type: "string", enum: ["Win","Lose","Draw"] },
      amount: { type: "string" },
    }
  }
};

export const clientSchema = {
  querystring: {
    type: "object",
    required: ["account"],
    properties: {
      account: { type: "string" },
    }
  }
};
