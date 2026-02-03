import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function Admin() {
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    if (user?.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }

    Promise.all([
      api.get("/admin/stats").then((r) => r.data),
      api.get("/admin/users").then((r) => r.data),
      api.get("/admin/payments").then((r) => r.data),
    ])
      .then(([statsData, usersData, paymentsData]) => {
        setStats(statsData);
        setUsers(usersData);
        setPayments(paymentsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated, user]);

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
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        {stats && (
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-white">
                {stats.total_users}
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 mb-2">Total Courses</h3>
              <p className="text-3xl font-bold text-white">
                {stats.total_courses}
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 mb-2">Enrollments</h3>
              <p className="text-3xl font-bold text-white">
                {stats.total_enrollments}
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 mb-2">Payments</h3>
              <p className="text-3xl font-bold text-white">
                {stats.total_payments}
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 mb-2">Revenue</h3>
              <p className="text-3xl font-bold text-white">
                ₹{stats.total_revenue?.toFixed(2) || 0}
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Recent Users
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.slice(0, 10).map((user: any) => (
                <div key={user.id} className="bg-gray-700 p-3 rounded">
                  <p className="text-white font-semibold">
                    {user.full_name || user.email}
                  </p>
                  <p className="text-gray-400 text-sm">Role: {user.role}</p>
                  <p className="text-gray-400 text-sm">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Recent Payments
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {payments.slice(0, 10).map((payment: any) => (
                <div key={payment.id} className="bg-gray-700 p-3 rounded">
                  <p className="text-white font-semibold">₹{payment.amount}</p>
                  <p className="text-gray-400 text-sm">
                    Status: {payment.status}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Date: {new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


