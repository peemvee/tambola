import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { BottomNav } from "@/components/ui/bottom-nav";
import { 
  User, 
  Bell, 
  Volume2, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Moon,
  Vibrate,
  Globe,
  Smartphone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: false,
    darkMode: false,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsGroups = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Edit Profile", action: () => navigate('/profile') },
        { icon: Shield, label: "Privacy & Security", action: () => navigate('/privacy') },
        { icon: Globe, label: "Language", subtitle: "English", action: () => {} },
      ]
    },
    {
      title: "Preferences",
      items: [
        { 
          icon: Bell, 
          label: "Notifications", 
          toggle: true, 
          value: settings.notifications,
          action: (value: boolean) => updateSetting('notifications', value)
        },
        { 
          icon: Volume2, 
          label: "Sound Effects", 
          toggle: true, 
          value: settings.sound,
          action: (value: boolean) => updateSetting('sound', value)
        },
        { 
          icon: Vibrate, 
          label: "Vibration", 
          toggle: true, 
          value: settings.vibration,
          action: (value: boolean) => updateSetting('vibration', value)
        },
        { 
          icon: Moon, 
          label: "Dark Mode", 
          toggle: true, 
          value: settings.darkMode,
          action: (value: boolean) => updateSetting('darkMode', value)
        },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & FAQ", action: () => navigate('/help') },
        { icon: Smartphone, label: "Contact Us", action: () => {} },
        { icon: Shield, label: "Terms & Privacy", action: () => navigate('/terms') },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-baloo font-bold text-foreground">
            ⚙️ Settings
          </h1>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6 bg-card/50 border-primary/20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
                🚀
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">Guest Player</h2>
                <p className="text-muted-foreground">Level 5 • 1,250 coins</p>
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto mt-1"
                  onClick={() => navigate('/auth')}
                >
                  Sign up to save progress
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + groupIndex * 0.1, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">{group.title}</h3>
              <Card className="p-0 bg-card/50 border-primary/20 overflow-hidden">
                {group.items.map((item, index) => (
                  <div key={item.label}>
                    <div 
                      className="flex items-center justify-between p-4 hover:bg-background/50 transition-colors cursor-pointer"
                      onClick={() => !item.toggle && item.action()}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          {item.subtitle && (
                            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                          )}
                        </div>
                      </div>
                      
                      {item.toggle ? (
                        <Switch
                          checked={item.value}
                          onCheckedChange={(checked) => item.action(checked)}
                        />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    {index < group.items.length - 1 && <Separator />}
                  </div>
                ))}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <Button
            variant="destructive"
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => navigate('/')}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-muted-foreground">
            TambolaVerse v1.0.0
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;