import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Heart,
  Target,
  Users,
  Sparkles,
  Award,
  MapPin,
  Linkedin,
} from "lucide-react";

export function AboutPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();
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
      linkedinUrl: "https://www.linkedin.com/in/bengisukazazlar/",
    },
    {
      name: "Frank Junior Hoza Longfor",
      role: "Senior Developer",
      bio: "Computer Science graduate from Douala, Cameroon.",
      imageSrc: "/assets/images/junior.png",
      linkedinUrl: "https://www.linkedin.com/in/hoza-junior/",
    },
    {
      name: "Alissa Forde",
      role: "Solutions Developer",
      bio: "Computer Science student from Orlando, Florida.",
      imageSrc: "/assets/images/alissa.png",
      linkedinUrl: "https://www.linkedin.com/in/alissa-forde/",
    },
  ];

  const openSignupDialog = () => {
    navigate("/?signup=true");
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Navigation */}
      <nav className="border-b bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#6B7C4E]">
                Community Wellness Hub
              </span>
            </div>
            <div className="flex gap-6 items-center">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-[#6B7C4E] transition-colors"
              >
                Home
              </button>
              <button className="text-[#6B7C4E] font-medium">About</button>
              <Button
                onClick={openSignupDialog}
                className="bg-[#6B7C4E] hover:bg-[#5A6B3E]"
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#F5F1E8] to-[#E8F0DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-[#4A5A3A] mb-6">
              About Our Mission
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Bringing comprehensive wellness services to a community that
              deserves access to health, fitness, and care.
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
                The Community Wellness Hub was born from a simple realization:
                our community lacked a dedicated space where people could access
                comprehensive health and wellness services under one roof.
              </p>
              <p>
                Our residents had to travel to neighboring towns for fitness
                classes, wellness coaching, and preventive health services. We
                knew our community deserved a place where health and wellness
                are accessible to everyone.
              </p>
              <p>
                This bold initiative brings together fitness facilities, cooking
                education, wellness coaching, and medical referrals in a
                welcoming environment designed to support every member of our
                community on their journey to better health.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center p-6 bg-white border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-[#6B7C4E]" />
                </div>
                <h3 className="text-3xl font-bold mb-1 text-[#4A5A3A]">100+</h3>
                <p className="text-sm text-gray-600">Expected Members</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-white border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-[#6B7C4E]" />
                </div>
                <h3 className="text-3xl font-bold mb-1 text-[#4A5A3A]">10+</h3>
                <p className="text-sm text-gray-600">Expert Instructors</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-white border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-[#6B7C4E]" />
                </div>
                <h3 className="text-3xl font-bold mb-1 text-[#4A5A3A]">10+</h3>
                <p className="text-sm text-gray-600">Weekly Classes</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-white border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#E8F0DC] rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-[#6B7C4E]" />
                </div>
                <h3 className="text-3xl font-bold mb-1 text-[#4A5A3A]">1st</h3>
                <p className="text-sm text-gray-600">In Our Community</p>
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
                    <Target className="w-6 h-6 text-[#6B7C4E]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#4A5A3A]">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-700">
                  To provide accessible, comprehensive wellness services that
                  empower every member to achieve their health goals through
                  education, support, and clinical guidance in a welcoming,
                  inclusive environment.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#E8F0DC] rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#6B7C4E]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#4A5A3A]">
                    Our Vision
                  </h3>
                </div>
                <p className="text-gray-700">
                  To become a model for community-based wellness, demonstrating
                  that when people have access to quality health resources and
                  support, entire community health can thrive.
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
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
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
  );
}
