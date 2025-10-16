import { FastifyRequest, FastifyReply } from "fastify";
import whitelistModel from "../models/whitelist.model";
import { ApiResponse } from "../utils/apiResponse";
import logger from "../winston";

export const whitelistMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Normalize IP (remove IPv6 prefix if present)
    const ipClient = (request.headers["cf-connecting-ip"] as string) ? (request.headers["x-forwarded-for"] as string)?.split(",")[0].trim() : request.ip;

    const found = await whitelistModel.findOne({ ip: ipClient });

    if (!found) {
      request.log.warn(`Whitelist blocked IP: ${ipClient}`);

      const res: ApiResponse = {
        message: `Unauthorized: Access denied for IP ${ipClient}`,
      };
      return reply.code(403).send(res);
    }

    // ✅ Passed whitelist → do nothing, let request continue
  } catch (error) {
    logger.error("Whitelist Error:", error);

    const res: ApiResponse = {
      message: "Internal server error during whitelist check",
    };
    return reply.code(500).send(res);
  }
};
