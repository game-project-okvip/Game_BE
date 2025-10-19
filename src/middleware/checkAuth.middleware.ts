import { FastifyRequest, FastifyReply } from "fastify";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import AdminModel from "../models/admin.model";
import { secret_key } from "../const/modal";
import { JWTUserPayload } from "../global";


export const checkAuthMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      return reply.code(401).send({
        message: "Missing authentication token, please try again",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({
        message: "Invalid authorization format. Expected 'Bearer <token>'",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return reply.code(401).send({
        message: "Token not found in authorization header",
      });
    }

    // 🔑 Verify JWT
    const decoded = jwt.verify(token, secret_key) as JWTUserPayload;

    if (!decoded?.username) {
      return reply.code(401).send({
        message: "Invalid JWT payload",
      });
    }

    // 🔎 Validate user in DB
    const account = await AdminModel
      .findOne({ username: decoded?.username })
      .select("-password -__v")
      .populate("role");

    if (!account) {
      return reply.code(401).send({
        message: "Invalid authentication code",
      });
    }

    // ✅ Attach user data to request
    request.userData = {
      id: (account._id as any).toString(),
      username: account.username,
      name: account.name,
      role: account.role,
    } as JWTUserPayload;

  } catch (error) {
    request.log.error(`Authentication error: ${error}`);

    let status = 500;
    let message = "System error";

    if (error instanceof TokenExpiredError) {
      status = 401;
      message = "Token has expired";
    } else if (error instanceof JsonWebTokenError) {
      status = 401;
      message = "Invalid token";
    }

    return reply.code(status).send({ message });
  }
};
