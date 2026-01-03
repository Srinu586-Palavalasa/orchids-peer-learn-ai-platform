"use client";

import React, { useState, useRef, useEffect } from "react";
import { Video, Users, Brain, Trophy, FileText, Star, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Upload, X, Play, Clock, Sparkles, Send, Bell, Check } from "lucide-react";
import CategoryList from "@/components/browse/CategoryList";
import SubjectList from "@/components/browse/SubjectList";
import MentorList from "@/components/browse/MentorList";
import { categories } from "@/lib/data";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import VideoRoom from "@/components/video/VideoRoom";
import LectureList from '@/components/browse/LectureList';
import ChatSidebar from "@/components/video/ChatSidebar";
import { getGeminiResponse } from "@/app/actions/chat";
import { Medal } from "lucide-react";

interface Session {
  id: number;
  title: string;
  mentor: string;
  subject: string;
  viewers?: number;
  time?: string;
  status: "live" | "upcoming";
  rating: number;
}

interface Mentor {
  name: string;
  subject: string;
  rating: number;
  sessions: number;
  avatar: string;
  role?: string;
  teachingHours: number;
}

interface ChatMessage {
  id: number;
  sender: string;
  message: string;
  type: "sent" | "received";
  isAI?: boolean;
}

const features = [
  {
    icon: <Video size={28} />,
    title: "Face-to-Face Video Learning",
    description: "Connect directly with peer mentors through high-quality video calls for personalized learning experiences.",
    action: "room"
  },
  {
    icon: <Brain size={28} />,
    title: "AI-Powered Notes",
    description: "Our AI assistant attends sessions and generates comprehensive notes and summaries automatically.",
    action: "room"
  },
  {
    icon: <Trophy size={28} />,
    title: "Mentor Leaderboard",
    description: "Top-rated mentors are recognized and showcased based on student feedback and session quality.",
    action: "leaderboard"
  },
  {
    icon: <FileText size={28} />,
    title: "PDF Summarizer",
    description: "Upload complex documents and get simplified explanations that make learning easier.",
    action: "pdf"
  },
  {
    icon: <Star size={28} />,
    title: "Rating & Feedback",
    description: "Rate your sessions and provide valuable feedback to help mentors improve their teaching.",
    action: "sessions"
  },
  {
    icon: <Users size={28} />,
    title: "Peer Community",
    description: "Join a supportive community of learners and teachers helping each other succeed.",
    action: "sessions"
  }
];

const initialMentors: Mentor[] = [
  { name: "Priya Sharma", subject: "Data Structures", rating: 4.9, sessions: 156, avatar: "PS", teachingHours: 15 },
  { name: "Rahul Verma", subject: "Mathematics", rating: 4.8, sessions: 142, avatar: "RV", teachingHours: 12 },
  { name: "Ananya Gupta", subject: "Physics", rating: 4.8, sessions: 128, avatar: "AG", teachingHours: 11 },
  { name: "Vikram Singh", subject: "Chemistry", rating: 4.7, sessions: 115, avatar: "VS", teachingHours: 9 },
  { name: "Sneha Reddy", subject: "Machine Learning", rating: 4.7, sessions: 98, avatar: "SR", teachingHours: 8 },
  { name: "Amit Patel", subject: "Algorithms", rating: 4.6, sessions: 87, avatar: "AP", teachingHours: 6 },
  { name: "Neha Kapoor", subject: "DBMS", rating: 4.6, sessions: 82, avatar: "NK", teachingHours: 4 },
  { name: "Karan Mehta", subject: "Operating Systems", rating: 4.5, sessions: 76, avatar: "KM", teachingHours: 2 },
];

const initialSessions: Session[] = [
  { id: 1, title: "Binary Search Trees Explained", mentor: "Priya Sharma", subject: "DSA", viewers: 24, status: "live", rating: 4.9 },
  { id: 2, title: "Integration Techniques", mentor: "Rahul Verma", subject: "Mathematics", viewers: 18, status: "live", rating: 4.8 },
  { id: 3, title: "Quantum Mechanics Basics", mentor: "Ananya Gupta", subject: "Physics", time: "In 30 mins", status: "upcoming", rating: 4.8 },
  { id: 4, title: "React Hooks Deep Dive", mentor: "Vikram Singh", subject: "Web Dev", viewers: 12, status: "live", rating: 4.7 },
  { id: 5, title: "Organic Chemistry Reactions", mentor: "Sneha Reddy", subject: "Chemistry", time: "Tomorrow 3PM", status: "upcoming", rating: 4.7 },
  { id: 6, title: "Linear Algebra Basics", mentor: "Rahul Verma", subject: "Mathematics", time: "In 2 hours", status: "upcoming", rating: 4.8 },
];

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"home" | "sessions" | "room" | "leaderboard" | "pdf">("home");
  const [browsingCategory, setBrowsingCategory] = useState<string | null>(null);
  const [browsingSubject, setBrowsingSubject] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [sessionFilter, setSessionFilter] = useState<"all" | "live" | "upcoming">("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);
  

  // Listen for mentor selection events from subcomponents (e.g., MentorList)
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        // @ts-ignore
        const m = e?.detail;
        if (m) {
          setSelectedMentor(m);
          setShowMentorModal(true);
        }
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('orchids-select-mentor', handler as EventListener);
    return () => window.removeEventListener('orchids-select-mentor', handler as EventListener);
  }, []);

  const [leaderboardFilter, setLeaderboardFilter] = useState<"week" | "month" | "all">("week");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [rating, setRating] = useState(0);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pdfSummary, setPdfSummary] = useState<string | null>(null);
  const [aiNotes, setAiNotes] = useState<string | null>(null);
  const [inCall, setInCall] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSession, setReminderSession] = useState<Session | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "Priya Sharma", message: "Welcome everyone! Let's start with the basics of BST.", type: "received" },
    { id: 2, sender: "Raj Kumar", message: "Thanks for the session! Quick question about insertion.", type: "received" },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newSessionForm, setNewSessionForm] = useState({
    title: "",
    subject: "",
    description: "",
    schedule: "now"
  });
  const [feedbackForm, setFeedbackForm] = useState({
    clarity: "",
    learned: "",
    suggestions: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);




  const simulateAINotes = () => {
    const notes = currentSession?.subject === "Mathematics"
      ? `<h4>Session Summary: Integration Techniques</h4>
      <ul>
        <li><strong>Basic Integration:</strong> Antiderivatives and the constant of integration.</li>
        <li><strong>Substitution Method:</strong> u-substitution for simplifying complex integrals.</li>
        <li><strong>Integration by Parts:</strong> Formula: ∫u dv = uv - ∫v du</li>
        <li><strong>Partial Fractions:</strong> Breaking down rational functions for easier integration.</li>
      </ul>
      <h4>Key Takeaways</h4>
      <ul>
        <li>Always check your answer by differentiating</li>
        <li>Look for patterns that suggest which technique to use</li>
        <li>Practice with varied problems to build intuition</li>
      </ul>`
      : `<h4>Session Summary: Binary Search Trees</h4>
      <ul>
        <li><strong>Definition:</strong> A BST is a binary tree where left children are smaller and right children are larger than the parent node.</li>
        <li><strong>Time Complexity:</strong> Average O(log n) for search, insert, and delete operations.</li>
        <li><strong>Key Operations:</strong> Insert, Search, Delete, Traversal (Inorder, Preorder, Postorder).</li>
        <li><strong>Applications:</strong> Database indexing, expression parsing, and sorted data storage.</li>
      </ul>
      <h4>Key Takeaways</h4>
      <ul>
        <li>Always maintain BST property during insertions</li>
        <li>Inorder traversal gives sorted output</li>
        <li>Balanced BSTs (AVL, Red-Black) prevent worst-case O(n)</li>
      </ul>`;
    setAiNotes(notes);
  };

  const simulatePDFSummary = (fileName: string) => {
    const summaries: Record<string, string> = {
      default: `This document explains the fundamentals of Object-Oriented Programming (OOP):

1. **Classes & Objects**: Classes are blueprints, objects are instances. Think of a class as a cookie cutter and objects as the cookies.

2. **Encapsulation**: Bundling data and methods together. Like a capsule medicine - everything needed is packaged inside.

3. **Inheritance**: Child classes inherit from parent classes. Like how you inherit traits from your parents.

4. **Polymorphism**: Same method, different behaviors. Like how "draw" means different things to an artist vs a poker player.

5. **Abstraction**: Hiding complex details, showing only essentials. Like driving a car without knowing how the engine works.

The document includes 15 practice problems and 5 real-world examples for better understanding.`
    };
    setPdfSummary(summaries.default);
  };

  const handleJoinSession = (session: Session) => {
    setCurrentSession(session);
    setInCall(true);
    setAiNotes(null);
    setActiveTab("room");
  };

  const handleSetReminder = (session: Session) => {
    setReminderSession(session);
    setShowReminder(true);
    setTimeout(() => setShowReminder(false), 4000);
  };

  const handleEndCall = () => {
    setInCall(false);
    simulateAINotes();
    setShowFeedbackModal(true);
    setFeedbackSubmitted(false);
    setRating(0);
    setFeedbackForm({ clarity: "", learned: "", suggestions: "" });
  };

  const handleSendMessage = async (msg: string) => {
    if (msg.trim()) {
      // Add user message immediately
      const userMsgId = chatMessages.length + 1;
      const newHistory = [...chatMessages, {
        id: userMsgId,
        sender: "You",
        message: msg,
        type: "sent" as const
      }];
      setChatMessages(newHistory);
      setChatLoading(true);

      try {
        // Convert internal message format to Gemini history format
        // Use the updated history (including the just-sent user message)
        const history = newHistory.map(m => ({
          role: m.sender === "You" ? "user" : "model" as "user" | "model",
          parts: m.message
        }));

        // Call Server Action
        const aiResponse = await getGeminiResponse(history, msg);

        // Add AI response
        setChatMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: "Gemini AI",
          message: aiResponse,
          type: "received",
          isAI: true
        }]);

      } catch (err) {
        console.error("Chat Error", err);
        setChatMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: "System",
          message: "Failed to get AI response. Please check your connection.",
          type: "received"
        }]);
      } finally {
        setChatLoading(false);
      }
    }
  };

  const handleCreateSession = () => {
    if (!user) return;
    if (newSessionForm.title && newSessionForm.subject) {
      setSessionCreated(true);
      setTimeout(() => {
        setShowCreateSessionModal(false);
        setSessionCreated(false);
        if (newSessionForm.schedule === "now") {
          setCurrentSession({
            id: Date.now(),
            title: newSessionForm.title,
            mentor: user.displayName || "You",
            subject: newSessionForm.subject,
            viewers: 0,
            status: "live",
            rating: 5.0
          });
          setInCall(true);
          setActiveTab("room");
        }
        setNewSessionForm({ title: "", subject: "", description: "", schedule: "now" });
      }, 1500);
    }
  };

  const handleSubmitFeedback = () => {
    if (rating > 0) {
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackSubmitted(false);
      }, 2000);
    }
  };

  const handleMentorClick = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowMentorModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file.name);
      simulatePDFSummary(file.name);
    }
  };

  const handleFeatureClick = (action: string) => {
    setActiveTab(action as typeof activeTab);
  };

  const handleSelectCategory = (categoryId: string) => {
    setBrowsingCategory(categoryId);
    setActiveTab("sessions");
  };

  const filteredSessions = initialSessions.filter(session => {
    if (sessionFilter === "all") return true;
    return session.status === sessionFilter;
  });

  const matchedSessions = browsingSubject && typeof browsingSubject === 'string'
    ? initialSessions.filter(s => s.subject === browsingSubject || s.subject.includes(browsingSubject) || browsingSubject.includes(s.subject))
    : [];

  const renderStars = (count: number, interactive = false, onRate?: (n: number) => void) => {
    return Array(5).fill(0).map((_, i) => (
      <button
        key={i}
        className={`star-btn ${i < count ? "active" : ""}`}
        onClick={() => onRate && onRate(i + 1)}
        style={!interactive ? { cursor: "default", fontSize: "1rem" } : {}}
        disabled={!interactive}
      >
        <Star size={interactive ? 28 : 16} fill={i < count ? "#ffd700" : "none"} color={i < count ? "#ffd700" : "#8888aa"} />
      </button>
    ));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="peer-learn-container">
      <header className="nav-header">
        <div className="nav-content">
          <div className="logo" onClick={() => setActiveTab("home")}>PeerLearn</div>
          <ul className="nav-links">
            <li><button className={activeTab === "home" ? "active" : ""} onClick={() => setActiveTab("home")}>Home</button></li>
            <li><button className={activeTab === "sessions" ? "active" : ""} onClick={() => { setActiveTab("sessions"); setBrowsingCategory(null); }}>Browse</button></li>
            <li><button className={activeTab === "leaderboard" ? "active" : ""} onClick={() => setActiveTab("leaderboard")}>Leaderboard</button></li>
            <li><button className={activeTab === "pdf" ? "active" : ""} onClick={() => setActiveTab("pdf")}>PDF Summary</button></li>
          </ul>
          <div className="nav-buttons">
            <div className="relative">
              <div
                className="flex items-center gap-3 mr-4 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {user.displayName ? user.displayName[0] : "U"}
                  </div>
                )}
                <span className="text-sm font-medium hidden md:block">{user.displayName?.split(' ')[0]}</span>
              </div>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-[#0F0F16]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 ring-1 ring-white/5">
                  <div className="p-4 border-b border-white/5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <p className="font-semibold text-sm text-white">{user.displayName}</p>
                    <p className="text-xs text-indigo-200/70 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => {
                        handleMentorClick({
                          name: user.displayName || "You",
                          role: "Student",
                          rating: 5.0,
                          sessions: 0,
                          avatar: user.photoURL || (user.displayName ? user.displayName[0] : "U"),
                          subject: "Learning",
                          teachingHours: 0
                        });
                        setShowUserMenu(false);
                      }}
                    >
                      <Users size={14} /> Profile
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors text-red-400 hover:text-red-300 flex items-center gap-2"
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                    >
                      <PhoneOff size={14} className="rotate-45" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn-secondary" onClick={() => setShowCreateSessionModal(true)}>Become a Mentor</button>
          </div>
        </div>
      </header>

      {activeTab === "home" && (
        <>
          <section className="hero-section">
            <div className="hero-bg"></div>
            <div className="hero-grid"></div>
            <div className="hero-content">
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                Live Sessions Available Now
              </div>
              <h1 className="hero-title">
                Welcome back, {user.displayName?.split(' ')[0]}!<br />
                <span className="hero-title-gradient">Ready to Learn?</span>
              </h1>
              <p className="hero-subtitle">
                Connect with fellow students for personalized, face-to-face video learning sessions. Understand complex topics easily with peer explanations.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => setActiveTab("sessions")}>
                  <Play size={18} style={{ marginRight: 8, display: "inline" }} />
                  Join a Session
                </button>
                <button className="btn btn-outline" onClick={() => setShowCreateSessionModal(true)}>
                  Start Teaching
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-value">2,500+</div>
                  <div className="stat-label">Active Learners</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">450+</div>
                  <div className="stat-label">Peer Mentors</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">10,000+</div>
                  <div className="stat-label">Sessions Completed</div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Why Choose PeerLearn?</h2>
              <p className="section-subtitle">
                A revolutionary platform designed to make learning collaborative, accessible, and effective.
              </p>
            </div>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card" onClick={() => handleFeatureClick(feature.action)}>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Find the perfect mentor in your field of study</p>
            </div>
            <CategoryList onSelectCategory={handleSelectCategory} />
          </section>

          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Live & Upcoming Sessions</h2>
              <p className="section-subtitle">Jump into a session now or schedule one for later</p>
            </div>
            <div className="sessions-grid">
              {initialSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <span className="session-subject">{session.subject}</span>
                    <span className={`session-status ${session.status}`}>
                      <span className="room-status-dot"></span>
                      {session.status === "live" ? `${session.viewers} watching` : session.time}
                    </span>
                  </div>
                  <h3 className="session-title">{session.title}</h3>
                  <div className="session-mentor">
                    <div className="session-mentor-avatar">{session.mentor.split(" ").map(n => n[0]).join("")}</div>
                    <div>
                      <div className="session-mentor-name">{session.mentor}</div>
                      <div className="session-mentor-rating">
                        <div className="star-rating" style={{ display: "inline-flex", marginRight: 4 }}>
                          {renderStars(Math.round(session.rating))}
                        </div>
                        {session.rating}
                      </div>
                    </div>
                  </div>
                  <div className="session-footer">
                    <span className="session-time">
                      <Clock size={14} />
                      {session.status === "live" ? "Started 15 mins ago" : session.time}
                    </span>
                    <button
                      className={`btn ${session.status === "live" ? "btn-primary" : "btn-warning"} btn-small`}
                      onClick={() => session.status === "live" ? handleJoinSession(session) : handleSetReminder(session)}
                    >
                      {session.status === "live" ? "Join Now" : "Set Reminder"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button className="btn btn-outline" onClick={() => setActiveTab("sessions")}>
                View All Sessions
              </button>
            </div>
            <div className="mt-8">
              <MentorList />
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Top Mentors This Week</h2>
              <p className="section-subtitle">Learn from our highest-rated peer mentors</p>
            </div>
            <div className="leaderboard-section">
              <div className="leaderboard-list">
                {initialMentors.slice(0, 5).map((mentor, index) => (
                  <div key={index} className="leaderboard-item" onClick={() => handleMentorClick(mentor)}>
                    <div className={`leaderboard-rank ${index < 3 ? `rank-${index + 1}` : "rank-default"}`}>
                      {index + 1}
                    </div>
                    <div className="leaderboard-avatar">{mentor.avatar}</div>
                    <div className="leaderboard-info">
                      <div className="leaderboard-name flex items-center gap-1">
                        {mentor.name}
                        {mentor.teachingHours >= 10 && (
                          <div className="bg-yellow-500/20 p-0.5 rounded ml-1" title="Gold Mentor (10+ Hours)">
                            <Medal size={14} className="text-yellow-500" />
                          </div>
                        )}
                        {mentor.teachingHours >= 5 && mentor.teachingHours < 10 && (
                          <div className="bg-slate-400/20 p-0.5 rounded ml-1" title="Silver Mentor (5+ Hours)">
                            <Medal size={14} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="leaderboard-subject">{mentor.subject}</div>
                    </div>
                    <div className="leaderboard-stats">
                      <div className="leaderboard-stat">
                        <div className="leaderboard-stat-value">{mentor.sessions}</div>
                        <div className="leaderboard-stat-label">Sessions</div>
                      </div>
                      <div className="leaderboard-stat">
                        <div className="star-rating">{renderStars(Math.round(mentor.rating))}</div>
                        <div className="leaderboard-stat-label">{mentor.rating} Rating</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button className="btn btn-outline" onClick={() => setActiveTab("leaderboard")}>
                View Full Leaderboard
              </button>
            </div>
          </section>
        </>
      )}

      {activeTab === "sessions" && (
        <section className="section" style={{ paddingTop: "8rem" }}>
          {!browsingCategory ? (
            <>
              <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Explore Subjects</h1>
                <p style={{ color: "var(--muted-foreground)" }}>Select a category to find specific topics and mentors.</p>
              </div>
              <CategoryList onSelectCategory={handleSelectCategory} />

              <div style={{ marginTop: "4rem", marginBottom: "2rem" }}>
                <h2 className="text-2xl font-bold">Trending Sessions</h2>
              </div>
              <div className="sessions-grid">
                {filteredSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="session-card">
                    <div className="session-header">
                      <span className="session-subject">{session.subject}</span>
                      <span className={`session-status ${session.status}`}>
                        <span className="room-status-dot"></span>
                        {session.status === "live" ? `${session.viewers} watching` : session.time}
                      </span>
                    </div>
                    <h3 className="session-title">{session.title}</h3>
                    <div className="session-mentor">
                      <div className="session-mentor-avatar">{session.mentor.split(" ").map(n => n[0]).join("")}</div>
                      <div>
                        <div className="session-mentor-name">{session.mentor}</div>
                        <div className="session-mentor-rating">
                          <div className="star-rating" style={{ display: "inline-flex", marginRight: 4 }}>
                            {renderStars(Math.round(session.rating))}
                          </div>
                          {session.rating}
                        </div>
                      </div>
                    </div>
                    <div className="session-footer">
                      <span className="session-time">
                        <Clock size={14} />
                        {session.status === "live" ? "Started 15 mins ago" : session.time}
                      </span>
                      <button
                        className={`btn ${session.status === "live" ? "btn-primary" : "btn-warning"} btn-small`}
                        onClick={() => session.status === "live" ? handleJoinSession(session) : handleSetReminder(session)}
                      >
                        {session.status === "live" ? "Join Now" : "Set Reminder"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : !browsingSubject ? (
            <SubjectList
              categoryId={browsingCategory}
              onBack={() => { setBrowsingCategory(null); setBrowsingSubject(null); }}
              onSelectSubject={(subject) => setBrowsingSubject(subject)}
            />
          ) : (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setBrowsingSubject(null)}
                  className="text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  ← Back to Subjects
                </button>
                <h2 className="text-2xl font-bold">{browsingSubject}</h2>
                <p className="text-muted-foreground">Available sessions and mentors for {browsingSubject}</p>
                {/* Show subject topics and mentors from static data when available */}
                {(() => {
                  const cat = categories.find(c => c.subjects.some(s => s.name === browsingSubject));
                  const subj = cat?.subjects.find(s => s.name === browsingSubject);
                  return subj ? (
                    <div className="mt-3 text-sm text-muted-foreground">
                      {subj.topics && <div><strong>Topics:</strong> {subj.topics.join(', ')}</div>}
                      {subj.mentors && subj.mentors.length > 0 && (
                        <div className="mt-2">
                          <strong>Mentors:</strong>
                          <div className="flex gap-3 mt-2">
                            {subj.mentors.map((m: any, i: number) => (
                              <div key={i} className="p-3 rounded-lg bg-card border text-sm">
                                <div className="font-semibold">{m.name}</div>
                                <div className="text-xs text-muted-foreground">Rating: {m.rating}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="sessions-grid">
                {matchedSessions.length > 0 ? (
                  matchedSessions.map((session) => (
                    <div key={session.id} className="session-card">
                      <div className="session-header">
                        <span className="session-subject">{session.subject}</span>
                        <span className={`session-status ${session.status}`}>
                          <span className="room-status-dot"></span>
                          {session.status === "live" ? `${session.viewers} watching` : session.time}
                        </span>
                      </div>
                      <h3 className="session-title">{session.title}</h3>
                      <div className="session-mentor" onClick={(e) => {
                        e.stopPropagation();
                        const mentorObj = initialMentors.find(m => m.name === session.mentor) || {
                          name: session.mentor,
                          role: "Mentor",
                          rating: session.rating,
                          sessions: 15,
                          avatar: session.mentor.split(" ").map(n => n[0]).join(""),
                          subject: session.subject,
                          teachingHours: 12
                        };
                        handleMentorClick(mentorObj);
                      }} style={{ cursor: "pointer" }}>
                        <div className="session-mentor-avatar">{session.mentor.split(" ").map(n => n[0]).join("")}</div>
                        <div>
                          <div className="session-mentor-name">{session.mentor}</div>
                          <div className="session-mentor-rating">
                            <div className="star-rating" style={{ display: "inline-flex", marginRight: 4 }}>
                              {renderStars(Math.round(session.rating))}
                            </div>
                            {session.rating}
                          </div>
                        </div>
                      </div>
                      <div className="session-footer">
                        <span className="session-time">
                          <Clock size={14} />
                          {session.status === "live" ? "Started 15 mins ago" : session.time}
                        </span>
                        <button
                          className={`btn ${session.status === "live" ? "btn-primary" : "btn-warning"} btn-small`}
                          onClick={() => session.status === "live" ? handleJoinSession(session) : handleSetReminder(session)}
                        >
                          {session.status === "live" ? "Join Now" : "Set Reminder"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No active sessions found for {browsingSubject}.</p>
                    <button className="btn btn-primary mt-4" onClick={() => setShowCreateSessionModal(true)}>
                      Be the first mentor!
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "room" && (
        <section className="section" style={{ paddingTop: "8rem" }}>
          <div className="video-room">
            <div className="video-room-header">
              <div className="room-info">
                <h3>{currentSession?.title || "Video Session"}</h3>
                {inCall && (
                  <div className="room-status">
                    <span className="room-status-dot"></span>
                    Live
                  </div>
                )}
              </div>
              {inCall && (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Users size={16} />
                    {currentSession?.viewers || 1} participants
                  </span>
                  <span className="ai-badge">
                    <Sparkles size={12} style={{ marginRight: 4 }} />
                    AI Recording
                  </span>
                </div>
              )}
            </div>

            {inCall && currentSession ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
                <div className="lg:col-span-3 h-full">
                  <VideoRoom
                    roomId={currentSession.id.toString()}
                    isHost={currentSession.mentor === (user?.displayName || "You")}
                    onEndCall={handleEndCall}
                  />
                </div>
                <div className="lg:col-span-1 h-full">
                  <ChatSidebar
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    loading={chatLoading}
                  />
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: "4rem" }}>
                <div className="empty-state-icon">
                  <Video size={64} />
                </div>
                <h3 style={{ marginBottom: "1rem" }}>Session Ended</h3>
                <p>Thank you for participating! Check out the AI-generated notes below.</p>
                <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={() => setActiveTab("sessions")}>
                  Browse More Sessions
                </button>
              </div>
            )}
          </div>

          {aiNotes && (
            <div className="ai-notes-panel">
              <div className="ai-notes-header">
                <Sparkles size={20} color="#6366f1" />
                <h3>AI-Generated Session Notes</h3>
                <span className="ai-badge">Auto-Generated</span>
              </div>
              <div className="ai-notes-content" dangerouslySetInnerHTML={{ __html: aiNotes }} />
            </div>
          )}
        </section>
      )}

      {activeTab === "leaderboard" && (
        <section className="section" style={{ paddingTop: "8rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Mentor Leaderboard</h1>
            <p style={{ color: "var(--muted-foreground)" }}>Our top-rated peer mentors based on student feedback</p>
          </div>
          <div className="tabs">
            <button className={`tab-btn ${leaderboardFilter === "week" ? "active" : ""}`} onClick={() => setLeaderboardFilter("week")}>This Week</button>
            <button className={`tab-btn ${leaderboardFilter === "month" ? "active" : ""}`} onClick={() => setLeaderboardFilter("month")}>This Month</button>
            <button className={`tab-btn ${leaderboardFilter === "all" ? "active" : ""}`} onClick={() => setLeaderboardFilter("all")}>All Time</button>
          </div>
          <div className="leaderboard-section">
            <div className="leaderboard-list">
              {initialMentors.map((mentor, index) => (
                <div key={index} className="leaderboard-item" onClick={() => handleMentorClick(mentor)}>
                  <div className={`leaderboard-rank ${index < 3 ? `rank-${index + 1}` : "rank-default"}`}>
                    {index + 1}
                  </div>
                  <div className="leaderboard-avatar">{mentor.avatar}</div>
                  <div className="leaderboard-info">
                    <div className="leaderboard-name flex items-center gap-1">
                      {mentor.name}
                      {mentor.teachingHours >= 10 && (
                        <div className="bg-yellow-500/20 p-0.5 rounded ml-1" title="Gold Mentor (10+ Hours)">
                          <Medal size={14} className="text-yellow-500" />
                        </div>
                      )}
                      {mentor.teachingHours >= 5 && mentor.teachingHours < 10 && (
                        <div className="bg-slate-400/20 p-0.5 rounded ml-1" title="Silver Mentor (5+ Hours)">
                          <Medal size={14} className="text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="leaderboard-subject">{mentor.subject}</div>
                  </div>
                  <div className="leaderboard-stats">
                    <div className="leaderboard-stat">
                      <div className="leaderboard-stat-value">{mentor.sessions}</div>
                      <div className="leaderboard-stat-label">Sessions</div>
                    </div>
                    <div className="leaderboard-stat">
                      <div className="star-rating">{renderStars(Math.round(mentor.rating))}</div>
                      <div className="leaderboard-stat-label">{mentor.rating} Rating</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "pdf" && (
        <section className="section" style={{ paddingTop: "8rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>PDF Summarizer</h1>
            <p style={{ color: "var(--muted-foreground)" }}>Upload your study materials and get AI-powered simple explanations</p>
          </div>
          <div className="pdf-upload-section">
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <div
              className={`upload-zone ${pdfFile ? "has-file" : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">
                {pdfFile ? <FileText size={32} /> : <Upload size={32} />}
              </div>
              <h3 className="upload-title">
                {pdfFile ? pdfFile : "Drop your PDF here or click to upload"}
              </h3>
              <p className="upload-subtitle">
                {pdfFile ? "Click to upload a different file" : "Supports PDF files up to 10MB"}
              </p>
            </div>

            {pdfSummary && (
              <div className="pdf-summary">
                <h4>
                  <Sparkles size={20} color="#6366f1" />
                  AI Summary - Simplified Explanation
                </h4>
                <div className="pdf-summary-content">
                  {pdfSummary}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {showFeedbackModal && (
        <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Rate This Session</h2>
              <button className="modal-close" onClick={() => setShowFeedbackModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {feedbackSubmitted ? (
                <div className="success-message">
                  <Check size={24} style={{ marginBottom: "0.5rem" }} />
                  <p>Thank you for your feedback!</p>
                </div>
              ) : (
                <div>
                  <div className="feedback-question">
                    <label>How would you rate this session overall?</label>
                    <div className="star-rating-input">
                      {renderStars(rating, true, setRating)}
                    </div>
                  </div>
                  <div className="feedback-question">
                    <label>Was the explanation clear and easy to understand?</label>
                    <select
                      className="form-select"
                      value={feedbackForm.clarity}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, clarity: e.target.value })}
                    >
                      <option value="">Select an option</option>
                      <option value="very">Very clear</option>
                      <option value="somewhat">Somewhat clear</option>
                      <option value="not">Not clear</option>
                    </select>
                  </div>
                  <div className="feedback-question">
                    <label>What did you learn from this session?</label>
                    <textarea
                      className="feedback-input"
                      rows={3}
                      placeholder="Share what you learned..."
                      value={feedbackForm.learned}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, learned: e.target.value })}
                    />
                  </div>
                  <div className="feedback-question">
                    <label>Any suggestions for improvement?</label>
                    <textarea
                      className="feedback-input"
                      rows={3}
                      placeholder="Help the mentor improve..."
                      value={feedbackForm.suggestions}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, suggestions: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
            {!feedbackSubmitted && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowFeedbackModal(false)}>
                  Skip
                </button>
                <button className="btn btn-primary" onClick={handleSubmitFeedback} disabled={rating === 0}>
                  Submit Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showCreateSessionModal && (
        <div className="modal-overlay" onClick={() => setShowCreateSessionModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create a Teaching Session</h2>
              <button className="modal-close" onClick={() => setShowCreateSessionModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {sessionCreated ? (
                <div className="success-message">
                  <Check size={24} style={{ marginBottom: "0.5rem" }} />
                  <p>Session created successfully! {newSessionForm.schedule === "now" ? "Starting now..." : "You will be notified."}</p>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Session Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Understanding Recursion Made Simple"
                      value={newSessionForm.title}
                      onChange={(e) => setNewSessionForm({ ...newSessionForm, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-select"
                      value={newSessionForm.subject}
                      onChange={(e) => setNewSessionForm({ ...newSessionForm, subject: e.target.value })}
                    >
                      <option value="">Select a subject</option>
                      <option value="DSA">Data Structures & Algorithms</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Web Dev">Web Development</option>
                      <option value="ML">Machine Learning</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="Describe what you'll be teaching..."
                      value={newSessionForm.description}
                      onChange={(e) => setNewSessionForm({ ...newSessionForm, description: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Schedule</label>
                    <select
                      className="form-select"
                      value={newSessionForm.schedule}
                      onChange={(e) => setNewSessionForm({ ...newSessionForm, schedule: e.target.value })}
                    >
                      <option value="now">Start Now (Live)</option>
                      <option value="later">Schedule for Later</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowCreateSessionModal(false)}>
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleCreateSession}
                      disabled={!newSessionForm.title || !newSessionForm.subject}
                    >
                      {newSessionForm.schedule === "now" ? "Start Session" : "Schedule Session"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showMentorModal && selectedMentor && (
        <div className="modal-overlay" onClick={() => setShowMentorModal(false)}>
          <div className="modal-content relative overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Background gradient for profile header */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />

            <div className="modal-header relative z-10 pt-4">
              <button className="modal-close bg-black/20 hover:bg-black/40 text-white rounded-full p-1" onClick={() => setShowMentorModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body relative z-10" style={{ marginTop: "-1rem" }}>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-secondary border-4 border-card shadow-xl flex items-center justify-center text-3xl font-bold mb-4">
                  {selectedMentor.avatar && selectedMentor.avatar.includes("/") ? (

                    <img src={selectedMentor.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                      {selectedMentor.avatar}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  {selectedMentor.name}
                  {selectedMentor.teachingHours >= 10 && (
                    <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30 flex items-center gap-1">
                      <Medal size={12} /> Gold Mentor
                    </span>
                  )}
                  {selectedMentor.teachingHours >= 5 && selectedMentor.teachingHours < 10 && (
                    <span className="bg-slate-400/20 text-slate-400 text-xs px-2 py-0.5 rounded-full border border-slate-400/30 flex items-center gap-1">
                      <Medal size={12} /> Silver Mentor
                    </span>
                  )}
                </h2>
                <p className="text-primary font-medium mb-1">{selectedMentor.subject} Expert</p>
                <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                  <Star size={14} fill="#eab308" className="text-yellow-500" />
                  <span className="text-yellow-500 text-sm font-bold">{selectedMentor.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 my-8">
                <div className="text-center p-4 bg-secondary/50 rounded-2xl border border-white/5">
                  <div className="text-2xl font-mono font-bold">{selectedMentor.sessions}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Sessions</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-2xl border border-white/5">
                  <div className="text-2xl font-mono font-bold">{Math.floor(selectedMentor.sessions * 3.5)}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Students</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-2xl border border-white/5">
                  <div className="text-2xl font-mono font-bold text-green-400">98%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Success</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">About Me</h4>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Passionate about teaching {selectedMentor.subject}. I believe in making complex concepts simple and accessible to everyone.
                  My goal is to help you master the fundamentals and excel in your exams.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {["Concept Clarity", "Exam Prep", "Assignments", "Live Coding"].map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-secondary border border-border text-gray-400">{tag}</span>
                  ))}
                </div>
              </div>
              {selectedMentor?.subject && (
                <div className="mt-6">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Topics & Lectures</h4>
                  <div className="mt-3">
                    <LectureList subjectName={selectedMentor.subject} />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer mt-6 pt-4 border-t border-border">
              <button
                className="btn btn-primary w-full shadow-lg shadow-primary/20"
                onClick={() => {
                  // Prefill create session form with mentor info and open session creation modal
                  setShowMentorModal(false);
                  setNewSessionForm(prev => ({
                    ...prev,
                    title: `${selectedMentor?.name} - 1:1 Session`,
                    subject: selectedMentor?.subject || prev.subject,
                    description: `Private session with ${selectedMentor?.name}`,
                    schedule: 'now'
                  }));
                  setShowCreateSessionModal(true);
                }}
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>
      )}

      {showReminder && reminderSession && (
        <div className="reminder-toast">
          <Bell className="reminder-toast-icon" size={24} />
          <div>
            <div style={{ fontWeight: 600 }}>Reminder Set!</div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
              We&apos;ll notify you before &quot;{reminderSession.title}&quot; starts
            </div>
          </div>
          <button className="reminder-toast-close" onClick={() => setShowReminder(false)}>
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}


