import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const pharmacies = await prisma.pharmacy.findMany({
      select: {
        dutyName: true,
        wgs84Lat: true,
        wgs84Lon: true,
      },
    });
    return NextResponse.json(pharmacies);
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    return NextResponse.json(
      { error: '약국 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}