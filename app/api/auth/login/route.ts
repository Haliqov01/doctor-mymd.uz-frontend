import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, password } = body;

    // Mock login - har qanday telefon va parol qabul qilinadi
    if (!phoneNumber || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Telefon raqam va parol kiritilishi kerak"
        },
        { status: 400 }
      );
    }

    // Mock successful login
    const token = "mock-jwt-token-123456789";
    
    const response = NextResponse.json({
      success: true,
      message: "Muvaffaqiyatli kirdingiz",
      data: {
        user: {
          id: "test-doctor-123",
          email: "doctor@mymd.uz",
          role: "DOCTOR",
          phoneNumber: phoneNumber,
          status: "ACTIVE"
        },
        token: token,
        profile: {
          firstName: "Aziz",
          lastName: "Karimov",
          specialization: "Kardiolog",
          licenseNumber: "MD-123456",
          licenseVerified: true
        }
      }
    });

    // Cookie olarak token'ı set et
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server xatosi"
      },
      { status: 500 }
    );
  }
}

