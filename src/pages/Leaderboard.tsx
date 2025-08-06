import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: "Rajesh Kumar", avatar: "🚀", wins: 147, earnings: "₹25,400", badge: "Champion" },
    { rank: 2, name: "Priya Sharma", avatar: "🌟", wins: 132, earnings: "₹22,100", badge: "Expert" },
    { rank: 3, name: "Amit Singh", avatar: "🎯", wins: 118, earnings: "₹19,800", badge: "Pro" },
    { rank: 4, name: "Sneha Patel", avatar: "🎨", wins: 95, earnings: "₹16,200", badge: "Advanced" },
    { rank: 5, name: "Vikram Joshi", avatar: "⚡", wins: 87, earnings: "₹14,500", badge: "Advanced" },
    { rank: 6, name: "Kavya Reddy", avatar: "🌈", wins: 73, earnings: "₹12,300", badge: "Skilled" },
    { rank: 7, name: "Rahul Gupta", avatar: "🔥", wins: 68, earnings: "₹11,100", badge: "Skilled" },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-primary" />;
      case 2: return <Medal className="w-6 h-6 text-secondary" />;
      case 3: return <Award className="w-6 h-6 text-accent" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Champion": return "bg-primary text-primary-foreground";
      case "Expert": return "bg-secondary text-secondary-foreground";
      case "Pro": return "bg-accent text-accent-foreground";
      case "Advanced": return "bg-muted text-muted-foreground";
      default: return "bg-card text-card-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-baloo font-bold text-foreground mb-2">
            🏆 Leaderboard
          </h1>
          <p className="text-muted-foreground">Top players this month</p>
        </motion.div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex justify-center items-end space-x-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="bg-secondary/20 p-3 rounded-full mb-2 mx-auto w-fit">
                  <span className="text-2xl">{leaderboardData[1].avatar}</span>
                </div>
                <Medal className="w-8 h-8 text-secondary mx-auto mb-1" />
                <p className="font-semibold text-sm">{leaderboardData[1].name.split(' ')[0]}</p>
                <p className="text-xs text-muted-foreground">{leaderboardData[1].earnings}</p>
              </div>

              {/* 1st Place */}
              <div className="text-center relative">
                <div className="bg-primary/20 p-4 rounded-full mb-2 mx-auto w-fit">
                  <span className="text-3xl">{leaderboardData[0].avatar}</span>
                </div>
                <Trophy className="w-10 h-10 text-primary mx-auto mb-1" />
                <p className="font-bold">{leaderboardData[0].name.split(' ')[0]}</p>
                <p className="text-sm text-primary font-semibold">{leaderboardData[0].earnings}</p>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2"
                >
                  <span className="text-xl">👑</span>
                </motion.div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="bg-accent/20 p-3 rounded-full mb-2 mx-auto w-fit">
                  <span className="text-2xl">{leaderboardData[2].avatar}</span>
                </div>
                <Award className="w-8 h-8 text-accent mx-auto mb-1" />
                <p className="font-semibold text-sm">{leaderboardData[2].name.split(' ')[0]}</p>
                <p className="text-xs text-muted-foreground">{leaderboardData[2].earnings}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Full Leaderboard */}
      <div className="px-6">
        <div className="space-y-3">
          {leaderboardData.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <Card className="p-4 bg-card/50 border-primary/20 hover:bg-card/70 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(player.rank)}
                    </div>
                    
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-2xl">
                        {player.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-semibold text-foreground">{player.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getBadgeColor(player.badge)}`}
                        >
                          {player.badge}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {player.wins} wins
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-primary">{player.earnings}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12% this week
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Leaderboard;