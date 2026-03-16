import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Users, CheckCircle2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  type: "fitness" | "cooking";
  date: string;
  time: string;
  instructor: string;
  spots: number;
  enrolled: boolean;
}

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Morning Yoga Flow",
    type: "fitness",
    date: "2026-03-17",
    time: "7:00 AM",
    instructor: "Sarah Johnson",
    spots: 8,
    enrolled: false,
  },
  {
    id: "2",
    title: "Healthy Meal Prep 101",
    type: "cooking",
    date: "2026-03-18",
    time: "6:00 PM",
    instructor: "Chef Marcus Lee",
    spots: 12,
    enrolled: true,
  },
  {
    id: "3",
    title: "HIIT Training",
    type: "fitness",
    date: "2026-03-19",
    time: "5:30 PM",
    instructor: "Mike Torres",
    spots: 5,
    enrolled: false,
  },
  {
    id: "4",
    title: "Plant-Based Cooking",
    type: "cooking",
    date: "2026-03-20",
    time: "7:00 PM",
    instructor: "Chef Emma Williams",
    spots: 10,
    enrolled: false,
  },
  {
    id: "5",
    title: "Pilates Core Strength",
    type: "fitness",
    date: "2026-03-21",
    time: "8:00 AM",
    instructor: "Jennifer Martinez",
    spots: 6,
    enrolled: false,
  },
  {
    id: "6",
    title: "Mediterranean Cuisine",
    type: "cooking",
    date: "2026-03-22",
    time: "6:30 PM",
    instructor: "Chef Antonio Rossi",
    spots: 15,
    enrolled: false,
  },
];

export function EventsList() {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);

  useEffect(() => {
    const fetchPrograms = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://127.0.0.1:8000/v1/api/programs/", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) {
          console.error(`Programs fetch failed with status ${res.status}`);
          setEvents(MOCK_EVENTS);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const mappedEvents: Event[] = data.map(
            (program: any, index: number) => ({
              id: String(program.id ?? index + 1),
              title:
                program.title || program.name || "Community Wellness Class",
              type: String(program.type || program.category || "")
                .toLowerCase()
                .includes("cook")
                ? "cooking"
                : "fitness",
              date: program.date || program.start_date || "2026-03-17",
              time: program.time || program.start_time || "TBD",
              instructor:
                program.instructor ||
                program.coach_name ||
                program.teacher ||
                "Community Staff",
              spots:
                typeof program.spots === "number"
                  ? program.spots
                  : typeof program.capacity === "number"
                    ? program.capacity
                    : 10,
              enrolled: Boolean(program.enrolled),
            }),
          );

          setEvents(mappedEvents);
        } else {
          setEvents(MOCK_EVENTS);
        }
      } catch (err) {
        console.error("Programs fetch failed, using mock events.", err);
        setEvents(MOCK_EVENTS);
      }
    };

    fetchPrograms();
  }, []);

  const handleSignup = async (eventId: string) => {
    const token = localStorage.getItem("token");
    const targetEvent = events.find((event) => event.id === eventId);

    setEvents(
      events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              enrolled: !event.enrolled,
              spots: event.enrolled ? event.spots + 1 : event.spots - 1,
            }
          : event,
      ),
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-white border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#4A5A3A]">Upcoming Events</CardTitle>
        <CardDescription>
          Sign up for fitness classes and cooking workshops
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-[#4A5A3A]">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    with {event.instructor}
                  </p>
                </div>
                <Badge
                  variant={event.type === "fitness" ? "default" : "secondary"}
                  className={
                    event.type === "fitness"
                      ? "bg-[#6B7C4E] hover:bg-[#5A6B3E]"
                      : ""
                  }
                >
                  {event.type === "fitness" ? "Fitness" : "Cooking"}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {event.time}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {event.spots} spots left
                </div>
              </div>

              <Button
                onClick={() => handleSignup(event.id)}
                className={
                  event.enrolled
                    ? "bg-[#6B7C4E] hover:bg-[#5A6B3E]"
                    : "hover:bg-[#E8F0DC] hover:text-[#4A5A3A] hover:border-[#6B7C4E]"
                }
                variant={event.enrolled ? "default" : "outline"}
                disabled={event.spots === 0 && !event.enrolled}
              >
                {event.enrolled ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Enrolled - Click to Cancel
                  </>
                ) : event.spots === 0 ? (
                  "Class Full"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
