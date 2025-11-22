import { NextResponse } from "next/server";

export async function POST() {
  // Mock logout - har doim muvaffaqiyatli
  const response = NextResponse.json({
    success: true,
    message: "Muvaffaqiyatli chiqdingiz"
  });

  // Cookie'yi sil
  response.cookies.delete("token");

  return response;
}

