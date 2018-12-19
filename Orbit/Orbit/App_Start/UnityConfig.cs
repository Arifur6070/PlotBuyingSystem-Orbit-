using OrbitInterface;
using OrbitRepository;
using System.Web.Http;
using Unity;
using Unity.WebApi;

namespace Orbit
{
	public static class UnityConfig
	{
		public static void RegisterComponents()
		{
			var container = new UnityContainer();
			
			// register all your components with the container here
			// it is NOT necessary to register your controllers
			
			// e.g. container.RegisterType<ITestService, TestService>();
			container.RegisterType<IUserRepository, UserRepository>();
			container.RegisterType<IPersonRepository, PersonRepository>();
			container.RegisterType<IPropertyRepository, PropertyRepository>();
			container.RegisterType<IApartmentRepository, ApartmentRepository>();
			container.RegisterType<ICategoryRepository, CategoryRepository>();
			
			GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
		}
	}
}