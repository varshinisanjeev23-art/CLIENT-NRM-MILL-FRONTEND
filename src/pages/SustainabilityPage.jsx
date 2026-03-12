import { Link } from 'react-router-dom';

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=2000"
          alt="Lush Greenhouse"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-sm"></div>
      </div>
      <div className="relative py-20 px-4">
        <div className="container mx-auto relative z-10">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-12 max-w-5xl mx-auto">
            <Link to="/why-nrm/savings" className="flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Savings
            </Link>
            <Link to="/why-nrm" className="flex items-center gap-2 text-emerald-200 font-semibold hover:gap-3 transition-all group">
              <span>Back to Why NRM</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="inline-block p-5 bg-white/10 rounded-full shadow-2xl mb-6 border border-white/20">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tighter uppercase">
            Eco-Friendly <span className="text-emerald-400 italic">Future</span>
          </h1>
          <p className="text-xl text-emerald-50 max-w-3xl mx-auto font-medium shadow-black/20 text-shadow-sm">
            Sustainable processing that cares for our planet and preserves local ecosystems
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Content Side */}
              <div className="p-12 order-2 lg:order-1">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Sustainable Milling, Better Future</h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-8">
                  Our rice milling processes prioritize environmental responsibility: efficient water usage,
                  by-product utilization, and energy-efficient machinery. We minimize waste while maximizing
                  the value of every grain, creating a sustainable supply chain from paddy to plate.
                </p>

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border-l-4 border-emerald-500 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">Water Conservation</h3>
                      <p className="text-gray-600">Advanced cleaning systems reduce water usage by 60%</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-2xl border-l-4 border-teal-500 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">By-Product Utilization</h3>
                      <p className="text-gray-600">Husk and bran converted to valuable animal feed and fuel</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-lime-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">Energy Efficiency</h3>
                      <p className="text-gray-600">Solar-powered mills and optimized machinery reduce carbon footprint</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-lime-50 rounded-2xl border-l-4 border-lime-500 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">Zero Waste Initiative</h3>
                      <p className="text-gray-600">Complete utilization of paddy components with minimal waste</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Side */}
              <div className="relative h-80 lg:h-auto order-1 lg:order-2 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transform hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-teal-600/30"></div>
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl">
                  <div className="text-3xl font-extrabold text-emerald-600">100%</div>
                  <div className="text-sm text-gray-700">Eco-Friendly</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-6">Explore more benefits</p>
            <Link
              to="/why-nrm/savings"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous: Savings
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
}
