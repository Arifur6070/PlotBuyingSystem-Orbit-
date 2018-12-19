using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrbitEntity
{
    public class Location : Entity
    {
        public string LocationName { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public int PropertyId { get; set; }
    }
}
