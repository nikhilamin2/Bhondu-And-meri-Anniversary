import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photosDir = path.join(process.cwd(), 'public', 'photos');

    if (!fs.existsSync(photosDir)) {
      fs.mkdirSync(photosDir, { recursive: true });
    }

    const savedFiles: string[] = [];

    // Form data can have multiple "files" or "file" or mapped keys
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
      if (value && typeof value === 'object' && 'arrayBuffer' in value) {
        const file = value as File;
        const originalName = file.name || `photo-${Date.now()}.jpeg`;
        
        // Clean filename but preserve readable naming
        // Keep spaces and parentheses if user uploaded "WhatsApp Image..." or sanitize
        const safeName = originalName.replace(/[^\w\s\(\)\.\-]/gi, '_');
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(photosDir, safeName);

        fs.writeFileSync(filePath, buffer);
        savedFiles.push(safeName);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${savedFiles.length} photo(s)`,
      savedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload photos' },
      { status: 500 }
    );
  }
}
