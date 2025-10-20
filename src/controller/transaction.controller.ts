import { FastifyRequest, FastifyReply } from "fastify";
import TransactionModel from "../models/transaction.model";
import ClientModel from "../models/client.model";
import { ApiResponse } from "../utils/apiResponse";

// Admin APIs
export const getTransctionFilterList = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name, type, start, end } = request.query as any;

    const q: any = {};
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Date Validation
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (endDate < startDate) {
        return reply.code(400).send({ message: "Invalid date range: end date cannot be earlier than start date" });
      }
    }

    // Account filter
    if (name) {
      const player = await ClientModel.findOne({ username: name }).select("_id").lean();
      if (!player) {
        return reply.code(404).send({ message: `Player - ${name} not found` });
      }
      q.clientId = player._id;
    }

    // Status filter
    if (type) {
      const s = String(type).toLowerCase();
      const map: Record<string, "Deposit" | "Withdraw"> = {
        deposit: "Deposit",
        withdraw: "Withdraw",
      };
      const normalized = map[s];
      if (normalized) q.type = normalized;
    }

    // Date range filter
    if (start || end) {
      q.createdAt = {};
      if (start) q.createdAt.$gte = new Date(start);
        if (end) {
            const endDate = new Date(end);
            const nextDay = new Date(endDate.getTime() + (24 * 60 * 60 * 1000));
            q.createdAt.$lt = nextDay; 
        }
    }
    console.log("Filter",q);
    const [items, total] = await Promise.all([
      TransactionModel.find(q)
        .select("-__v")
        .populate([{ path: "clientId", select: "username balance"}])
        .sort({ createdAt: -1 })
        .lean(),
      TransactionModel.countDocuments(q),
    ]);

    return reply.send({
      message: "Player Transction List fetched successfully",
      data: {
        items,
        total,
      },
    });
  } catch (error) {
    request.log.error(`Error at Get Transction List - ${error}`);
    return reply.code(500).send({ message: "System error" });
  }
}

// Client APIs

export const CreateTransaction = async (request: FastifyRequest, reply: FastifyReply) => {
    const { account, amount, type } = request.body as any;
    try {
        const player = await ClientModel.findOne({ username: account });
    
        if (!player) {
            return reply.code(404).send({ message: `Player - ${account} not found` } satisfies ApiResponse);
        }
    
        if (type === "Deposit") {
            // Call BO Deposit API
        } else if (type === "Withdraw") {
            // Call BO Withdraw API
        }

        const trans = new TransactionModel({ clientId: player._id, amount, type });
        trans.save();

        return reply.send({ message: 'Transaction created successfully', data: null });
    } catch (error) {
        request.log.error(`Error at create transaction - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}

export const GetPlayerTransactionByAccount = async (request: FastifyRequest, reply: FastifyReply) => {
    const { account } = request.query as { account?: string };

    if (!account) {
      return reply.code(400).send({ message: "Account is required" });
    }

    try {
        const player = await ClientModel.findOne({ username: account });
    
        if (!player) {
            return reply.code(404).send({ message: `Player - ${account} not found` } satisfies ApiResponse);
        }

        const history = await TransactionModel.find({ clientId: player._id }).select('-__v');

        return reply.send({ message: 'Player Transction By Account fetched successfully', data: history });
    } catch (error) {
        request.log.error(`Error at Get Transction List - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}
