using OrbitEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using OrbitRepository;
using OrbitInterface;
using PMSApp.Attributes;
using System.Threading;

namespace Orbit.Controllers
{
    [RoutePrefix("api/users")]
    public class UserController : ApiController
    {
        private IUserRepository repo;
        private IPersonRepository pRepo;

        private string username = Thread.CurrentPrincipal.Identity.Name;

        public UserController(IUserRepository repo)
        {
            this.repo = repo;
        }

        [HttpGet]
        [Route("")]
        [BasicAuthentication]
        public IHttpActionResult Get()
        {
            var users = repo.GetAll();
            if (users == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(users);
            }
        }

        [Route("{id}", Name = "GetUser")]
        public IHttpActionResult Get(int id)
        {
            User usr = repo.Get(id);

            if (usr == null)
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Ok(usr);
            }
        }

        [Route("")]
        [BasicAuthentication]
        public IHttpActionResult Get(string username, string password)
        {
            User usr = repo.GetUserCredentials(username, password);

            if (usr == null)
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Ok(usr);
            }
        }

        [Route("")]
        [HttpPost]
        public IHttpActionResult Post(User user)
        {
            repo.Insert(user);
            string url = Url.Link("GetUser", new { id = user.Id });
            return Created(url, user);
        }

        [Route("{id}")]
        public IHttpActionResult Put([FromBody]User user, [FromUri]int id)
        {
            user.Id = id;
            repo.Update(user);
            return Ok(user);
        }

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            repo.Delete(repo.Get(id));
            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
