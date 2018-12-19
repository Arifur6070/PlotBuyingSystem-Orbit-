using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrbitEntity
{
    public class Property : Entity
    {
        public string Title { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public string Status { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public int CategoryId { get; set; }
        public int OwnerId { get; set; }     
    }
}
