using OrbitEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrbitInterface
{
    public interface IApartmentRepository : IRepository<Apartment>
    {
        List<Apartment> GetApartmentsByCategory(int id);
    }
}
