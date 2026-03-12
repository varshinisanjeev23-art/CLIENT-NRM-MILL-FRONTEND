import { useParams, Link, useNavigate } from 'react-router-dom';
import services from '../data/services';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const svc = services.find((s) => s.slug === slug);

  if (!svc) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Service Not Found</h2>
          <p className="mb-6 text-gray-600">The service you're looking for doesn't exist.</p>
          <button onClick={() => navigate(-1)} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100">
      {/* Hero Image Section */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${svc.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-blue-900/60 to-transparent"></div>
        
        {/* Floating badge */}
        <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl">
          <div className="text-xs text-gray-600 mb-1">Service Category</div>
          <div className="text-lg font-bold text-indigo-600">Premium</div>
        </div>

        {/* Back button */}
        <div className="absolute top-8 left-8">
          <Link 
            to="/services" 
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl text-gray-800 font-semibold hover:bg-white transition-all group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <p className="text-sm text-indigo-200 uppercase tracking-wider mb-3 font-bold">Professional Service</p>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl">{svc.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100 -mt-32 relative z-10">
            <div className="p-12">
              {/* Description */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{svc.summary}</p>
              </div>

              {/* Features */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Key Features</h2>
                <div className="space-y-4">
                  {svc.bullets.map((b, index) => (
                    <div key={b} className="flex items-start gap-4 p-5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-800 flex-1 text-lg">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
               
                <Link 
                  to="/contact" 
                  className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Ask Questions
                </Link>
              </div>
            </div>

            {/* Info Footer */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-12 py-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Professional fabric processing with guaranteed quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">24-72 hour turnaround</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
