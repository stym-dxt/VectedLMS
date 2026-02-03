import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Payment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (courseId) {
      api
        .get(`/courses/${courseId}`)
        .then((response) => {
          setCourse(response.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [courseId]);

  const handlePayment = async () => {
    if (!courseId || !course) return;

    setProcessing(true);
    try {
      const response = await api.post("/payments/create-order", {
        course_id: parseInt(courseId),
        amount: course.price,
        currency: "INR",
      });

      const { order_id, amount, currency, key } = response.data;

      const options = {
        key,
        amount: amount * 100,
        currency,
        name: "Vector Skill Academy",
        description: `Payment for ${course.title}`,
        order_id,
        handler: async function (response: any) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate("/dashboard");
          } catch (error) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#0ea5e9",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on("payment.failed", function () {
        alert("Payment failed");
        setProcessing(false);
      });
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to create payment order");
      setProcessing(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Complete Your Purchase
        </h1>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {course.title}
          </h2>
          <p className="text-gray-300 mb-4">{course.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-blue-400">
              ₹{course.price}
            </span>
          </div>
        </div>
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
        >
          {processing ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}


