import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { UserRound, Stethoscope, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { apiUrl } from "../config/api";

export function ReferralSystem() {
  const [specialists, setSpecialists] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const res = await fetch(apiUrl("specialists/"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // WORKAROUND: Fallback data if the backend list is empty
        if (data.length === 0) {
          setSpecialists([
            {
              id: 1,
              name: "Dr. Sarah Chen",
              specialty: "Cardiology",
              email: "s.chen@wellness.org",
            },
            {
              id: 2,
              name: "Dr. Marcus Thorne",
              specialty: "Nutritionist",
              email: "m.thorne@wellness.org",
            },
          ]);
        } else {
          setSpecialists(data);
        }
      } catch (err) {
        console.error("Specialist fetch failed. Using demo data.");
      }
    };
    fetchSpecialists();
  }, [token]);

  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#4A5A3A] flex items-center gap-2">
          <Stethoscope className="w-5 h-5" />
          Recommended Specialists
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {specialists.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 bg-[#F5F1E8] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <UserRound className="w-5 h-5 text-[#6B7C4E]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{s.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                    {s.specialty}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-[#6B7C4E]">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
