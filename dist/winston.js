"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const timeHandle = () => {
    const time = new Date().getTime();
    const year = new Date(time).getFullYear();
    const month = (new Date(time).getMonth() + 1).toString().padStart(2, "0");
    const day = new Date(time).getDate().toString().padStart(2, "0");
    const timeDisplay = `${year}_${month}_${day}`;
    return timeDisplay;
};
const logger = winston_1.default.createLogger({
    // Format of the log combined through format.combine
    format: winston_1.default.format.combine(
    // Add timestamp to log
    winston_1.default.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), 
    // Add colors
    winston_1.default.format.colorize(), 
    // Set the format of the log
    winston_1.default.format.printf((log) => {
        // If log is an error, show the stack trace; otherwise, show the message
        if (log.stack)
            return `[${log.timestamp}] [${log.level}] ${log.stack}`;
        return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })),
    transports: [
        // Display logs via console
        new winston_1.default.transports.Console(),
        // Set up to write errors to a file
        new winston_1.default.transports.File({
            filename: `log/${timeHandle()}_combined.log`,
            maxsize: 5242880, // Max file size in bytes (5MB)
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=winston.js.map