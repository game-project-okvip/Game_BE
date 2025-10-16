"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlayerHistory = exports.GetPlayerHistoryByAccount = exports.getHistoryDetail = exports.gethistoryList = void 0;
const playerHistory_model_1 = __importDefault(require("../models/playerHistory.model"));
// Admin APIs
const gethistoryList = async (request, reply) => {
    try {
        const historyList = await playerHistory_model_1.default.find().select('-__v');
        return reply.send({ message: 'Player History List fetched successfully', data: historyList });
    }
    catch (error) {
        request.log.error(`Error at Get History List - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.gethistoryList = gethistoryList;
const getHistoryDetail = async (request, reply) => {
    const { id } = request.query;
    if (!id) {
        return reply.code(400).send({ message: "Client ID is required" });
    }
    try {
        const history = await playerHistory_model_1.default.find({ clientId: id }).select('-__v');
        return reply.send({ message: 'Player History By ClientId fetched successfully', data: history });
    }
    catch (error) {
        request.log.error(`Error at Get History Detail - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.getHistoryDetail = getHistoryDetail;
// Client APIs
const GetPlayerHistoryByAccount = async (request, reply) => {
    const { account } = request.query;
    if (!account) {
        return reply.code(400).send({ message: "Account is required" });
    }
    try {
        const history = await playerHistory_model_1.default.find({ clientId: account }).select('-__v');
        return reply.send({ message: 'Player History By Account fetched successfully', data: history });
    }
    catch (error) {
        request.log.error(`Error at Get History List - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.GetPlayerHistoryByAccount = GetPlayerHistoryByAccount;
const CreatePlayerHistory = async (request, reply) => {
    const { account, game, amount, status } = request.body;
    try {
        if (status === "Win") {
            // Call BO API
        }
        else if (status === "Lose") {
            // Call BO API
        }
        const history = new playerHistory_model_1.default({ clientId: account, game, status, amount });
        return reply.send({ message: 'Player History created successfully', data: null });
    }
    catch (error) {
        request.log.error(`Error at create Player History - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.CreatePlayerHistory = CreatePlayerHistory;
//# sourceMappingURL=playerhistory.controller.js.map