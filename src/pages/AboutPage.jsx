export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-warm-gray-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 tracking-tighter uppercase">
            About NRM
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            Leading the rice & wheat industry with innovation and sustainability
          </p>
        </div>
      </div>

      {/* Story Cards */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-l-8 border-orange-500 transform hover:scale-105 transition-all duration-300">
            <div className="p-10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Mission</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    NRM is a leading rice milling platform committed to delivering high-quality rice processing services
                    at competitive rates. Our mission is to transform the rice industry through innovation, sustainability, and customer-centricity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Excellence Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-l-8 border-red-500 transform hover:scale-105 transition-all duration-300">
            <div className="p-10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">Excellence in Every Thread</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    With state-of-the-art facilities, expert technicians, and a passion for excellence, we serve manufacturers
                    across the region, helping them achieve outstanding fabric quality while minimizing environmental impact.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl font-extrabold mb-2">500+</div>
              <div className="text-orange-100 text-lg">Satisfied Clients</div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl font-extrabold mb-2">15+</div>
              <div className="text-red-100 text-lg">Years Experience</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl font-extrabold mb-2">100%</div>
              <div className="text-pink-100 text-lg">Eco-Friendly</div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
