import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, code } = body;

    if (!phoneNumber || !code) {
      return NextResponse.json(
        {
          success: false,
          error: "Telefon raqam va kod kiritilishi kerak"
        },
        { status: 400 }
      );
    }

    // Mock verification - har qanday kod qabul qilinadi (yoki faqat 1234567)
    const isValidCode = code === "1234567" || code.length === 7;

    if (!isValidCode) {
      return NextResponse.json(
        {
          success: false,
          error: "Noto'g'ri kod"
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "SMS kod tasdiqlandi",
      data: {
        verified: true,
        phoneNumber: phoneNumber
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Tasdiqlashda xato"
      },
      { status: 500 }
    );
  }
}


