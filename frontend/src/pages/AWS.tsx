import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  Server, 
  Database, 
  Network, 
  BarChart3,
  Code,
  Rocket,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Sparkles,
  Zap,
  Briefcase,
  Users,
  MonitorPlay,
  FileText,
  Globe
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { SmartApplaiBanner } from '@/components/SmartApplaiBanner';

interface Module {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  topics: string[];
  project?: string;
  resources: string[];
}

const AWS: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [animateHeader, setAnimateHeader] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleGetAccessClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  useEffect(() => {
    setAnimateHeader(true);
  }, []);

  const handleEnrollClick = () => {
    if (isAuthenticated) {
      navigate('/courses');
    } else {
      navigate('/register');
    }
  };


  const curriculum: Module[] = [
    {
      id: 1,
      title: "Introduction to AWS & Basic Services",
      icon: <Cloud size={24} />,
      description: "Master the fundamentals of AWS cloud computing and core services.",
      topics: [
        "Introduction to AWS",
        "AWS Identity & Access Management (IAM)",
        "Amazon Simple Storage Service (S3)",
        "AWS Console & CLI basics",
        "AWS Regions & Availability Zones"
      ],
      project: "Create IAM users and configure S3 bucket with proper permissions",
      resources: ["AWS Free Tier Guide", "AWS Documentation"]
    },
    {
      id: 2,
      title: "Compute Services",
      icon: <Server size={24} />,
      description: "Learn to deploy and manage compute resources in the cloud.",
      topics: [
        "Amazon Elastic Compute Cloud (EC2)",
        "AWS Lambda",
        "Amazon Elastic Container Service (ECS)",
        "Instance types and pricing",
        "Auto Scaling basics"
      ],
      project: "Deploy a web application on EC2 with auto-scaling",
      resources: ["EC2 User Guide", "Lambda Best Practices"]
    },
    {
      id: 3,
      title: "Database Services",
      icon: <Database size={24} />,
      description: "Master AWS database solutions for various use cases.",
      topics: [
        "Amazon Relational Database Service (RDS)",
        "Amazon DynamoDB",
        "Amazon Redshift",
        "Amazon ElastiCache",
        "Database migration strategies"
      ],
      project: "Set up RDS MySQL and DynamoDB for a multi-tier application",
      resources: ["RDS Documentation", "DynamoDB Developer Guide"]
    },
    {
      id: 4,
      title: "Networking & Security",
      icon: <Network size={24} />,
      description: "Build secure and scalable network architectures on AWS.",
      topics: [
        "Amazon Virtual Private Cloud (VPC)",
        "AWS Direct Connect & VPN",
        "Amazon Route 53",
        "AWS Security Best Practices",
        "Network ACLs & Security Groups"
      ],
      project: "Design and implement a secure multi-tier VPC architecture",
      resources: ["VPC User Guide", "AWS Security Whitepaper"]
    },
    {
      id: 5,
      title: "Monitoring & Management",
      icon: <BarChart3 size={24} />,
      description: "Monitor, manage, and automate AWS resources effectively.",
      topics: [
        "Amazon CloudWatch",
        "AWS Auto Scaling",
        "AWS CloudFormation",
        "AWS Systems Manager",
        "Cost optimization strategies"
      ],
      project: "Set up comprehensive monitoring and auto-scaling for an application",
      resources: ["CloudWatch Documentation", "CloudFormation Templates"]
    },
    {
      id: 6,
      title: "Application Development & Deployment",
      icon: <Code size={24} />,
      description: "Build and deploy modern applications using AWS services.",
      topics: [
        "AWS CodeCommit",
        "Amazon API Gateway",
        "AWS Step Functions",
        "Amazon SQS & SNS",
        "Serverless application architecture"
      ],
      project: "Build a serverless application with API Gateway and Lambda",
      resources: ["API Gateway Guide", "Step Functions Documentation"]
    },
    {
      id: 7,
      title: "AI & Machine Learning Services",
      icon: <Zap size={24} />,
      description: "Leverage AWS AI/ML services for intelligent applications.",
      topics: [
        "Amazon SageMaker",
        "Amazon SageMaker Ground Truth",
        "Amazon Augmented AI (A2I)",
        "AWS Glue & Athena",
        "ML model deployment"
      ],
      project: "Train and deploy a machine learning model using SageMaker",
      resources: ["SageMaker Developer Guide", "AWS ML Best Practices"]
    },
    {
      id: 8,
      title: "Analytics & Visualization",
      icon: <BarChart3 size={24} />,
      description: "Process, analyze, and visualize data at scale.",
      topics: [
        "Amazon QuickSight",
        "Amazon Kinesis",
        "AWS Data Pipeline",
        "Real-time analytics",
        "Data warehousing concepts"
      ],
      project: "Build a real-time analytics pipeline with Kinesis and QuickSight",
      resources: ["Kinesis Developer Guide", "QuickSight User Guide"]
    },
    {
      id: 9,
      title: "Recap & Project Showcase",
      icon: <Rocket size={24} />,
      description: "Consolidate learning with comprehensive projects and best practices.",
      topics: [
        "Multi-service architecture design",
        "Cost optimization review",
        "Security best practices recap",
        "Project portfolio development",
        "AWS certification preparation"
      ],
      project: "End-to-end cloud application with all AWS services integrated",
      resources: ["AWS Well-Architected Framework", "Certification Exam Guides"]
    }
  ];

  const services = [
    {
      title: "Hands-on Labs",
      icon: <MonitorPlay size={24} />,
      desc: "Real AWS environment access for practical learning."
    },
    {
      title: "Certification Prep",
      icon: <FileText size={24} />,
      desc: "Structured preparation for AWS certifications."
    },
    {
      title: "Project Portfolio",
      icon: <Briefcase size={24} />,
      desc: "Build real-world projects to showcase your skills."
    },
    {
      title: "Expert Mentorship",
      icon: <Users size={24} />,
      desc: "Guidance from AWS certified professionals."
    },
    {
      title: "Career Support",
      icon: <Briefcase size={24} />,
      desc: "Resume optimization and interview preparation."
    },
    {
      title: "Lifetime Access",
      icon: <Globe size={24} />,
      desc: "Access to updated content and new AWS services."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header with Course Branding */}
      <header className="relative z-10 container mx-auto px-6 py-16 text-center">
        <div className={`transition-all duration-1000 ease-out transform ${animateHeader ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          {/* Course Logo/Badge */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-2 border-orange-500/40 rounded-3xl p-6 backdrop-blur-sm">
                <Cloud size={64} className="text-orange-400 mx-auto drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-950/30 border border-orange-500/30 text-orange-400 text-sm font-medium mb-8 animate-pulse">
            <Sparkles size={16} />
            <span>Vector Skill Academy Exclusive</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600">
              Master AWS Cloud Platform
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            From fundamentals to advanced services. Become a <span className="text-white font-semibold">Certified AWS Professional</span> with hands-on experience across all major AWS services.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-orange-500/50 transition-all">
              <BookOpen size={20} className="text-orange-400" />
              <span className="font-bold">9 Core Modules</span>
            </div>
            <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-orange-500/50 transition-all">
              <Clock size={20} className="text-yellow-400" />
              <span className="font-bold">12-16 Weeks</span>
            </div>
            <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-yellow-500/50 transition-all">
              <Rocket size={20} className="text-yellow-400" />
              <span className="font-bold">AWS Certified</span>
            </div>
          </div>

          {/* Course Highlights */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {['EC2 & Lambda', 'S3 & RDS', 'VPC & Security', 'SageMaker', 'CloudFormation'].map((highlight, idx) => (
              <span key={idx} className="px-4 py-2 bg-orange-950/30 border border-orange-500/30 rounded-lg text-orange-300 text-sm font-medium">
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* USP Section - Smart ApplAI */}
      <SmartApplaiBanner onGetAccessClick={handleGetAccessClick} theme="aws" />

      {/* Main Roadmap */}
      <main className="relative z-10 container mx-auto px-4 pb-24 max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
          Your Learning Path
        </h2>

        <div className="relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 -translate-x-1/2 hidden md:block"></div>
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-800 -translate-x-1/2 md:hidden"></div>

          {curriculum.map((module, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div 
                key={module.id} 
                className={`relative mb-12 md:mb-24 flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row group perspective-1000`}
              >
                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20 bg-slate-950 p-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)] group-hover:scale-125 transition-transform"></div>
                </div>

                <div className="hidden md:block w-1/2"></div>

                <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isLeft ? 'md:pr-16' : 'md:pl-16'}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-800 overflow-hidden group"
                  >
                    <div 
                      onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                      className="relative p-6 cursor-pointer hover:bg-slate-800/50 transition-all"
                    >
                      <div className={`flex flex-col gap-3 ${isLeft ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
                        <div className={`flex items-center justify-between w-full ${isLeft ? 'md:flex-row-reverse' : 'flex-row'}`}>
                          <div className={`flex items-center gap-3 ${isLeft ? 'md:flex-row-reverse' : 'flex-row'}`}>
                            <div className="text-orange-400 bg-orange-950/30 p-2 rounded-lg">{module.icon}</div>
                            <span className="text-xs font-mono text-slate-500 uppercase">Module {module.id}</span>
                          </div>
                          {expandedModule === module.id ? (
                            <ChevronUp className="text-orange-400" size={20} />
                          ) : (
                            <ChevronDown className="text-slate-500" size={20} />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-200 group-hover:text-orange-300 transition-colors">{module.title}</h3>
                        <p className="text-slate-400 text-sm">{module.description}</p>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedModule === module.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 border-t border-slate-800 pt-6 space-y-6">
                            <div>
                              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Code size={16} className="text-orange-400" />
                                Syllabus
                              </h4>
                              <div className="space-y-2">
                                {module.topics.map((topic, i) => (
                                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                                    <span className="text-slate-300 text-sm">{topic}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {module.project && (
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-orange-900/10 border border-orange-500/20">
                                  <h4 className="font-bold text-orange-400 text-sm mb-2 flex items-center gap-2">
                                    <Rocket size={16}/> Capstone Project
                                  </h4>
                                  <p className="text-slate-300 text-sm">{module.project}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                                  <h4 className="font-bold text-green-400 text-sm mb-2 flex items-center gap-2">
                                    <BookOpen size={16}/> Resources
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {module.resources.map((r, i) => (
                                      <span key={i} className="text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-400">{r}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end pt-4 border-t border-slate-800">
                              <button className="flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors">
                                <span>Download Full Syllabus</span>
                                <Download size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Additional Services Grid */}
      <section className="relative z-10 bg-slate-900/50 py-20 border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Beyond the Code: Career Acceleration
            </h2>
            <p className="text-slate-400">Everything you need to land your dream AWS role.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all group">
                <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center mb-4 text-orange-400 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-slate-400 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="relative z-10 py-16 text-center border-t border-slate-800 bg-slate-950">
         <h2 className="text-2xl font-bold text-white mb-8">Ready to become a Certified AWS Professional?</h2>
         <button 
           onClick={handleEnrollClick}
           className="px-10 py-4 rounded-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:-translate-y-1 transition-all"
         >
           Enroll Now
         </button>
      </footer>

    </div>
  );
};

export default AWS;

