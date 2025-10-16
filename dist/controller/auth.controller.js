"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const admin_model_1 = __importDefault(require("../models/admin.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const modal_1 = require("../const/modal");
const jsonwebtoken_1 = require("jsonwebtoken");
const login = async (request, reply) => {
    const { username, password } = request.body;
    if (!username || !password) {
        return reply.code(400).send({ message: 'Incomplete information, please check and try again' });
    }
    try {
        const isExist = await admin_model_1.default.findOne({ username })
            .populate([{ path: "role", select: "role permission" }]).exec();
        if (!isExist) {
            return reply.code(404).send({ message: 'Account not found, please check and try again' });
        }
        console.log("isExist", isExist);
        if (isExist.role?.isSuperAdmin === "false") {
            const isPasswordMatch = await bcryptjs_1.default.compare(password, isExist.password);
            if (!isPasswordMatch) {
                return reply.code(400).send({ message: "Password incorrect. try again" });
            }
        }
        const roleName = isExist?.role?.role;
        const payload = {
            id: isExist._id.toString(),
            username: isExist.username,
            name: isExist.name,
            role: isExist.role,
        };
        const token = (0, jsonwebtoken_1.sign)(payload, modal_1.secret_key, { expiresIn: "12h" });
        return reply.send({
            message: "Login successful",
            data: {
                username: isExist.username,
                name: isExist.name,
                role: isExist.role,
                token
            }
        });
    }
    catch (error) {
        request.log.error(`Login Error: ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map