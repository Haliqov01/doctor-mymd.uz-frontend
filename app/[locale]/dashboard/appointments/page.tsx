"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
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
import { dashboardLogger } from "@/lib/utils/logger";

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">("All");

  const statusConfig = {
    [AppointmentStatus.Pending]: {
      label: t('appointments.status.awaitingConfirmation'),
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: AlertCircle,
    },
    [AppointmentStatus.Approved]: {
      label: t('appointments.status.approved'),
      color: "bg-teal-50 text-teal-700 border-teal-200",
      icon: CheckCircle2,
    },
    [AppointmentStatus.Rejected]: {
      label: t('appointments.status.rejected'),
      color: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    },
    [AppointmentStatus.Completed]: {
      label: t('appointments.status.completed'),
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: CheckCircle2,
    },
  };

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);

      const { doctorResolver } = await import("@/lib/services/doctorResolver");
      
      let doctorId = doctorResolver.getCachedDoctorId();
      
      if (!doctorId) {
        doctorId = await doctorResolver.resolve();
      }

      if (!doctorId) {
        dashboardLogger.warn("Appointments", "No doctor ID found - showing empty list");
        setAppointments([]);
        setTotalCount(0);
        return;
      }

      dashboardLogger.info("Appointments", "Fetching appointments for doctorId:", doctorId);

      const payload = {
        pageNumber: currentPage,
        pageSize: pageSize,
        status: statusFilter !== "All" ? statusFilter : undefined,
        doctorId: doctorId,
      };

      const result = await appointmentService.getAppointments(payload);

      setAppointments(result.data || []);
      setTotalCount(result.totalCount || 0);
    } catch (error: any) {
      dashboardLogger.error("Appointments", "Error loading appointments:", error);
      if (error.status === 401) {
        clearStoredToken();
        router.push("/login");
      }
      setAppointments([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, statusFilter, router]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleConfirm = async (appointmentId: number) => {
    if (!confirm(t('appointments.confirmQuestion'))) return;

    setActionLoading(true);
    try {
      await appointmentService.confirmAppointment(appointmentId);
      alert(t('appointments.confirmedSuccess'));
      fetchAppointments();
    } catch (error: any) {
      dashboardLogger.error("Appointments", "Error confirming appointment:", error);
      alert(error.message || t('appointments.confirmError'));
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
      alert(t('appointments.reject.reasonMinError'));
      return;
    }

    setActionLoading(true);
    try {
      await appointmentService.rejectAppointment(selectedAppointment.id, rejectionReason);
      alert(t('appointments.reject.success'));
      setRejectDialogOpen(false);
      fetchAppointments();
    } catch (error: any) {
      dashboardLogger.error("Appointments", "Error rejecting appointment:", error);
      alert(error.message || t('appointments.reject.error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (appointmentId: number) => {
    if (!confirm(t('appointments.completeQuestion'))) return;

    setActionLoading(true);
    try {
      await appointmentService.completeAppointment(appointmentId);
      alert(t('appointments.completedSuccess'));
      fetchAppointments();
    } catch (error: any) {
      dashboardLogger.error("Appointments", "Error completing appointment:", error);
      alert(error.message || t('appointments.completeError'));
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
      <Card className={`transition-all duration-300 ${isPending ? "border-amber-200 border-2" : "border-slate-200"}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <User className="h-5 w-5 text-teal-600" />
                {appointment.patientName}
              </CardTitle>
              <div className="flex flex-col gap-1 mt-2 text-sm text-slate-500">
                {appointment.patientPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {appointment.patientPhone}
                  </div>
                )}
              </div>
            </div>
            <Badge className={`${config.color} border flex items-center gap-1 rounded-lg`}>
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-teal-600" />
              <span className="font-medium text-slate-700">{formatDate(appointment.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-teal-600" />
              <span className="font-medium text-slate-700">
                {formatTime(appointment.scheduledDate)} ({appointment.duration} {t('common.minutes')})
              </span>
            </div>
          </div>

          {appointment.message && (
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-teal-800">{t('appointments.complaint')}:</div>
                  <div className="text-sm text-teal-700 mt-1">{appointment.message}</div>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-400">
            {t('appointments.requestTime')}: {new Date(appointment.createdDate).toLocaleString("uz-UZ")}
          </div>

          {isPending && (
            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                onClick={() => handleRejectClick(appointment)}
                disabled={actionLoading}
              >
                <X className="mr-2 h-4 w-4" />
                {t('appointments.reject.button')}
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => handleConfirm(appointment.id)}
                disabled={actionLoading}
              >
                <Check className="mr-2 h-4 w-4" />
                {t('common.confirm')}
              </Button>
            </div>
          )}

          {appointment.status === AppointmentStatus.Approved && (
            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <Button
                size="sm"
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                onClick={() => {
                  const params = new URLSearchParams({
                    appointmentId: appointment.id.toString(),
                    patientId: appointment.patientId?.toString() || '',
                    patientName: appointment.patientName || '',
                    complaint: appointment.message || '',
                  });
                  router.push(`/dashboard/reports/create?${params.toString()}`);
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                {t('appointments.writeReport')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => handleComplete(appointment.id)}
                disabled={actionLoading}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t('appointments.complete')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const allAppointments = filterAppointments();
  const pendingAppointments = filterAppointments(AppointmentStatus.Pending);
  const confirmedAppointments = filterAppointments(AppointmentStatus.Approved);
  const completedAppointments = filterAppointments(AppointmentStatus.Completed);

  return (
    <div className="min-h-screen bg-[#FAFBFC] p-4 md:p-8">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.backToDashboard')}
        </Button>

        <Card className="mb-6 border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800">{t('appointments.title')}</CardTitle>
            <CardDescription>
              {t('appointments.description')}
            </CardDescription>
          </CardHeader>
        </Card>

        {pendingAppointments.length > 0 && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">
                  {t('appointments.pendingCount', { count: pendingAppointments.length })}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="pending">
              {t('appointments.status.pending')} ({pendingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              {t('appointments.status.confirmed')} ({confirmedAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              {t('appointments.status.completed')} ({completedAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              {t('common.all')} ({allAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingAppointments.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">{t('appointments.noPending')}</p>
                </CardContent>
              </Card>
            ) : (
              pendingAppointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
            )}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            {confirmedAppointments.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">{t('appointments.noConfirmed')}</p>
                </CardContent>
              </Card>
            ) : (
              confirmedAppointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedAppointments.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">{t('appointments.noCompleted')}</p>
                </CardContent>
              </Card>
            ) : (
              completedAppointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {allAppointments.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">{t('appointments.noAppointments')}</p>
                </CardContent>
              </Card>
            ) : (
              allAppointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('appointments.reject.title')}</DialogTitle>
              <DialogDescription>
                {t('appointments.reject.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">{t('appointments.reject.reason')}</Label>
                <Input
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder={t('appointments.reject.reasonPlaceholder')}
                  className="w-full"
                />
                <p className="text-xs text-slate-400">{t('appointments.reject.minChars')}</p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
                disabled={actionLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectConfirm}
                disabled={actionLoading || rejectionReason.length < 10}
              >
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('appointments.reject.button')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
