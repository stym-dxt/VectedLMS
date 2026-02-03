import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  Terminal, 
  Package, 
  GitMerge, 
  Container,
  Settings,
  Shield,
  BarChart3,
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
  Globe,
  Code,
  Cloud,
  Box
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

const DevOps: React.FC = () => {
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
      title: "Version Control & Collaboration",
      icon: <GitBranch size={24} />,
      description: "Master Git fundamentals and collaborative development workflows.",
      topics: [
        "Git fundamentals (init, clone, add, commit, push, pull)",
        "Branching strategies (Git Flow, trunk-based development)",
        "Merging, rebasing, resolving conflicts",
        "GitHub / GitLab / Bitbucket workflows",
        "Pull requests, code reviews, tagging & releases"
      ],
      project: "Set up a complete Git workflow with branching strategy",
      resources: ["Git Documentation", "GitHub Guides"]
    },
    {
      id: 2,
      title: "Linux, Networking & System Basics",
      icon: <Terminal size={24} />,
      description: "Build strong foundation in Linux and networking essentials.",
      topics: [
        "Linux file system, permissions, processes",
        "Package managers (apt, yum)",
        "Shell scripting (bash)",
        "System services (systemd)",
        "Networking basics (DNS, TCP/IP, ports, firewalls)",
        "SSH & secure access"
      ],
      project: "Automate system administration tasks with bash scripts",
      resources: ["Linux Administration Guide", "Bash Scripting Tutorial"]
    },
    {
      id: 3,
      title: "Build Tools & Artifact Management",
      icon: <Package size={24} />,
      description: "Manage dependencies and build artifacts efficiently.",
      topics: [
        "Maven / Gradle / npm / pip",
        "Dependency management",
        "Artifact repositories (Nexus, Artifactory)",
        "Versioning strategies",
        "Build optimization"
      ],
      project: "Set up artifact repository and build pipeline",
      resources: ["Maven Guide", "Nexus Documentation"]
    },
    {
      id: 4,
      title: "CI/CD Fundamentals",
      icon: <GitMerge size={24} />,
      description: "Understand continuous integration and deployment principles.",
      topics: [
        "Continuous Integration vs Continuous Deployment",
        "Pipeline concepts (stages, jobs, runners, agents)",
        "Build automation",
        "Test automation integration",
        "Deployment strategies"
      ],
      project: "Design a CI/CD pipeline architecture",
      resources: ["CI/CD Best Practices", "Pipeline Design Patterns"]
    },
    {
      id: 5,
      title: "CI/CD Tools",
      icon: <Settings size={24} />,
      description: "Master industry-standard CI/CD tools and platforms.",
      topics: [
        "Jenkins",
        "GitHub Actions",
        "GitLab CI/CD",
        "Azure DevOps Pipelines",
        "Pipeline as Code (YAML)",
        "Secrets & credentials management in pipelines"
      ],
      project: "Build end-to-end CI/CD pipeline with GitHub Actions",
      resources: ["Jenkins Handbook", "GitHub Actions Docs"]
    },
    {
      id: 6,
      title: "Containerization with Docker",
      icon: <Container size={24} />,
      description: "Containerize applications for consistent deployments.",
      topics: [
        "Containers vs Virtual Machines",
        "Docker architecture",
        "Docker images & containers",
        "Dockerfile best practices",
        "Multi-stage builds",
        "Docker Compose",
        "Container security basics"
      ],
      project: "Containerize a multi-tier application with Docker Compose",
      resources: ["Docker Documentation", "Docker Best Practices"]
    },
    {
      id: 7,
      title: "Container Registries",
      icon: <Container size={24} />,
      description: "Manage and secure container images effectively.",
      topics: [
        "Docker Hub",
        "GitHub Container Registry",
        "Amazon ECR / Google Artifact Registry",
        "Image tagging & versioning",
        "Image scanning"
      ],
      project: "Set up private container registry with image scanning",
      resources: ["ECR Guide", "Container Security"]
    },
    {
      id: 8,
      title: "Kubernetes Fundamentals",
      icon: <Box size={24} />,
      description: "Orchestrate containers at scale with Kubernetes.",
      topics: [
        "Kubernetes architecture",
        "Pods, ReplicaSets, Deployments",
        "Services (ClusterIP, NodePort, LoadBalancer)",
        "Namespaces",
        "ConfigMaps & Secrets",
        "Health checks & probes"
      ],
      project: "Deploy and manage applications on Kubernetes cluster",
      resources: ["Kubernetes Documentation", "K8s Tutorial"]
    },
    {
      id: 9,
      title: "Advanced Kubernetes",
      icon: <Box size={24} />,
      description: "Master advanced Kubernetes concepts and patterns.",
      topics: [
        "Ingress controllers",
        "Helm charts",
        "StatefulSets & DaemonSets",
        "Horizontal Pod Autoscaler (HPA)",
        "Resource requests & limits",
        "Rolling updates & rollbacks",
        "Kubernetes security (RBAC, Network Policies)"
      ],
      project: "Deploy production-ready application with Helm",
      resources: ["Helm Documentation", "K8s Security Guide"]
    },
    {
      id: 10,
      title: "Infrastructure as Code (IaC)",
      icon: <Code size={24} />,
      description: "Automate infrastructure provisioning and management.",
      topics: [
        "IaC concepts & benefits",
        "Terraform basics",
        "Providers, resources, variables",
        "Terraform state & backends",
        "Modules",
        "Workspaces",
        "Terraform best practices",
        "Terraform Cloud / Terraform Enterprise"
      ],
      project: "Provision cloud infrastructure using Terraform",
      resources: ["Terraform Documentation", "Terraform Best Practices"]
    },
    {
      id: 11,
      title: "Configuration Management",
      icon: <Settings size={24} />,
      description: "Automate configuration and system management.",
      topics: [
        "Ansible fundamentals",
        "Playbooks, roles, inventories",
        "Idempotency",
        "Secrets handling (Vault integration)",
        "Ansible vs Terraform use cases"
      ],
      project: "Automate server configuration with Ansible playbooks",
      resources: ["Ansible Documentation", "Ansible Best Practices"]
    },
    {
      id: 12,
      title: "Cloud Platforms (DevOps Focus)",
      icon: <Cloud size={24} />,
      description: "Leverage cloud platforms for DevOps workflows.",
      topics: [
        "AWS / Azure / GCP fundamentals",
        "Compute, networking, storage basics",
        "IAM & access control",
        "Managed Kubernetes (EKS, AKS, GKE)",
        "Cloud-native CI/CD integrations"
      ],
      project: "Deploy application on managed Kubernetes service",
      resources: ["AWS EKS Guide", "Azure AKS Docs"]
    },
    {
      id: 13,
      title: "Monitoring & Logging",
      icon: <BarChart3 size={24} />,
      description: "Implement comprehensive monitoring and logging solutions.",
      topics: [
        "Monitoring concepts (metrics, logs, traces)",
        "Prometheus",
        "Grafana dashboards",
        "Alertmanager",
        "ELK / EFK stack (Elasticsearch, Logstash/Fluentd, Kibana)",
        "Cloud-native monitoring (CloudWatch, Azure Monitor, Stackdriver)"
      ],
      project: "Set up monitoring stack with Prometheus and Grafana",
      resources: ["Prometheus Guide", "Grafana Documentation"]
    },
    {
      id: 14,
      title: "Observability & Reliability",
      icon: <MonitorPlay size={24} />,
      description: "Build reliable and observable systems.",
      topics: [
        "SLIs, SLOs, SLAs",
        "Distributed tracing (Jaeger, OpenTelemetry)",
        "Error budgets",
        "Capacity planning",
        "Performance tuning"
      ],
      project: "Implement distributed tracing for microservices",
      resources: ["OpenTelemetry Docs", "SRE Handbook"]
    },
    {
      id: 15,
      title: "Security & DevSecOps",
      icon: <Shield size={24} />,
      description: "Integrate security into DevOps practices.",
      topics: [
        "Secure SDLC",
        "Secrets management (Vault, cloud secret managers)",
        "Static & Dynamic code analysis (SAST, DAST)",
        "Container security scanning",
        "Kubernetes security best practices",
        "IAM & least privilege",
        "Compliance basics"
      ],
      project: "Implement DevSecOps pipeline with security scanning",
      resources: ["DevSecOps Guide", "Security Best Practices"]
    },
    {
      id: 16,
      title: "Release Strategies",
      icon: <Rocket size={24} />,
      description: "Master advanced deployment and release strategies.",
      topics: [
        "Blue-Green deployments",
        "Canary deployments",
        "Feature flags",
        "Rollback strategies",
        "Zero-downtime deployments"
      ],
      project: "Implement blue-green deployment for production",
      resources: ["Deployment Strategies", "Feature Flags Guide"]
    },
    {
      id: 17,
      title: "Automation & SRE Practices",
      icon: <Zap size={24} />,
      description: "Apply Site Reliability Engineering principles.",
      topics: [
        "Infrastructure automation",
        "Self-healing systems",
        "Chaos engineering (basics)",
        "Incident management",
        "Postmortems & root cause analysis"
      ],
      project: "Build self-healing infrastructure with automation",
      resources: ["SRE Book", "Chaos Engineering"]
    },
    {
      id: 18,
      title: "Capstone Projects",
      icon: <Rocket size={24} />,
      description: "Build end-to-end DevOps solutions integrating all concepts.",
      topics: [
        "CI/CD pipeline: Git → Build → Test → Docker → Kubernetes",
        "Terraform-provisioned infrastructure",
        "Helm-based application deployment",
        "Monitoring with Prometheus & Grafana",
        "Logging with ELK stack",
        "Secure pipeline with secrets & scanning"
      ],
      project: "Complete DevOps pipeline with all best practices",
      resources: ["DevOps Roadmap", "Project Templates"]
    }
  ];

  const services = [
    {
      title: "Hands-on Labs",
      icon: <MonitorPlay size={24} />,
      desc: "Real cloud environment access for practical learning."
    },
    {
      title: "Certification Prep",
      icon: <FileText size={24} />,
      desc: "Structured preparation for DevOps certifications."
    },
    {
      title: "Project Portfolio",
      icon: <Briefcase size={24} />,
      desc: "Build real-world projects to showcase your skills."
    },
    {
      title: "Expert Mentorship",
      icon: <Users size={24} />,
      desc: "Guidance from industry DevOps professionals."
    },
    {
      title: "Career Support",
      icon: <Briefcase size={24} />,
      desc: "Resume optimization and interview preparation."
    },
    {
      title: "Lifetime Access",
      icon: <Globe size={24} />,
      desc: "Access to updated content and new tools."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-green-500 selection:text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header with Course Branding */}
      <header className="relative z-10 container mx-auto px-6 py-16 text-center">
        <div className={`transition-all duration-1000 ease-out transform ${animateHeader ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          {/* Course Logo/Badge */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 rounded-3xl p-6 backdrop-blur-sm">
                <GitBranch size={64} className="text-green-400 mx-auto drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-950/30 border border-green-500/30 text-green-400 text-sm font-medium mb-8 animate-pulse">
            <Sparkles size={16} />
            <span>Vector Skill Academy Exclusive</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-green-600">
              Master DevOps & SRE
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            From Git to Kubernetes. Become a <span className="text-white font-semibold">Certified DevOps Engineer</span> with hands-on experience in CI/CD, containers, and cloud infrastructure.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-green-500/50 transition-all">
              <BookOpen size={20} className="text-green-400" />
              <span className="font-bold">18 Core Modules</span>
            </div>
            <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-green-500/50 transition-all">
              <Clock size={20} className="text-emerald-400" />
              <span className="font-bold">20-24 Weeks</span>
            </div>
            <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-emerald-500/50 transition-all">
              <Rocket size={20} className="text-emerald-400" />
              <span className="font-bold">SRE Certified</span>
            </div>
          </div>

          {/* Course Highlights */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {['CI/CD Pipelines', 'Docker & K8s', 'Terraform', 'Monitoring', 'DevSecOps'].map((highlight, idx) => (
              <span key={idx} className="px-4 py-2 bg-green-950/30 border border-green-500/30 rounded-lg text-green-300 text-sm font-medium">
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* USP Section - Smart ApplAI */}
      <SmartApplaiBanner onGetAccessClick={handleGetAccessClick} theme="devops" />

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
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] group-hover:scale-125 transition-transform"></div>
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
                            <div className="text-green-400 bg-green-950/30 p-2 rounded-lg">{module.icon}</div>
                            <span className="text-xs font-mono text-slate-500 uppercase">Module {module.id}</span>
                          </div>
                          {expandedModule === module.id ? (
                            <ChevronUp className="text-green-400" size={20} />
                          ) : (
                            <ChevronDown className="text-slate-500" size={20} />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-200 group-hover:text-green-300 transition-colors">{module.title}</h3>
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
                                <Code size={16} className="text-green-400" />
                                Syllabus
                              </h4>
                              <div className="space-y-2">
                                {module.topics.map((topic, i) => (
                                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
                                    <span className="text-slate-300 text-sm">{topic}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {module.project && (
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-green-900/10 border border-green-500/20">
                                  <h4 className="font-bold text-green-400 text-sm mb-2 flex items-center gap-2">
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
                              <button className="flex items-center gap-2 text-sm font-bold text-green-400 hover:text-green-300 transition-colors">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
              Beyond the Code: Career Acceleration
            </h2>
            <p className="text-slate-400">Everything you need to land your dream DevOps role.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all group">
                <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center mb-4 text-green-400 group-hover:scale-110 transition-transform">
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
         <h2 className="text-2xl font-bold text-white mb-8">Ready to become a Certified DevOps Engineer?</h2>
         <button 
           onClick={handleEnrollClick}
           className="px-10 py-4 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:-translate-y-1 transition-all"
         >
           Enroll Now
         </button>
      </footer>

    </div>
  );
};

export default DevOps;

