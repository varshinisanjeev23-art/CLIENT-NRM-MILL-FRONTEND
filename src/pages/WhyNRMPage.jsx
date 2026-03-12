export default function WhyNRMPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-warm-gray-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 px-4 bg-gradient-to-r from-amber-600 to-orange-700">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block p-5 bg-white/10 backdrop-blur-md rounded-full shadow-2xl mb-6 border border-white/20">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tighter uppercase">
            Why Choose <span className="text-rose-400">NRM?</span>
          </h1>
          <p className="text-xl text-rose-50 max-w-3xl mx-auto font-medium shadow-black/20 text-shadow-sm">
            Two core pillars that set us apart: unbeatable savings and unwavering sustainability
          </p>
        </div>
      </div>

      {/* Main Sections */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Savings Section */}
          <section id="savings" className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800">💰 Savings</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  We cut cost without cutting corners. Optimized recipes, bulk chemical procurement, and energy-aware runs
                  drive lower cost-per-meter while keeping your whiteness index and shade targets consistent.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800 flex-1">Bulk procurement & optimized liquor ratios reduce chemical spend</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800 flex-1">Shorter cycle times through optimized rice milling processes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800 flex-1">Real-time QC minimizes rework and over-processing costs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800 flex-1">Transparent pricing with predictable cost-per-meter models</span>
                  </li>
                </ul>
                <a href="/why-nrm/savings" className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
                  Learn More About Savings →
                </a>
              </div>
              <div className="relative h-80 lg:h-auto overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transform hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20"></div>
              </div>
            </div>
          </section>

          {/* Sustainability Section */}
          <section id="sustainability" className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-80 lg:h-auto overflow-hidden order-2 lg:order-1">
                <div
                  className="absolute inset-0 bg-cover bg-center transform hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-teal-600/20"></div>
              </div>
              <div className="p-12 order-1 lg:order-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800">🌿 Sustainability</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Sustainability is built into every run: water reuse, low-impact chemistries, and energy-efficient machinery.
                  You get compliant outputs, lower effluent load, and a greener supply chain story.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800 flex-1">Closed-loop water recovery to cut fresh water draw</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800 flex-1">Formulations tuned for lower COD/BOD and minimal AOX</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800 flex-1">Energy-optimized process windows per fabric</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800 flex-1">Traceable batches with environmental metrics per lot</span>
                  </li>
                </ul>
                <a href="/why-nrm/sustainability" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
                  Learn More About Sustainability →
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div >
  );
}
