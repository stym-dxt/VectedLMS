import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Calendar, Video, Play, ExternalLink } from "lucide-react";

interface LiveClassItem {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  meet_link: string;
  scheduled_at: string;
  duration: number | null;
  recording_url: string | null;
  is_completed: boolean;
}

export default function LiveClasses() {
  const { isAuthenticated } = useAuthStore();
  const [classes, setClasses] = useState<LiveClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    api
      .get("/live-classes", { params: { include_past: true } })
      .then((response) => {
        setClasses(response.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated]);

  const now = new Date();
  const liveNow: LiveClassItem[] = [];
  const upcoming: LiveClassItem[] = [];
  const recorded: LiveClassItem[] = [];

  classes.forEach((c) => {
    const start = new Date(c.scheduled_at);
    const end = c.duration ? new Date(start.getTime() + c.duration * 60 * 1000) : null;
    if (c.is_completed && c.recording_url) {
      recorded.push(c);
    } else if (start > now) {
      upcoming.push(c);
    } else if (end && now < end) {
      liveNow.push(c);
    } else if (start <= now && !c.is_completed) {
      recorded.push(c);
    } else {
      recorded.push(c);
    }
  });

  const joinClass = (meetLink: string) => {
    window.open(meetLink, "_blank");
  };

  const cardClass =
    "bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Live Classes</h1>
        <p className="text-slate-400 text-sm mb-8">
          Join from here—one place for upcoming classes and recordings.
        </p>

        {liveNow.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live now
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {liveNow.map((c) => (
                <div key={c.id} className={`${cardClass} border-red-500/30`}>
                  <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
                  {c.description && <p className="text-slate-400 text-sm mb-4">{c.description}</p>}
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(c.scheduled_at).toLocaleString()}
                    {c.duration && ` · ${c.duration} min`}
                  </div>
                  <button
                    onClick={() => joinClass(c.meet_link)}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                  >
                    <Video className="w-5 h-5" />
                    Join class
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Upcoming
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {upcoming.length === 0 ? (
              <p className="text-slate-500 col-span-2">No upcoming classes.</p>
            ) : (
              upcoming.map((c) => (
                <div key={c.id} className={cardClass}>
                  <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
                  {c.description && <p className="text-slate-400 text-sm mb-4">{c.description}</p>}
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(c.scheduled_at).toLocaleString()}
                    {c.duration && ` · ${c.duration} min`}
                  </div>
                  <button
                    onClick={() => joinClass(c.meet_link)}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                  >
                    <Video className="w-5 h-5" />
                    Join class
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-emerald-400" />
            Recorded
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recorded.length === 0 ? (
              <p className="text-slate-500 col-span-2">No recordings yet.</p>
            ) : (
              recorded.map((c) => (
                <div key={c.id} className={cardClass}>
                  <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
                  {c.description && <p className="text-slate-400 text-sm mb-4">{c.description}</p>}
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(c.scheduled_at).toLocaleString()}
                  </div>
                  {c.recording_url ? (
                    <a
                      href={c.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Watch recording
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <p className="text-slate-500 text-sm">Recording not available yet.</p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
