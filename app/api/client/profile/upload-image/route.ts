import { getClientSession } from "@/lib/auth";
import { storageService, StorageBucket } from "@/lib/storage/supabase-storage";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Upload gambar
    const { url: imageUrl } = await storageService.uploadFile(
      StorageBucket.PROFILE_IMAGES,
      file,
      {
        path: `user_${session.id}`, // Gunakan underscore daripada hyphen
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
      }
    );

    // Update user profile dengan URL gambar baru
    await prisma.user.update({
      where: { id: session.id },
      data: { image: imageUrl }
    });

    return NextResponse.json({
      imageUrl,
      message: "Profile image updated successfully"
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error.statusCode || 500 }
    );
  }
}