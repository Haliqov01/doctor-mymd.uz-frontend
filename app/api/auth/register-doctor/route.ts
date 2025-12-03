import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phoneNumber, specialization, password } = body;

    // Validation
    if (!firstName || !lastName || !email || !phoneNumber || !specialization || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Barcha majburiy maydonlarni to'ldiring"
        },
        { status: 400 }
      );
    }

    // Mock successful registration
    return NextResponse.json({
      success: true,
      message: "Ro'yxatdan o'tdingiz! Profilingizni to'ldiring.",
      data: {
        user: {
          id: "new-doctor-" + Date.now(),
          email: email,
          phoneNumber: phoneNumber,
          role: "DOCTOR",
          status: "PENDING"
        },
        profile: {
          firstName: firstName,
          lastName: lastName,
          specialization: specialization,
          licenseVerified: false
        },
        token: "mock-jwt-token-" + Date.now()
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Ro'yxatdan o'tishda xato"
      },
      { status: 500 }
    );
  }
}


