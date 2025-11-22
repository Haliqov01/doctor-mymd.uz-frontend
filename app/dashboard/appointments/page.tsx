"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  reason: string;
  patientNotes?: string;
  doctorNotes?: string;
  rejectionReason?: string;
  patient: {
    id: string;
    name: string;
    phoneNumber?: string;
    email: string;
  };
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
}

const statusConfig = {
  PENDING: {
    label: "Tasdiqlash kutilmoqda",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: AlertCircle,
  },
  CONFIRMED: {
    label: "Tasdiqlandi",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rad etildi",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Bekor qilingan",
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: XCircle,
  },
  COMPLETED: {
    label: "Yakunlandi",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: CheckCircle2,
  },
  NO_SHOW: {
    label: "Kelmadi",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: XCircle,
  },
};

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/doctor/appointments");
      if (!response.ok) throw new Error("Uchrashuvlar yuklanmadi. Iltimos, keyinroq urinib ko‘ring.");

      const data = await response.json();
      setAppointments(data.data.appointments || []);
    } catch (error) {
      console.error("Uchrashuvlar yuklanayotganda xatolik yuz berdi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (appointmentId: string) => {
    if (!confirm("Uchrashuvni tasdiqlashni xohlaysizmi?")) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/doctor/appointments/${appointmentId}/confirm`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Uchrashuv tasdiqlanmadi.");

      alert("Uchrashuv tasdiqlandi.");
      fetchAppointments();
    } catch (error) {
      console.error("Uchrashuv tasdiqlanayotganda xatolik yuz berdi:", error);
      alert("Uchrashuv tasdiqlanayotganda xatolik yuz berdi.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedAppointment) return;
    if (rejectionReason.length < 10) {
      alert("Iltimos, rad etish sababini kamida 10 belgidan iborat aniq tarzda yozing.");
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/doctor/appointments/${selectedAppointment.id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason }),
      });

      if (!response.ok) throw new Error("Uchrashuvni rad etib bo‘lmadi");

      alert("Uchrashuv muvaffaqiyatli rad etildi.");
      setRejectDialogOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error("Uchrashuvni rad etishda xatolik yuz berdi:", error);
      alert("Uchrashuvni rad etishda xatolik yuz berdi.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("uz-UZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }).format(date);
  };

  const filterAppointments = (status?: string) => {
    if (status === "all" || !status) return appointments;
    return appointments.filter((apt) => apt.status === status);
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const config = statusConfig[appointment.status];
    const StatusIcon = config.icon;
    const isPending = appointment.status === "PENDING";

    return (
      <Card className={`hover:shadow-md transition-shadow ${isPending ? "border-yellow-300 border-2" : ""}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {appointment.patient.name}
              </CardTitle>
              <div className="flex flex-col gap-1 mt-2 text-sm text-gray-600">
                {appointment.patient.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {appointment.patient.phoneNumber}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {appointment.patient.email}
                </div>
              </div>
            </div>
            <Badge className={`${config.color} border flex items-center gap-1`}>
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="font-medium">{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="font-medium">
                {appointment.startTime} - {appointment.endTime}
              </span>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-green-900">Shikoyat / Sabab:</div>
                <div className="text-sm text-green-700 mt-1">{appointment.reason}</div>
              </div>
            </div>
          </div>

          {appointment.patientNotes && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900">Bemor yozuvlari:</div>
              <div className="text-sm text-blue-700 mt-1">{appointment.patientNotes}</div>
            </div>
          )}

          {appointment.status === "REJECTED" && appointment.rejectionReason && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm font-medium text-red-900">Rad etish sababi:</div>
              <div className="text-sm text-red-700 mt-1">{appointment.rejectionReason}</div>
            </div>
          )}

          <div className="text-xs text-gray-500">
          So‘rov vaqti: {new Date(appointment.createdAt).toLocaleString("tr-TR")}
          </div>

          {isPending && (
            <div className="flex gap-2 pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                onClick={() => handleRejectClick(appointment)}
                disabled={actionLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Rad etish
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleConfirm(appointment.id)}
                disabled={actionLoading}
              >
                <Check className="mr-2 h-4 w-4" />
                Tasdiqlash
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  const allAppointments = filterAppointments("all");
  const pendingAppointments = filterAppointments("PENDING");
  const confirmedAppointments = filterAppointments("CONFIRMED");
  const completedAppointments = filterAppointments("COMPLETED");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Bosh sahifaga qaytish
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Uchrashuvlar</CardTitle>
            <CardDescription>
              Bemorlarning uchrashuvlarini ko‘rish va boshqarish
            </CardDescription>
          </CardHeader>
        </Card>

        {pendingAppointments.length > 0 && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">
                  {pendingAppointments.length} Sizda haligacha tasdiqlanmagan uchrashuv so‘rovi bor
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="pending">
              Tasdiqlash kutilmoqda ({pendingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Tasdiqlandi ({confirmedAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Yakunlandi ({completedAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              Barchasi ({allAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Kutayotgan uchrashuv so‘rovi yo‘q</p>
                </CardContent>
              </Card>
            ) : (
              pendingAppointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
            )}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            {confirmedAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Tasdiqlangan uchrashuvlar yo‘q</p>
                </CardContent>
              </Card>
            ) : (
              confirmedAppointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Yakunlangan uchrashuvlar yo‘q</p>
                </CardContent>
              </Card>
            ) : (
              completedAppointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {allAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Hozircha uchrashuvingiz yo‘q</p>
                </CardContent>
              </Card>
            ) : (
              allAppointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
            )}
          </TabsContent>
        </Tabs>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Uchrashuvni Rad etish</DialogTitle>
              <DialogDescription>
                Iltimos, uchrashuvni rad etish sababini aniq tarzda yozing. Bu sabab bemorga yetkaziladi.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rad etish sababi</Label>
                <Input
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Masalan: Bu kunda boshqa uchrashuv mavjud..."
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Kamida 10 belgidan iborat</p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
                disabled={actionLoading}
              >
                Bekor qilish
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectConfirm}
                disabled={actionLoading || rejectionReason.length < 10}
              >
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Rad etish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

