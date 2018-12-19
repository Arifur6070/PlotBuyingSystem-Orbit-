using OrbitEntity;
using OrbitRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OrbitApp.Controllers
{
    public class UserController : Controller
    {
        private UserRepository repoUser = new UserRepository();
        private PersonRepository repoPerson = new PersonRepository();
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(User user)
        {
            User validUser = repoUser.Validate(user);
            if (validUser != null)
            {
                Session["Username"] = validUser.Username;
                Session["UserId"] = validUser.Id;
                return RedirectToAction("Dashboard", "Person");
            }
            else
            {
                return Content("Invalid username or password");
            }
        }

        [HttpGet]
        public ActionResult Registration()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Registration(Person person)
        {
            Session["Name"] = person.Name;
            Session["Email"] = person.Email;
            Session["PhoneNum"] = person.PhoneNum;
            Session["Address"] = person.Address;

            if (person.Name == null || person.Email == null || person.PhoneNum == null || person.Address == null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("RegistrationConfirm");
            }
        }

        [HttpGet]
        public ActionResult RegistrationConfirm()
        {
            return View();
        }

        [HttpPost]
        public ActionResult RegistrationConfirm(User user)
        {
            if (user.Username == null || user.Password == null)
            {
                return View();
            }
            else
            {
                Person person = new Person()
                {
                    Name = Session["Name"].ToString(),
                    Username = user.Username,
                    Email = Session["Email"].ToString(),
                    PhoneNum = Session["PhoneNum"].ToString(),
                    Address = Session["Address"].ToString(),
                };

                this.repoPerson.Insert(person);
                this.repoUser.Insert(user);

                Session.Abandon();
                return RedirectToAction("Login");
            }
        }

        public ActionResult Test()
        {
            return View();
        }
    }
}