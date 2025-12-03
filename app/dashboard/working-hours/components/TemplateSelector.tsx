"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Sunrise, Sunset, Zap } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: "standard" | "halfday" | "morning" | "evening") => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const templates = [
    {
      id: "standard" as const,
      icon: Calendar,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "Standart",
      description: "Dush-Juma, 09:00 - 18:00",
      details: "Tushlik: 13:00 - 14:00",
    },
    {
      id: "halfday" as const,
      icon: Clock,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      title: "Yarim kun",
      description: "09:00 - 13:00",
      details: "Tushliksiz",
    },
    {
      id: "morning" as const,
      icon: Sunrise,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
      title: "Ertalab",
      description: "08:00 - 13:00",
      details: "Ertalabki soatlar",
    },
    {
      id: "evening" as const,
      icon: Sunset,
      iconColor: "text-pink-600",
      bgColor: "bg-pink-100",
      title: "Kechqurun",
      description: "14:00 - 20:00",
      details: "Tushlik: 17:00 - 17:30",
    },
  ];

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-neutral-900">
          <Zap className="h-6 w-6 text-green-600" />
          Tezkor sozlash
        </CardTitle>
        <CardDescription className="text-base text-neutral-600">
          Tayyor shablon tanlang yoki qo&apos;lda o&apos;zgartiring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {templates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Button
                key={template.id}
                type="button"
                variant="outline"
                className="h-auto flex-col items-start p-4 border-2 hover:border-green-400 hover:bg-green-50 transition-all"
                onClick={() => onSelectTemplate(template.id)}
              >
                <div className={`h-12 w-12 rounded-lg ${template.bgColor} flex items-center justify-center mb-3`}>
                  <IconComponent className={`h-6 w-6 ${template.iconColor}`} />
                </div>
                <div className="font-semibold text-base text-left text-neutral-900">{template.title}</div>
                <div className="text-sm text-neutral-600 text-left mt-1">{template.description}</div>
                <div className="text-xs text-neutral-500 text-left mt-1">{template.details}</div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

