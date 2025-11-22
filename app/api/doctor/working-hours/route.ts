import { NextResponse } from "next/server";

// Mock working hours data
const mockWorkingHours = [
  {
    id: "1",
    doctorId: "test-doctor-123",
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    isActive: true
  },
  {
    id: "2",
    doctorId: "test-doctor-123",
    dayOfWeek: "TUESDAY",
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    isActive: true
  },
  {
    id: "3",
    doctorId: "test-doctor-123",
    dayOfWeek: "WEDNESDAY",
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    isActive: true
  },
  {
    id: "4",
    doctorId: "test-doctor-123",
    dayOfWeek: "THURSDAY",
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    isActive: true
  },
  {
    id: "5",
    doctorId: "test-doctor-123",
    dayOfWeek: "FRIDAY",
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    isActive: true
  },
  {
    id: "6",
    doctorId: "test-doctor-123",
    dayOfWeek: "SATURDAY",
    startTime: "09:00",
    endTime: "14:00",
    breakStart: null,
    breakEnd: null,
    isActive: false
  },
  {
    id: "7",
    doctorId: "test-doctor-123",
    dayOfWeek: "SUNDAY",
    startTime: "00:00",
    endTime: "00:00",
    breakStart: null,
    breakEnd: null,
    isActive: false
  }
];

export async function GET() {
  // Mock GET - ish soatlarini qaytarish
  return NextResponse.json({
    success: true,
    data: mockWorkingHours
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workingHours } = body;

    if (!workingHours || !Array.isArray(workingHours)) {
      return NextResponse.json(
        {
          success: false,
          error: "Noto'g'ri ma'lumot formati"
        },
        { status: 400 }
      );
    }

    // Mock save - faqat muvaffaqiyat qaytarish
    console.log("📅 Mock: Ish soatlari saqlandi:", workingHours);

    return NextResponse.json({
      success: true,
      message: "Ish soatlari muvaffaqiyatli saqlandi",
      data: workingHours
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Ish soatlarini saqlashda xato"
      },
      { status: 500 }
    );
  }
}

