using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrbitEntity
{
    public class Apartment : Entity
    {
        public int OwnerId { get; set; }
        public int CategoryId { get; set; }
        public int Size { get; set; }
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public DateTime DatePosted { get; set; }
    }
}
