import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Telefon raqam kiritilishi kerak"
        },
        { status: 400 }
      );
    }

    // Mock SMS yuborish
    console.log(`📱 Mock SMS sent to ${phoneNumber}: Code is 123456`);

    return NextResponse.json({
      success: true,
      message: "SMS kod yuborildi",
      data: {
        phoneNumber: phoneNumber,
        expiresIn: 300, // 5 daqiqa
        // Development uchun - haqiqiy kodda bu bo'lmasligi kerak!
        devCode: "123456"
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "SMS yuborishda xato"
      },
      { status: 500 }
    );
  }
}


