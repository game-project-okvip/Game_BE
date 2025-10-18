"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientInfo = exports.deleteUser = exports.updateUser = exports.getAdminDetail = exports.createAdminAccounts = exports.getAdminAccounts = exports.getClientDetail = exports.getallClient = void 0;
const client_model_1 = __importDefault(require("../models/client.model"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
const api_service_1 = require("../services/api.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Admin API
const getallClient = async (request, reply) => {
    try {
        const clientList = await client_model_1.default.find().select('-__v');
        return reply.send({ message: 'All Clients fetched successfully', data: clientList });
    }
    catch (error) {
        request.log.error(`Error at Get All Clients - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.getallClient = getallClient;
const getClientDetail = async (request, reply) => {
    const { id } = request.query;
    if (!id) {
        return reply.code(400).send({ message: "Client ID is required" });
    }
    try {
        const client = await client_model_1.default.findById(id).select('-__v');
        return reply.send({ message: 'Get client info successfully', data: client });
    }
    catch (error) {
        request.log.error(`Error at Get Client By Id - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.getClientDetail = getClientDetail;
const getAdminAccounts = async (request, reply) => {
    try {
        const userList = await admin_model_1.default.find().select('-password -role -createdAt -updatedAt -__v').exec();
        return reply.send({ message: 'Get All User Accounts successfully', data: userList });
    }
    catch (error) {
        request.log.error(`Error at Get Client By Id - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.getAdminAccounts = getAdminAccounts;
const createAdminAccounts = async (request, reply) => {
    const { username, name, password, role } = request.body;
    const isExist = await admin_model_1.default.findOneAndDelete({ username });
    if (isExist) {
        return reply.code(409).send({ message: 'User already exist.' });
    }
    const hashPass = await bcryptjs_1.default.hash(password, 10);
    const adminUser = new admin_model_1.default({ username, name, password: hashPass, role });
    await adminUser.save();
    return reply.send({ message: 'User created successfully', userId: adminUser._id });
};
exports.createAdminAccounts = createAdminAccounts;
const getAdminDetail = async (request, reply) => {
    const { id } = request.query;
    if (!id) {
        return reply.code(400).send({ message: "Client ID is required" });
    }
    try {
        const user = await admin_model_1.default.findById(id).select('-password -createdAt -updatedAt -__v');
        return reply.send({ message: 'Get user info successfully', data: user });
    }
    catch (error) {
        request.log.error(`Error at Get User By Id - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.getAdminDetail = getAdminDetail;
const updateUser = async (request, reply) => {
    const { id, name, role } = request.body;
    const user = await admin_model_1.default.findById(id);
    console.log("name", name);
    console.log("role", role);
    if (!user) {
        request.log.error(`User Not Found`);
        return reply.code(404).send({ message: 'User not found' });
    }
    user.name = name ?? user.name;
    user.role = role ?? user.role;
    await user.save();
    return reply.send({ message: 'User updated successfully', data: user });
};
exports.updateUser = updateUser;
const deleteUser = async (request, reply) => {
    const { id } = request.body;
    const user = await admin_model_1.default.findById(id);
    if (!user) {
        return reply.code(404).send({ message: "User not found" });
    }
    await user.deleteOne();
    return reply.send({ message: "User deleted" });
};
exports.deleteUser = deleteUser;
//Client API
const getClientInfo = async (request, reply) => {
    const { account } = request.query;
    if (!account || account === "") {
        return reply.code(400).send({ message: 'Account Require' });
    }
    try {
        // Get Member Info
        const memberInfo = await (0, api_service_1.getMemberInfo)(account);
        if (memberInfo.status_code !== 200) {
            return reply.code(404).send({ message: `Account ${account} not found in the system.` });
        }
        const member = memberInfo?.data?.Result.Member;
        //Get Deposit Info
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const start_time = todayStart.getTime();
        const end_time = todayEnd.getTime();
        console.log("Start", start_time);
        console.log("End", end_time);
        const depositHistory = await (0, api_service_1.getFullDepositHistory)(account, start_time.toString(), end_time.toString());
        if (depositHistory.status_code !== 200) {
            return reply.code(400).send({ message: `Account ${account} deposit history not found.` });
        }
        //console.log("Successfully get deposit info", depositHistory.data?.Result?.Records);
        const deposit = depositHistory?.data?.Result.Records[0];
        //Insert into our Db after get from BO API
        const client = new client_model_1.default({ username: member?.Account, name: member?.Name, balance: deposit?.Amount });
        await client.save();
        return reply.send({ message: 'get Client Info successfully', data: client });
    }
    catch (error) {
        request.log.error(`Error at create transaction - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.getClientInfo = getClientInfo;
//# sourceMappingURL=user.controller.js.map