import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Bell, 
  Palette, 
  Download, 
  Trash2, 
  Info, 
  Shield, 
  FileText,
  ExternalLink,
  Sparkles,
  Globe,
  Mail
} from "lucide-react";

export const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notifications") !== "false"
  );
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem("sound") !== "false"
  );
  const [dailyDigest, setDailyDigest] = useState(
    localStorage.getItem("dailyDigest") !== "false"
  );

  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    localStorage.setItem("notifications", String(checked));
    toast.success(checked ? "Notifications enabled" : "Notifications disabled");
  };

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
    localStorage.setItem("sound", String(checked));
    toast.success(checked ? "Sounds enabled" : "Sounds disabled");
  };

  const handleDailyDigestToggle = (checked: boolean) => {
    setDailyDigest(checked);
    localStorage.setItem("dailyDigest", String(checked));
    toast.success(checked ? "Daily digest enabled" : "Daily digest disabled");
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all app data? This cannot be undone.")) {
      localStorage.clear();
      toast.success("All data cleared successfully");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleClearCache = () => {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
      toast.success("Cache cleared successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold gradient-text">Settings</h2>
        <p className="text-muted-foreground mt-2">
          Manage your preferences and app settings
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex flex-col gap-1">
                  <span>Enable Notifications</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    Receive push notifications for tasks and alarms
                  </span>
                </Label>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="flex flex-col gap-1">
                  <span>Sound Effects</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    Play sounds for notifications and interactions
                  </span>
                </Label>
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={handleSoundToggle}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="digest" className="flex flex-col gap-1">
                  <span>Daily Digest</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    Receive daily productivity summaries
                  </span>
                </Label>
                <Switch
                  id="digest"
                  checked={dailyDigest}
                  onCheckedChange={handleDailyDigestToggle}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use the Mood Selector on the Dashboard to change themes
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Data
              </CardTitle>
              <CardDescription>
                Download your data for backup or transfer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Export functionality is available in the Analytics section
              </p>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions - proceed with caution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleClearCache}
              >
                Clear Cache
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleClearData}
              >
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                About V.I.G.O Spark
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Version</p>
                <Badge variant="secondary">2.0.0</Badge>
              </div>
              <Separator />
              <div>
                <p className="font-semibold mb-2">Your AI-Powered Productivity Hub</p>
                <p className="text-sm text-muted-foreground">
                  V.I.G.O (Virtual Intelligence for Goal Optimization) Spark is designed to help you 
                  achieve more with intelligent task management, goal tracking, and personalized insights.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                About the Developer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">John Ajayi</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Web & App Developer | Full-Stack Engineer
                </p>
                <p className="text-sm mb-4">
                  John Ajayi is a passionate web and app developer with expertise in building 
                  modern, user-centric applications. With a focus on creating intuitive interfaces 
                  and robust functionality, John specializes in React, TypeScript, and full-stack development.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Other Projects</h4>
                <div className="space-y-3">
                  <a
                    href="https://daily-light-aura.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Globe className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Daily Light - Bible App</p>
                        <p className="text-xs text-muted-foreground">
                          Your daily spiritual companion
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Get in Touch</h4>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    window.location.href = "mailto:contact@johnajayi.dev";
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Contact Developer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Policy */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Policy
              </CardTitle>
              <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Data Collection</h4>
                <p className="text-muted-foreground">
                  V.I.G.O Spark stores your data locally on your device. We do not collect, transmit, 
                  or store any personal information on external servers unless you explicitly use cloud 
                  features that require authentication.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Local Storage</h4>
                <p className="text-muted-foreground">
                  Your tasks, goals, settings, and preferences are stored in your browser's local storage. 
                  This data remains on your device and is not accessible to us or third parties.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">AI Features</h4>
                <p className="text-muted-foreground">
                  When using the AI Assistant, your queries are processed through secure AI services. 
                  We do not store conversation history beyond your current session.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Cookies</h4>
                <p className="text-muted-foreground">
                  We use browser storage mechanisms (localStorage, sessionStorage) to maintain your 
                  preferences and app state. No tracking cookies are used.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Your Rights</h4>
                <p className="text-muted-foreground">
                  You have full control over your data. You can export or delete all your data at any 
                  time from the Data Management section in Settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Terms & Conditions */}
        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Terms & Conditions
              </CardTitle>
              <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Acceptance of Terms</h4>
                <p className="text-muted-foreground">
                  By accessing and using V.I.G.O Spark, you accept and agree to be bound by these 
                  Terms and Conditions. If you do not agree, please do not use the application.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Use License</h4>
                <p className="text-muted-foreground">
                  Permission is granted to use V.I.G.O Spark for personal productivity purposes. 
                  You may not modify, distribute, or reverse-engineer the application.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Disclaimer</h4>
                <p className="text-muted-foreground">
                  V.I.G.O Spark is provided "as is" without warranties of any kind. We do not guarantee 
                  that the application will be error-free or uninterrupted. Use at your own risk.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Limitations</h4>
                <p className="text-muted-foreground">
                  We are not liable for any damages arising from the use or inability to use V.I.G.O Spark, 
                  including but not limited to data loss, productivity impacts, or technical issues.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">AI Assistant Usage</h4>
                <p className="text-muted-foreground">
                  The AI Assistant provides suggestions and assistance but should not be considered 
                  professional advice. Always exercise your own judgment when following AI recommendations.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Modifications</h4>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Continued use of the application 
                  after changes constitutes acceptance of the new terms.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <p className="text-muted-foreground">
                  For questions about these Terms & Conditions, please contact us through the About section.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
