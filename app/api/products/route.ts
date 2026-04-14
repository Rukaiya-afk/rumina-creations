import { NextResponse } from 'next/server';
import { addProduct } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const composition = formData.get('composition') as string;
    const technique = formData.get('technique') as string;
    const scale = formData.get('scale') as string;
    const imageFile = formData.get('image') as File;

    if (!title || !composition || !technique || !scale || !imageFile) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 2. Upload to Supabase Storage
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
    const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    
    // We use the supabaseServer client to ensure the upload is authorized via the user's session
    const { data: uploadData, error: uploadError } = await supabaseServer.storage
      .from('product-images')
      .upload(fileName, fileBuffer, {
        contentType: imageFile.type,
        upsert: false
      });


    if (uploadError) {
      console.error('Supabase Storage Error:', uploadError);
      return NextResponse.json({ error: "Failed to upload image to storage" }, { status: 500 });
    }

    // 3. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    // 4. Save to Supabase DB
    const newProduct = await addProduct({
      title,
      composition,
      technique,
      scale,
      image: publicUrl
    });

    if (!newProduct) {
      return NextResponse.json({ error: "Failed to save product to database" }, { status: 500 });
    }

    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
