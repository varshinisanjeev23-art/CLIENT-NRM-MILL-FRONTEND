import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ ok: false, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ ok: false, message: '' });
    try {
      await api.post('/auth/forgot-password', { email });
      setStatus({ ok: true, message: 'If an account exists, a reset link has been sent.' });
    } catch (err) {
      setStatus({ ok: false, message: err.response?.data?.message || 'Failed to send reset link' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Forgot Password</h1>
          <p className="text-slate-600 text-sm">Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your@email.com"
            />
          </div>
          {status.message && (
            <div className={`${status.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'} border-2 px-4 py-3 rounded-xl text-sm font-semibold`}>{status.message}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow hover:shadow-lg disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
