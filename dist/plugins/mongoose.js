"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const mongoose_1 = __importDefault(require("mongoose"));
const role_model_1 = __importDefault(require("../models/role.model"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
const client_model_1 = __importDefault(require("../models/client.model"));
const playerHistory_model_1 = __importDefault(require("../models/playerHistory.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const whitelist_model_1 = __importDefault(require("../models/whitelist.model"));
const modal_1 = require("../const/modal");
const winston_1 = __importDefault(require("../winston"));
exports.default = (0, fastify_plugin_1.default)(async (fastify, opts) => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://neung:neung1@160.10.1.2:27017/okvip_game?authSource=admin';
    try {
        await mongoose_1.default.connect(MONGO_URI);
        fastify.log.info('✅ MongoDB connected');
    }
    catch (err) {
        winston_1.default.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
});
const defaultConfig = async () => {
    const session = await mongoose_1.default.startSession();
    await role_model_1.default.init();
    await admin_model_1.default.init();
    await client_model_1.default.init();
    await playerHistory_model_1.default.init();
    await transaction_model_1.default.init();
    await whitelist_model_1.default.init();
    try {
        // Start a transaction
        session.startTransaction();
        // Create Role
        let superAdminRole = await role_model_1.default.findOne({ role: "Super Admin", site: null }).session(session);
        console.log("SuperAdmin", superAdminRole);
        if (!superAdminRole) {
            superAdminRole = new role_model_1.default({ role: "Super Admin", permission: modal_1.allRole });
            await superAdminRole.save({ session });
        }
        // Default IP Whitelist
        const defaultWhitelist = await whitelist_model_1.default.countDocuments().session(session);
        if (defaultWhitelist === 0) {
            const whitelistEntries = [
                { ip: "127.0.0.1", description: "Default IP", createBy: "admin" }
            ];
            await whitelist_model_1.default.insertMany(whitelistEntries, { session });
        }
        // Default Account
        const adminAccount = await admin_model_1.default.findOne({ username: "admin" }).session(session);
        if (!adminAccount) {
            const newAdmin = {
                username: "admin",
                name: "Admin",
                password: "admin", // Consider hashing this password before storing in production
                role: superAdminRole._id,
            };
            await admin_model_1.default.create([newAdmin], { session });
        }
        // Commit the transaction
        await session.commitTransaction();
        // console.log('Created successfully');
        // End the session
        session.endSession();
    }
    catch (error) {
        // If an error occurs, abort the transaction
        await session.abortTransaction();
        console.error('Error creating sites:', error);
        // Ensure the session is ended properly
        session.endSession();
    }
};
exports.defaultConfig = defaultConfig;
//# sourceMappingURL=mongoose.js.map