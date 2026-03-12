import { Link } from 'react-router-dom';
import services from '../data/services';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden py-24 px-4 bg-gradient-to-r from-indigo-600 to-blue-700">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA4MCAwIEwgMCAwIDAgODAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaW09InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tighter uppercase">
            Our Premium Services
          </h1>
          <p className="text-xl text-indigo-50 max-w-3xl mx-auto font-medium">
            Professional rice & wheat milling solutions tailored to your needs. From cleaning to polishing, we deliver excellence.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((svc, index) => (
            <div
              key={svc.slug}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image with overlay */}
              <div className="relative h-64 overflow-hidden">
                <div
                  className="h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${svc.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>

                {/* Floating badge */}
                <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-full shadow-lg">
                  <span className="text-sm font-bold text-indigo-600">Premium</span>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{svc.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">{svc.summary}</p>

                {/* Features list */}
                <div className="space-y-3 mb-6">
                  {svc.bullets.slice(0, 3).map((b, i) => (
                    <div key={b} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 flex-1">{b}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  to={`/services/${svc.slug}`}
                  className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>View Full Details</span>
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-indigo-100 mb-8">Book your rice milling service today and experience the NRM difference</p>
          <Link
            to="/contact"
            className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Book Service Now
          </Link>
        </div>
      </div>
    </div>
  );
}
