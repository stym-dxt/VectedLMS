import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function Testimonials() {
  const { isAuthenticated } = useAuthStore();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    content: "",
    rating: 5,
    course_id: null as number | null,
  });

  useEffect(() => {
    api
      .get("/testimonials", { params: { approved_only: true } })
      .then((response) => {
        setTestimonials(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/testimonials", formData);
      setShowForm(false);
      setFormData({
        user_name: "",
        user_email: "",
        content: "",
        rating: 5,
        course_id: null,
      });
      api
        .get("/testimonials", { params: { approved_only: true } })
        .then((response) => setTestimonials(response.data));
    } catch (error) {
      alert("Failed to submit testimonial");
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Student Testimonials
          </h1>
          {isAuthenticated && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              {showForm ? "Cancel" : "Add Testimonial"}
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Share Your Experience
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.user_name}
                onChange={(e) =>
                  setFormData({ ...formData, user_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.user_email}
                onChange={(e) =>
                  setFormData({ ...formData, user_email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
              />
              <textarea
                placeholder="Your testimonial"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={5}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                required
              />
              <div className="mb-4">
                <label className="text-gray-300 mb-2 block">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} {rating === 5 ? "Stars" : "Star"}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">⭐</div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {testimonial.user_name}
                  </h3>
                  {testimonial.rating && (
                    <p className="text-yellow-400">
                      {"⭐".repeat(testimonial.rating)}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-gray-300 mb-4">{testimonial.content}</p>
              <p className="text-gray-400 text-sm">
                {new Date(testimonial.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
          {testimonials.length === 0 && (
            <div className="col-span-3 text-center text-gray-400">
              No testimonials yet. Be the first to share your experience!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


