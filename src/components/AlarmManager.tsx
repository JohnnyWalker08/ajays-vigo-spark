import { useState, useEffect } from "react";
import { Clock, Plus, Trash2, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { notificationService, Alarm } from "@/utils/notificationService";
import { Label } from "@/components/ui/label";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AlarmManager = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAlarmTitle, setNewAlarmTitle] = useState("");
  const [newAlarmTime, setNewAlarmTime] = useState("");
  const [isRepeat, setIsRepeat] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  useEffect(() => {
    const updateAlarms = () => {
      setAlarms(notificationService.getAlarms());
    };

    updateAlarms();
    const unsubscribe = notificationService.subscribe(updateAlarms);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddAlarm = () => {
    if (!newAlarmTitle.trim() || !newAlarmTime) return;

    notificationService.addAlarm({
      title: newAlarmTitle,
      time: newAlarmTime,
      enabled: true,
      repeat: isRepeat,
      days: isRepeat ? selectedDays : undefined,
    });

    // Reset form
    setNewAlarmTitle("");
    setNewAlarmTime("");
    setIsRepeat(false);
    setSelectedDays([]);
    setIsDialogOpen(false);

    // Show confirmation notification
    notificationService.addNotification({
      title: '⏰ Alarm Set',
      message: `"${newAlarmTitle}" at ${newAlarmTime}`,
      type: 'reminder',
      priority: 'low',
    });
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const formatTime12Hour = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getDaysText = (alarm: Alarm) => {
    if (!alarm.repeat || !alarm.days || alarm.days.length === 0) {
      return 'Once';
    }
    if (alarm.days.length === 7) {
      return 'Every day';
    }
    return alarm.days.map(d => DAYS[d]).join(', ');
  };

  return (
    <Card className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 glow-primary">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Alarm Manager</h2>
            <p className="text-xs text-muted-foreground">Set reminders and alarms</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <Plus className="h-4 w-4 mr-1" />
              Add Alarm
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-primary/20">
            <DialogHeader>
              <DialogTitle className="gradient-text">Create New Alarm</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Alarm Title</Label>
                <Input
                  value={newAlarmTitle}
                  onChange={(e) => setNewAlarmTitle(e.target.value)}
                  placeholder="Wake up, Meeting, etc."
                  className="glass-input mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground">Time</Label>
                <Input
                  type="time"
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                  className="glass-input mt-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">Repeat</Label>
                <Switch checked={isRepeat} onCheckedChange={setIsRepeat} />
              </div>
              {isRepeat && (
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Repeat on
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map((day, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={selectedDays.includes(index) ? "default" : "outline"}
                        onClick={() => toggleDay(index)}
                        className="w-14"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <Button
                onClick={handleAddAlarm}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                Create Alarm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No alarms set</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first alarm to get started
            </p>
          </div>
        ) : (
          alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                alarm.enabled
                  ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30'
                  : 'bg-card/30 border-border/30 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Switch
                    checked={alarm.enabled}
                    onCheckedChange={() => notificationService.toggleAlarm(alarm.id)}
                  />
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">
                      {formatTime12Hour(alarm.time)}
                    </h4>
                    <p className="text-sm text-muted-foreground">{alarm.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getDaysText(alarm)}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => notificationService.deleteAlarm(alarm.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {alarms.length > 0 && (
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Bell className="h-4 w-4" />
            <span>
              {alarms.filter(a => a.enabled).length} active alarm{alarms.filter(a => a.enabled).length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
