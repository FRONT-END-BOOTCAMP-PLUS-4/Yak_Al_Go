import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hpid = searchParams.get('hpid');

  if (!hpid) {
    return NextResponse.json({ error: 'HPID is required' }, { status: 400 });
  }

  try {
    const pharmacy = await prisma.pharmacies.findUnique({
      where: {
        hpid: hpid,
      },
      select: {
        duty_name: true,
        duty_addr: true,
      },
    });

    if (!pharmacy) {
      return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: pharmacy.duty_name,
      address: pharmacy.duty_addr,
    });
  } catch (error) {
    console.error('Error fetching pharmacy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pharmacy data' },
      { status: 500 }
    );
  }
}