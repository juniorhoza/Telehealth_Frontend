import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Clock, MapPin } from "lucide-react";

export function CenterHours() {
  const hours = [
    { day: "Monday - Friday", time: "5:00 AM - 10:00 PM" },
    { day: "Saturday", time: "7:00 AM - 8:00 PM" },
    { day: "Sunday", time: "8:00 AM - 6:00 PM" },
  ];

  const handleAddressClick = () => {
    window.open("https://www.google.com/maps/search/123+Main+Street", "_blank");
  };

  return (
    <Card className="bg-white border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#4A5A3A]">Center Hours</CardTitle>
        <CardDescription>Gym and facility access times</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {hours.map((schedule) => (
            <div
              key={schedule.day}
              className="flex justify-between items-center"
            >
              <span className="text-sm font-medium text-gray-700">
                {schedule.day}
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {schedule.time}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={handleAddressClick}
            className="flex items-start gap-2 text-sm text-gray-600 hover:text-[#6B7C4E] transition-colors w-full"
          >
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">
                Community Wellness Hub
              </p>
              <p>123 Main Street</p>
              <p>Tallahassee, FL 32307</p>
            </div>
          </button>
        </div>

        <div className="pt-4 border-t">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm font-medium text-yellow-900 mb-1">
              Holiday Hours
            </p>
            <p className="text-sm text-yellow-700">
              Special hours during holidays. Check our calendar for updates.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
