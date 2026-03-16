import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Mail, Phone, Calendar } from "lucide-react";
import { useState } from "react";

export function CoachInfo() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleScheduleAppointment = () => {
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:rachel.davis@wellnesshub.com";
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+15551234567";
  };

  return (
    <Card className="bg-white border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#4A5A3A]">Your Wellness Coach</CardTitle>
        <CardDescription>Your dedicated health provider</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#6B7C4E] to-[#8A9B6E] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              DR
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#4A5A3A]">Dr. Rachel Davis</h3>
              <p className="text-sm text-gray-600">Certified Wellness Coach</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              Specializing in holistic health, nutrition, and fitness coaching with 10+ years of experience.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleEmailClick}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6B7C4E] transition-colors w-full"
            >
              <Mail className="w-4 h-4" />
              <span>rachel.davis@wellnesshub.com</span>
            </button>
            <button
              onClick={handlePhoneClick}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6B7C4E] transition-colors w-full"
            >
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </button>
          </div>

          {showConfirmation && (
            <div className="p-3 bg-[#E8F0DC] rounded-lg border border-[#6B7C4E]/20">
              <p className="text-sm font-medium text-[#4A5A3A]">
                Appointment request sent! Dr. Davis will contact you soon.
              </p>
            </div>
          )}

          <Button 
            className="w-full bg-[#6B7C4E] hover:bg-[#5A6B3E] gap-2"
            onClick={handleScheduleAppointment}
          >
            <Calendar className="w-4 h-4" />
            Schedule Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}