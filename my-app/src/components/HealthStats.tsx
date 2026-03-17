import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Activity, Scale, Ruler } from "lucide-react";

interface HealthTrackingEntry {
  uuid: string;
  metric_type: string;
  value_numeric?: number | string | null;
  value_systolic?: number | null;
  value_diastolic?: number | null;
  medication_taken?: boolean | null;
  unit?: string;
}

interface HealthStatsData {
  weight_kg?: number | string;
  adherence?: string;
  blood_pressure?: string;
}

const FALLBACK_STATS: HealthStatsData = {
  weight_kg: "--",
  adherence: "N/A",
  blood_pressure: "--",
};

export function HealthStats() {
  const [stats, setStats] = useState<HealthStatsData>(FALLBACK_STATS);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://127.0.0.1:8000/v1/api/health-tracking/summary/",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Health stats fetch failed:", res.status, text);
          return;
        }

        const data: HealthTrackingEntry[] = await res.json();

        if (!Array.isArray(data)) {
          console.error("Unexpected health stats response:", data);
          return;
        }

        const weightEntry = data.find(
          (entry) => entry.metric_type === "WEIGHT",
        );
        const bpEntry = data.find((entry) => entry.metric_type === "BP");
        const adherenceEntry = data.find(
          (entry) => entry.metric_type === "ADHERENCE",
        );

        setStats({
          weight_kg: weightEntry?.value_numeric ?? "--",
          adherence:
            adherenceEntry?.medication_taken === true ||
            Number(adherenceEntry?.value_numeric) === 1
              ? "Taken"
              : adherenceEntry?.medication_taken === false ||
                  Number(adherenceEntry?.value_numeric) === 0
                ? "Missed"
                : "N/A",
          blood_pressure:
            bpEntry?.value_systolic != null && bpEntry?.value_diastolic != null
              ? `${bpEntry.value_systolic}/${bpEntry.value_diastolic}`
              : bpEntry?.value_numeric != null
                ? `${bpEntry.value_numeric} ${bpEntry.unit ?? ""}`.trim()
                : "--",
        });
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
            <p className="text-xl font-bold">
              {stats.weight_kg !== "--" ? `${stats.weight_kg} kg` : "--"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-none shadow-sm">
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-full">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Medication Adherence</p>
            <p className="text-xl font-bold">{stats.adherence}</p>
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
