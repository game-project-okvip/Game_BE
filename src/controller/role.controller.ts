import { FastifyRequest, FastifyReply } from "fastify";
import RoleModel from "../models/role.model";
import { ApiResponse } from "../utils/apiResponse";

export const createRole = async (request: FastifyRequest, reply: FastifyReply) => {
    const { body } = request.body as any;
    const user = (request as any).userData;

    try {
        const isExist = await RoleModel.countDocuments({ body });
        if (isExist > 0) {
            return reply.code(403).send({ message: 'Role Name is already exist' } satisfies ApiResponse);
        }

        const create = await RoleModel.create({ ...request.body as any, create_by: user.username });
        request.log.info(`CREATE ROLE: ${user.username} - ${create.role}`);

        return reply.send({ message: 'Role created successfully', data: create } satisfies ApiResponse);
    } catch (error) {
        request.log.error(`Error at create role - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}

export const updateRole = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.query as { id?: string };
    const body = request.body as any;
    const user = (request as any).userData;

    if (!id) {
      return reply.code(400).send({ message: 'Query must include Role ID' } satisfies ApiResponse);  
    }

    try {
        const isExist = await RoleModel.findById(id);

        if (!isExist) {
            return reply.code(404).send({ message: 'Role note found' } satisfies ApiResponse);
        }

        if (isExist.isSuperAdmin === true) {
            return reply.code(400).send({ message: 'Access Denied to edit SuperAdmin role' } satisfies ApiResponse);
        }

        const updated = await RoleModel.findByIdAndUpdate(id, { ...body }, { new: true }).select('-__v');

        return reply.send({
            message: 'Role updated successfully',
            data: updated
        } satisfies ApiResponse);
    } catch (error) {
        request.log.error(`Error at update role - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}

export const getRoles = async (request: FastifyRequest, reply: FastifyReply) => {
    const { ...query } = request.query as any;

    try {

        const roles = await RoleModel.find(query).select('-__v');

        return reply.send({ message: 'Roles fetched successfully', data: roles } satisfies ApiResponse);
        
    } catch (error) {
        request.log.error(`Error at Get Roles - ${error}`);
        return reply.code(500).send({ message: 'System error' } satisfies ApiResponse);
    }
}