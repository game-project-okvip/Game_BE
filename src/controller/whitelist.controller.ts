import WhitelistModel from "../models/whitelist.model";
import type { FastifyRequest, FastifyReply } from "fastify";
import { ApiResponse } from "../utils/apiResponse";
import logger from "../winston";
import { JWTUserPayload } from "../global";

/**
 * POST /whitelist
 */
export const create_whitelist = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = request.body as Record<string, unknown>;
    const user = request.userData as JWTUserPayload | undefined;

    if (!body || Object.keys(body).length === 0) {
      return reply
        .code(400)
        .send({ message: "Incomplete whitelist data, please check and try again." });
    }

    try {
      const created = await WhitelistModel.create({
        ...body,
        createBy: user?.username,
        updateBy: user?.username,
      });

      logger.info(
        `BACKEND SYSTEM - CREATE WHITELIST - ${user?.username} - ${JSON.stringify(created)}`
      );

      const res: ApiResponse = {
        message: "IP whitelist created successfully",
        data: created,
      };
      return reply.send(res);
    } catch (error: any) {
      if (error.code === 11000) {
        return reply.code(409).send({ message: "Duplicate IP address in whitelist." });
      }
      logger.error("Error creating whitelist entry:", error);
      return reply.code(500).send({ message: "System error during whitelist creation." });
    }
  } catch (error) {
    logger.error("Unexpected error:", error);
    return reply.code(500).send({ message: "System error" });
  }
};

/**
 * GET /whitelist
 */
export const get_whitelist = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const list = await WhitelistModel.find().select('-createBy -updateBy -createdAt -updatedAt');

    const res: ApiResponse = {
      message: "IP whitelist retrieved successfully",
      data: list,
    };
    return reply.send(res);
  } catch (error) {
    logger.error("Unexpected error:", error);
    return reply.code(500).send({ message: "System error" });
  }
};

/**
 * PATCH /whitelist
 */
export const update_whitelist = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.query as { id?: string };
    const body = request.body as Record<string, unknown>;
    const user = request.userData as JWTUserPayload | undefined;

    if (!id) {
      return reply.code(400).send({ message: "Whitelist ID is required" });
    }

    try {
      const updated = await WhitelistModel.findByIdAndUpdate(
        id,
        { ...body, updateBy: user?.username },
        { new: true }
      );

      if (!updated) {
        return reply.code(404).send({ message: "IP whitelist not found." });
      }

      logger.info(
        `BACKEND SYSTEM - UPDATE WHITELIST - ${user?.username} - ${updated.ip}`
      );

      const res: ApiResponse = {
        message: "IP whitelist updated successfully",
        data: updated,
      };
      return reply.send(res);
    } catch (error) {
      logger.error("Error updating whitelist entry:", error);
      return reply.code(500).send({ message: "System error during whitelist update." });
    }
  } catch (error) {
    logger.error("Unexpected error:", error);
    return reply.code(500).send({ message: "System error" });
  }
};

/**
 * DELETE /whitelist
 */
export const delete_whitelist = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.query as any;
    const user = request.userData as JWTUserPayload | undefined;

    if (!id) {
      return reply.code(400).send({ message: "Whitelist ID is required" });
    }

    try {
      const del = await WhitelistModel.deleteOne({ _id: id });

      if (del.deletedCount && del.deletedCount > 0) {
        logger.info(
          `BACKEND SYSTEM - DELETE WHITELIST - ${user?.username} - ${id}`
        );

        const res: ApiResponse = {
          message: "IP whitelist deleted successfully",
          data: del,
        };
        return reply.send(res);
      }

      return reply
        .code(404)
        .send({ message: "IP whitelist not found. No changes were made." });
    } catch (error) {
      logger.error("Error deleting whitelist entry:", error);
      return reply.code(500).send({ message: "System error during whitelist deletion." });
    }
  } catch (error) {
    logger.error("Unexpected error:", error);
    return reply.code(500).send({ message: "System error" });
  }
};