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
    public class PersonRepository : Repository<Person>, IPersonRepository
    {
        public Person GetAuthenticatedPerson(string username)
        {
            Person validPerson = Context.People.SingleOrDefault(u => u.Username == username);
            return validPerson;
        }
    }
}
