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
    [RoutePrefix("api/apartments")]
    public class ApartmentController : ApiController
    {
        private IApartmentRepository repo;

        public ApartmentController(IApartmentRepository repo)
        {
            this.repo = repo;
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult Get()
        {
            var a = repo.GetAll();
            if (a == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(a);
            }
        }

        [Route("{id}", Name = "GetApartment")]
        public IHttpActionResult Get(int id)
        {
            Apartment a = repo.Get(id);

            if (a == null)
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Ok(a);
            }
        }

        [Route("")]
        [HttpPost]
        [BasicAuthentication]
        public IHttpActionResult Post(Apartment apartment)
        {
            apartment.DatePosted = DateTime.Now;
            repo.Insert(apartment);
            string url = Url.Link("GetApartment", new { id = apartment.Id });
            return Created(url, apartment);
        }
    }
}
