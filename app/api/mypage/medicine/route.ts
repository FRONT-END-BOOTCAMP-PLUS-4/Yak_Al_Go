import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const medicines = await prisma.user_medis.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        start_date: true,
        end_date: true,
        medicines: {
          select: {
            item_name: true,
            item_seq: true,
          },
        },
      },
    });

    const formattedMedicines = medicines.map((med) => ({
      id: med.id,
      name: med.medicines.item_name,
      startDate: med.start_date ? med.start_date.toISOString().split('T')[0] : null,
      endDate: med.end_date ? med.end_date.toISOString().split('T')[0] : '계속',
      active: med.end_date ? new Date(med.end_date) > new Date() : true,
      item_seq: med.medicines.item_seq,
    }));

    return NextResponse.json(formattedMedicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return NextResponse.json({ error: 'Failed to fetch medicine data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const medicineId = searchParams.get('medicineId');

  if (!medicineId) {
    return NextResponse.json({ error: 'Medicine ID is required' }, { status: 400 });
  }

  try {
    await prisma.user_medis.delete({
      where: {
        id: parseInt(medicineId),
      },
    });

    return NextResponse.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    return NextResponse.json({ error: 'Failed to delete medicine' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, itemSeq, startDate, endDate } = body;

  if (!userId || !itemSeq || !startDate) {
    return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
  }

  try {
    const newMedicine = await prisma.user_medis.create({
      data: {
        userId,
        itemSeq,
        start_date: new Date(startDate),
        end_date: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(newMedicine);
  } catch (error) {
    console.error('Error adding medicine:', error);
    return NextResponse.json({ error: 'Failed to add medicine' }, { status: 500 });
  }
}
