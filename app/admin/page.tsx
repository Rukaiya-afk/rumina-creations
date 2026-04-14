import { createClient } from '@/lib/supabase-server';
import { getProducts } from '@/lib/db';
import AdminDashboard from './AdminDashboard';
import { signIn, signOut } from '../login/actions';
import './admin.css';
import '../login/login.css';

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If NOT logged in, show the login form right here (Consolidated Admin Login)
  if (!user) {
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
                placeholder="admin@ruminacreations.com"
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
            <input type="hidden" name="fromAdmin" value="true" />
            <button type="submit" className="btn btn-login">Access Portal</button>
          </form>
        </div>
      </div>
    );
  }

  // If logged in, show the dashboard
  const initialProducts = await getProducts();

  return (
    <div className="admin-container">
      <div className="admin-header-row">
        <h1 className="admin-title">Portal Dashboard</h1>
        <form action={signOut}>
          <button type="submit" className="btn btn-secondary">Logout</button>
        </form>
      </div>
      <AdminDashboard initialProducts={initialProducts} />
    </div>
  );
}
