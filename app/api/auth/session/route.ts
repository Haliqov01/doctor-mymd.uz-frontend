import { NextResponse } from "next/server";

export async function GET() {
  // Mock session response - giriş yapmış doktor
  return NextResponse.json({
    success: true,
    data: {
      session: {
        userId: "test-doctor-123",
        email: "doctor@mymd.uz",
        role: "DOCTOR",
        iat: Date.now(),
        exp: Date.now() + 86400000
      },
      user: {
        id: "test-doctor-123",
        email: "doctor@mymd.uz",
        role: "DOCTOR",
        phoneNumber: "+998901234567",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      profile: {
        id: "profile-123",
        userId: "test-doctor-123",
        firstName: "Aziz",
        lastName: "Karimov",
        specialization: "Kardiolog",
        licenseNumber: "MD-123456",
        licenseVerified: true
      }
    }
  });
}

