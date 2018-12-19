using OrbitEntity;
using OrbitRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OrbitApp.Controllers
{
    public class PersonController : BaseController
    {
        private PersonRepository repoPerson = new PersonRepository();
        private UserRepository repoUser = new UserRepository();

        // GET: Person
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Dashboard()
        {
            return View(this.repoPerson.Get(Convert.ToInt32(Session["UserId"])));
        }

        [HttpGet]
        public ActionResult Profile()
        {
            Person p = new Person();
            p = this.repoPerson.Get(Convert.ToInt32(Session["UserId"]));
            if (p != null)
            {
                Session["Email"] = p.Email.ToString();
            }
               
            return View(p);
        }

        [HttpPost]
        public ActionResult Profile(Person person)
        {
            this.repoPerson.Update(person);
            return View(person);
        }

        [HttpGet]
        public ActionResult PostAd()
        {
            return View();
        }

        [HttpGet]
        public ActionResult ChangePassword()
        {
            return View();
        }

        //[HttpPost]
        //public ActionResult ChangePassword(User user)
        //{
        //    if (user.OldPassword == null || user.Password == null || user.ConfirmPassword == null)
        //    {
        //        return View();
        //    }
        //    else
        //    {
        //        User newUser = new User()
        //        {
        //            Username = user.Username,
        //            Password = user.OldPassword
        //        };

        //        User validUser = repoUser.Validate(newUser);
        //        if (validUser == null)
        //        {
        //            ViewData["PasswordNotification"] = "Your password was incorrect";
        //            return View();
        //        }
        //        else
        //        {
        //            newUser.Id = Convert.ToInt32(Session["UserId"]);
        //            newUser.OldPassword = user.OldPassword;
        //            newUser.ConfirmPassword = user.ConfirmPassword;
        //            newUser.Password = user.Password;
        //            repoUser.Update(newUser);
        //            return Content("Password Changed!");
                    
        //        }               
        //    }
        //}
    }
}