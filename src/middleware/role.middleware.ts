import { FastifyRequest, FastifyReply } from 'fastify';
import roleModel from '../models/role.model';

export const rolePermissionMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = (request as any).userData;

    if (!user?.role?._id) {
      return reply.code(403).send({ message: "No role assigned to user" });
    }

    const rawUrl = request.raw.url || '';
    const method = request.method;
    const path = rawUrl.split('?')[0];
    let permissionKey = path.split('/').filter(Boolean)[0];
    // if (permissionKey == "promo") {
    //   permissionKey = "promotion"
    // }
    const role: any = await roleModel.findById(user.role._id);
    if (!role) {
      return reply.code(403).send({ message: "Account not authorized" });
    }

    const hasPermission = role.permission?.[permissionKey]?.[method];
    if (!hasPermission) {
      return reply.code(403).send({ message: "Permission denied" });
    }

    // Allow request
  } catch (error: any) {
    request.log.error("rolePermissionMiddleware error:", error);
    return reply.code(500).send({ message: error.message || "Internal server error" });
  }
};
