using OrbitEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrbitInterface
{
    public interface IUserRepository : IRepository<User>
    {
        User Validate(User user);
        User GetUserCredentials(string username, string password);
        bool isOldPasswordValid(User user);
    }
}
