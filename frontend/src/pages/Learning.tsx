import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function Learning() {
  const { courseId } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    if (courseId) {
      api
        .get(`/courses/${courseId}`)
        .then((response) => {
          setCourse(response.data);
          if (response.data.modules?.[0]?.lessons?.[0]) {
            const firstLesson = response.data.modules[0].lessons[0];
            setSelectedLesson(firstLesson);
            if (firstLesson.id) {
              api
                .get("/notes", { params: { lesson_id: firstLesson.id } })
                .then((response) => setNotes(response.data))
                .catch(() => {});
            }
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [courseId, isAuthenticated]);

  useEffect(() => {
    if (selectedLesson?.id && isAuthenticated) {
      api
        .get("/notes", { params: { lesson_id: selectedLesson.id } })
        .then((response) => setNotes(response.data))
        .catch(() => {});
    }
  }, [selectedLesson?.id, isAuthenticated]);

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLesson) return;

    try {
      const response = await api.post("/notes", {
        lesson_id: selectedLesson.id,
        content: newNote,
      });
      setNotes([...notes, response.data]);
      setNewNote("");
    } catch (error) {
      alert("Failed to save note");
    }
  };

  const checkAccess = async (lesson: any) => {
    try {
      const response = await api.get(`/content/lesson/${lesson.id}/access`);
      if (response.data.has_access) {
        setSelectedLesson(lesson);
      } else {
        alert(
          response.data.unlock_message ||
            "This lesson is locked. Please enroll in the course.",
        );
      }
    } catch (error) {
      alert("Failed to check access");
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
    <div className="min-h-screen bg-gray-900">
      <div className="flex h-screen">
        <div className="w-1/4 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">
              {course.title}
            </h2>
            {course.modules?.map((module: any) => (
              <div key={module.id} className="mb-4">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  {module.title}
                </h3>
                {module.lessons?.map((lesson: any) => (
                  <button
                    key={lesson.id}
                    onClick={() => checkAccess(lesson)}
                    className={`w-full text-left px-4 py-2 mb-1 rounded ${
                      selectedLesson?.id === lesson.id
                        ? "bg-blue-600 text-white"
                        : lesson.is_locked
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-gray-300 hover:bg-gray-700"
                    }`}
                    disabled={lesson.is_locked}
                  >
                    {lesson.title}
                    {lesson.is_locked && " 🔒"}
                    {lesson.is_preview && " (Preview)"}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedLesson ? (
            <>
              <div className="flex-1 bg-black flex items-center justify-center">
                {selectedLesson.video_url ? (
                  <ReactPlayer
                    url={selectedLesson.video_url}
                    controls
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <div className="text-white">
                    No video available for this lesson
                  </div>
                )}
              </div>
              <div className="h-1/3 bg-gray-800 border-t border-gray-700 p-4 overflow-y-auto">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {selectedLesson.title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {selectedLesson.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    My Notes
                  </h4>
                  <form onSubmit={handleNoteSubmit} className="mb-4">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                    <button
                      type="submit"
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      Save Note
                    </button>
                  </form>
                  <div className="space-y-2">
                    {notes.map((note) => (
                      <div key={note.id} className="bg-gray-700 p-3 rounded">
                        <p className="text-gray-300">{note.content}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(note.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white">
              Select a lesson to start learning
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
