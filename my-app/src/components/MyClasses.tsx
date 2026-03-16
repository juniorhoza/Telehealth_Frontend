import { useEffect, useState } from "react";

export function MyClasses() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/v1/api/my-enrollments/",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );
        const data = await res.json();
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (err) {
        setEnrollments([]);
      }
    };

    fetchMyClasses();
  }, [token]);

  if (enrollments.length === 0) {
    return (
      <div className="p-3 rounded-lg border bg-gray-50">
        <p className="text-sm text-gray-600">
          You are not enrolled in any classes yet.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Visit the Events tab to browse and sign up for upcoming wellness
          classes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {enrollments.map((e) => (
        <div
          key={e.enrollment_uuid}
          className="p-3 bg-white rounded-lg border flex justify-between items-center"
        >
          <span className="text-sm font-medium">
            {e.program?.name || "Wellness Class"}
          </span>
          <span className="text-[10px] bg-[#E8F0DC] px-2 py-1 rounded text-[#6B7C4E]">
            {e.status || "Enrolled"}
          </span>
        </div>
      ))}
    </div>
  );
}
