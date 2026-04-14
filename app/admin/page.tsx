import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { getProducts } from '@/lib/db';
import AdminDashboard from './AdminDashboard';
import { signOut } from '../login/actions';
import './admin.css';

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

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
