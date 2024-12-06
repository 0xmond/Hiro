using Entities.Models;
using Service.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public abstract class SecurityService<T> : ISecurityService<T> where T : class
    {
        public bool isOwn(string currentUserId, string entityId)
        {
            if (currentUserId != entityId)
                return false;

            return true;
        }

        public bool isValid(T entity)
        {
            if (entity is null)
                return false;

            return true;
        }
    }
}
