import { FastifyRequest, FastifyReply } from "fastify";
import PlayerHistoryModel from "../models/playerHistory.model";
import { ApiResponse } from "../utils/apiResponse";

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