"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlayerTransactionByAccount = exports.CreateTransaction = void 0;
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const CreateTransaction = async (request, reply) => {
    const { account, amount, type } = request.body;
    try {
        if (type === "Deposit") {
            // Call BO Deposit API
        }
        else if (type === "Withdraw") {
            // Call BO Withdraw API
        }
        return reply.send({ message: 'Transaction created successfully', data: null });
    }
    catch (error) {
        request.log.error(`Error at create transaction - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.CreateTransaction = CreateTransaction;
const GetPlayerTransactionByAccount = async (request, reply) => {
    const { account } = request.query;
    if (!account) {
        return reply.code(400).send({ message: "Account is required" });
    }
    try {
        const history = await transaction_model_1.default.find({ clientId: account }).select('-__v');
        return reply.send({ message: 'Player Transction By Account fetched successfully', data: history });
    }
    catch (error) {
        request.log.error(`Error at Get Transction List - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.GetPlayerTransactionByAccount = GetPlayerTransactionByAccount;
//# sourceMappingURL=transaction.controller.js.map