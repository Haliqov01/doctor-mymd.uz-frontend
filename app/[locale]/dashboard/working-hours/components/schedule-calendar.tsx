import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy } from "lucide-react";
import { WorkingHour } from "../hooks/useWorkingHours";

interface DayCardProps {
  workingHour: WorkingHour;
  dayLabel: string;
  dayIcon: string;
  onToggle: () => void;
  onUpdate: (updates: Partial<WorkingHour>) => void;
  onCopyToAll: () => void;
}

export function DayCard({
  workingHour,
  dayLabel,
  dayIcon,
  onToggle,
  onUpdate,
  onCopyToAll,
}: DayCardProps) {
  return (
    <Card className={workingHour.isActive ? "border-green-200" : "border-gray-200 opacity-60"}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{dayIcon}</span>
            <CardTitle className="text-lg">{dayLabel}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className={workingHour.isActive ? "text-green-600" : "text-gray-400"}
            >
              {workingHour.isActive ? "✅ Aktiv" : "❌ Yopiq"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCopyToAll}
              title="Barcha kunlarga nusxalash"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {workingHour.isActive && (
        <CardContent className="space-y-4">
          {/* Working Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${workingHour.dayOfWeek}-start`}>⏰ Boshlanish</Label>
              <Input
                id={`${workingHour.dayOfWeek}-start`}
                type="time"
                value={workingHour.startTime}
                onChange={(e) => onUpdate({ startTime: e.target.value })}
                className="border-green-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${workingHour.dayOfWeek}-end`}>⏰ Tugash</Label>
              <Input
                id={`${workingHour.dayOfWeek}-end`}
                type="time"
                value={workingHour.endTime}
                onChange={(e) => onUpdate({ endTime: e.target.value })}
                className="border-green-200"
              />
            </div>
          </div>

          {/* Break Time */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">🍽️ Tushlik vaqti (opsional)</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="time"
                placeholder="Boshlanish"
                value={workingHour.breakStart || ""}
                onChange={(e) => onUpdate({ breakStart: e.target.value || null })}
                className="border-orange-200"
              />
              <Input
                type="time"
                placeholder="Tugash"
                value={workingHour.breakEnd || ""}
                onChange={(e) => onUpdate({ breakEnd: e.target.value || null })}
                className="border-orange-200"
              />
            </div>
          </div>

          {/* Slot Duration */}
          <div className="space-y-2">
            <Label htmlFor={`${workingHour.dayOfWeek}-slot`}>⏱️ Muloqot davomiyligi</Label>
            <Select
              value={workingHour.slotDuration.toString()}
              onValueChange={(value) => onUpdate({ slotDuration: parseInt(value) })}
            >
              <SelectTrigger id={`${workingHour.dayOfWeek}-slot`}>
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


