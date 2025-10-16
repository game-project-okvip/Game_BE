"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_whitelist = exports.update_whitelist = exports.get_whitelist = exports.create_whitelist = void 0;
const whitelist_model_1 = __importDefault(require("../models/whitelist.model"));
const winston_1 = __importDefault(require("../winston"));
/**
 * POST /whitelist
 */
const create_whitelist = async (request, reply) => {
    try {
        const body = request.body;
        const user = request.userData;
        if (!body || Object.keys(body).length === 0) {
            return reply
                .code(400)
                .send({ message: "Incomplete whitelist data, please check and try again." });
        }
        try {
            const created = await whitelist_model_1.default.create({
                ...body,
                createBy: user?.username,
                updateBy: user?.username,
            });
            winston_1.default.info(`BACKEND SYSTEM - CREATE WHITELIST - ${user?.username} - ${JSON.stringify(created)}`);
            const res = {
                message: "IP whitelist created successfully",
                data: created,
            };
            return reply.send(res);
        }
        catch (error) {
            if (error.code === 11000) {
                return reply.code(409).send({ message: "Duplicate IP address in whitelist." });
            }
            winston_1.default.error("Error creating whitelist entry:", error);
            return reply.code(500).send({ message: "System error during whitelist creation." });
        }
    }
    catch (error) {
        winston_1.default.error("Unexpected error:", error);
        return reply.code(500).send({ message: "System error" });
    }
};
exports.create_whitelist = create_whitelist;
/**
 * GET /whitelist
 */
const get_whitelist = async (request, reply) => {
    try {
        const list = await whitelist_model_1.default.find().select('-createBy -updateBy -createdAt -updatedAt');
        const res = {
            message: "IP whitelist retrieved successfully",
            data: list,
        };
        return reply.send(res);
    }
    catch (error) {
        winston_1.default.error("Unexpected error:", error);
        return reply.code(500).send({ message: "System error" });
    }
};
exports.get_whitelist = get_whitelist;
/**
 * PATCH /whitelist
 */
const update_whitelist = async (request, reply) => {
    try {
        const { id } = request.query;
        const body = request.body;
        const user = request.userData;
        if (!id) {
            return reply.code(400).send({ message: "Whitelist ID is required" });
        }
        try {
            const updated = await whitelist_model_1.default.findByIdAndUpdate(id, { ...body, updateBy: user?.username }, { new: true });
            if (!updated) {
                return reply.code(404).send({ message: "IP whitelist not found." });
            }
            winston_1.default.info(`BACKEND SYSTEM - UPDATE WHITELIST - ${user?.username} - ${updated.ip}`);
            const res = {
                message: "IP whitelist updated successfully",
                data: updated,
            };
            return reply.send(res);
        }
        catch (error) {
            winston_1.default.error("Error updating whitelist entry:", error);
            return reply.code(500).send({ message: "System error during whitelist update." });
        }
    }
    catch (error) {
        winston_1.default.error("Unexpected error:", error);
        return reply.code(500).send({ message: "System error" });
    }
};
exports.update_whitelist = update_whitelist;
/**
 * DELETE /whitelist
 */
const delete_whitelist = async (request, reply) => {
    try {
        const { id } = request.body;
        const user = request.userData;
        if (!id) {
            return reply.code(400).send({ message: "Whitelist ID is required" });
        }
        try {
            const del = await whitelist_model_1.default.deleteOne({ _id: id });
            if (del.deletedCount && del.deletedCount > 0) {
                winston_1.default.info(`BACKEND SYSTEM - DELETE WHITELIST - ${user?.username} - ${id}`);
                const res = {
                    message: "IP whitelist deleted successfully",
                    data: del,
                };
                return reply.send(res);
            }
            return reply
                .code(404)
                .send({ message: "IP whitelist not found. No changes were made." });
        }
        catch (error) {
            winston_1.default.error("Error deleting whitelist entry:", error);
            return reply.code(500).send({ message: "System error during whitelist deletion." });
        }
    }
    catch (error) {
        winston_1.default.error("Unexpected error:", error);
        return reply.code(500).send({ message: "System error" });
    }
};
exports.delete_whitelist = delete_whitelist;
//# sourceMappingURL=whitelist.controller.js.map