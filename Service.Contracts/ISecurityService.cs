using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface ISecurityService<T>
    {
        bool isOwn(string currentUserId, string entityId);
        bool isValid(T entity);
    }
}
