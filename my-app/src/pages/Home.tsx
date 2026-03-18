import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { apiUrl } from "../config/api";
import { notify } from "../lib/notifications";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import {
  Heart,
  Users,
  Dumbbell,
  Calendar,
  Info,
  Home,
  Check,
  Linkedin,
} from "lucide-react";

export function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [insuranceStatus, setInsuranceStatus] = useState("unknown");
  const [heightCm, setHeightCm] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [otpStep, setOtpStep] = useState(false); // Flag for the OTP input
  const [otpUuid, setOtpUuid] = useState(""); // Stores the UUID from the login response
  const [otpCode, setOtpCode] = useState(""); // Stores the 6-digit code the user types
  const foundingTeam = [
    {
      name: "Javonte Carter",
      role: "Team Lead",
      bio: "Computer Science graduate student from Fort Pierce, Florida.",
      imageSrc: "/assets/images/javonte.png",
      linkedinUrl: "https://www.linkedin.com/in/javonte-carter/",
    },
    {
      name: "Bengisu Kazazlar",
      role: "Solutions Lead",
      bio: "Junior Computer Science student from İzmir, Turkey.",
      imageSrc: "/assets/images/bengi.jpeg",
      linkedinUrl: "https://www.linkedin.com/in/bengisu-kazazlar/",
    },
    {
      name: "Frank Junior Hoza Longfor",
      role: "Senior Developer",
      bio: "Computer Science graduate from Douala, Cameroon.",
      imageSrc: "/assets/images/junior.png",
      linkedinUrl: "https://www.linkedin.com/in/frank-junior-hoza-longfor/",
    },
    {
      name: "Alissa Forde",
      role: "Solutions Developer",
      bio: "Computer Science student from Orlando, Florida.",
      imageSrc: "/assets/images/alissa.png",
      linkedinUrl: "https://www.linkedin.com/in/alissa-forde/",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { 
      if (isLogin) {
        if (!otpStep) {
          // --- STEP 1: INITIAL LOGIN (Check Email/Password) ---
          // FIX: Change 'verify-otp' to 'login' here
          const response = await fetch(
            apiUrl("authentication/login/"),
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }), // FIX: Send email/password, not otpCode
            },
          );
          const result = await response.json();

          if (response.ok) {
            // Success! Now we have the otp_uuid to use in the next step
            setOtpUuid(result.otp_uuid);
            setOtpStep(true);
            notify.info("Password accepted. OTP sent to your email.");
          } else {
            notify.error(result.message || "Login failed");
          }
        } else {
          // --- STEP 2: VERIFY OTP (Final Token Exchange) ---
          const response = await fetch(
            apiUrl("authentication/verify-otp/"),
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                otp_uuid: otpUuid,
                otp_code: otpCode,
              }),
            },
          );
          const result = await response.json();

          if (response.ok) {
            console.log("Verified! Token:", result.access_token);
            login(result.access_token, result.user);
            notify.success("Login successful.");
            setShowLogin(false);
            navigate("/dashboard");
          } else {
            notify.error(result.message || "Invalid OTP code");
          }
        }
      } else {
        // --- SIGNUP LOGIC ---
        await signup({
          name,
          email,
          password,
          dob,
          gender,
          heightCm,
          insuranceStatus,
          emergencyName,
          emergencyPhone,
        });
        notify.success("Registration successful. Check your email for an OTP.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Auth Error:", error);

      if (error instanceof Error) {
        notify.error(`Auth error: ${error.message}`);
      } else {
        notify.warning("Unknown auth error occurred.");
      }
    }
  };

  const openLoginDialog = () => {
    setIsLogin(true);
    setOtpStep(false);
    setOtpCode("");
    setOtpUuid("");
    setShowLogin(true);
    setShowSignup(false);
  };

  const openSignupDialog = () => {
    setIsLogin(false);
    setOtpStep(false);
    setOtpCode("");
    setOtpUuid("");
    setShowSignup(true);
    setShowLogin(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F5F1E8] flex flex-col">
      <Tabs defaultValue="home" className="tabs-container h-full flex flex-col">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between px-8 py-4">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger
              value="home"
              className="gap-2 data-[state=active]:bg-white data-[state=inactive]:bg-transparent"
            >
              <Home className="w-4 h-4" />
              Home
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="gap-2 data-[state=active]:bg-white data-[state=inactive]:bg-transparent"
            >
              <Info className="w-4 h-4" />
              About
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="gap-2 data-[state=active]:bg-white data-[state=inactive]:bg-transparent"
            >
              <Dumbbell className="w-4 h-4" />
              Our Services
            </TabsTrigger>
            <TabsTrigger
              value="benefits"
              className="gap-2 data-[state=active]:bg-white data-[state=inactive]:bg-transparent"
            >
              <Heart className="w-4 h-4" />
              Member Benefits
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-3 items-center ml-6">
            <Button
              variant="outline"
              onClick={openLoginDialog}
              className="bg-white"
            >
              Log In
            </Button>
            <Button
              onClick={openSignupDialog}
              className="bg-[#6B7C4E] hover:bg-[#5A6B3E] text-white"
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Main Content Area - Full Height, No Scroll */}
        {/* Home Tab */}
        {/* Home Tab */}
        <div className="tab-panels relative flex-1 min-h-0">
          <TabsContent value="home" forceMount className="tab-content m-0">
            <div className="w-full px-20 pt-24">
              <div className="max-w-[720px]">
                <h1 className="text-[96px] font-semibold text-[#556F2F] leading-[0.95] tracking-[-0.04em]">
                  Welcome
                  <br />
                  to the
                  <br />
                  Community
                  <br />
                  Wellness Hub
                </h1>

                <p className="mt-12 max-w-[620px] text-[23px] leading-[1.25] text-[#53657D]">
                  Access fitness classes, cooking workshops, wellness coaching,
                  and more - all in one welcoming space.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent
            value="about"
            forceMount
            className="tab-content m-0 overflow-auto"
          >
            <div className="bg-[#F5F1E8]">
              {/* Hero Section */}
              <div className="bg-gradient-to-br from-[#F5F1E8] to-[#E8F0DC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                  <div className="text-center">
                    <h1 className="text-5xl font-bold text-[#4A5A3A] mb-6">
                      About Our Mission
                    </h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                      Bringing comprehensive wellness services to a community
                      that deserves access to health, fitness, and care.
                    </p>
                  </div>
                </div>
              </div>

              {/* Our Story */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-[#4A5A3A]">
                      Our Story
                    </h2>
                    <div className="space-y-4 text-gray-700">
                      <p>
                        The Community Wellness Hub was born from a simple
                        realization: our community lacked a dedicated space
                        where people could access comprehensive health and
                        wellness services under one roof.
                      </p>
                      <p>
                        Our residents travel to neighboring census tracts for
                        fitness classes, wellness coaching, and preventive
                        health services. We knew our community deserved a place
                        where health and wellness are accessible to everyone.
                      </p>
                      <p>
                        This bold initiative brings together fitness facilities,
                        cooking education, wellness coaching, and medical
                        referrals in a welcoming environment designed to support
                        every member of our community on their journey to better
                        health.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="text-center p-6 bg-white border-none shadow-sm">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="w-6 h-6 text-[#6B7C4E]" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1 text-[#4A5A3A]">
                          100+
                        </h3>
                        <p className="text-sm text-gray-600">
                          Expected Members
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="text-center p-6 bg-white border-none shadow-sm">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-3">
                          <Heart className="w-6 h-6 text-[#6B7C4E]" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1 text-[#4A5A3A]">
                          10+
                        </h3>
                        <p className="text-sm text-gray-600">
                          Expert Instructors
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="text-center p-6 bg-white border-none shadow-sm">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-3">
                          <Check className="w-6 h-6 text-[#6B7C4E]" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1 text-[#4A5A3A]">
                          10+
                        </h3>
                        <p className="text-sm text-gray-600">Weekly Classes</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center p-6 bg-white border-none shadow-sm">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-3">
                          <Info className="w-6 h-6 text-[#6B7C4E]" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1 text-[#4A5A3A]">
                          1st
                        </h3>
                        <p className="text-sm text-gray-600">
                          In Our Community
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Mission & Vision */}
              <div className="bg-white/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card className="bg-white border-none shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-[#E8F0DC] rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-[#6B7C4E]" />
                          </div>
                          <h3 className="text-2xl font-bold text-[#4A5A3A]">
                            Our Mission
                          </h3>
                        </div>
                        <p className="text-gray-700">
                          To provide accessible, comprehensive wellness services
                          that empower every member to achieve their health
                          goals through education, support, and clinical
                          guidance in a welcoming, inclusive environment.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border-none shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-[#E8F0DC] rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-[#6B7C4E]" />
                          </div>
                          <h3 className="text-2xl font-bold text-[#4A5A3A]">
                            Our Vision
                          </h3>
                        </div>
                        <p className="text-gray-700">
                          To become a model for community-based wellness,
                          demonstrating that when people have access to quality
                          health resources and support, entire community health
                          can thrive.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* What We Offer */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center mb-12 text-[#4A5A3A]">
                  Comprehensive Services
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#4A5A3A]">
                      Fitness & Movement
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Group fitness classes (yoga, HIIT, pilates)</li>
                      <li>• Personal training sessions</li>
                      <li>• Fully equipped gym facilities</li>
                      <li>• Outdoor activity programs</li>
                      <li>• Adaptive fitness for all abilities</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#4A5A3A]">
                      Nutrition & Cooking
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Cooking classes and workshops</li>
                      <li>• Nutrition education programs</li>
                      <li>• Meal planning guidance</li>
                      <li>• Dietary counseling services</li>
                      <li>• Community kitchen access</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#4A5A3A]">
                      Wellness & Support
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Certified wellness coaching</li>
                      <li>• Health screenings and assessments</li>
                      <li>• Specialist referral network</li>
                      <li>• Mental health resources</li>
                      <li>• Community support groups</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Team Section */}
              <div className="bg-[#6B7C4E] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <h2 className="text-3xl font-bold text-center mb-8">
                    Our Founding Team
                  </h2>
                  <div className="grid md:grid-cols-4 gap-8">
                    {foundingTeam.map((member) => (
                      <div key={member.name} className="text-center">
                        <img
                          src={member.imageSrc}
                          alt={`${member.name} profile`}
                          className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-white/30"
                        />
                        <h3 className="text-xl font-semibold mb-1">
                          {member.name}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <p className="text-[#E8F0DC]">{member.role}</p>
                          <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Visit ${member.name} on LinkedIn`}
                            className="text-[#E8F0DC] hover:text-white transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </div>
                        <p className="text-sm text-white/90">{member.bio}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent
            value="services"
            forceMount
            className="tab-content m-0 h-full flex items-center justify-center overflow-auto"
          >
            <div className="max-w-6xl px-8 py-8 w-full flex flex-col items-center">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#4A5A3A] mb-4">
                  Our Services
                </h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Comprehensive wellness services designed to support every
                  aspect of your health journey
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Dumbbell className="w-8 h-8 text-[#6B7C4E]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-[#4A5A3A]">
                      Fitness Classes
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Group fitness sessions for all levels, from yoga to
                      high-intensity training
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-[#6B7C4E]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-[#4A5A3A]">
                      Cooking Classes
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Learn to prepare nutritious, delicious meals with expert
                      instructors
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-[#6B7C4E]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-[#4A5A3A]">
                      Wellness Coaching
                    </h3>
                    <p className="text-gray-600 text-sm">
                      One-on-one support from certified wellness coaches and
                      health providers
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-[#6B7C4E]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-[#4A5A3A]">
                      Community Focus
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Build connections and support each other on your wellness
                      journey
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent
            value="benefits"
            forceMount
            className="tab-content m-0 h-full flex items-center justify-center overflow-auto"
          >
            <div className="max-w-6xl px-8 py-8 w-full flex flex-col items-center">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#4A5A3A] mb-4">
                  Member Benefits
                </h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Everything you need to achieve your wellness goals under one
                  roof
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-[#4A5A3A]">
                          Unlimited Class Access
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Attend unlimited fitness and cooking classes with
                          flexible scheduling to fit your lifestyle
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-[#4A5A3A]">
                          Personal Wellness Coach
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Get paired with a dedicated wellness coach to guide
                          your health journey
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-[#4A5A3A]">
                          Health Tracking & Stats
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Monitor your progress with detailed health metrics and
                          personalized insights
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-[#4A5A3A]">
                          Specialist Referrals
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Access our network of medical specialists based on
                          your wellness needs
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-[#4A5A3A]">
                          24/7 Gym Access
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Work out on your schedule with round-the-clock access
                          to our fitness facilities
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-[#4A5A3A]">
                          Community Events
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Participate in workshops, health fairs, and social
                          events throughout the year
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Login/Signup Dialog */}
      <Dialog
        open={showLogin || showSignup}
        onOpenChange={(open) => {
          setShowLogin(open);
          setShowSignup(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isLogin ? "Welcome Back" : "Create Your Account"}
            </DialogTitle>
            <DialogDescription>
              {isLogin
                ? "Log in to access your wellness dashboard"
                : "Join our community and start your wellness journey"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* If we are NOT in the OTP step, show Login or Signup fields */}
            {!otpStep ? (
              <>
                {/* Registration Fields - Only shown when isLogin is false */}
                {!isLogin && (
                  <div className="space-y-4">
                    {/* ... Keep all your existing Signup Input fields (Name, DOB, Gender, etc.) ... */}
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    {/* ... (Keep the rest of your signup fields here) ... */}
                  </div>
                )}

                {/* Basic Login Fields (Email/Password) */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              /* STEP 2: SHOW THIS ONLY WHEN otpStep IS TRUE */
              <div className="space-y-4 py-4 text-center">
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-md text-sm mb-4">
                  A 6-digit code has been sent to <strong>{email}</strong>
                </div>
                <Label htmlFor="otpCode" className="text-lg font-semibold">
                  Enter Verification Code
                </Label>
                <Input
                  id="otpCode"
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  placeholder="000000"
                  className="text-center text-2xl tracking-[0.5em] h-14"
                />
                <p className="text-xs text-gray-500">
                  Didn't get a code? Wait a moment and check your spam folder.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#6B7C4E] hover:bg-[#5A6B3E] text-white"
            >
              {otpStep ? "Verify Code" : isLogin ? "Log In" : "Create Account"}
            </Button>

            {/* Only show the toggle link if we aren't mid-OTP verification */}
            {!otpStep && (
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#6B7C4E] hover:underline"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Log in"}
                </button>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
