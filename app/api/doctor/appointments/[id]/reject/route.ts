import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: appointmentId } = await params;
    const body = await request.json();
    const { reason } = body;

    // Mock reject appointment
    console.log(`❌ Mock: Appointment ${appointmentId} rejected. Reason: ${reason || 'No reason'}`);

    return NextResponse.json({
      success: true,
      message: "Uchrashuv rad etildi",
      data: {
        appointmentId: appointmentId,
        status: "REJECTED",
        rejectionReason: reason
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Uchrashuv rad etilmadi"
      },
      { status: 500 }
    );
  }
}

