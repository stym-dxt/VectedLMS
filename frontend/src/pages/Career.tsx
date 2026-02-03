import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function Career() {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "interview" | "resume" | "clients"
  >("interview");
  const [interviewPreps, setInterviewPreps] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [clientConnections, setClientConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    Promise.all([
      api.get("/career/interview-prep").then((r) => r.data),
      api.get("/career/resumes").then((r) => r.data),
      api.get("/career/client-connections").then((r) => r.data),
    ])
      .then(([preps, res, clients]) => {
        setInterviewPreps(preps);
        setResumes(res);
        setClientConnections(clients);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated]);

  const handleCreateInterviewPrep = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const response = await api.post("/career/interview-prep", {
        title: formData.get("title"),
        content: formData.get("content"),
      });
      setInterviewPreps([...interviewPreps, response.data]);
      e.currentTarget.reset();
    } catch (error) {
      alert("Failed to create interview prep");
    }
  };

  const handleCreateResume = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const response = await api.post("/career/resumes", {
        title: formData.get("title"),
        resume_data: {
          personalInfo: formData.get("personalInfo"),
          experience: formData.get("experience"),
          education: formData.get("education"),
          skills: formData.get("skills"),
        },
      });
      setResumes([...resumes, response.data]);
      e.currentTarget.reset();
    } catch (error) {
      alert("Failed to create resume");
    }
  };

  const handleCreateClientConnection = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const response = await api.post("/career/client-connections", {
        client_name: formData.get("client_name"),
        client_email: formData.get("client_email"),
        client_phone: formData.get("client_phone"),
        notes: formData.get("notes"),
      });
      setClientConnections([...clientConnections, response.data]);
      e.currentTarget.reset();
    } catch (error) {
      alert("Failed to create client connection");
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
        <h1 className="text-4xl font-bold text-white mb-8">Career Services</h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("interview")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "interview"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Interview Prep
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "resume"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Resume Builder
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "clients"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Client Connections
          </button>
        </div>

        {activeTab === "interview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Create Interview Prep
              </h2>
              <form onSubmit={handleCreateInterviewPrep}>
                <input
                  name="title"
                  placeholder="Title"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                  required
                />
                <textarea
                  name="content"
                  placeholder="Content"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Create
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                My Interview Preps
              </h2>
              <div className="space-y-4">
                {interviewPreps.map((prep) => (
                  <div
                    key={prep.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {prep.title}
                    </h3>
                    <p className="text-gray-300">{prep.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "resume" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Create Resume
              </h2>
              <form onSubmit={handleCreateResume}>
                <input
                  name="title"
                  placeholder="Resume Title"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                  required
                />
                <textarea
                  name="personalInfo"
                  placeholder="Personal Information"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                  rows={2}
                />
                <textarea
                  name="experience"
                  placeholder="Experience"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                  rows={3}
                />
                <textarea
                  name="education"
                  placeholder="Education"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                  rows={2}
                />
                <textarea
                  name="skills"
                  placeholder="Skills"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                  rows={2}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Create Resume
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                My Resumes
              </h2>
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {resume.title}
                    </h3>
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                      {JSON.stringify(resume.resume_data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "clients" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Add Client Connection
              </h2>
              <form onSubmit={handleCreateClientConnection}>
                <input
                  name="client_name"
                  placeholder="Client Name"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                  required
                />
                <input
                  name="client_email"
                  type="email"
                  placeholder="Client Email"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                />
                <input
                  name="client_phone"
                  placeholder="Client Phone"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                />
                <textarea
                  name="notes"
                  placeholder="Notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Add Connection
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                My Client Connections
              </h2>
              <div className="space-y-4">
                {clientConnections.map((client) => (
                  <div
                    key={client.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {client.client_name}
                    </h3>
                    <p className="text-gray-300">
                      Email: {client.client_email || "N/A"}
                    </p>
                    <p className="text-gray-300">
                      Phone: {client.client_phone || "N/A"}
                    </p>
                    <p className="text-gray-300">Status: {client.status}</p>
                    {client.notes && (
                      <p className="text-gray-300 mt-2">
                        Notes: {client.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


