import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Plus, Clock } from "lucide-react";
import { format } from "date-fns";

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  time?: string;
  color: string;
}

export const SmartCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddEvent = () => {
    if (!newEventTitle.trim() || !date) return;

    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      date: date,
      title: newEventTitle,
      time: newEventTime,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };

    setEvents([...events, newEvent]);
    setNewEventTitle("");
    setNewEventTime("");
    setIsDialogOpen(false);
  };

  const todayEvents = events.filter(
    (event) => format(event.date, "yyyy-MM-dd") === format(date || new Date(), "yyyy-MM-dd")
  );

  return (
    <Card className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 glow-primary">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Smart Calendar</h2>
            <p className="text-xs text-muted-foreground">Plan your schedule</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-primary/20">
            <DialogHeader>
              <DialogTitle className="gradient-text">Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Event Title</label>
                <Input
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Meeting, Task, etc."
                  className="glass-input mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Time (Optional)</label>
                <Input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="glass-input mt-1"
                />
              </div>
              <Button
                onClick={handleAddEvent}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
            modifiers={{
              hasEvent: events.map(e => e.date)
            }}
            modifiersClassNames={{
              hasEvent: "bg-primary/20 text-primary font-bold"
            }}
          />
        </div>

        {/* Events List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Events for {format(date || new Date(), "MMM dd, yyyy")}
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {todayEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No events scheduled for this day
              </p>
            ) : (
              todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all"
                  style={{ borderLeftColor: event.color, borderLeftWidth: "4px" }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{event.title}</h4>
                      {event.time && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {event.time}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
