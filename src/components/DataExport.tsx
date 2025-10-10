import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

export const DataExport = () => {
  const exportData = (format: "json" | "txt") => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const goals = JSON.parse(localStorage.getItem("goals") || "[]");
    const gamification = JSON.parse(localStorage.getItem("gamification") || "{}");
    
    const data = {
      tasks,
      goals,
      gamification,
      exportDate: new Date().toISOString(),
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === "json") {
      content = JSON.stringify(data, null, 2);
      filename = `ajayi-planner-backup-${Date.now()}.json`;
      mimeType = "application/json";
    } else {
      content = `AJAYI'S PLANNER - DATA EXPORT\n`;
      content += `Export Date: ${new Date().toLocaleString()}\n\n`;
      content += `=== TASKS ===\n`;
      tasks.forEach((task: any, i: number) => {
        content += `${i + 1}. [${task.completed ? "✓" : " "}] ${task.text}\n`;
      });
      content += `\n=== GOALS ===\n`;
      goals.forEach((goal: any, i: number) => {
        content += `${i + 1}. ${goal.text} (${goal.progress}%)\n`;
      });
      content += `\n=== STATS ===\n`;
      content += `Level: ${gamification.level || 1}\n`;
      content += `Points: ${gamification.points || 0}\n`;
      content += `Streak: ${gamification.streak || 0} days\n`;
      
      filename = `ajayi-planner-backup-${Date.now()}.txt`;
      mimeType = "text/plain";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Data exported as ${format.toUpperCase()}`);
  };

  return (
    <Card className="glass-card p-4 border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <Download className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Export Data</h3>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 hover-scale"
          onClick={() => exportData("json")}
        >
          <FileText className="w-4 h-4 mr-2" />
          JSON
        </Button>
        <Button
          variant="outline"
          className="flex-1 hover-scale"
          onClick={() => exportData("txt")}
        >
          <FileText className="w-4 h-4 mr-2" />
          TXT
        </Button>
      </div>
    </Card>
  );
};