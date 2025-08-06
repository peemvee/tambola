import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Gift, Star, Zap, Crown, Calendar, CheckCircle } from "lucide-react";

const Rewards = () => {
  const dailyTasks = [
    { id: 1, task: "Play 3 games", progress: 2, total: 3, reward: "50 coins", completed: false },
    { id: 2, task: "Win 1 game", progress: 1, total: 1, reward: "100 coins", completed: true },
    { id: 3, task: "Invite a friend", progress: 0, total: 1, reward: "200 coins", completed: false },
  ];

  const achievements = [
    { id: 1, title: "First Win", description: "Win your first game", icon: "🏆", unlocked: true, reward: "500 coins" },
    { id: 2, title: "Social Player", description: "Play with 10 different friends", icon: "👥", unlocked: false, progress: 7, total: 10 },
    { id: 3, title: "Lucky Seven", description: "Win 7 games in a row", icon: "🍀", unlocked: false, progress: 3, total: 7 },
    { id: 4, title: "Big Winner", description: "Win ₹5000 in a single game", icon: "💎", unlocked: false },
  ];

  const rewards = [
    { id: 1, title: "Free Game Entry", description: "Skip entry fee for next game", cost: 200, icon: "🎟️" },
    { id: 2, title: "Double Coins", description: "2x coins for next 3 games", cost: 500, icon: "⚡" },
    { id: 3, title: "VIP Badge", description: "Show off with a special badge", cost: 1000, icon: "👑" },
    { id: 4, title: "Custom Avatar", description: "Unlock exclusive avatars", cost: 1500, icon: "🎨" },
  ];

  const userCoins = 1250;

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
          <h1 className="text-3xl font-baloo font-bold text-foreground mb-2">
            🎁 Rewards
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold text-primary">{userCoins} Coins</span>
          </div>
        </motion.div>

        {/* Daily Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6 bg-card/50 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-baloo font-semibold text-foreground">Daily Tasks</h2>
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                Resets in 8h
              </Badge>
            </div>
            
            <div className="space-y-4">
              {dailyTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-foreground">{task.task}</p>
                      {task.completed && <CheckCircle className="w-4 h-4 text-secondary" />}
                    </div>
                    <Progress 
                      value={(task.progress / task.total) * 100} 
                      className="h-2 mb-1" 
                    />
                    <p className="text-xs text-muted-foreground">
                      {task.progress}/{task.total} • Reward: {task.reward}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    disabled={!task.completed}
                    className={task.completed ? "bg-secondary text-secondary-foreground" : ""}
                  >
                    {task.completed ? "Claim" : "Incomplete"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-baloo font-semibold text-foreground mb-4">Achievements</h2>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="p-4 bg-card/50 border-primary/20">
                <div className="flex items-center space-x-4">
                  <div className={`text-3xl p-2 rounded-full ${achievement.unlocked ? 'bg-primary/20' : 'bg-muted/20'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                      {achievement.unlocked && <CheckCircle className="w-4 h-4 text-secondary" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    {achievement.progress !== undefined && (
                      <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                    )}
                  </div>
                  <div className="text-right">
                    {achievement.unlocked ? (
                      <Badge className="bg-secondary text-secondary-foreground">Unlocked</Badge>
                    ) : achievement.progress !== undefined ? (
                      <span className="text-xs text-muted-foreground">{achievement.progress}/{achievement.total}</span>
                    ) : (
                      <Badge variant="outline">Locked</Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Reward Shop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-baloo font-semibold text-foreground mb-4">Reward Shop</h2>
          <div className="grid grid-cols-1 gap-3">
            {rewards.map((reward) => (
              <Card key={reward.id} className="p-4 bg-card/50 border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl p-2 bg-accent/20 rounded-full">
                      {reward.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary mb-2">{reward.cost} coins</p>
                    <Button
                      size="sm"
                      disabled={userCoins < reward.cost}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {userCoins >= reward.cost ? "Buy" : "Need more"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Rewards;