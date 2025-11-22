import { NextResponse } from "next/server";

// Mock appointments data
const mockAppointments = [
  {
    id: "apt-1",
    patientName: "Alisher Tursunov",
    patientPhone: "+998901234567",
    date: new Date(Date.now() + 86400000).toISOString(), // Ertaga
    time: "10:00",
    status: "PENDING",
    reason: "Yurak tekshiruvi",
    notes: "Birinchi marta keladi"
  },
  {
    id: "apt-2",
    patientName: "Malika Karimova",
    patientPhone: "+998902345678",
    date: new Date(Date.now() + 86400000).toISOString(),
    time: "11:30",
    status: "CONFIRMED",
    reason: "Qon bosimi muammosi",
    notes: ""
  },
  {
    id: "apt-3",
    patientName: "Jahongir Rahimov",
    patientPhone: "+998903456789",
    date: new Date(Date.now() + 172800000).toISOString(), // 2 kundan keyin
    time: "14:00",
    status: "PENDING",
    reason: "Konsultatsiya",
    notes: "Takroriy qabul"
  }
];

export async function GET() {
  // Mock appointments list
  return NextResponse.json({
    success: true,
    data: {
      appointments: mockAppointments,
      total: mockAppointments.length
    }
  });
}

