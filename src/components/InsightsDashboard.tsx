import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Calendar, CheckCircle2, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DailyActivity {
  date: string;
  tasksCompleted: number;
  goalsProgress: number;
  points: number;
}

interface InsightsData {
  weeklyActivity: DailyActivity[];
  totalTasksCompleted: number;
  totalGoalsCompleted: number;
  averageTasksPerDay: number;
  mostProductiveDay: string;
  currentWeekPoints: number;
}

const CHART_COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--destructive))"];

export const InsightsDashboard = () => {
  const [insights, setInsights] = useState<InsightsData>({
    weeklyActivity: [],
    totalTasksCompleted: 0,
    totalGoalsCompleted: 0,
    averageTasksPerDay: 0,
    mostProductiveDay: "Monday",
    currentWeekPoints: 0,
  });

  useEffect(() => {
    calculateInsights();
    
    // Recalculate when tasks or goals change
    const handleStorageChange = () => calculateInsights();
    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for real-time updates
    const handleUpdate = () => calculateInsights();
    window.addEventListener("insights-update" as any, handleUpdate);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("insights-update" as any, handleUpdate);
    };
  }, []);

  const calculateInsights = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const goals = JSON.parse(localStorage.getItem("goals") || "[]");
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");

    // Generate last 7 days data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toDateString();
    });

    const weeklyActivity = last7Days.map((dateStr) => {
      const dayActivity = activityLog.filter((log: any) => new Date(log.date).toDateString() === dateStr);
      const tasksCompleted = dayActivity.filter((log: any) => log.type === "task_completed").length;
      const goalsProgress = dayActivity.filter((log: any) => log.type === "goal_progress").length;
      const points = dayActivity.reduce((sum: number, log: any) => sum + (log.points || 0), 0);

      return {
        date: new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" }),
        tasksCompleted,
        goalsProgress,
        points,
      };
    });

    const totalTasksCompleted = tasks.filter((t: any) => t.completed).length;
    const totalGoalsCompleted = goals.filter((g: any) => g.progress === 100).length;
    const averageTasksPerDay = weeklyActivity.reduce((sum, day) => sum + day.tasksCompleted, 0) / 7;
    
    const mostProductiveDay = weeklyActivity.reduce((prev, current) => 
      (current.tasksCompleted > prev.tasksCompleted) ? current : prev
    ).date;

    const currentWeekPoints = weeklyActivity.reduce((sum, day) => sum + day.points, 0);

    setInsights({
      weeklyActivity,
      totalTasksCompleted,
      totalGoalsCompleted,
      averageTasksPerDay,
      mostProductiveDay,
      currentWeekPoints,
    });
  };

  const categoryData = [
    { name: "Tasks", value: insights.totalTasksCompleted, color: CHART_COLORS[0] },
    { name: "Goals", value: insights.totalGoalsCompleted, color: CHART_COLORS[1] },
  ];

  return (
    <div className="glass rounded-2xl p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Weekly Insights
        </h2>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass rounded-xl p-4 space-y-1 hover:border-primary/50 transition-smooth">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Tasks Done</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{insights.totalTasksCompleted}</div>
        </div>

        <div className="glass rounded-xl p-4 space-y-1 hover:border-secondary/50 transition-smooth">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-secondary" />
            <span className="text-xs text-muted-foreground">Goals Hit</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{insights.totalGoalsCompleted}</div>
        </div>

        <div className="glass rounded-xl p-4 space-y-1 hover:border-accent/50 transition-smooth">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">Avg/Day</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{insights.averageTasksPerDay.toFixed(1)}</div>
        </div>

        <div className="glass rounded-xl p-4 space-y-1 hover:border-destructive/50 transition-smooth">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-destructive" />
            <span className="text-xs text-muted-foreground">Best Day</span>
          </div>
          <div className="text-lg font-bold text-foreground">{insights.mostProductiveDay}</div>
        </div>
      </div>

      {/* Charts */}
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 glass">
          <TabsTrigger value="weekly">Weekly Activity</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Tasks Completed This Week</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={insights.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  cursor={{ fill: "hsl(var(--primary) / 0.1)" }}
                />
                <Bar 
                  dataKey="tasksCompleted" 
                  fill="hsl(var(--primary))" 
                  radius={[8, 8, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Points Earned This Week</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={insights.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
                />
                <Bar 
                  dataKey="points" 
                  fill="hsl(var(--accent))" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="glass rounded-xl p-6 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {categoryData.map((item) => (
              <div
                key={item.name}
                className="glass rounded-xl p-4 flex items-center gap-3 hover:scale-105 transition-smooth"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 20px ${item.color}40` }}
                />
                <div>
                  <div className="text-xs text-muted-foreground">{item.name}</div>
                  <div className="text-xl font-bold text-foreground">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Export utility to log activity
export const logActivity = (type: string, points: number = 0) => {
  const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");
  activityLog.push({
    date: new Date().toISOString(),
    type,
    points,
  });
  localStorage.setItem("activityLog", JSON.stringify(activityLog));
  
  // Trigger insights update
  window.dispatchEvent(new Event("insights-update"));
};