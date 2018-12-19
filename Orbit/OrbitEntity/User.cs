using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OrbitEntity
{
    public class User : Entity
    {
        [Required(ErrorMessage = "Username cannot be empty")]
        [MaxLength(32)]
        public string Username { get; set; }

        [Required(ErrorMessage = "New Password cannot be empty")]
        [DataType(DataType.Password)]
        [MaxLength(16, ErrorMessage = "Maximum 16 characters allowed")]
        [MinLength(4, ErrorMessage = "Minimum 4 characters required")]
        public string Password { get; set; }    


    }
}
