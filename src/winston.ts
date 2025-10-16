import winston from "winston";

const timeHandle = (): string => {
  const time = new Date().getTime();
  const year = new Date(time).getFullYear();
  const month = (new Date(time).getMonth() + 1).toString().padStart(2, "0");
  const day = new Date(time).getDate().toString().padStart(2, "0");

  const timeDisplay = `${year}_${month}_${day}`;
  return timeDisplay;
};

const logger = winston.createLogger({
  // Format of the log combined through format.combine
  format: winston.format.combine(
    // Add timestamp to log
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    // Add colors
    winston.format.colorize(),
    // Set the format of the log
    winston.format.printf((log) => {
      // If log is an error, show the stack trace; otherwise, show the message
      if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
      return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })
  ),
  transports: [
    // Display logs via console
    new winston.transports.Console(),
    // Set up to write errors to a file
    new winston.transports.File({
      filename: `log/${timeHandle()}_combined.log`,
      maxsize: 5242880, // Max file size in bytes (5MB)
    }),
  ],
});

export default logger;
