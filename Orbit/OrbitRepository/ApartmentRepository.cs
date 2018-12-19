using OrbitEntity;
using OrbitInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrbitRepository
{
    public class ApartmentRepository : Repository<Apartment>, IApartmentRepository
    {
        public List<Apartment> GetApartmentsByCategory(int categoryId)
        {
            return Context.Apartments.Where(a => a.CategoryId == categoryId).ToList();
        }
    }
}
