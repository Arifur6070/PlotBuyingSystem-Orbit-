using OrbitEntity;
using OrbitInterface;
using PMSApp.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Orbit.Controllers
{
    [RoutePrefix("api/properties")]
    public class PropertyController : ApiController
    {
        private IPropertyRepository repo;

        public PropertyController(IPropertyRepository repo)
        {
            this.repo = repo;
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult Get()
        {
            var p = repo.GetAll();
            if (p == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(p);
            }
        }

        [Route("{id}", Name = "GetProperty")]
        public IHttpActionResult Get(int id)
        {
            Property p = repo.Get(id);

            if (p == null)
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Ok(p);
            }
        }

        //[Route("")]
        //[HttpPost]
        //[BasicAuthentication]
        //public IHttpActionResult Post(Property property)
        //{
        //    property.DateCreated = DateTime.Now;
        //    repo.Insert(property);
        //    string url = Url.Link("GetProperty", new { id = property.Id });
        //    return Created(url, property);
        //}

        [Route("{id}")]
        [BasicAuthentication]
        public IHttpActionResult Put([FromBody]Property property, [FromUri]int id)
        {
            property.Id = id;
            repo.Update(property);
            return Ok(property);
        }

        [Route("{id}")]
        [BasicAuthentication]
        public IHttpActionResult Delete(int id)
        {
            repo.Delete(repo.Get(id));
            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
