"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Calendar, Clock, Utensils, Timer, CheckCircle, XCircle } from "lucide-react";
import { WorkingHour } from "../hooks/useWorkingHours";

interface DayCardProps {
  workingHour: WorkingHour;
  dayLabel: string;
  onToggle: () => void;
  onUpdate: (updates: Partial<WorkingHour>) => void;
  onCopyToAll: () => void;
}

export function DayCard({
  workingHour,
  dayLabel,
  onToggle,
  onUpdate,
  onCopyToAll,
}: DayCardProps) {
  return (
    <Card className={workingHour.isActive ? "border-green-200 shadow-soft" : "border-neutral-200 opacity-60"}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${workingHour.isActive ? "bg-green-100" : "bg-neutral-100"}`}>
              <Calendar className={`h-5 w-5 ${workingHour.isActive ? "text-green-600" : "text-neutral-400"}`} />
            </div>
            <CardTitle className="text-lg font-bold text-neutral-900">{dayLabel}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className={`gap-2 ${workingHour.isActive ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              {workingHour.isActive ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Aktiv
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Yopiq
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCopyToAll}
              title="Barcha kunlarga nusxalash"
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {workingHour.isActive && (
        <CardContent className="space-y-5">
          {/* Working Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${workingHour.dayOfWeek}-start`} className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                <Clock className="h-4 w-4 text-green-600" />
                Boshlanish
              </Label>
              <Input
                id={`${workingHour.dayOfWeek}-start`}
                type="time"
                value={workingHour.startTime}
                onChange={(e) => onUpdate({ startTime: e.target.value })}
                className="border-2 border-green-200 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${workingHour.dayOfWeek}-end`} className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                <Clock className="h-4 w-4 text-green-600" />
                Tugash
              </Label>
              <Input
                id={`${workingHour.dayOfWeek}-end`}
                type="time"
                value={workingHour.endTime}
                onChange={(e) => onUpdate({ endTime: e.target.value })}
                className="border-2 border-green-200 focus:border-green-500"
              />
            </div>
          </div>

          {/* Break Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
              <Utensils className="h-4 w-4 text-orange-600" />
              Tushlik vaqti (ixtiyoriy)
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="time"
                placeholder="Boshlanish"
                value={workingHour.breakStart || ""}
                onChange={(e) => onUpdate({ breakStart: e.target.value || null })}
                className="border-2 border-orange-200 focus:border-orange-500"
              />
              <Input
                type="time"
                placeholder="Tugash"
                value={workingHour.breakEnd || ""}
                onChange={(e) => onUpdate({ breakEnd: e.target.value || null })}
                className="border-2 border-orange-200 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Slot Duration */}
          <div className="space-y-2">
            <Label htmlFor={`${workingHour.dayOfWeek}-slot`} className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
              <Timer className="h-4 w-4 text-purple-600" />
              Muloqot davomiyligi
            </Label>
            <Select
              value={(workingHour.slotDuration || 30).toString()}
              onValueChange={(value) => onUpdate({ slotDuration: parseInt(value) })}
            >
              <SelectTrigger id={`${workingHour.dayOfWeek}-slot`} className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 daqiqa</SelectItem>
                <SelectItem value="30">30 daqiqa</SelectItem>
                <SelectItem value="45">45 daqiqa</SelectItem>
                <SelectItem value="60">1 soat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

