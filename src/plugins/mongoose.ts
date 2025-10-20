import fp from 'fastify-plugin';
import mongoose, { Types } from 'mongoose';
import RoleModel from '../models/role.model';
import AdminModel, { IAdmin } from '../models/admin.model';
import ClientModel from '../models/client.model';
import PlayerHistoryModel from '../models/playerHistory.model';
import TransactionModel from '../models/transaction.model';
import WhitelistModel, { IWhitelist } from '../models/whitelist.model';
import { allRole } from '../const/modal';
import bcrypt from "bcryptjs";
import logger from '../winston';

export default fp(async (fastify, opts) => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://neung:neung1@160.10.1.2:27017/okvip_game?authSource=admin';

  try {
    await mongoose.connect(MONGO_URI);
    fastify.log.info('✅ MongoDB connected');
  } catch (err) {
    logger.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
});

export const defaultConfig = async () => {
  const session = await mongoose.startSession();
  await RoleModel.init();
  await AdminModel.init();
  await ClientModel.init();
  await PlayerHistoryModel.init();
  await TransactionModel.init();
  await WhitelistModel.init();
  
  try {
    // Start a transaction
    session.startTransaction();

    // Create Role
    let superAdminRole = await RoleModel.findOne({ role: "Super Admin", site: null }).session(session);
    console.log("SuperAdmin",superAdminRole);
    if (!superAdminRole) {
      superAdminRole = new RoleModel({ role: "Super Admin", permission: allRole });
      await superAdminRole.save({ session });
    }

    // Default IP Whitelist
    const defaultWhitelist = await WhitelistModel.countDocuments().session(session);
    if (defaultWhitelist === 0) {
      const whitelistEntries: Partial<IWhitelist>[] = [
        { ip: "128.10.102.8", description: "Default IP", createBy: "admin" }
      ];
      await WhitelistModel.insertMany(whitelistEntries, { session });
    }

    // Default Account
    const adminAccount = await AdminModel.findOne({ username: "admin" }).session(session);
    if (!adminAccount) {
      const newAdmin: Partial<IAdmin> = {
        username: "admin",
        name: "Admin",
        password: await bcrypt.hash("admin", 10), // Consider hashing this password before storing in production
        role: superAdminRole._id as Types.ObjectId,
      };
      await AdminModel.create([newAdmin], { session });
    }

    // Commit the transaction
    await session.commitTransaction();
    // console.log('Created successfully');
    // End the session
    session.endSession();
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    console.error('Error creating sites:', error);
    // Ensure the session is ended properly
    session.endSession();
  }
};
