"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoles = exports.updateRole = exports.createRole = void 0;
const role_model_1 = __importDefault(require("../models/role.model"));
const createRole = async (request, reply) => {
    const { body } = request.body;
    const user = request.userData;
    try {
        const isExist = await role_model_1.default.countDocuments({ body });
        if (isExist > 0) {
            return reply.code(403).send({ message: 'Role Name is already exist' });
        }
        const create = await role_model_1.default.create({ ...request.body, create_by: user.username });
        request.log.info(`CREATE ROLE: ${user.username} - ${create.role}`);
        return reply.send({ message: 'Role created successfully', data: create });
    }
    catch (error) {
        request.log.error(`Error at create role - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.createRole = createRole;
const updateRole = async (request, reply) => {
    const { id } = request.query;
    const body = request.body;
    const user = request.userData;
    if (!id) {
        return reply.code(400).send({ message: 'Query must include Role ID' });
    }
    try {
        const isExist = await role_model_1.default.findById(id);
        if (!isExist) {
            return reply.code(404).send({ message: 'Role note found' });
        }
        if (isExist.isSuperAdmin === true) {
            return reply.code(400).send({ message: 'Access Denied to edit SuperAdmin role' });
        }
        const updated = await role_model_1.default.findByIdAndUpdate(id, { ...body }, { new: true }).select('-__v');
        return reply.send({
            message: 'Role updated successfully',
            data: updated
        });
    }
    catch (error) {
        request.log.error(`Error at update role - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.updateRole = updateRole;
const getRoles = async (request, reply) => {
    const { ...query } = request.query;
    try {
        const roles = await role_model_1.default.find(query).select('-__v');
        return reply.send({ message: 'Roles fetched successfully', data: roles });
    }
    catch (error) {
        request.log.error(`Error at Get Roles - ${error}`);
        return reply.code(500).send({ message: 'System error' });
    }
};
exports.getRoles = getRoles;
//# sourceMappingURL=role.controller.js.map