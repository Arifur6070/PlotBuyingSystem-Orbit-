using OrbitEntity;
using OrbitInterface;
using PMSApp.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;

namespace Orbit.Controllers
{
    [RoutePrefix("api/people")]
    public class PersonController : ApiController
    {
        private IPersonRepository repo;

        public PersonController(IPersonRepository repo)
        {
            this.repo = repo;
        }

        //[HttpGet]
        //[Route("")]
        //public IHttpActionResult Get()
        //{
        //    var p = repo.GetAll();
        //    if (p == null)
        //    {
        //        return NotFound();
        //    }
        //    else
        //    {
        //        return Ok(p);
        //    }
        //}

        [HttpGet]
        [Route("")]
        [BasicAuthentication]
        public IHttpActionResult Get()
        {
            string usernamme = Thread.CurrentPrincipal.Identity.Name;

            var p = repo.GetAuthenticatedPerson(usernamme);
            if (p == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(p);
            }
        }

        [Route("{id}", Name = "GetPerson")]
        public IHttpActionResult Get(int id)
        {
            Person p = repo.Get(id);
            
            if (p == null)
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Ok(p);
            }
        }

        [Route("")]
        [HttpPost]
        public IHttpActionResult Post(Person person)
        {
            repo.Insert(person);
            string url = Url.Link("GetPerson", new { id = person.Id });
            return Created(url, person);
        }

        [Route("{id}")]
        [BasicAuthentication]
        public IHttpActionResult Put([FromBody]Person person, [FromUri]int id)
        {
            person.Id = id;
            repo.Update(person);
            return Ok(person);
        }

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            repo.Delete(repo.Get(id));
            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
