import { useState } from 'react';
import api from '../services/api';

export default function CareersPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleApplyClick = (position) => {
    setSelectedPosition(position);
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    if (!file) {
      setStatus({ type: 'error', message: 'Please upload your resume.' });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('position', selectedPosition);
    formData.append('message', form.message);
    formData.append('resume', file);

    try {
      await api.post('/careers/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ type: 'success', message: 'Application submitted successfully!' });
      setForm({ name: '', email: '', phone: '', message: '' });
      setFile(null);
      setTimeout(() => setShowForm(false), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Error submitting application.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden py-24 px-4 bg-gradient-to-r from-slate-700 to-gray-800">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block p-5 bg-white/10 rounded-full shadow-2xl mb-6 border border-white/20">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tighter uppercase">
            Careers at <span className="text-slate-400">NRM</span>
          </h1>
          <p className="text-xl text-slate-100 max-w-3xl mx-auto font-medium">
            Join our team of dedicated professionals shaping the future of rice & wheat milling
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Info Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 mb-8">
            <div className="p-12">
              <div className="flex items-start gap-6 mb-8">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Our Team</h2>
                  <p className="text-gray-700 leading-relaxed text-lg mb-4">
                    Join our team of dedicated professionals shaping the future of rice milling.
                    We are always looking for talented individuals in engineering, operations, and administration.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Send your resume to <a href="mailto:careers@nrm.com" className="text-blue-600 hover:text-blue-700 font-semibold underline">careers@nrm.com</a> or contact us via our Contact page.
                  </p>
                </div>
              </div>

              {/* Open Positions */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Current Opportunities</h3>
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border-l-4 border-slate-600 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-gray-800">Process Engineer</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Full-time</span>
                    </div>
                    <p className="text-gray-600 mb-3">Optimize rice milling workflows with data-driven process improvements</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">Engineering</span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">1+ years</span>
                    </div>
                    <button 
                      onClick={() => handleApplyClick('Process Engineer')}
                      className="mt-4 text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      Apply Now <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>


                  <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border-l-4 border-slate-600 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-gray-800">Quality Control Specialist</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Full-time</span>
                    </div>
                    <p className="text-gray-600 mb-3">Ensure compliance with international standards and customer specifications</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">Operations</span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">1+ years</span>
                    </div>
                    <button 
                      onClick={() => handleApplyClick('Quality Control Specialist')}
                      className="mt-4 text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      Apply Now <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>


                  <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border-l-4 border-slate-600 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-gray-800">Operations Manager</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Full-time</span>
                    </div>
                    <p className="text-gray-600 mb-3">Lead day-to-day operations and drive continuous improvement initiatives</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">Management</span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">1+ years</span>
                    </div>
                    <button 
                      onClick={() => handleApplyClick('Operations Manager')}
                      className="mt-4 text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      Apply Now <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="bg-gradient-to-r from-slate-700 to-gray-800 px-12 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">Ready to Make an Impact?</h3>
                  <p className="text-slate-200">Send us your resume and let's build the future together</p>
                </div>
                <button 
                  onClick={() => handleApplyClick('General Application')}
                  className="px-8 py-3 bg-white text-gray-800 rounded-xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Submit General Application
                </button>
              </div>
            </div>

            {/* Application Form */}
            {showForm && (
              <div id="application-form" className="p-12 border-t border-gray-200 bg-slate-50">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-gray-800">Apply for: <span className="text-blue-600">{selectedPosition}</span></h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input 
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({...form, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Resume (PDF/DOC) *</label>
                      <input 
                        type="file" 
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Cover Letter / Message</label>
                    <textarea 
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                      placeholder="Tell us why you are a great fit..."
                    />
                  </div>

                  {status.message && (
                    <div className={`p-4 rounded-xl text-center font-semibold ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {status.message}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-blue-700 disabled:bg-blue-300 transition-all"
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div >
  );
}
