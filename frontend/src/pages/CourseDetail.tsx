import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  modules: any[];
}

export default function CourseDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then((response) => {
        setCourse(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    if (isAuthenticated) {
      api
        .get("/courses/my/enrollments")
        .then((response) => {
          const enrollments = response.data;
          setEnrolled(
            enrollments.some((e: any) => e.course_id === parseInt(id || "0")),
          );
        })
        .catch(() => {});
    }
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    try {
      await api.post(`/courses/${id}/enroll`);
      setEnrolled(true);
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.detail === "Already enrolled"
      ) {
        setEnrolled(true);
      } else {
        alert("Failed to enroll");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Course not found
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
        <p className="text-gray-300 mb-8">{course.description}</p>

        <div className="flex gap-4 mb-8">
          {enrolled ? (
            <Link
              to={`/courses/${id}/learn`}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
            >
              Start Learning
            </Link>
          ) : (
            <>
              {course.price > 0 ? (
                <Link
                  to={`/courses/${id}/payment`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
                >
                  Buy Now - ₹{course.price}
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
                >
                  Enroll for Free
                </button>
              )}
            </>
          )}
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Course Modules
          </h2>
          {course.modules?.map((module) => (
            <div key={module.id} className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">
                {module.title} {module.is_locked && "🔒"}
              </h3>
              {module.lessons?.map((lesson: any) => (
                <div key={lesson.id} className="ml-4 text-gray-300 mb-1">
                  {lesson.title}
                  {lesson.is_locked && " 🔒"}
                  {lesson.is_preview && " (Preview)"}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
