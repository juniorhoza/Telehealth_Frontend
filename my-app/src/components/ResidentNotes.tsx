import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MessageSquare, Clock } from "lucide-react";

interface Note {
  uuid: string;
  note_text: string;
  created_at: string;
  doctor_name: string;
}

export function ResidentNotes({ residentUuid }: { residentUuid?: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      if (!residentUuid) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/v1/api/doctor/residents/${residentUuid}/note/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const text = await response.text();
          console.error("Notes fetch failed:", response.status, text);
          setError("Notes are unavailable right now.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setNotes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching doctor notes:", error);
        setError("Notes are unavailable right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [residentUuid]);

  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-[#4A5A3A] flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Doctor&apos;s Resident Notes
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Loading clinical notes...</p>
        ) : error ? (
          <p className="text-sm text-gray-500 italic">{error}</p>
        ) : notes.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No notes from your provider yet.
          </p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.uuid}
                className="p-3 bg-[#F5F1E8] rounded-lg border-l-4 border-[#6B7C4E]"
              >
                <p className="text-gray-800 text-sm mb-2">{note.note_text}</p>
                <div className="flex justify-between items-center text-[10px] text-gray-500">
                  <span className="font-semibold">
                    Dr. {note.doctor_name || "Staff"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
