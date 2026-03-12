import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    const redirect = params.get('redirect') || '/';

    if (token) {
      try {
        localStorage.setItem('token', token);
        if (name || email) {
          const user = { name: name || 'Google User', email: email || '', role: 'user' };
          localStorage.setItem('user', JSON.stringify(user));
        }
        navigate(redirect, { replace: true });
      } catch (e) {
        navigate(`/login?redirect=${encodeURIComponent(redirect)}&error=oauth_failed`, { replace: true });
      }
    } else {
      navigate(`/login?redirect=${encodeURIComponent(redirect)}&error=oauth_missing_token`, { replace: true });
    }
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-gray-600">Signing you in with Google…</div>
    </div>
  );
}
