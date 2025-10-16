import { FastifyRequest, FastifyReply } from "fastify";
import AdminModel from "../models/admin.model";
import { ApiResponse } from "../utils/apiResponse";
import logger from "../winston";
import bcrypt from "bcryptjs";
import { JWTUserPayload } from "../global";
import { secret_key } from "../const/modal";
import { sign } from "jsonwebtoken";

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = request.body as { username?: string; password?: string; };

    if (!username || !password) {
        return reply.code(400).send({ message: 'Incomplete information, please check and try again' } satisfies ApiResponse);
    }
    try {
        const isExist = await AdminModel.findOne({ username })
        .populate([{ path: "role", select: "role permission" }]).exec();

        if (!isExist) {
            return reply.code(404).send({ message: 'Account not found, please check and try again' } satisfies  ApiResponse);
        }
        console.log("isExist",isExist);
        if ((isExist.role as any)?.isSuperAdmin === "false") {
            const isPasswordMatch = await bcrypt.compare(password, isExist.password);

            if (!isPasswordMatch) {
                return reply.code(400).send({ message: "Password incorrect. try again" } satisfies ApiResponse);
            }
        }
        
        const roleName = (isExist?.role as any)?.role;
        
        const payload: JWTUserPayload = {
            id: (isExist._id as any).toString(),
            username: isExist.username,
            name: isExist.name,
            role: isExist.role,
        };

        const token = sign(payload, secret_key, { expiresIn: "12h" })

        return reply.send({
            message: "Login successful",
            data: {
                username: isExist.username,
                name: isExist.name,
                role: isExist.role,
                token
            }
        } satisfies ApiResponse);
    } catch (error) {
        request.log.error(`Login Error: ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}