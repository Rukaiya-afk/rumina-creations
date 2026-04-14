import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { signIn } from './actions';
import './login.css';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/admin');
  }

  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams.error;

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Artisan Portal</h1>
        <p className="login-subtitle">Sign in to manage your elegant catalogue</p>
        
        {error && (
          <div className="error-message" style={{ color: '#e53e3e', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={signIn} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="e.g. admin@ruminacreations.com"
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              className="form-input"
            />
          </div>
          <button type="submit" className="btn btn-login">Access Portal</button>
        </form>
      </div>
    </div>
  );
}
