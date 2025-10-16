import { FastifyRequest, FastifyReply } from "fastify";
import PlayerHistoryModel from "../models/playerHistory.model";
import { ApiResponse } from "../utils/apiResponse";

// Admin APIs
export const gethistoryList = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const historyList = await PlayerHistoryModel.find().select('-__v');

        return reply.send({ message: 'Player History List fetched successfully', data: historyList });
    } catch (error) {
        request.log.error(`Error at Get History List - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}

export const getHistoryDetail = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.query as { id?: string };

    if (!id) {
      return reply.code(400).send({ message: "Client ID is required" });
    }

    try {
        const history = await PlayerHistoryModel.find({ clientId: id }).select('-__v');

        return reply.send({ message: 'Player History By ClientId fetched successfully', data: history });
    } catch (error) {
        request.log.error(`Error at Get History Detail - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}

// Client APIs
export const GetPlayerHistoryByAccount = async (request: FastifyRequest, reply: FastifyReply) => {
    const { account } = request.query as { account?: string };

    if (!account) {
      return reply.code(400).send({ message: "Account is required" });
    }

    try {
        const history = await PlayerHistoryModel.find({ clientId: account }).select('-__v');

        return reply.send({ message: 'Player History By Account fetched successfully', data: history });
    } catch (error) {
        request.log.error(`Error at Get History List - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}

export const CreatePlayerHistory = async (request: FastifyRequest, reply: FastifyReply) => {
    const { account, game, amount, status } = request.body as any;
    try {
        if (status === "Win") {
            // Call BO API
        } else if (status === "Lose") {
            // Call BO API
        }

        const history = new PlayerHistoryModel({ clientId: account, game, status, amount });

        return reply.send({ message: 'Player History created successfully', data: null });
    } catch (error) {
        request.log.error(`Error at create Player History - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}
