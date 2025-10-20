import { FastifyRequest, FastifyReply } from "fastify";
import mongoose from "mongoose";
import PlayerHistoryModel from "../models/playerHistory.model";
import { ApiResponse } from "../utils/apiResponse";
import ClientModel from "../models/client.model";
import TransactionModel from "../models/transaction.model";

// Admin APIs
export const getHistoryFilterList = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name, game, status, start, end } = request.query as any;

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

    // Game filter
    if (game && game.trim()) {
      q.game = { $regex: escapeRegExp(game.trim()), $options: "i" };
    }

    // Status filter
    if (status) {
      const s = String(status).toLowerCase();
      const map: Record<string, "Win" | "Lose" | "Draw"> = {
        win: "Win",
        lose: "Lose",
        draw: "Draw",
      };
      const normalized = map[s];
      if (normalized) q.status = normalized;
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

    const [items, total] = await Promise.all([
      PlayerHistoryModel.find(q)
        .select("-__v")
        .populate([{ path: "clientId", select: "username balance"}])
        .sort({ createdAt: -1 })
        .lean(),
      PlayerHistoryModel.countDocuments(q),
    ]);

    return reply.send({
      message: "Player History List fetched successfully",
      data: {
        items,
        total,
      },
    });
  } catch (error) {
    request.log.error(`Error at Get History List - ${error}`);
    return reply.code(500).send({ message: "System error" });
  }
}

// Client APIs
export const GetPlayerHistoryByAccount = async (request: FastifyRequest, reply: FastifyReply) => {
    const { account } = request.query as { account?: string };

    if (!account) {
      return reply.code(400).send({ message: "Account is required" });
    }

    const player = await ClientModel.findOne({ username: account });

    if (!player) {
        return reply.code(404).send({ message: `Player - ${account} not found` } satisfies ApiResponse);
    }

    try {
        const history = await PlayerHistoryModel.find({ clientId: player._id }).select('-__v');

        return reply.send({ message: 'Player History By Account fetched successfully', data: history });
    } catch (error) {
        request.log.error(`Error at Get History List - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}

export const CreatePlayerHistory = async (request: FastifyRequest, reply: FastifyReply) => {
  const { account, game, amount, status } = request.body as any;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    let type = "Deposit";
    
    const player = await ClientModel.findOne({ username: account });

    if (!player) {
        return reply.code(404).send({ message: `Player - ${account} not found` } satisfies ApiResponse);
    }
    
    if (status === "Win") {
        // Call BO API
    } else if (status === "Lose") {
      type = "Withdraw";
        // Call BO API
    }

    const history = new PlayerHistoryModel({ clientId: player._id, game, status, amount });
    history.save();
    
    if (status !== "Draw") {
      const trans = new TransactionModel({ clientId: player._id, amount, type });
      trans.save();
    }
    
    await session.commitTransaction();
    return reply.send({ message: 'Player History created successfully', data: history });
  } catch (error) {
    await session.abortTransaction();
    request.log.error(`Error at create Player History - ${error}`);
    return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
  } finally {
      session.endSession();
  }
}
