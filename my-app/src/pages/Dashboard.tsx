import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { EventsList } from "../components/EventsList";
import { CoachInfo } from "../components/CoachInfo";
import { HealthStats } from "../components/HealthStats";
import { MyClasses } from "../components/MyClasses";
import { CenterHours } from "../components/CenterHours";
import { ReferralSystem } from "../components/ReferralSystem";
import { ResidentNotes } from "../components/ResidentNotes";
import { DashboardOverview } from "../components/DashboardOverview";
import {
  Heart,
  LogOut,
  LayoutDashboard,
  Calendar,
  Activity,
  Users,
} from "lucide-react";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // STEP 1 FIX: State to store the real user data from the backend
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found, redirecting to login.");
        navigate("/");
        return;
      }

      try {
        console.log("Sending Token:", token);

        const userRes = await fetch("http://127.0.0.1:8000/v1/api/users/me/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await userRes.json();
        console.log("users/me response:", data);

        if (userRes.ok) {
          setProfile(data);
          console.log("Identity sync successful:", data);
        } else {
          console.error(`Fetch failed with status ${userRes.status}`, data);

          if (userRes.status === 401) {
            logout();
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Network or Syntax Error:", error);
      }
    };

    fetchUserData();
  }, [navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user && !profile) return null;

  return (
    <div className="h-screen bg-[#F5F1E8] flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="border-b bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#6B7C4E]">
                Community Wellness Hub
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                {/* STEP 1 FIX: Using backend data for the greeting */}
                Welcome,{" "}
                {profile?.first_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : user?.full_name || "User"}
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 bg-white"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold mb-8 text-[#4A5A3A]">
          Your Wellness Dashboard
        </h1>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0 space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-white/60 border">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="health" className="gap-2">
              <Activity className="w-4 h-4" />
              Health
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <Users className="w-4 h-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 relative min-h-0 overflow-auto">
            <TabsContent value="overview">
              <DashboardOverview onNavigateToTab={setActiveTab} />
            </TabsContent>
            <TabsContent value="events">
              <EventsList />
            </TabsContent>
            <TabsContent value="health" className="space-y-6">
              {/* Live Metrics Grid */}
              <HealthStats />

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Real Doctor Notes using the UUID from Step 1 */}
                <ResidentNotes residentUuid={profile?.uuid} />

                {/* Your Referral System (Step 5 on our roadmap) */}
                <ReferralSystem />
              </div>
            </TabsContent>
            <TabsContent value="resources">
              <div className="grid lg:grid-cols-2 gap-6">
                <CoachInfo />
                <CenterHours />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
