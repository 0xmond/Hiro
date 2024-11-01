using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contracts;
using NLog;

namespace LoggerService
{
    public class LoggerManager : ILoggerManager
    {
        private static ILogger logger = LogManager.GetCurrentClassLogger();
        public LoggerManager()
        {

        }

        // The implementation of ILoggerService contract is here
        // Implemented by (ILogger logger) => NLog.ILogger
        public void LogDebug(string message) => logger.Debug(message);
        public void LogError(string message) => logger.Error(message);
        public void LogWarn(string message) => logger.Warn(message);
        public void LogInfo(string message) => logger.Info(message);
    }
}
