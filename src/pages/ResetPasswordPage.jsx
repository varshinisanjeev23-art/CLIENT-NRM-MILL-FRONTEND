import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ ok: false, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ ok: false, message: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    setStatus({ ok: false, message: '' });
    try {
      await api.post('/auth/reset-password', { token, password });
      setStatus({ ok: true, message: 'Password updated. Redirecting to login…' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setStatus({ ok: false, message: err.response?.data?.message || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Reset Password</h1>
          <p className="text-slate-600 text-sm">Enter a new password for your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="••••••••"
            />
          </div>
          {status.message && (
            <div className={`${status.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'} border-2 px-4 py-3 rounded-xl text-sm font-semibold`}>{status.message}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-xl font-bold shadow hover:shadow-lg disabled:opacity-60"
          >
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-violet-600 font-semibold hover:underline">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
