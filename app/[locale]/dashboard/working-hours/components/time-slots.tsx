
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TemplateSelectorProps {
  onSelectTemplate: (template: "standard" | "halfday" | "morning" | "evening") => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const templates = [
    {
      id: "standard" as const,
      icon: "Calendar",
      title: "Standart",
      description: "Dush-Juma, 09:00 - 18:00",
      details: "Tushlik: 13:00 - 14:00",
    },
    {
      id: "halfday" as const,
      icon: "Clock",
      title: "Yarim kun",
      description: "09:00 - 13:00",
      details: "Tushliksiz",
    },
    {
      id: "morning" as const,
      icon: "🌅",
      title: "Ertalab",
      description: "08:00 - 13:00",
      details: "Ertalabki soatlar",
    },
    {
      id: "evening" as const,
      icon: "🌆",
      title: "Kechqurun",
      description: "14:00 - 20:00",
      details: "Tushlik: 17:00 - 17:30",
    },
  ];

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🚀 Tezkor sozlash
        </CardTitle>
        <CardDescription>
          Tayyor shablon tanlang yoki qo'lda o'zgartiring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {templates.map((template) => (
            <Button
              key={template.id}
              type="button"
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:border-green-400 hover:bg-green-50"
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="text-3xl mb-2">{template.icon}</div>
              <div className="font-semibold text-left">{template.title}</div>
              <div className="text-xs text-gray-600 text-left">{template.description}</div>
              <div className="text-xs text-gray-500 text-left mt-1">{template.details}</div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

