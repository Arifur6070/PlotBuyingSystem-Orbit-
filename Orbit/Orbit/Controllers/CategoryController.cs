using OrbitEntity;
using OrbitInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Orbit.Controllers
{
    [RoutePrefix("api/categories")]
    public class CategoryController : ApiController
    {
        private ICategoryRepository repo;
        private IApartmentRepository aRepo;

        public CategoryController(ICategoryRepository repo, IApartmentRepository aRepo)
        {
            this.repo = repo;
            this.aRepo = aRepo;
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

        [Route("{id}", Name = "GetCategory")]
        public IHttpActionResult Get(int id)
        {
            Category c = repo.Get(id);

            if (c == null)
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Ok(c);
            }
        }

        [Route("")]
        [HttpPost]
        public IHttpActionResult Post(Category category)
        {
            repo.Insert(category);
            string url = Url.Link("GetCategory", new { id = category.Id });
            return Created(url, category);
        }

        [Route("{id}")]
        public IHttpActionResult Put([FromBody]Category category, [FromUri]int id)
        {
            category.Id = id;
            repo.Update(category);
            return Ok(category);
        }

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            repo.Delete(repo.Get(id));
            return StatusCode(HttpStatusCode.NoContent);
        }

        [Route("{id}/apartments")]
        public IHttpActionResult GetApartments(int id)
        {
            return Ok(aRepo.GetApartmentsByCategory(id));
        }

    }
}
