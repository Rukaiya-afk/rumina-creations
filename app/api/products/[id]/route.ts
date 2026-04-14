import { NextResponse } from 'next/server';
import { deleteProduct, getProduct } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { createClient } from '@/lib/supabase-server';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Auth check
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // 2. Get product to find the image filename for storage deletion
    const product = await getProduct(id);
    if (product && product.image.includes('supabase.co')) {
      const urlParts = product.image.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Attempt removal from storage
      await supabase.storage
        .from('product-images')
        .remove([fileName]);
    }

    // 3. Delete from DB
    const success = await deleteProduct(id);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete product from database" }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete API Error:', error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
