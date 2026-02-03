import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function Certifications() {
  const { isAuthenticated } = useAuthStore();
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    api
      .get("/certifications")
      .then((response) => {
        setCertifications(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated]);

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
          My Certifications
        </h1>
        <div className="grid md:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">🎓</div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Certificate #{cert.certificate_number}
                </h2>
                <p className="text-gray-300 mb-4">
                  Issued: {new Date(cert.issued_at).toLocaleDateString()}
                </p>
                {cert.verification_code && (
                  <p className="text-sm text-gray-400 mb-4">
                    Verification Code: {cert.verification_code}
                  </p>
                )}
                {cert.certificate_url && (
                  <a
                    href={cert.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Download Certificate
                  </a>
                )}
              </div>
            </div>
          ))}
          {certifications.length === 0 && (
            <div className="col-span-3 text-center text-gray-400">
              No certifications yet. Complete courses to earn certificates!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


