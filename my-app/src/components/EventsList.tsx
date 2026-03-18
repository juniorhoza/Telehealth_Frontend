import { useEffect, useState, useCallback } from "react";
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
import { apiUrl } from "../config/api";

interface Event {
  id: string;
  title: string;
  type: "fitness" | "cooking";
  date: string;
  time: string;
  instructor: string;
  spots: number;
  enrolled: boolean;
  enrollmentUuid?: string | null;
}

// Keep these easy to swap if your backend uses slightly different paths
const ENROLL_CREATE_URL = apiUrl("my-enrollments/"); // POST
const ENROLL_DELETE_URL = (enrollmentUuid: string) =>
  apiUrl(`my-enrollments/${enrollmentUuid}/`); // DELETE

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
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const authHeaders: HeadersInit = token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };

  const mapProgramsAndEnrollments = useCallback(
    (programs: any[], enrollments: any[]): Event[] => {
      const enrollmentMap = new Map<string, any>();

      for (const enrollment of enrollments || []) {
        const programUuid =
          enrollment?.program_uuid ||
          enrollment?.program?.uuid ||
          enrollment?.program?.id ||
          enrollment?.program_id;

        if (programUuid) {
          enrollmentMap.set(String(programUuid), enrollment);
        }
      }

      return programs.map((program: any, index: number) => {
        const programId = String(
          program?.uuid ?? program?.id ?? program?.program_uuid ?? index + 1,
        );

        const matchingEnrollment = enrollmentMap.get(programId);

        return {
          id: programId,
          title: program?.title || program?.name || "Community Wellness Class",
          type: String(program?.type || program?.category || "")
            .toLowerCase()
            .includes("cook")
            ? "cooking"
            : "fitness",
          date: program?.date || program?.start_date || "2026-03-17",
          time: program?.time || program?.start_time || "TBD",
          instructor:
            program?.instructor ||
            program?.coach_name ||
            program?.teacher ||
            "Community Staff",
          spots:
            typeof program?.spots === "number"
              ? program.spots
              : typeof program?.capacity === "number"
                ? program.capacity
                : 10,
          enrolled: Boolean(matchingEnrollment),
          enrollmentUuid:
            matchingEnrollment?.enrollment_uuid ||
            matchingEnrollment?.uuid ||
            null,
        };
      });
    },
    [],
  );

  const fetchEvents = useCallback(async () => {
    setLoading(true);

    try {
      const [programsRes, enrollmentsRes] = await Promise.all([
        fetch(apiUrl("programs/"), { headers: authHeaders }),
        fetch(apiUrl("my-enrollments/"), { headers: authHeaders }),
      ]);

      if (!programsRes.ok) {
        console.error(
          `Programs fetch failed with status ${programsRes.status}`,
        );
        setEvents(MOCK_EVENTS);
        setLoading(false);
        return;
      }

      const programsData = await programsRes.json();
      const enrollmentsData = enrollmentsRes.ok
        ? await enrollmentsRes.json()
        : [];

      if (Array.isArray(programsData) && programsData.length > 0) {
        const mapped = mapProgramsAndEnrollments(
          programsData,
          Array.isArray(enrollmentsData) ? enrollmentsData : [],
        );
        setEvents(mapped);
      } else {
        setEvents(MOCK_EVENTS);
      }
    } catch (err) {
      console.error(
        "Programs/enrollments fetch failed, using mock events.",
        err,
      );
      setEvents(MOCK_EVENTS);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, mapProgramsAndEnrollments]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSignup = async (eventId: string) => {
    const targetEvent = events.find((event) => event.id === eventId);
    if (!targetEvent) return;

    setSubmittingId(eventId);

    try {
      if (targetEvent.enrolled) {
        if (!targetEvent.enrollmentUuid) {
          console.error("Missing enrollment UUID for cancellation.");
          return;
        }

        const cancelRes = await fetch(
          ENROLL_DELETE_URL(targetEvent.enrollmentUuid),
          {
            method: "DELETE",
            headers: authHeaders,
          },
        );

        if (!cancelRes.ok) {
          const errorText = await cancelRes.text();
          console.error(
            "Cancel enrollment failed:",
            cancelRes.status,
            errorText,
          );
          return;
        }
      } else {
        const createRes = await fetch(ENROLL_CREATE_URL, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            program_uuid: eventId,
          }),
        });

        if (!createRes.ok) {
          const errorText = await createRes.text();
          console.error("Enrollment failed:", createRes.status, errorText);
          return;
        }
      }

      await fetchEvents();
    } catch (error) {
      console.error("Enrollment action failed:", error);
    } finally {
      setSubmittingId(null);
    }
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
                disabled={
                  submittingId === event.id ||
                  (event.spots === 0 && !event.enrolled)
                }
              >
                {event.enrolled ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {submittingId === event.id
                      ? "Updating..."
                      : "Enrolled - Click to Cancel"}
                  </>
                ) : event.spots === 0 ? (
                  "Class Full"
                ) : submittingId === event.id ? (
                  "Signing Up..."
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
