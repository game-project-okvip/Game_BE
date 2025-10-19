import { FastifyRequest, FastifyReply } from "fastify";
import ClientModel from "../models/client.model";
import AdminModel from "../models/admin.model";
import { ApiResponse } from "../utils/apiResponse";
import { getMemberInfo, getFullDepositHistory } from "../services/api.service";
import bcrypt from "bcryptjs";

// Admin API
export const getallClient = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const clientList = await ClientModel.find().select('-__v');

        return reply.send({ message: 'All Clients fetched successfully', data: clientList } satisfies ApiResponse);
    } catch (error) {
        request.log.error(`Error at Get All Clients - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}

export const getClientDetail = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.query as { id?: string };

    if (!id) {
      return reply.code(400).send({ message: "Client ID is required" }  satisfies ApiResponse);
    }

    try {   
        const client = await ClientModel.findById(id).select('-__v');

        return reply.send({ message: 'Get client info successfully', data: client } satisfies ApiResponse);

    } catch (error) {
        request.log.error(`Error at Get Client By Id - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}

export const getAdminAccounts = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userList = await AdminModel.find().select('-password -role -createdAt -updatedAt -__v').exec();

        return reply.send({ message: 'Get All User Accounts successfully', data: userList } satisfies ApiResponse);
    } catch (error) {
        request.log.error(`Error at Get Client By Id - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}

export const createAdminAccounts = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, name, password, role } = request.body as any;

    const isExist = await AdminModel.findOneAndDelete({ username });
    if (isExist) {
        return reply.code(409).send({ message: 'User already exist.' } satisfies ApiResponse);
    }

    const hashPass = await bcrypt.hash(password, 10);

    const adminUser = new AdminModel({ username, name, password: hashPass, role });
    await adminUser.save();
    return reply.send({ message: 'User created successfully', userId: adminUser._id });
}

export const getAdminDetail = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.query as { id?: string };

    if (!id) {
      return reply.code(400).send({ message: "Client ID is required" } satisfies ApiResponse);
    }

    try {
        const user = await AdminModel.findById(id).select('-password -createdAt -updatedAt -__v');

        return reply.send({ message: 'Get user info successfully', data: user } satisfies ApiResponse);

    } catch (error) {
        request.log.error(`Error at Get User By Id - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, name, role } = request.body as any;
    const user = await AdminModel.findById(id);
    console.log("name",name);
    console.log("role",role);
    if (!user) {
        request.log.error(`User Not Found`);
        return reply.code(404).send({ message: 'User not found' } satisfies ApiResponse);
    }

    user.name = name ?? user.name;
    user.role = role ?? user.role;
    await user.save();
    return reply.send({ message: 'User updated successfully', data: user } satisfies ApiResponse);
}

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.body as any;
    const user = await AdminModel.findById(id);
    if (!user) {
        return reply.code(404).send({ message: "User not found" } satisfies ApiResponse);
    }

    await user.deleteOne();
    return reply.send({ message: "User deleted" });
}

//Client API
export const getClientInfo = async (request: FastifyRequest, reply: FastifyReply) => {
    const { account } = request.query  as any;
    if (!account || account === "") {
        return reply.code(400).send({ message: 'Account Require' } satisfies ApiResponse);
    }

    try {
        // Get Member Info
        const memberInfo = await getMemberInfo(account);

        if (memberInfo.status_code !== 200) {
            return reply.code(404).send({ message: `Account ${account} not found in the system.` } satisfies ApiResponse);
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
        const depositHistory = await getFullDepositHistory(account, start_time.toString(), end_time.toString() );

        if (depositHistory.status_code !== 200 || depositHistory.data === null) {
            return reply.code(400).send({ message: `Account ${account} deposit history not found.` } satisfies ApiResponse);
        }
        //console.log("Successfully get deposit info", depositHistory.data?.Result?.Records);
        const deposit = depositHistory?.data?.Result.Records[0];
        
        //Insert new or update record into our Db after get from BO API
        const username = member?.Account;
        const name = member?.Name ?? '';
        const balance = Number(deposit?.Amount ?? 0);
        const updatedAt = new Date();

        const client = await ClientModel.findOneAndUpdate(
            { username },
            { $set: { name, balance, updatedAt } },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );
        
        return reply.send({ message: 'get Client Info successfully', data: client });
    } catch (error) {
        request.log.error(`Error at create transaction - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}