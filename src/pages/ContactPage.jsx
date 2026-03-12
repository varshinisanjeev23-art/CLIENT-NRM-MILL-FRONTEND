import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ContactPage() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMessages = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/contact/my');
      setMessages(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Could not load replies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setStatus('Please sign in or sign up to send a message.');
      return;
    }

    try {
      await api.post('/contact', form);
      setStatus('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', message: '' });
      loadMessages();
    } catch {
      setStatus('Error sending message. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header as a Compact Banner */}
      <div className="relative py-16 px-4 text-center bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/contact_bg_realistic_1770094570685.png')` }}>
        {/* Dark overlay for the banner */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl mb-4 border border-white/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tighter uppercase">
            Get in <span className="text-cyan-400">Touch</span>
          </h1>
          <p className="text-lg text-cyan-50 max-w-xl mx-auto font-medium opacity-90">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20 pb-20">
        {/* Auth Required Notice */}
        {!user && (
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-8 mb-10 text-center shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-2xl font-bold text-white">Authentication Required</h3>
            </div>
            <p className="text-white text-lg mb-6">Please sign in or create an account to send us a message</p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="bg-white text-cyan-600 px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all">
                Sign In
              </Link>
              <Link to="/register" className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-700 transition-all">
                Create Account
              </Link>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-cyan-100 relative z-10">
          <div className="p-10">
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold mb-3 text-gray-700">Full Name</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full border-2 border-cyan-200 pl-12 pr-4 py-3 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold mb-3 text-gray-700">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full border-2 border-cyan-200 pl-12 pr-4 py-3 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold mb-3 text-gray-700">Phone Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border-2 border-cyan-200 pl-12 pr-4 py-3 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-bold mb-3 text-gray-700">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full border-2 border-cyan-200 px-4 py-3 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  Send Message
                </button>
              </form>
            ) : (
              <div className="text-center text-gray-600 py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-lg">You need to be logged in to send a message.</p>
              </div>
            )}
            {status && (
              <div className={`mt-6 p-4 rounded-xl text-center font-semibold ${status.includes('Error') || status.includes('Please') ? 'bg-red-100 text-red-800 border-2 border-red-300' : 'bg-green-100 text-green-800 border-2 border-green-300'}`}>
                {status}
              </div>
            )}
          </div>
        </div>
      </div>

      {
        user && (
          <div className="container mx-auto px-4 mt-10 pb-20 relative z-10">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-cyan-100">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Your Messages & Replies
                  </h2>
                  <button onClick={loadMessages} className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all">
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
              <div className="p-8">
                {loading && (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading messages...</p>
                  </div>
                )}
                {error && <p className="bg-red-100 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl">{error}</p>}
                {!loading && messages.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-600 text-lg">No messages yet. Submit the form above to contact us.</p>
                  </div>
                )}
                {!loading && messages.length > 0 && (
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <div key={m._id} className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(m.createdAt).toLocaleString()}
                          </span>
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${m.replied ? 'bg-green-500 text-white' : 'bg-yellow-400 text-yellow-900'}`}>
                            {m.replied ? '✓ Replied' : '⏱ Pending'}
                          </span>
                        </div>
                        <p className="text-gray-800 leading-relaxed mb-3">{m.message}</p>
                        {m.reply && (
                          <div className="mt-4 bg-white border-l-4 border-cyan-500 rounded-r-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                              </svg>
                              <strong className="text-cyan-600">Admin Reply:</strong>
                            </div>
                            <p className="text-gray-700 pl-7">{m.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
