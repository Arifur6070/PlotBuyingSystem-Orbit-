using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OrbitEntity;

namespace OrbitInterface
{
    public interface IPropertyRepository : IRepository<Property>
    {
        List<Property> GetPropertiesByCategory(int categoryId);
        //List<Property> GetPropertiesByCategory(int categoryId, string proeprtyType);
    }
}
