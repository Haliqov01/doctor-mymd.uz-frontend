import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: appointmentId } = await params;

    // Mock confirm appointment
    console.log(`✅ Mock: Appointment ${appointmentId} confirmed`);

    return NextResponse.json({
      success: true,
      message: "Uchrashuv tasdiqlandi",
      data: {
        appointmentId: appointmentId,
        status: "CONFIRMED"
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Uchrashuv tasdiqlanmadi"
      },
      { status: 500 }
    );
  }
}

