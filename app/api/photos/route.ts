import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const photosDir = path.join(process.cwd(), 'public', 'photos');
    if (!fs.existsSync(photosDir)) {
      fs.mkdirSync(photosDir, { recursive: true });
      return NextResponse.json({ files: [], count: 0 });
    }

    const allEntries = fs.readdirSync(photosDir);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const imageFiles = allEntries.filter((file) =>
      validExtensions.includes(path.extname(file).toLowerCase())
    );

    return NextResponse.json({
      files: imageFiles.map((file) => ({
        filename: file,
        url: `/photos/${encodeURIComponent(file)}`,
        name: file,
        size: fs.statSync(path.join(photosDir, file)).size,
      })),
      count: imageFiles.length,
    });
  } catch (error) {
    console.error('Error reading photos:', error);
    return NextResponse.json({ error: 'Failed to read photos' }, { status: 500 });
  }
}
