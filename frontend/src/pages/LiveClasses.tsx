import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function LiveClasses() {
  const { isAuthenticated } = useAuthStore();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    api
      .get("/live-classes")
      .then((response) => {
        setClasses(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated]);

  const joinClass = (meetLink: string) => {
    window.open(meetLink, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Live Classes</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-white mb-2">
                {classItem.title}
              </h2>
              <p className="text-gray-300 mb-4">{classItem.description}</p>
              <div className="mb-4">
                <p className="text-gray-400">
                  Scheduled: {new Date(classItem.scheduled_at).toLocaleString()}
                </p>
                {classItem.duration && (
                  <p className="text-gray-400">
                    Duration: {classItem.duration} minutes
                  </p>
                )}
              </div>
              {classItem.is_completed && classItem.recording_url && (
                <a
                  href={classItem.recording_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 mb-4 block"
                >
                  Watch Recording
                </a>
              )}
              {!classItem.is_completed && (
                <button
                  onClick={() => joinClass(classItem.meet_link)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Join Class
                </button>
              )}
            </div>
          ))}
          {classes.length === 0 && (
            <div className="col-span-2 text-center text-gray-400">
              No live classes scheduled
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


