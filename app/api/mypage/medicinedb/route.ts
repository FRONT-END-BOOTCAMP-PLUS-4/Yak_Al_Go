import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const medicines = await prisma.medicines.findMany({
      where: {
        OR: [
          { item_name: { contains: query, mode: 'insensitive' } },
          { entp_name: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        item_seq: true,
        item_name: true,
        entp_name: true,
      },
    });

    return NextResponse.json(medicines);
  } catch (error) {
    console.error('Error searching medicines:', error);
    return NextResponse.json({ error: 'Failed to search medicines' }, { status: 500 });
  }
}
