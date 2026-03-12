export default function WhyNRMPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-amber-100">
      {/* Hero Section */}
      <div className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block p-5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full shadow-2xl mb-6">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
            Why Choose NRM Rice Mill?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quality, savings, and sustainability in every meter we process
          </p>
        </div>
      </div>

      {/* Content Cards */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Savings Section */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
            <div className="p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-gray-800">💰 Cost Savings</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                We pass on cost savings through bulk processing, optimized chemical usage, and reduced waste. 
                Our competitive pricing models help textile manufacturers maximize their margins while maintaining top quality.
              </p>
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">30%</div>
                  <div className="text-sm text-gray-600">Cost Reduction</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">99%</div>
                  <div className="text-sm text-gray-600">Quality Consistency</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">24h</div>
                  <div className="text-sm text-gray-600">Fast Turnaround</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sustainability Section */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
            <div className="p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-gray-800">🌿 Environmental Responsibility</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                Our facility employs advanced water reuse systems, eco-friendly chemicals, and energy-efficient processes. 
                We believe in sustainable textile processing that respects the environment and meets global compliance standards.
              </p>
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">70%</div>
                  <div className="text-sm text-gray-600">Water Reuse</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
                  <div className="text-sm text-gray-600">Eco-Friendly</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">40%</div>
                  <div className="text-sm text-gray-600">Energy Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
