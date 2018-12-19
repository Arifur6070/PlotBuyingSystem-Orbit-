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
    public class PropertyRepository : Repository<Property>, IPropertyRepository
    {
        public List<Property> GetPropertiesByCategory(int categoryId)
        {
            return Context.Properties.Where(p => p.CategoryId == categoryId).ToList();
        }

        //public List<Property> GetPropertiesByCategory(int categoryId, string proeprtyType)
        //{
        //    return Context.Properties.Where(p => p.CategoryId == categoryId && p.Type == proeprtyType).ToList();
        //}
    }
}
