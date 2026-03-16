import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { MyClasses } from "./MyClasses";
import {
  Calendar,
  TrendingUp,
  Users,
  Dumbbell,
  Clock,
  AlertCircle,
} from "lucide-react";

interface DashboardOverviewProps {
  onNavigateToTab: (tab: string) => void;
}

export function DashboardOverview({ onNavigateToTab }: DashboardOverviewProps) {
  // Quick stats
  const quickStats = [
    {
      label: "Classes This Week",
      value: "4",
      icon: Dumbbell,
      color: "text-[#6B7C4E]",
      bgColor: "bg-[#E8F0DC]",
    },
    {
      label: "Upcoming Events",
      value: "6",
      icon: Calendar,
      color: "text-[#6B7C4E]",
      bgColor: "bg-[#E8F0DC]",
    },
    {
      label: "Wellness Score",
      value: "88",
      icon: TrendingUp,
      color: "text-[#6B7C4E]",
      bgColor: "bg-[#E8F0DC]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="bg-gradient-to-br from-[#E8F0DC] to-[#F5F1E8] border-[#6B7C4E]/20">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold text-[#4A5A3A] mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-700">
            You're making great progress on your wellness journey. Keep up the
            excellent work!
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="bg-white border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#4A5A3A]">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Events Preview */}
        <Card className="bg-white border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#4A5A3A]">Upcoming Events</CardTitle>
            <CardDescription>Your next scheduled classes</CardDescription>
          </CardHeader>
          <CardContent>
            <MyClasses />
          </CardContent>
        </Card>

        {/* Health Overview */}
        <Card className="bg-white border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#4A5A3A]">Health Overview</CardTitle>
            <CardDescription>Your key wellness metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Weekly Activity Goal
                </span>
                <span className="text-sm font-bold text-[#4A5A3A]">80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Steps Today
                </span>
                <span className="text-sm font-bold text-[#4A5A3A]">
                  8,542 / 10,000
                </span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    New Referral Available
                  </p>
                  <p className="text-sm text-yellow-700">
                    A cardiologist has been recommended based on your stats
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full hover:bg-[#E8F0DC] hover:text-[#4A5A3A] hover:border-[#6B7C4E]"
              onClick={() => onNavigateToTab("health")}
            >
              View Full Health Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#4A5A3A]">Quick Actions</CardTitle>
          <CardDescription>Common tasks and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4 hover:bg-[#E8F0DC] hover:text-[#4A5A3A] hover:border-[#6B7C4E]"
              onClick={() => onNavigateToTab("events")}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Book Class</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4 hover:bg-[#E8F0DC] hover:text-[#4A5A3A] hover:border-[#6B7C4E]"
              onClick={() => onNavigateToTab("resources")}
            >
              <Users className="w-5 h-5" />
              <span className="text-sm">Contact Coach</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4 hover:bg-[#E8F0DC] hover:text-[#4A5A3A] hover:border-[#6B7C4E]"
              onClick={() => onNavigateToTab("resources")}
            >
              <Clock className="w-5 h-5" />
              <span className="text-sm">Center Hours</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4 hover:bg-[#E8F0DC] hover:text-[#4A5A3A] hover:border-[#6B7C4E]"
              onClick={() => onNavigateToTab("health")}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Track Progress</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
