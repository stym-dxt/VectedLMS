import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player/youtube';
import { 
  Brain, 
  Code, 
  Database, 
  Cpu, 
  Layers, 
  MessageSquare, 
  Image as ImageIcon, 
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
  ShieldCheck,
  Globe,
  Play
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { SmartApplaiBanner } from '@/components/SmartApplaiBanner';

interface Module {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  weeks: string;
  topics: string[];
  project: string;
  resources: string[];
}

// YouTube video URL for course explainer video
// Update this URL to change the video
const GENAI_VIDEO_URL = 'https://youtu.be/cHgWI7USUcY'; // Replace with your actual YouTube URL

const GenAI: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [animateHeader, setAnimateHeader] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

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

  const handleGetAccessClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const curriculum: Module[] = [
    {
      id: 1,
      title: "Level 0 – Python & AI Basics",
      icon: <Code size={24} />,
      description: "Building the bedrock: Python mastery and core GenAI concepts.",
      weeks: "Weeks 1-3",
      topics: [
        "Python Syntax, Data Structures & Algorithms",
        "NumPy & Pandas for Data Manipulation",
        "Intro to Neural Networks & Deep Learning",
        "Basics of Generative Models (GANs vs Transformers)",
        "Setting up the Dev Environment (Conda, Jupyter)"
      ],
      project: "Build a Simple Neural Net from Scratch",
      resources: ["Vector Academy Python Guide", "Interactive Coding Labs"]
    },
    {
      id: 2,
      title: "Data Preprocessing & Engineering",
      icon: <Database size={24} />,
      description: "The fuel for AI: Cleaning, structuring, and preparing data.",
      weeks: "Weeks 4-5",
      topics: [
        "Data Cleaning & Normalization Techniques",
        "Tokenization Strategies for LLMs",
        "Handling Unstructured Data (Text, Images)",
        "Feature Engineering for GenAI",
        "Building Efficient Data Pipelines"
      ],
      project: "ETL Pipeline for LLM Training Dataset",
      resources: ["Pandas Documentation", "Data Engineering Patterns"]
    },
    {
      id: 3,
      title: "Prompt Engineering",
      icon: <MessageSquare size={24} />,
      description: "Mastering the art of communicating with LLMs.",
      weeks: "Weeks 6-7",
      topics: [
        "Zero-shot, Few-shot & Chain-of-Thought Prompting",
        "ReAct (Reason + Act) Frameworks",
        "Handling Hallucinations & Ambiguity",
        "Prompt Optimization & Testing",
        "Automated Prompt Engineering (APE)"
      ],
      project: "Build a Complex Reasoning Prompt System",
      resources: ["Mastering GenAI Stack PDF - Module 1", "OpenAI Cookbook"]
    },
    {
      id: 4,
      title: "RAG (Retrieval-Augmented Generation)",
      icon: <Layers size={24} />,
      description: "Grounding AI in truth with external data sources.",
      weeks: "Weeks 8-10",
      topics: [
        "Vector Embeddings & Semantic Search",
        "Vector Databases (Pinecone, Weaviate, Chroma)",
        "RAG Architecture (Retriever + Generator)",
        "Advanced RAG: Hybrid Search & Re-ranking",
        "Building Chat-with-your-Data Apps"
      ],
      project: "Enterprise Knowledge Base Chatbot",
      resources: ["Mastering GenAI Stack PDF - Module 3", "LangChain Docs"]
    },
    {
      id: 5,
      title: "LLM Fine-Tuning",
      icon: <Cpu size={24} />,
      description: "Tailoring foundation models for specific domains.",
      weeks: "Weeks 11-13",
      topics: [
        "Full Fine-Tuning vs Transfer Learning",
        "Parameter-Efficient Fine-Tuning (PEFT)",
        "LoRA & QLoRA Techniques",
        "Dataset Preparation for Fine-Tuning",
        "Evaluation Metrics (Perplexity, BLEU, ROUGE)"
      ],
      project: "Fine-tune Llama-3 for Medical Diagnosis",
      resources: ["Mastering GenAI Stack PDF - Module 4", "HuggingFace PEFT"]
    },
    {
      id: 6,
      title: "Agentic AI",
      icon: <Rocket size={24} />,
      description: "Creating autonomous agents that plan and act.",
      weeks: "Weeks 14-16",
      topics: [
        "Agent Architectures (Memory, Planning, Tools)",
        "Multi-Agent Systems (CrewAI, AutoGen)",
        "Tool Use & Function Calling",
        "Building Autonomous Research Agents",
        "Self-Correction & Reflection Loops"
      ],
      project: "Autonomous Software Dev Agent",
      resources: ["Mastering GenAI Stack PDF - Module 6", "CrewAI Examples"]
    },
    {
      id: 7,
      title: "RLHF",
      icon: <Brain size={24} />,
      description: "Reinforcement Learning from Human Feedback.",
      weeks: "Weeks 17-18",
      topics: [
        "PPO (Proximal Policy Optimization)",
        "Reward Modeling & Preference Datasets",
        "Aligning AI with Human Values",
        "Direct Preference Optimization (DPO)",
        "Safety & Guardrails Implementation"
      ],
      project: "Align a Chatbot to be 'Helpful & Harmless'",
      resources: ["Mastering GenAI Stack PDF - Module 5", "Anthropic Papers"]
    },
    {
      id: 8,
      title: "Multimodal AI",
      icon: <ImageIcon size={24} />,
      description: "Beyond text: Audio, Video, and Image generation.",
      weeks: "Weeks 19-20",
      topics: [
        "Diffusion Models (Stable Diffusion, Midjourney)",
        "Vision Transformers (ViT)",
        "Audio Generation (TTS, MusicGen)",
        "Video Synthesis (Sora Concepts)",
        "Building Multimodal Pipelines"
      ],
      project: "Text-to-Video Marketing Generator",
      resources: ["Mastering GenAI Stack PDF - Module 7", "Diffusers Library"]
    },
    {
      id: 9,
      title: "AI Ethics & Security",
      icon: <ShieldCheck size={24} />,
      description: "Ensuring responsible and secure AI deployment.",
      weeks: "Weeks 21",
      topics: [
        "Bias Detection & Mitigation",
        "Prompt Injection & Jailbreaking Defense",
        "Data Privacy & Compliance (GDPR/EU AI Act)",
        "Model Red Teaming",
        "Adversarial Attacks & Defenses"
      ],
      project: "Security Audit of an LLM Application",
      resources: ["Mastering GenAI Stack PDF - Module 8", "OWASP for LLMs"]
    },
    {
      id: 10,
      title: "GenAI for Enterprises",
      icon: <Briefcase size={24} />,
      description: "Strategy, integration, and scaling in business.",
      weeks: "Weeks 22",
      topics: [
        "Identifying High-Value Use Cases",
        "Buy vs Build Decisions",
        "Enterprise Architecture for GenAI",
        "ROI Calculation & Impact Analysis",
        "Change Management for AI Adoption"
      ],
      project: "Develop an Enterprise AI Strategy Deck",
      resources: ["Mastering GenAI Stack PDF - Module 9", "Case Studies"]
    },
    {
      id: 11,
      title: "Deploying AI Models",
      icon: <Globe size={24} />,
      description: "MLOps: Taking models from notebook to production.",
      weeks: "Weeks 23-24",
      topics: [
        "Containerization (Docker)",
        "Model Serving (vLLM, TGI, TorchServe)",
        "Cloud Deployment (AWS/GCP/Azure)",
        "Monitoring & Observability (LangSmith)",
        "Cost Optimization Strategies"
      ],
      project: "Deploy Scalable RAG API on AWS",
      resources: ["Mastering GenAI Stack PDF - Module 10", "MLOps Roadmap"]
    },
    {
      id: 12,
      title: "Model Context Protocol",
      icon: <FileText size={24} />,
      description: "Standardizing how AI models consume context.",
      weeks: "Weeks 25",
      topics: [
        "Understanding Context Windows",
        "The MCP Specification",
        "Optimizing Context Retrieval",
        "State Management in Long Conversations",
        "Interoperability between Models"
      ],
      project: "Implement MCP for a Multi-Turn Agent",
      resources: ["Model Context Protocol Docs", "Context Optimization Research"]
    },
    {
      id: 13,
      title: "Basics of Quantum Computing",
      icon: <Zap size={24} />,
      description: "The future frontier: Where AI meets Quantum.",
      weeks: "Weeks 26",
      topics: [
        "Qubits, Superposition & Entanglement",
        "Quantum Gates & Circuits",
        "Quantum Machine Learning (QML) Potential",
        "Running Circuits on Simulators (Qiskit)",
        "The Future of Quantum AI"
      ],
      project: "Simple Quantum Circuit Simulation",
      resources: ["IBM Qiskit Tutorials", "Quantum AI Intro"]
    }
  ];

  const services = [
    {
      title: "Flexible Learning",
      icon: <MonitorPlay size={24} />,
      desc: "Online, Offline, & Recorded Classes available 24/7."
    },
    {
      title: "Resume by HR Pros",
      icon: <FileText size={24} />,
      desc: "Crafted by experienced industry HRs to beat ATS."
    },
    {
      title: "Professional Branding",
      icon: <Briefcase size={24} />,
      desc: "LinkedIn & Job Board profile optimization."
    },
    {
      title: "Real Mock Interviews",
      icon: <Users size={24} />,
      desc: "Practice with working IT professionals."
    },
    {
      title: "Business Comm",
      icon: <MessageSquare size={24} />,
      desc: "Free classes to master corporate communication."
    },
    {
      title: "Staff Augmentation Support",
      icon: <Users size={24} />,
      desc: "Interview scheduling by Vected Technologies team."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header with Course Branding */}
      <header className="relative z-10 container mx-auto px-6 py-16 text-center">
        <div className={`transition-all duration-1000 ease-out transform ${animateHeader ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          {/* Course Logo/Badge */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/40 rounded-3xl p-6 backdrop-blur-sm">
                <Brain size={64} className="text-cyan-400 mx-auto drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-8 animate-pulse">
            <Sparkles size={16} />
            <span>Vector Skill Academy Exclusive</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Master the Full GenAI Stack
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            From Python Fundamentals to Autonomous Agents & Quantum Computing. 
            Become a <span className="text-white font-semibold">Certified GenAI Professional</span> with our industry-first curriculum.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-cyan-500/50 transition-all">
              <BookOpen size={20} className="text-purple-400" />
              <span className="font-bold">13 Core Levels</span>
            </div>
            <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-cyan-500/50 transition-all">
              <Clock size={20} className="text-cyan-400" />
              <span className="font-bold">26 Weeks</span>
            </div>
            <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-purple-500/50 transition-all">
              <Rocket size={20} className="text-purple-400" />
              <span className="font-bold">100% Placement</span>
            </div>
          </div>

          {/* Course Highlights */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {['Python Mastery', 'LLM Fine-Tuning', 'RAG Systems', 'Agentic AI', 'Quantum Computing'].map((highlight, idx) => (
              <span key={idx} className="px-4 py-2 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-300 text-sm font-medium">
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Course Explainer Video Section */}
      <section className="relative z-10 container mx-auto px-4 mb-24 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-[0_0_40px_rgba(6,182,212,0.15)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10"></div>
          
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                <Play className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Course Overview</h2>
                <p className="text-slate-400 text-sm">Watch this video to understand what you'll learn in this program</p>
              </div>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl">
              <div className="relative pt-[56.25%]">
                <ReactPlayer
                  url={GENAI_VIDEO_URL}
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0"
                  controls={true}
                  light={false}
                  playing={false}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* USP Section - Smart ApplAI */}
      <SmartApplaiBanner onGetAccessClick={handleGetAccessClick} theme="genai" />

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
                  <div className="w-4 h-4 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover:scale-125 transition-transform"></div>
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
                            <div className="text-cyan-400 bg-cyan-950/30 p-2 rounded-lg">{module.icon}</div>
                            <span className="text-xs font-mono text-slate-500 uppercase">{module.weeks}</span>
                          </div>
                          {expandedModule === module.id ? (
                            <ChevronUp className="text-cyan-400" size={20} />
                          ) : (
                            <ChevronDown className="text-slate-500" size={20} />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">{module.title}</h3>
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
                                <Code size={16} className="text-cyan-400" />
                                Syllabus
                              </h4>
                              <div className="space-y-2">
                                {module.topics.map((topic, i) => (
                                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"></div>
                                    <span className="text-slate-300 text-sm">{topic}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-purple-900/10 border border-purple-500/20">
                                <h4 className="font-bold text-purple-400 text-sm mb-2 flex items-center gap-2">
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

                            <div className="flex justify-end pt-4 border-t border-slate-800">
                              <button className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Beyond the Code: Career Acceleration
            </h2>
            <p className="text-slate-400">Everything you need to land your dream job.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all group">
                <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
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
         <h2 className="text-2xl font-bold text-white mb-8">Ready to become a Certified GenAI Professional?</h2>
         <button 
           onClick={handleEnrollClick}
           className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-1 transition-all"
         >
           Enroll Now
         </button>
      </footer>

    </div>
  );
};

export default GenAI;

