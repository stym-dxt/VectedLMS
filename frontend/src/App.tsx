import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import Learning from "./pages/Learning";
import LiveClasses from "./pages/LiveClasses";
import Career from "./pages/Career";
import Certifications from "./pages/Certifications";
import Admin from "./pages/Admin";
import Onboarding from "./pages/Onboarding";
import Roadmaps from "./pages/Roadmaps";
import Testimonials from "./pages/Testimonials";
import GenAI from "./pages/GenAI";
import AWS from "./pages/AWS";
import DevOps from "./pages/DevOps";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="courses/:courseId/payment" element={<Payment />} />
            <Route path="courses/:courseId/learn" element={<Learning />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="live-classes" element={<LiveClasses />} />
            <Route path="career" element={<Career />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="admin" element={<Admin />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="roadmaps" element={<Roadmaps />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="genai" element={<GenAI />} />
            <Route path="aws" element={<AWS />} />
            <Route path="devops" element={<DevOps />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
