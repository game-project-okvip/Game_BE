import { FastifyRequest, FastifyReply } from "fastify";
import TransactionModel from "../models/transaction.model";
import { ApiResponse } from "../utils/apiResponse";

export const CreateTransaction = async (request: FastifyRequest, reply: FastifyReply) => {
    const { account, amount, type } = request.body as any;
    try {
        if (type === "Deposit") {
            // Call BO Deposit API
        } else if (type === "Withdraw") {
            // Call BO Withdraw API
        }

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
        const history = await TransactionModel.find({ clientId: account }).select('-__v');

        return reply.send({ message: 'Player Transction By Account fetched successfully', data: history });
    } catch (error) {
        request.log.error(`Error at Get Transction List - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}
