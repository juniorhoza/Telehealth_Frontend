import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Activity, Scale, Ruler } from "lucide-react";

interface HealthStatsData {
  weight_kg?: number | string;
  bmi?: number | string;
  blood_pressure?: string;
}

const FALLBACK_STATS: HealthStatsData = {
  weight_kg: "--",
  bmi: "N/A",
  blood_pressure: "--",
};

export function HealthStats() {
  const [stats, setStats] = useState<HealthStatsData>(FALLBACK_STATS);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://127.0.0.1:8000/v1/api/health-tracking/",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Health stats fetch failed:", res.status, text);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const latest = data[0];

          setStats({
            weight_kg: latest.value_numeric ?? "--",
            bmi: latest.bmi ?? "N/A",
            blood_pressure:
              latest.value_systolic && latest.value_diastolic
                ? `${latest.value_systolic}/${latest.value_diastolic}`
                : "--",
          });
        } else if (data && typeof data === "object") {
          setStats({
            weight_kg: data.weight_kg ?? data.value_numeric ?? "--",
            bmi: data.bmi ?? "N/A",
            blood_pressure:
              data.blood_pressure ??
              (data.value_systolic && data.value_diastolic
                ? `${data.value_systolic}/${data.value_diastolic}`
                : "--"),
          });
        }
      } catch (err) {
        console.error("Health stats fetch failed:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white border-none shadow-sm">
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <Scale className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Weight</p>
            <p className="text-xl font-bold">{stats.weight_kg} kg</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-none shadow-sm">
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-full">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">BMI</p>
            <p className="text-xl font-bold">{stats.bmi}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-none shadow-sm">
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-full">
            <Ruler className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Blood Pressure</p>
            <p className="text-xl font-bold">{stats.blood_pressure}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
