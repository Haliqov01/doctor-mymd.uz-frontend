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
import { appointmentService } from "@/lib/services";
import { clearStoredToken } from "@/lib/api-client";
import { Appointment, AppointmentStatus } from "@/types";

const statusConfig = {
  [AppointmentStatus.Pending]: {
    label: "Tasdiqlash kutilmoqda",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: AlertCircle,
  },
  [AppointmentStatus.Approved]: {
    label: "Tasdiqlandi",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle2,
  },
  [AppointmentStatus.Rejected]: {
    label: "Rad etildi",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: XCircle,
  },
  [AppointmentStatus.Completed]: {
    label: "Yakunlandi",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: CheckCircle2,
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
      const result = await appointmentService.getAppointments({
        pageNumber: 1,
        pageSize: 100,
      });
      setAppointments(result.data || []);
    } catch (error: any) {
      console.error("Uchrashuvlar yuklanayotganda xatolik:", error);
      if (error.status === 401) {
        clearStoredToken();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (appointmentId: number) => {
    if (!confirm("Uchrashuvni tasdiqlashni xohlaysizmi?")) return;

    setActionLoading(true);
    try {
      await appointmentService.confirmAppointment(appointmentId);
      alert("Uchrashuv tasdiqlandi.");
      fetchAppointments();
    } catch (error: any) {
      console.error("Uchrashuv tasdiqlanayotganda xatolik:", error);
      alert(error.message || "Uchrashuv tasdiqlanayotganda xatolik yuz berdi.");
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
      await appointmentService.rejectAppointment(selectedAppointment.id, rejectionReason);
      alert("Uchrashuv muvaffaqiyatli rad etildi.");
      setRejectDialogOpen(false);
      fetchAppointments();
    } catch (error: any) {
      console.error("Uchrashuvni rad etishda xatolik:", error);
      alert(error.message || "Uchrashuvni rad etishda xatolik yuz berdi.");
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

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filterAppointments = (status?: AppointmentStatus) => {
    if (status === undefined) return appointments;
    return appointments.filter((apt) => apt.status === status);
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const config = statusConfig[appointment.status] || statusConfig[AppointmentStatus.Pending];
    const StatusIcon = config.icon;
    const isPending = appointment.status === AppointmentStatus.Pending;

    return (
      <Card className={`hover:shadow-md transition-shadow ${isPending ? "border-yellow-300 border-2" : ""}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {appointment.patientName}
              </CardTitle>
              <div className="flex flex-col gap-1 mt-2 text-sm text-gray-600">
                {appointment.patientPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {appointment.patientPhone}
                  </div>
                )}
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
              <span className="font-medium">{formatDate(appointment.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="font-medium">
                {formatTime(appointment.scheduledDate)} ({appointment.duration} daqiqa)
              </span>
            </div>
          </div>

          {appointment.message && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-900">Shikoyat / Sabab:</div>
                  <div className="text-sm text-green-700 mt-1">{appointment.message}</div>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            So'rov vaqti: {new Date(appointment.createdDate).toLocaleString("uz-UZ")}
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

  const allAppointments = filterAppointments();
  const pendingAppointments = filterAppointments(AppointmentStatus.Pending);
  const confirmedAppointments = filterAppointments(AppointmentStatus.Approved);
  const completedAppointments = filterAppointments(AppointmentStatus.Completed);

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
              Bemorlarning uchrashuvlarini ko'rish va boshqarish
            </CardDescription>
          </CardHeader>
        </Card>

        {pendingAppointments.length > 0 && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">
                  {pendingAppointments.length} ta tasdiqlanmagan uchrashuv so'rovi bor
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="pending">
              Kutilmoqda ({pendingAppointments.length})
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
                  <p className="text-gray-600">Kutayotgan uchrashuv so'rovi yo'q</p>
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
                  <p className="text-gray-600">Tasdiqlangan uchrashuvlar yo'q</p>
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
                  <p className="text-gray-600">Yakunlangan uchrashuvlar yo'q</p>
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
                  <p className="text-gray-600">Hozircha uchrashuvingiz yo'q</p>
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
