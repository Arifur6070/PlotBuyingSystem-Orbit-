using OrbitData;
using OrbitEntity;
using OrbitInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrbitRepository
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private OrbitDBContext context = new OrbitDBContext();

        public User Validate(User user)
        {
            User validUser = this.context.Users.SingleOrDefault(u => u.Username == user.Username && u.Password == user.Password);
            return validUser;
        }

        public User GetUserCredentials(string username, string password)
        {
            User validUser = this.context.Users.SingleOrDefault(u => u.Username == username && u.Password == password);
            return validUser;
        }

        public bool isOldPasswordValid(User user)
        {
            User checkPass = this.context.Users.SingleOrDefault(u => u.Password == user.Password);
            if (checkPass != null)
            {
                return true;
            }
            return false;
        }
    }
}
