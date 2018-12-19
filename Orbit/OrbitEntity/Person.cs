using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrbitEntity
{
    public class Person : Entity
    {
        [Required(ErrorMessage = "Name cannot be empty")]
        [MaxLength(32)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Username cannot be empty")]
        [MaxLength(32)]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email cannot be empty")]
        [DataType(DataType.EmailAddress)]
        [MaxLength(32)]
        public string Email { get; set; }

        [Required(ErrorMessage = "Phone Number cannot be empty")]
        [DataType(DataType.PhoneNumber)]
        [MaxLength(14)]
        public string PhoneNum { get; set; }

        [Required(ErrorMessage = "Address cannot be empty")]
        [MaxLength(50)]
        public string Address { get; set; }
    }
}
