import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/roadmaps")
      .then((response) => {
        setRoadmaps(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
        <h1 className="text-4xl font-bold text-white mb-8">
          Learning Roadmaps
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">
                {roadmap.title}
              </h2>
              <p className="text-gray-300 mb-4">{roadmap.description}</p>
              {roadmap.category && (
                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm mb-4">
                  {roadmap.category}
                </span>
              )}
              {roadmap.course_ids && roadmap.course_ids.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-2">
                    Includes {roadmap.course_ids.length} courses
                  </p>
                  <Link
                    to="/courses"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    View Courses →
                  </Link>
                </div>
              )}
            </div>
          ))}
          {roadmaps.length === 0 && (
            <div className="col-span-2 text-center text-gray-400">
              No roadmaps available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


