import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  BriefcaseBusiness,
  Brain,
  MessageCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Plus,
  Minus,
  ArrowRight,
  FileText,
  Users,
  BookOpen,
  Headphones,
  Lock,
  Calendar,
  RefreshCw,
  Wrench,
  LifeBuoy,
  Loader2,
  AlertCircle,
  Send,
  Sun,
  Moon,
  Bot,
  Gift,
  Sparkles,
  Lightbulb,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  NOTE ON DARK MODE                                                  */
/*  This file uses Tailwind's class-based dark mode ("dark:" variants) */
/*  toggled by adding/removing a "dark" class on the outer wrapper.    */
/*  For that to work, your tailwind.config.js needs:                  */
/*      module.exports = { darkMode: "class", ... }                   */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Lead form config                                                   */
/* ------------------------------------------------------------------ */

// Point this at your deployed backend (see /server in this project),
// e.g. "https://your-api.onrender.com/api/leads".
const LEAD_FORM_ENDPOINT = import.meta.env.VITE_LEAD_FORM_ENDPOINT || "/api/leads";

// Point this at your chatbot backend once it's wired up to your AI API of choice.
const CHATBOT_API_ENDPOINT = import.meta.env.VITE_CHATBOT_API_ENDPOINT || "/api/chat";
const FEEDBACK_API_ENDPOINT = import.meta.env.VITE_FEEDBACK_API_ENDPOINT || "/api/feedback";

/* ------------------------------------------------------------------ */
/*  Top contact bar config                                             */
/* ------------------------------------------------------------------ */

const INTRO_TAGLINE = "Thoughtful academic support, built around your goals.";
const INTRO_DURATION_MS = 5000;
const OFFER_ENABLED = import.meta.env.VITE_OFFER_ENABLED === "true";
const OFFER_TITLE = import.meta.env.VITE_OFFER_TITLE || "A little something for your first order";
const OFFER_DESCRIPTION = import.meta.env.VITE_OFFER_DESCRIPTION || "Get 10% off your first request.";
const OFFER_CODE = import.meta.env.VITE_OFFER_CODE || "WELCOME10";
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "hello@studyspark.example";
const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || "+1 (202) 555-0147";
const INBOUND_AI_PHONE = import.meta.env.VITE_VAPI_INBOUND_NUMBER || "";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "";
const PHONE_HREF = INBOUND_AI_PHONE
  ? `tel:${INBOUND_AI_PHONE}`
  : import.meta.env.VITE_CONTACT_PHONE
    ? `tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`
    : "#get-quote";
const TOP_BANNER_TEXT = import.meta.env.VITE_TOP_BANNER_TEXT || "Thoughtful academic guidance, tailored around your goals";

/* ------------------------------------------------------------------ */
/*  Shared website content                                            */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Services", href: "/services/" },
  { label: "About us", href: "/about-us/" },
  { label: "Reviews", href: "/reviews/" },
  { label: "Experts", href: "/experts/" },
  {
    label: "Resources",
    href: "/samples/",
    items: [
      { title: "Samples", desc: "Browse example work and formats.", href: "/samples/" },
      { title: "Blog", desc: "Practical advice for your studies.", href: "/blog/" },
    ],
  },
];

const EXPERTS = [
  { name: "Writing coach", tag: "Essays & editing", desc: "Structure, clarity, citations, and academic tone." },
  { name: "Research guide", tag: "Research & dissertations", desc: "Topic development, source strategy, and methodology." },
  { name: "Subject tutor", tag: "Business & psychology", desc: "Break down key concepts and apply them with confidence." },
  { name: "STEM mentor", tag: "Computing & maths", desc: "Work through technical ideas one clear step at a time." },
];

const STEPS = [
  { number: "1", title: "Tell us about your goal", desc: "Share your subject, deadline, and the kind of guidance you need." },
  { number: "2", title: "Meet your specialist", desc: "We match your request with a subject-aware academic support expert." },
  { number: "3", title: "Move forward with confidence", desc: "Get clear, timely support and stay in control of your learning." },
];

const FEATURES = [
  { icon: Clock, title: "Deadline-aware", desc: "Plan your support around the dates that matter to you." },
  { icon: ShieldCheck, title: "Original guidance", desc: "Get tailored explanations and feedback, not recycled answers." },
  { icon: Lock, title: "Private by design", desc: "Your contact details and request stay confidential." },
  { icon: RefreshCw, title: "Support that adapts", desc: "Ask follow-up questions when you need clarification." },
  { icon: Headphones, title: "Real people, ready to help", desc: "Our support team can help you find the right next step." },
  { icon: Award, title: "Subject specialists", desc: "Connect with experienced professionals across disciplines." },
];

const SERVICES = [
  { icon: FileText, title: "Essay coaching", desc: "Shape a clear argument, improve structure, and strengthen your writing." },
  { icon: BookOpen, title: "Research guidance", desc: "Get help narrowing a topic, finding sources, and planning your approach." },
  { icon: Users, title: "Project support", desc: "Make complex coursework more manageable with expert feedback." },
  { icon: Wrench, title: "Editing & proofreading", desc: "Polish clarity, grammar, citations, and presentation." },
  { icon: LifeBuoy, title: "Exam preparation", desc: "Build a focused revision plan and review challenging concepts." },
  { icon: Calendar, title: "Dissertation support", desc: "Get guidance with proposals, methodology, and chapter planning." },
];

const REVIEWS = [
  { subject: "Clarity", body: "Understand difficult ideas with patient explanations and practical next steps." },
  { subject: "Confidence", body: "Build stronger study habits and feel more prepared to take on your own work." },
  { subject: "Personal support", body: "Get guidance shaped around your subject, goals, and timeline." },
];

const COMPARISON_ROWS = [
  ["Learning goals", "A one-size-fits-all answer", "Guidance shaped around your goals"],
  ["Subject support", "General information", "A specialist matched to your subject"],
  ["Study skills", "Focus on a single task", "Build strategies you can reuse"],
  ["Timeline", "Standard process", "Discuss a plan for your deadline"],
  ["Follow-up", "Limited opportunity to clarify", "Ask questions as you make progress"],
  ["Academic integrity", "May leave expectations unclear", "Support that keeps the work yours"],
];

const FAQS = [
  { q: "How does StudySpark work?", a: "Tell us what you are working on and your timeline. We will help you find suitable academic guidance and explain the next steps before you commit." },
  { q: "Can I ask for help with a tight deadline?", a: "Share your deadline in the request form. We will let you know what support is realistic for your timeframe." },
  { q: "Is my information kept private?", a: "We use your details to respond to your request and provide support. They are not displayed publicly." },
  { q: "Can I speak to someone before submitting a request?", a: "Yes. Use the chat, WhatsApp, or call option and our team can help you understand the process." },
  { q: "Does this service complete assignments for students?", a: "No. Our service is for tutoring, feedback, research guidance, editing, and study support that helps you learn and produce your own work." },
];

const FOOTER_COLUMNS = [
  { heading: "Explore", links: [{ label: "About us", href: "/about-us/" }, { label: "Experts", href: "/experts/" }, { label: "Reviews", href: "/reviews/" }] },
  { heading: "Resources", links: [{ label: "Samples", href: "/samples/" }, { label: "Blog", href: "/blog/" }, { label: "FAQs", href: "/#faq" }] },
  { heading: "Get in touch", links: [{ label: "Request support", href: "#get-quote" }, { label: "Email us", href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "#get-quote" }, { label: "Call us", href: PHONE_HREF }] },
];

/* ------------------------------------------------------------------ */
/*  0. Top Contact Bar                                                 */
/* ------------------------------------------------------------------ */

function TopBar() {
  return (
    <div className="border-b border-[#d9bb7a]/20 bg-[#17324d] text-white dark:bg-[#101c2b]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-4 py-1.5 sm:min-h-10 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-8 lg:px-10">
        <p className="min-w-0 truncate text-center text-[10px] font-medium tracking-wide text-white/90 sm:text-left sm:text-xs lg:text-[13px]">
          <span className="mr-2 text-[#e4c987]" aria-hidden="true">✦</span>
          {TOP_BANNER_TEXT}
        </p>
        <div className="flex shrink-0 items-center justify-center gap-3 text-[10px] sm:gap-4 sm:text-xs">
          <a href={PHONE_HREF} className="inline-flex items-center gap-1.5 whitespace-nowrap text-white/90 transition-colors hover:text-[#f3d994]">
              <Phone size={13} className="text-[#e4c987]" />
              <span>{CONTACT_PHONE}</span>
          </a>
          <span className="h-3 w-px bg-white/25" aria-hidden="true" />
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 whitespace-nowrap text-white/90 transition-colors hover:text-[#f3d994]">
              <Mail size={13} className="text-[#e4c987]" />
              <span>{CONTACT_EMAIL}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Header                                                          */
/* ------------------------------------------------------------------ */

function Header({ darkMode, onToggleDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);

  return (
    <div className="sticky top-0 z-50">
      <TopBar />
      <header className="relative border-b border-slate-200/80 bg-white/95 shadow-[0_8px_24px_rgba(23,50,77,0.05)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="flex h-[64px] items-center justify-between sm:h-[70px]">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f8b8d] to-[#17324d] text-xl font-extrabold text-white shadow-[0_6px_16px_rgba(15,139,141,0.2)]">
              S
            </div>
            <span className="text-[19px] font-extrabold tracking-tight text-slate-800 dark:text-white">StudySpark</span>
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((menu) => (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => menu.items && setActiveMenu(menu.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {menu.items ? (
                  <button onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)} className="flex items-center gap-1 text-[13px] font-medium text-slate-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 py-8">
                    {menu.label}
                    <ChevronDown size={16} className={`transition-transform ${activeMenu === menu.label ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <a href={menu.href} className="flex items-center text-[13px] font-medium text-slate-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 py-8">
                    {menu.label}
                  </a>
                )}
                {menu.items && activeMenu === menu.label && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 p-3">
                    {menu.items.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button onClick={onToggleDarkMode} aria-label="Toggle dark mode" className="rounded-full p-2 text-slate-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a
              href="#get-quote"
              className="rounded-md bg-[#0f8b8d] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(15,139,141,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#0b6e70] hover:shadow-[0_10px_22px_rgba(15,139,141,0.24)]"
            >
              Request Help
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-slate-700 dark:text-gray-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((menu) => (
              <div key={menu.label} className="border-b border-gray-100 dark:border-slate-800 last:border-none">
                {menu.items ? <button
                  className="w-full flex items-center justify-between py-3 text-left text-sm font-semibold text-slate-900 dark:text-white"
                  onClick={() => setMobileSubmenu(mobileSubmenu === menu.label ? null : menu.label)}
                >
                  {menu.label}
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${mobileSubmenu === menu.label ? "rotate-180" : ""}`}
                  />
                </button> : <a href={menu.href} onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-semibold text-slate-900 dark:text-white">{menu.label}</a>}
                {mobileSubmenu === menu.label && (
                  <div className="pb-3 pl-2 space-y-2">
                    {menu.items?.map((item) => (
                      <a key={item.title} href={item.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-gray-600 dark:text-gray-400">
                        {item.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href="#get-quote"
              onClick={() => setMobileOpen(false)}
              className="block text-center w-full bg-[#0f8b8d] hover:bg-[#0b6e70] text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors mt-2"
            >
              Request Help
            </a>
            <button onClick={onToggleDarkMode} className="flex w-full items-center gap-2 py-3 text-sm font-medium text-slate-700 dark:text-gray-300">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />} Toggle {darkMode ? "light" : "dark"} mode
            </button>
          </div>
        </div>
      )}
      </header>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Hero                                                            */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="bg-white dark:bg-slate-950">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-9 sm:px-8 md:py-14 lg:grid-cols-[1.08fr_.92fr] lg:gap-12 lg:px-10 lg:py-12">
        <div className="max-w-[700px]">
          <h1 className="reference-heading text-[35px] font-bold leading-[1.16] tracking-[-1.2px] sm:text-[44px] lg:text-[49px]">
          Get Personalised Academic Guidance for Your Next Big Goal
          </h1>
          <p className="mt-4 max-w-[680px] text-[16px] leading-[1.8] text-[#656565] dark:text-gray-300 sm:text-[17px]">
            Managing university work means juggling research, writing, projects, and deadlines. Get practical, one-to-one guidance to understand complex tasks, strengthen your own work, and plan your next step with confidence.
          </p>
          <div className="mt-6 text-center text-[15px] text-[#333] dark:text-gray-200 sm:text-left">
            Trusted by students for friendly, practical support
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            {[
              { name: "Learner-first guidance", score: "Personalised" },
              { name: "Subject specialists", score: "Experienced" },
              { name: "Private support", score: "Confidential" },
            ].map((item) => (
              <div key={item.name} className="flex min-w-[140px] items-center gap-2 rounded-md border border-[#eaeaea] bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6fffa] text-[#0f8b8d]"><CheckCircle2 size={16} /></span>
                <span><span className="block text-[11px] font-semibold text-slate-500">{item.name}</span><span className="block text-[12px] font-bold text-slate-800 dark:text-white">{item.score}</span></span>
              </div>
            ))}
          </div>
          <a href="/about-us/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0b6e70] hover:underline">
            Discover how we support students <ArrowRight size={16} />
          </a>
        </div>
        <GetQuoteForm compact />
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="bg-white dark:bg-slate-900 py-16 sm:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f8b8d]">About StudySpark</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[#333] dark:text-white">Learning is a journey. You don’t have to navigate it alone.</h2>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">We connect learners with knowledgeable specialists for practical, personalised academic guidance. Our goal is to make challenging work feel clearer while helping you build confidence and skills you can use again.</p>
          <a href="#get-quote" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0b6e70] dark:text-[#99f6e4] hover:gap-3 transition-all">Tell us what you’re working on <ArrowRight size={17} /></a>
        </div>
      </div>
    </section>
  );
}

function ResourcesSection() {
  const resources = [
    { id: "samples", icon: FileText, label: "Samples", title: "See what clear academic work can look like", description: "Explore example outlines, annotated citations, and project plans—starting points to inspire your own work.", cta: "Ask for a sample" },
    { id: "blog", icon: BookOpen, label: "From the blog", title: "Practical ideas for your next study session", description: "Try breaking a large assignment into smaller tasks, setting a short research sprint, and reviewing your argument before polishing details.", cta: "Get study guidance" },
  ];
  return (
    <section id="resources" className="bg-[#f7f5ef] dark:bg-slate-950 py-16 sm:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f8b8d]">Resources</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[#333] dark:text-white">Ideas and examples to keep you moving</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {resources.map(({ id, icon: Icon, label, title, description, cta }) => (
            <article id={id} key={id} className="scroll-mt-28 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-9 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e6fffa] text-[#0f8b8d] dark:text-[#99f6e4]"><Icon size={23} /></div>
              <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#0f8b8d]">{label}</p>
              <h3 className="mt-2 text-xl font-bold text-[#333] dark:text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
              <a href="#get-quote" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0b6e70] dark:text-[#99f6e4]">{cta}<ArrowRight size={16} /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Lead form config data                                              */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Lead / Quote Request Form                                          */
/* ------------------------------------------------------------------ */

function GetQuoteForm({ compact = false }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    countryCode: "+1",
    service: "Writing guidance",
    subject: "",
    deadline: "",
    deadlineTime: "10:00 AM",
    pages: 1,
    details: "",
    consent: false,
  });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const dragDepth = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const maxFiles = 4;
  const maxFileSize = 5 * 1024 * 1024;
  const allowedExtensions = new Set([".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png"]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addFiles(selectedFiles) {
    const nextFiles = [...files];
    let fileIssue = "";
    for (const file of selectedFiles) {
      const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      if (!allowedExtensions.has(extension)) {
        fileIssue = "Please attach PDF, DOC, DOCX, TXT, JPG, or PNG files only.";
        continue;
      }
      if (file.size > maxFileSize) {
        fileIssue = `${file.name} is larger than the 5 MB per-file limit.`;
        continue;
      }
      if (nextFiles.reduce((total, item) => total + item.size, file.size) > 15 * 1024 * 1024) {
        fileIssue = "Attachments must be 15 MB or smaller in total.";
        continue;
      }
      if (nextFiles.length >= maxFiles) {
        fileIssue = `You can attach up to ${maxFiles} files.`;
        break;
      }
      const alreadyAdded = nextFiles.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified);
      if (!alreadyAdded) {
        nextFiles.push(file);
      } else {
        fileIssue = `“${file.name}” is already attached.`;
      }
    }
    setFiles(nextFiles);
    setErrorMessage(fileIssue);
  }

  function handleFileSelection(event) {
    addFiles(Array.from(event.target.files || []));
    event.target.value = "";
  }

  function handleDragEnter(event) {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setStatus("submitting");

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "countryCode") return;
        if (key === "whatsapp") {
          payload.append(key, `${form.countryCode} ${value}`.trim());
        } else {
          payload.append(key, String(value));
        }
      });
      files.forEach((file) => payload.append("attachments", file));

      const res = await fetch(LEAD_FORM_ENDPOINT, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const response = await res.json().catch(() => ({}));
        throw new Error(response.error || "We couldn’t submit your request. Please try again.");
      }

      setStatus("success");
      setFiles([]);
      setForm({
        name: "",
        email: "",
        whatsapp: "",
        countryCode: "+1",
        service: "Writing guidance",
        subject: "",
        deadline: "",
        deadlineTime: "10:00 AM",
        pages: 1,
        details: "",
        consent: false,
      });
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong submitting your request. Please try again.");
      setStatus("error");
    }
  }

  const inputClasses =
    `w-full rounded-md border border-gray-300 dark:border-slate-600 bg-[#f8f8fa] dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 ${compact ? "py-3 text-[13px]" : "py-2.5 text-sm"} focus:outline-none focus:ring-2 focus:ring-[#0f8b8d] focus:border-[#0f8b8d]`;
  const labelClasses = "block text-sm font-semibold text-slate-900 dark:text-white mb-1.5";

  return (
    <section id="get-quote" className={compact ? "w-full scroll-mt-24" : "bg-gray-50 dark:bg-slate-950 py-16 sm:py-20 lg:py-24 scroll-mt-20"}>
      <div className={compact ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        <div className={compact ? "" : "grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start"}>
          {/* Left: copy */}
          {!compact && <div className="lg:col-span-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Tell Us What You Need
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Share a few details about what you’re working on. Our team will follow up with a suitable next step by email or WhatsApp.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "No-obligation first conversation",
                "Your details stay private",
                "A real person will follow up",
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-slate-700 dark:text-gray-300">
                    <CheckCircle2 size={18} className="text-[#0f8b8d] shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>}

          {/* Right: form card */}
          <div className={compact
            ? "rounded-xl border border-[#d8e7e5] bg-white p-5 shadow-[0_16px_44px_rgba(23,50,77,0.12)] dark:border-slate-700 dark:bg-slate-900 sm:p-6"
            : "lg:col-span-3 rounded-xl border border-gray-100 bg-white p-6 shadow-[0_16px_44px_rgba(23,50,77,0.08)] dark:border-slate-800 dark:bg-slate-900 sm:p-8"}>
            {status === "success" ? (
              <div className="flex flex-col items-center text-center py-10">
                <div className="h-14 w-14 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Request Received</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                  Thanks for reaching out. Our team will contact you shortly using the details you provided.
                </p>
                <button
                  onClick={() => { setStatus("idle"); setErrorMessage(""); }}
                  className="mt-6 text-sm font-semibold text-[#0b6e70] hover:text-[#084f50]"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <>
              {compact && (
                <>
                  <h2 className="text-center text-[18px] font-bold leading-snug text-[#303030] dark:text-white">Tell us what kind of study support you need</h2>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium text-slate-600 dark:text-gray-300">
                    {["Experienced specialists", "Private & secure", "Friendly support"].map((item) => (
                      <span key={item} className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-[#0f8b8d]" />{item}</span>
                    ))}
                  </div>
                </>
              )}
              <form onSubmit={handleSubmit} className={compact ? "mt-4 space-y-3" : "space-y-5"}>
                <fieldset>
                  {!compact && <legend className={labelClasses}>What do you need help with?</legend>}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["Writing guidance", "Writing"],
                      ["Technical tutoring", "Technical"],
                      ["Online tutoring", "Online class"],
                    ].map(([value, label]) => (
                      <label key={value} className={`flex min-h-10 cursor-pointer items-center justify-center rounded-md border px-2 text-center text-xs font-semibold transition-colors ${form.service === value ? "border-[#0f8b8d] bg-[#e6fffa] text-[#075b5d] dark:bg-teal-950 dark:text-teal-200" : "border-gray-300 text-slate-700 dark:border-slate-700 dark:text-gray-300"}`}>
                        <input
                          type="radio"
                          name={`support-type-${compact ? "hero" : "page"}`}
                          value={value}
                          checked={form.service === value}
                          onChange={(event) => updateField("service", event.target.value)}
                          className="sr-only"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className={`grid grid-cols-1 ${compact ? "sm:grid-cols-2 gap-3" : "sm:grid-cols-2 gap-5"}`}>
                  <div>
                    {!compact && <label className={labelClasses}>Full Name</label>}
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder={compact ? "Full name" : "Jane Doe"}
                      aria-label="Full name"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    {!compact && <label className={labelClasses}>Email Address</label>}
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder={compact ? "Email address" : "jane@example.com"}
                      aria-label="Email address"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className={`grid grid-cols-1 ${compact ? "sm:grid-cols-2 gap-3" : "sm:grid-cols-2 gap-5"}`}>
                  <div>
                    {!compact && <label className={labelClasses}>WhatsApp Number</label>}
                    <div className="flex gap-2">
                      <select
                        value={form.countryCode}
                        onChange={(e) => updateField("countryCode", e.target.value)}
                        aria-label="Country calling code"
                        className={`${inputClasses} w-[105px] shrink-0 px-2`}
                      >
                        {["+1", "+44", "+61", "+64", "+91", "+27"].map((code) => <option key={code} value={code}>{code}</option>)}
                      </select>
                      <input
                        type="tel"
                        required
                        value={form.whatsapp}
                        onChange={(e) => updateField("whatsapp", e.target.value)}
                        placeholder="Phone / WhatsApp"
                        aria-label="Phone or WhatsApp number"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div>
                    {!compact && <label className={labelClasses}>Subject or course</label>}
                    <input
                      type="text"
                      required
                      maxLength={120}
                      value={form.subject}
                      onChange={(e) => updateField("subject", e.target.value)}
                      placeholder="Subject / course code"
                      aria-label="Subject or course code"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    {!compact && <label className={labelClasses}>Deadline</label>}
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().slice(0, 10)}
                      value={form.deadline}
                      onChange={(e) => updateField("deadline", e.target.value)}
                      aria-label="Deadline date"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    {!compact && <label className={labelClasses}>Preferred time</label>}
                    <select value={form.deadlineTime} onChange={(e) => updateField("deadlineTime", e.target.value)} aria-label="Preferred deadline time" className={inputClasses}>
                      {["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM", "10:00 PM"].map((time) => <option key={time}>{time}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    {!compact && <label className={labelClasses}>Pages or word count</label>}
                    {compact && <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">Pages / words</label>}
                    <span className="text-[11px] text-slate-500 dark:text-gray-400">1 page ≈ 250 words</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" aria-label="Remove one page" disabled={Number(form.pages) <= 1} onClick={() => updateField("pages", Math.max(1, Number(form.pages) - 1))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-white"><Minus size={16} /></button>
                    <input type="number" required min="1" max="500" value={form.pages} onChange={(e) => updateField("pages", Math.min(500, Math.max(1, Number(e.target.value) || 1)))} aria-label="Number of pages" className={`${inputClasses} text-center`} />
                    <button type="button" aria-label="Add one page" disabled={Number(form.pages) >= 500} onClick={() => updateField("pages", Math.min(500, Number(form.pages) + 1))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-white"><Plus size={16} /></button>
                    <span className="shrink-0 text-xs text-slate-500 dark:text-gray-400">≈ {Number(form.pages) * 250} words</span>
                  </div>
                </div>

                <div>
                  {!compact && <label className={labelClasses}>How can we guide you?</label>}
                  <textarea
                    rows={compact ? 3 : 4}
                    maxLength={3000}
                    value={form.details}
                    onChange={(e) => updateField("details", e.target.value)}
                    placeholder="Describe the topic, instructions, or concepts you would like help understanding."
                    aria-label="Request details"
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={handleDragLeave}
                  onDrop={(event) => {
                    event.preventDefault();
                    dragDepth.current = 0;
                    setIsDragging(false);
                    addFiles(Array.from(event.dataTransfer.files || []));
                  }}
                  className={`rounded-lg border border-dashed p-3 transition-colors ${isDragging ? "border-[#0f8b8d] bg-[#e6fffa] dark:bg-teal-950/40" : "border-gray-300 bg-[#f8f8fa] dark:border-slate-700 dark:bg-slate-950"}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-300">
                      <FileText size={18} className="text-[#0f8b8d]" />
                      <span>Attach your brief or study materials <span className="text-xs text-slate-500">(optional)</span></span>
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-md border border-[#0f8b8d] px-3 py-1.5 text-xs font-semibold text-[#0b6e70] hover:bg-[#e6fffa] dark:text-teal-300">
                      Choose files
                    </button>
                    <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" onChange={handleFileSelection} className="sr-only" aria-label="Attach files" />
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">PDF, DOC, DOCX, TXT, JPG or PNG · up to 4 files, 5 MB each (15 MB total)</p>
                  {files.length > 0 && <ul className="mt-2 space-y-1">
                    {files.map((file) => <li key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-2 text-xs text-slate-700 dark:text-gray-300">
                      <span className="truncate">{file.name} <span className="text-slate-500">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span></span>
                      <button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((item) => item !== file))} className="shrink-0 text-red-600 hover:underline">Remove</button>
                    </li>)}
                  </ul>}
                </div>

                <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-gray-400">
                  <input type="checkbox" required checked={form.consent} onChange={(e) => updateField("consent", e.target.checked)} className="mt-0.5 accent-[#0f8b8d]" />
                  <span>I agree to be contacted about this request by email, phone, or WhatsApp. Please do not attach sensitive personal information.</span>
                </label>

                {(status === "error" || errorMessage) && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg px-4 py-3">
                    <AlertCircle size={16} className="shrink-0" />
                    {errorMessage || "Please check the form and try again."}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-[#0f8b8d] hover:bg-[#0b6e70] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base px-8 py-3.5 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      {compact ? "Send my request" : "Send my request"}
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Expert / Profile Cards                                          */
/* ------------------------------------------------------------------ */

function ExpertCards() {
  return (
    <section id="experts" className="bg-white dark:bg-slate-900 py-16 sm:py-20 lg:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333] dark:text-white">Meet your kind of support</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl">
              Connect with a specialist whose experience fits what you’re working on.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERTS.map((expert) => (
            <div
              key={expert.tag}
              className="bg-white dark:bg-slate-800 shadow-lg rounded-xl border border-gray-100 dark:border-slate-700 p-6 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-[#e6fffa] text-[#0f8b8d] dark:text-[#99f6e4] flex items-center justify-center font-bold text-lg" aria-hidden="true">{expert.name.slice(0, 1)}</div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{expert.name}</p>
                  <span className="inline-block mt-1 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full">
                    {expert.tag}
                  </span>
                </div>
              </div>
              <p className="mt-5 text-sm text-gray-600 dark:text-gray-400">{expert.desc}</p>
              <a href="#get-quote" className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0b6e70] dark:text-[#99f6e4]">Find my specialist <ArrowRight size={15} /></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. How It Works                                                    */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  return (
    <section id="services" className="bg-gray-50 dark:bg-slate-950 py-16 sm:py-20 lg:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333] dark:text-white">A simple way to get started</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Clear steps from your first question to a plan that feels achievable.
          </p>
        </div>

        <div className="relative">
          <div
            className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-gray-200 dark:bg-slate-800"
            style={{ marginLeft: "16.6%", marginRight: "16.6%" }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
            {STEPS.map((step, idx) => (
              <div key={idx} className="relative flex lg:flex-col lg:items-center lg:text-center gap-4">
                {idx !== STEPS.length - 1 && (
                  <span className="lg:hidden absolute left-8 top-16 bottom-[-2.5rem] w-0.5 bg-gray-200 dark:bg-slate-800" />
                )}
                <div className="relative z-10 h-16 w-16 shrink-0 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-extrabold">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-xs">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Features Grid                                                   */
/* ------------------------------------------------------------------ */

function FeaturesGrid() {
  return (
    <section className="bg-white dark:bg-slate-900 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333] dark:text-white">Support built around you</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Thoughtful guidance with your privacy, progress, and learning in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex flex-col items-start">
                <div className="h-12 w-12 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                  <Icon size={24} className="text-orange-500" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Services Layout                                                 */
/* ------------------------------------------------------------------ */

function ServicesGrid() {
  return (
    <section className="bg-gray-50 dark:bg-slate-950 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333] dark:text-white">Find the right kind of help</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl">
              Choose a starting point or tell us what you need and we’ll help you find the right fit.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                  <Icon size={24} className="text-orange-500" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{service.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{service.desc}</p>
                <a
                  href="#get-quote"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:gap-2.5 transition-all"
                >
                  Learn More
                  <ArrowRight size={14} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Dynamic Review Cards                                            */
/* ------------------------------------------------------------------ */

function ReviewCards() {
  return (
    <section id="reviews" className="bg-white dark:bg-slate-900 py-16 sm:py-20 lg:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333] dark:text-white">Learner reviews & our commitments</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            We’re collecting verified learner reviews. Here’s the experience we aim to deliver every time.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="break-inside-avoid mb-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 rounded-full">
                  {review.subject}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Our commitment</span>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                <span>StudySpark approach</span>
              </div>

              <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{review.body}</p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Comparison Table                                                */
/* ------------------------------------------------------------------ */

function ComparisonTable() {
  return (
    <section className="bg-gray-50 dark:bg-slate-950 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Why Choose Specialized Support</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            A personal, learning-first alternative to one-size-fits-all help.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="bg-slate-900 dark:bg-black text-white">
                <th className="text-left font-semibold px-4 sm:px-6 py-4">Comparison Point</th>
                <th className="text-left font-semibold px-4 sm:px-6 py-4">One-size-fits-all</th>
                <th className="text-left font-semibold px-4 sm:px-6 py-4 text-orange-400">StudySpark</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-gray-50 dark:bg-slate-800/50"}>
                  <td className="px-4 sm:px-6 py-4 font-semibold text-slate-900 dark:text-white border-t border-gray-100 dark:border-slate-800 whitespace-nowrap">
                    {row[0]}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-slate-800">
                    {row[1]}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-slate-900 dark:text-white font-medium border-t border-gray-100 dark:border-slate-800">
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-orange-500 shrink-0" />
                      {row[2]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. FAQ Accordion                                                   */
/* ------------------------------------------------------------------ */

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-white dark:bg-slate-900 py-16 sm:py-20 lg:py-24 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Helpful answers before you take the next step.
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-slate-800 border-t border-b border-gray-200 dark:border-slate-800">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx}>
                <button
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{faq.q}</span>
                  {isOpen ? (
                    <Minus size={20} className="text-orange-500 shrink-0" />
                  ) : (
                    <Plus size={20} className="text-gray-400 dark:text-gray-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="pb-5 pr-8">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PageHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <section className="bg-white px-5 py-8 dark:bg-slate-950 sm:px-8 sm:py-10 lg:py-12">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className={`pt-2 lg:pt-8 ${align === "center" ? "text-center lg:text-left" : ""}`}>
          {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8b8d]">{eyebrow}</p>}
          <h1 className={`reference-heading mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[48px] ${align === "center" ? "mx-auto max-w-4xl lg:mx-0" : "max-w-5xl"}`}>
            {title}
          </h1>
          {description && <p className={`mt-4 text-base leading-relaxed text-[#666] dark:text-gray-300 sm:text-lg ${align === "center" ? "mx-auto max-w-4xl lg:mx-0" : "max-w-4xl"}`}>{description}</p>}
          <PageIntroVisual />
        </div>
        <div className="w-full lg:pt-0">
          <GetQuoteForm compact />
        </div>
      </div>
    </section>
  );
}

function PageIntroVisual() {
  return (
    <div className="relative mt-7 max-w-2xl overflow-hidden rounded-2xl border border-[#dbe9e8] bg-gradient-to-br from-[#f6fbfa] via-white to-[#eef3fb] p-5 shadow-[0_18px_50px_rgba(23,50,77,0.08)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-[#142538] sm:mt-9 sm:p-7">
      <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-[#c9eee8]/60 blur-3xl dark:bg-[#0f8b8d]/20" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#dce5fa]/70 blur-3xl dark:bg-blue-900/20" />
      <div className="relative grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_155px] sm:gap-7">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4e9e5] bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#0b6e70] dark:border-slate-700 dark:bg-slate-800 dark:text-teal-200">
            <Sparkles size={13} /> Thoughtful support
          </span>
          <h2 className="mt-3 text-xl font-bold leading-snug tracking-tight text-[#17324d] dark:text-white sm:text-2xl">A clearer path starts with one good conversation.</h2>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-600 dark:text-gray-300 sm:text-sm">Bring your questions, course brief, or study goals. We’ll help you identify a practical next step.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Understand", "Plan", "Progress"].map((step, index) => (
              <span key={step} className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium text-slate-700 shadow-sm dark:bg-slate-800 dark:text-gray-200">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e1f4f0] text-[9px] font-bold text-[#0b6e70] dark:bg-teal-950 dark:text-teal-200">{index + 1}</span>
                {step}
              </span>
            ))}
          </div>
        </div>
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
          <div className="absolute inset-2 rounded-[2rem] bg-gradient-to-br from-[#0f8b8d] to-[#355a83] opacity-10 rotate-6" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.7rem] bg-gradient-to-br from-[#0f8b8d] to-[#17324d] text-white shadow-[0_16px_32px_rgba(23,50,77,0.2)] sm:h-28 sm:w-28">
            <BookOpen size={46} strokeWidth={1.4} />
          </div>
          <div className="absolute right-0 top-1 flex h-9 w-9 items-center justify-center rounded-xl border border-white bg-white text-[#0f8b8d] shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <CheckCircle2 size={19} />
          </div>
          <div className="absolute bottom-0 left-0 flex h-9 w-9 items-center justify-center rounded-xl border border-white bg-white text-[#b58b42] shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <Lightbulb size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PageCallout({ title = "Ready to take the next step?", description = "Tell us what you are working on and our team will help you find the right kind of support." }) {
  return (
    <section className="bg-[#effafa] px-5 py-12 dark:bg-slate-900 sm:px-8 sm:py-16">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#333] dark:text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">{description}</p>
        </div>
        <a href="#get-quote" className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[#0f8b8d] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0b6e70]">
          Get free assistance <ArrowRight size={17} />
        </a>
      </div>
    </section>
  );
}

function ValueCards({ entries }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(({ icon: Icon, title, description }) => (
        <article key={title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e6fffa] text-[#0f8b8d] dark:bg-orange-500/10"><Icon size={22} /></div>
          <h3 className="mt-4 text-lg font-bold text-[#333] dark:text-white">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
        </article>
      ))}
    </div>
  );
}

function AboutPage() {
  const values = [
    { icon: BookOpen, title: "Learning comes first", description: "We focus on explaining ideas, strengthening skills, and helping students create their own work." },
    { icon: Users, title: "Personal, subject-aware support", description: "Every student arrives with a different brief, background, and timeline. We start by listening." },
    { icon: Lock, title: "Respect and privacy", description: "Your questions are welcome, and your personal details are used only to respond to your request." },
  ];
  return (
    <>
      <PageHeading eyebrow="About StudySpark" title="Academic support built around how students really learn" description="University study can be challenging to navigate alone. StudySpark helps learners connect with practical guidance, subject expertise, and a clearer plan—while keeping the work and learning their own." />
      <section className="bg-white px-5 pb-14 dark:bg-slate-950 sm:px-8 sm:pb-20">
        <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-xl bg-[#f4f5f8] p-7 dark:bg-slate-900 sm:p-10">
            <p className="text-sm font-semibold text-[#0f8b8d]">Our purpose</p>
            <h2 className="mt-3 text-2xl font-bold text-[#333] dark:text-white sm:text-3xl">Make difficult study tasks feel manageable.</h2>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">From understanding an assignment brief to planning research or polishing a draft, learners can get a useful second perspective and clear, actionable next steps. We aim to support progress, not replace it.</p>
            <a href="#get-quote" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0b6e70]">Talk to our team <ArrowRight size={16} /></a>
          </div>
          <div className="rounded-xl border border-gray-200 p-7 dark:border-slate-800 sm:p-10">
            <h2 className="text-xl font-bold text-[#333] dark:text-white">What you can expect</h2>
            <ul className="mt-5 space-y-4">
              {["A thoughtful response to your goals", "Clear expectations before you begin", "Guidance that respects academic integrity", "Support matched to your subject and timeline"].map(item => <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#0f8b8d]" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-[#f7f8fa] px-5 py-14 dark:bg-slate-900 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <PageSectionTitle eyebrow="Core values" title="The principles behind every conversation" />
          <ValueCards entries={values} />
        </div>
      </section>
      <section className="bg-white px-5 py-14 dark:bg-slate-950 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <PageSectionTitle eyebrow="How it works" title="A simple route from question to clear next steps" />
          <HowItWorks />
        </div>
      </section>
      <FAQAccordion />
      <PageCallout title="Let’s find a way forward" />
    </>
  );
}

function PageSectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8b8d]">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-bold text-[#333] dark:text-white sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-gray-600 dark:text-gray-400">{description}</p>}
    </div>
  );
}

function ReviewsPage() {
  const principles = [
    { icon: MessageCircle, title: "A real conversation", description: "Tell us what worked, what could be clearer, and how the support affected your learning." },
    { icon: ShieldCheck, title: "Verified before publishing", description: "We do not invent, edit, or publish testimonials as though they came from a customer." },
    { icon: BookOpen, title: "Useful feedback", description: "Honest feedback helps learners understand the service and helps us improve it." },
  ];
  return (
    <>
      <PageHeading eyebrow="Reviews" align="center" title="Learner feedback matters" description="Read genuine feedback about the support experience. We are building our verified review collection and will only publish feedback with permission." />
      <section className="bg-white px-5 py-8 dark:bg-slate-950 sm:px-8 sm:py-12">
        <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-xl bg-[#f7f8fa] p-7 text-center dark:bg-slate-900 sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6fffa] text-[#0f8b8d]"><MessageCircle size={28} /></div>
            <h2 className="mt-5 text-2xl font-bold text-[#333] dark:text-white">Your experience matters</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">We do not display placeholder star ratings or made-up customer stories. Verified reviews will appear here as they are collected.</p>
            <a href="#share-feedback" className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#0f8b8d] px-5 py-3 font-semibold text-white hover:bg-[#0b6e70]">Share feedback <ArrowRight size={16} /></a>
          </div>
          <div>
            <PageSectionTitle eyebrow="Our promise" title="An open, useful review process" description="Feedback is most helpful when it reflects a real experience. We invite learners to share it directly with our team." />
            <ValueCards entries={principles} />
          </div>
        </div>
      </section>
      <section className="bg-[#f7f8fa] px-5 py-12 dark:bg-slate-900 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-[1200px]">
          <PageSectionTitle title="What good support should deliver" description="We use feedback to keep improving the parts of the experience learners value." />
          <ReviewCards />
        </div>
      </section>
      <FeedbackForm />
      <FAQAccordion />
      <PageCallout title="Have a question about our support?" description="Send your question through the enquiry form and our team will respond directly." />
    </>
  );
}

function FeedbackForm() {
  const [form, setForm] = useState({ name: "", email: "", rating: "5", feedback: "", publishPermission: false });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const inputClasses = "w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-gray-400 focus:border-[#0f8b8d] focus:outline-none focus:ring-2 focus:ring-[#0f8b8d] dark:border-slate-700 dark:bg-slate-950 dark:text-white";

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const response = await fetch(FEEDBACK_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "We couldn't send your feedback. Please try again.");
      }
      setStatus("success");
      setForm({ name: "", email: "", rating: "5", feedback: "", publishPermission: false });
    } catch (submissionError) {
      setError(submissionError.message || "We couldn't send your feedback. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section id="share-feedback" className="scroll-mt-24 bg-white px-5 py-12 dark:bg-slate-950 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-9">
        {status === "success" ? (
          <div role="status" className="py-8 text-center">
            <CheckCircle2 size={36} className="mx-auto text-[#0f8b8d]" />
            <h2 className="mt-4 text-2xl font-bold text-[#333] dark:text-white">Thank you for your feedback</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Your feedback was saved privately for our team. We only publish feedback with your permission and after review.</p>
            <button type="button" onClick={() => setStatus("idle")} className="mt-5 text-sm font-semibold text-[#0b6e70]">Send more feedback</button>
          </div>
        ) : (
          <>
            <PageSectionTitle eyebrow="Help us improve" title="Share your experience" description="Feedback is stored privately for our team. It is not published automatically; publication requires your permission and review." />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200">
                  Name <span className="font-normal text-slate-500">(optional)</span>
                  <input className={`${inputClasses} mt-1.5 font-normal`} maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" />
                </label>
                <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200">
                  Email <span className="font-normal text-slate-500">(optional)</span>
                  <input className={`${inputClasses} mt-1.5 font-normal`} type="email" maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
                </label>
              </div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200">
                How would you rate your experience?
                <select required className={`${inputClasses} mt-1.5 font-normal`} value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })}>
                  {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} {rating === 1 ? "star" : "stars"}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200">
                Your feedback
                <textarea required minLength={10} maxLength={3000} rows={5} className={`${inputClasses} mt-1.5 resize-y font-normal`} value={form.feedback} onChange={(event) => setForm({ ...form, feedback: event.target.value })} placeholder="Tell us what went well or what we could improve." />
              </label>
              <label className="flex items-start gap-2 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                <input type="checkbox" className="mt-1 accent-[#0f8b8d]" checked={form.publishPermission} onChange={(event) => setForm({ ...form, publishPermission: event.target.checked })} />
                I give permission for this feedback to be considered for publication after review. My name and email address will remain private.
              </label>
              {error && <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
              <button type="submit" disabled={status === "submitting"} className="inline-flex items-center gap-2 rounded-md bg-[#0f8b8d] px-6 py-3 font-semibold text-white hover:bg-[#0b6e70] disabled:cursor-not-allowed disabled:opacity-60">
                {status === "submitting" ? "Sending..." : "Send feedback"} <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

function ExpertsPage() {
  const [subject, setSubject] = useState("All subjects");
  const subjects = ["All subjects", "Writing & editing", "Research", "Business", "Psychology", "Computing & maths", "Exam preparation"];
  const profiles = [
    { title: "Writing & Editing Mentor", category: "Writing & editing", icon: FileText, skills: "Essay structure, academic tone, proofreading, and citations." },
    { title: "Research Guide", category: "Research", icon: Search, skills: "Topic development, source strategy, literature reviews, and methodology." },
    { title: "Business Study Tutor", category: "Business", icon: BriefcaseBusiness, skills: "Management concepts, case analysis, and clear report planning." },
    { title: "Psychology Learning Coach", category: "Psychology", icon: Brain, skills: "Research methods, theory, evidence evaluation, and revision plans." },
    { title: "Computing & Maths Tutor", category: "Computing & maths", icon: Wrench, skills: "Break down technical concepts, problem-solving approaches, and project plans." },
    { title: "Exam Preparation Coach", category: "Exam preparation", icon: Clock, skills: "Build a focused revision schedule and practise challenging concepts." },
  ];
  const matchingProfiles = profiles.filter(profile => subject === "All subjects" || profile.category === subject);
  return (
    <>
      <PageHeading eyebrow="Subject specialists" title="Find academic guidance that fits your subject" description="Browse areas of support and tell us what you are working on. We’ll help you identify an appropriate next step." />
      <section className="bg-white px-5 pb-14 dark:bg-slate-950 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">Explore support areas</p>
            <div className="flex gap-3">
              <label className="sr-only" htmlFor="expert-subject">Filter specialists by subject</label>
              <select id="expert-subject" value={subject} onChange={event => setSubject(event.target.value)} className="min-w-56 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                {subjects.map(option => <option key={option}>{option}</option>)}
              </select>
              <button type="button" onClick={() => setSubject("All subjects")} className="rounded-md border border-[#0f8b8d] px-4 py-3 text-sm font-semibold text-[#0b6e70] hover:bg-[#effafa]">Reset</button>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matchingProfiles.map(({ title, category, icon: Icon, skills }) => (
              <article key={category} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6fffa] text-[#0f8b8d] dark:bg-orange-500/10"><Icon size={24} /></div>
                  <div><h2 className="font-bold text-[#333] dark:text-white">{title}</h2><p className="mt-1 text-xs text-gray-500">{category}</p></div>
                </div>
                <p className="mt-5 min-h-12 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{skills}</p>
                <a href="#get-quote" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0b6e70]">Ask about this subject <ArrowRight size={15} /></a>
              </article>
            ))}
          </div>
          {matchingProfiles.length === 0 && <p className="py-12 text-center text-gray-600 dark:text-gray-300">No specialists match that subject yet. Contact us and we’ll check what support is available.</p>}
        </div>
      </section>
      <PageCallout title="Not sure which specialist you need?" description="Describe your course or assignment and we’ll help you find the right kind of support." />
      <FAQAccordion />
    </>
  );
}

const SAMPLE_CATEGORIES = ["All examples", "Essay planning", "Research", "Case studies", "Study skills"];
const SAMPLE_LIBRARY = [
  { title: "Building a focused essay outline", category: "Essay planning", description: "A sample structure for moving from a prompt to a clear question, argument, and paragraph plan.", takeaway: "Use the question’s key terms to organise each section." },
  { title: "Planning a literature review", category: "Research", description: "An example source-mapping approach for comparing themes, methods, and gaps across readings.", takeaway: "Group sources by ideas rather than summarising one at a time." },
  { title: "Analysing a business case", category: "Case studies", description: "A case-study framework for identifying context, evaluating evidence, and considering options.", takeaway: "Connect each recommendation to evidence in the case." },
  { title: "Turning a topic into a research question", category: "Research", description: "A worked planning example for narrowing a broad subject into a question that can be investigated.", takeaway: "Check scope, evidence, and feasibility before committing." },
  { title: "A realistic weekly study plan", category: "Study skills", description: "A simple planning example that balances class time, assignment milestones, and revision.", takeaway: "Break tasks into short sessions with a clear outcome." },
  { title: "Structuring an evidence-led paragraph", category: "Essay planning", description: "An outline showing how a claim, evidence, and explanation can work together in a paragraph.", takeaway: "Explain why the evidence supports the point you are making." },
];

function SamplesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All examples");
  const filteredSamples = SAMPLE_LIBRARY.filter(sample => {
    const matchesCategory = category === "All examples" || sample.category === category;
    const text = `${sample.title} ${sample.description} ${sample.category}`.toLowerCase();
    return matchesCategory && text.includes(query.trim().toLowerCase());
  });
  return (
    <>
      <PageHeading eyebrow="Free study resources" align="center" title="Samples and examples to help you get started" description="Browse concise academic planning examples. Use them to understand structure and approach—then develop your own work and ideas." />
      <section className="bg-[#f7f8fa] px-5 py-10 dark:bg-slate-900 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-[1200px]">
          <PageSectionTitle eyebrow="Example library" title="Find an example by topic or study goal" description="These short learning examples are starting points, not work to submit as your own." />
          <div className="mb-7 flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
              <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Filter examples by keyword..." aria-label="Filter examples by keyword" className="w-full rounded-md border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            </label>
            <label className="sr-only" htmlFor="sample-category">Filter examples by category</label>
            <select id="sample-category" value={category} onChange={event => setCategory(event.target.value)} className="rounded-md border border-gray-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              {SAMPLE_CATEGORIES.map(option => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSamples.map(sample => (
              <article key={sample.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <span className="inline-block rounded-full bg-[#e6fffa] px-3 py-1 text-xs font-semibold text-[#0f766e]">{sample.category}</span>
                <h2 className="mt-4 text-lg font-bold text-[#333] dark:text-white">{sample.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{sample.description}</p>
                <p className="mt-4 border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-500 dark:border-slate-800 dark:text-gray-300"><strong>Study tip:</strong> {sample.takeaway}</p>
                <a href="#get-quote" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0b6e70]">Get guidance on this <ArrowRight size={15} /></a>
              </article>
            ))}
          </div>
          {filteredSamples.length === 0 && <div className="rounded-lg bg-white p-8 text-center text-sm text-gray-600 dark:bg-slate-950 dark:text-gray-300">No examples match that search. Try another keyword or choose “All examples”.</div>}
        </div>
      </section>
      <PageCallout title="Need help applying an example?" description="Our team can help you understand the format and plan your own work." />
    </>
  );
}

const BLOG_ARTICLES = [
  { category: "Planning", readTime: "5 min read", title: "How to turn an assignment brief into a practical plan", summary: "Start by identifying the action words, deliverables, and criteria. Then turn each requirement into a small research or writing task.", points: ["Highlight command words and define what they ask you to do.", "List the evidence or sources each part will need.", "Set milestones early enough to review and revise."] },
  { category: "Research", readTime: "6 min read", title: "A simple way to organise sources for a literature review", summary: "A source matrix helps you compare ideas without losing track of where each finding came from.", points: ["Record the research question, method, and main finding.", "Group papers by themes or points of debate.", "Use your notes to identify patterns and gaps."] },
  { category: "Writing", readTime: "4 min read", title: "Make academic paragraphs easier to follow", summary: "A clear paragraph gives readers a claim, relevant evidence, and an explanation of how the evidence supports the point.", points: ["Begin with one focused idea.", "Use evidence that directly supports the idea.", "Explain the link before moving to the next point."] },
  { category: "Study skills", readTime: "5 min read", title: "Build a study schedule you can actually keep", summary: "A useful schedule makes room for classes, focused work, breaks, and changes in priority.", points: ["Choose a small number of weekly outcomes.", "Divide large tasks into sessions with clear endpoints.", "Review the plan each week and adjust realistically."] },
];

function BlogPage() {
  const [openArticle, setOpenArticle] = useState(null);
  return (
    <>
      <PageHeading eyebrow="StudySpark blog" title="Ideas and practical advice for your studies" description="Short, useful guides on planning assignments, researching effectively, writing clearly, and building study habits." />
      <section className="bg-[#f7f8fa] px-5 py-10 dark:bg-slate-900 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <PageSectionTitle eyebrow="Blog & articles" title="Fresh ways to make progress" />
            <a href="/samples/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0b6e70]">Browse study samples <ArrowRight size={15} /></a>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {BLOG_ARTICLES.map(article => (
              <article key={article.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold"><span className="rounded-full bg-[#e6fffa] px-3 py-1 text-[#0f766e]">{article.category}</span><span className="text-gray-500">{article.readTime}</span></div>
                <h2 className="mt-5 text-xl font-bold text-[#333] dark:text-white">{article.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{article.summary}</p>
                {openArticle === article.title && <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4 dark:border-slate-800">{article.points.map(point => <li key={point} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#0f8b8d]" />{point}</li>)}</ul>}
                <button type="button" onClick={() => setOpenArticle(openArticle === article.title ? null : article.title)} aria-expanded={openArticle === article.title} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0b6e70]">
                  {openArticle === article.title ? "Show less" : "Read article"} <ArrowRight size={15} className={openArticle === article.title ? "-rotate-90" : ""} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
      <PageCallout title="Want advice for your own assignment?" description="Share your subject and goals and we’ll help you find a useful place to start." />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  10. Chatbot Widget                                                 */
/* ------------------------------------------------------------------ */

function ChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi, I’m Spark, your study support guide. Ask me about services, deadlines, or how to get started." },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);
  const quickQuestions = ["What support do you offer?", "Can I attach my brief?", "How can I speak to a person?"];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  async function sendMessage(message) {
    const text = message.trim();
    if (!text || isSending) return;

    const nextMessages = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(CHATBOT_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply || "I couldn’t find an answer to that. Please use the request form and our team will help." }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "I’m having trouble connecting. Please try again or send your question through the request form." },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSend(e) {
    e.preventDefault();
    sendMessage(input);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm h-[28rem] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#0f8b8d] text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">Spark study guide</p>
            <p className="text-xs text-white/80 mt-0.5">Here to help you find the next step</p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close chat" className="p-1 hover:bg-white/10 rounded-full">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 dark:bg-slate-950">
        {messages.map((m, idx) => (
          <div key={idx} className="space-y-2">
            <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#0f8b8d] text-white rounded-br-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
            {idx === 0 && messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pl-1">
                {quickQuestions.map((question) => (
                  <button key={question} type="button" disabled={isSending} onClick={() => sendMessage(question)} className="rounded-full border border-[#9edbd4] bg-white px-3 py-1.5 text-left text-xs text-[#075b5d] hover:bg-[#e6fffa] disabled:opacity-50 dark:bg-slate-800 dark:text-teal-200">
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-2.5">
              <Loader2 size={16} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="shrink-0 border-t border-gray-200 dark:border-slate-800 p-3 flex items-center gap-2 bg-white dark:bg-slate-900">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-gray-400 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b8d]"
        />
        <button
          type="submit"
          disabled={isSending}
          aria-label="Send message"
          className="h-9 w-9 shrink-0 rounded-full bg-[#0f8b8d] hover:bg-[#0b6e70] disabled:opacity-60 text-white flex items-center justify-center transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  11. Floating Action Buttons                                        */
/* ------------------------------------------------------------------ */

function FloatingActionButtons({ chatOpen, onToggleChat }) {
  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
        <a
          href={WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "#get-quote"}
          target={WHATSAPP_NUMBER ? "_blank" : undefined}
          rel={WHATSAPP_NUMBER ? "noopener noreferrer" : undefined}
          aria-label={WHATSAPP_NUMBER ? "Chat on WhatsApp" : "Request a call back"}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center text-white transition-colors hover:scale-105"
        >
          {WHATSAPP_NUMBER ? <MessageCircle size={24} /> : <Phone size={24} />}
        </a>
        <button
          onClick={onToggleChat}
          aria-label="Open live chat"
          className="h-14 w-14 rounded-full bg-[#0f8b8d] hover:bg-[#0b6e70] shadow-lg flex items-center justify-center text-white transition-colors hover:scale-105"
        >
          {chatOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>
      <ChatWidget isOpen={chatOpen} onClose={onToggleChat} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  12. Footer                                                         */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-[#17324d] dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-[#0f8b8d] flex items-center justify-center text-white font-extrabold text-lg">
                S
              </div>
              <span className="text-xl font-extrabold text-white">StudySpark</span>
            </div>
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              Practical, personalised academic guidance to help learners grow with confidence.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="font-semibold text-white text-sm">{col.heading}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-[#99f6e4] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-[#99f6e4] shrink-0" />
            <a href={PHONE_HREF}>{INBOUND_AI_PHONE || "Request a call back"}</a>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-[#99f6e4] shrink-0" />
            <a href={CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "#get-quote"}>{CONTACT_EMAIL || "Send us a message"}</a>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} StudySpark. All rights reserved.</p>
          <p className="text-center sm:text-right max-w-xl">
            Academic guidance is designed to support learning and does not replace a student’s own work.
          </p>
        </div>
      </div>
    </footer>
  );
}

function OfferPopup({ onClose }) {
  return (
    <aside className="fixed bottom-24 left-4 z-50 w-[calc(100vw-2rem)] max-w-sm animate-offer-in rounded-xl border border-[#7dd3c7] bg-white p-5 shadow-2xl dark:bg-slate-900" aria-label="Special offer">
      <button onClick={onClose} aria-label="Close offer" className="absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"><X size={18} /></button>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e6fffa] text-[#0f8b8d] dark:text-[#99f6e4]"><Gift size={22} /></div>
        <div className="pr-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0f8b8d]">A special offer</p>
          <h2 className="mt-1 text-lg font-bold text-[#333] dark:text-white">{OFFER_TITLE}</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{OFFER_DESCRIPTION}</p>
          <p className="mt-3 inline-block rounded-lg border border-dashed border-[#0f8b8d] bg-[#e6fffa] px-3 py-1.5 font-mono font-bold tracking-wider text-[#333] dark:bg-slate-800 dark:text-[#99f6e4]">{OFFER_CODE}</p>
        </div>
      </div>
      <a href="#get-quote" onClick={onClose} className="mt-4 flex items-center justify-center gap-2 rounded-md bg-[#0f8b8d] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0b6e70]">
        Claim offer <ArrowRight size={16} />
      </a>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  13. Intro Splash                                                   */
/* ------------------------------------------------------------------ */

function IntroSplash({ onFinish }) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [scene, setScene] = useState(0);
  const [introDuration, setIntroDuration] = useState(INTRO_DURATION_MS);
  const finishedRef = useRef(false);
  const finishTimerRef = useRef(null);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const sceneCopy = [
    { eyebrow: "A more thoughtful way to study", title: "Big goals begin with a clear next step.", detail: "Bring the question. We’ll help you find a way forward." },
    { eyebrow: "Guidance that meets you where you are", title: "Make the complicated feel manageable.", detail: "Explore ideas, plan your approach, and build confidence as you go." },
    { eyebrow: "Your learning. Your momentum.", title: "Move forward with confidence.", detail: "Find practical, personal academic guidance with StudySpark." },
  ];

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setClosing(true);
    document.body.style.overflow = "";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    finishTimerRef.current = setTimeout(() => onFinishRef.current(), reducedMotion ? 0 : 420);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const showTimer = setTimeout(() => setVisible(true), 20);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 1400 : INTRO_DURATION_MS;
    setIntroDuration(duration);
    const sceneTimer = setInterval(() => setScene((current) => (current + 1) % sceneCopy.length), duration / sceneCopy.length);
    const closeTimer = setTimeout(finish, duration);

    function handleKey(e) {
      if (e.key === "Escape") finish();
    }
    window.addEventListener("keydown", handleKey);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
      clearInterval(sceneTimer);
      clearTimeout(finishTimerRef.current);
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [finish]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#101d2c] px-4 py-6 transition-opacity duration-500 sm:px-8 ${visible && !closing ? "opacity-100" : "opacity-0"}`} role="dialog" aria-modal="true" aria-label="Welcome to StudySpark">
      <div className="pointer-events-none absolute inset-0 intro-grain" />
      <div className="pointer-events-none absolute -left-32 top-[-12rem] h-[30rem] w-[30rem] rounded-full bg-[#0f8b8d]/25 blur-[100px] intro-orbit" />
      <div className="pointer-events-none absolute -bottom-56 -right-24 h-[36rem] w-[36rem] rounded-full bg-[#b58b42]/15 blur-[110px] intro-orbit intro-orbit-delay" />
      <div className={`relative mx-auto w-full max-w-6xl transition-all duration-500 ease-out ${visible && !closing ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0"}`}>
        <div className="mb-6 flex items-center justify-between sm:mb-9">
          <a href="/" className="group inline-flex items-center gap-3 text-white" aria-label="StudySpark home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-lg font-extrabold shadow-lg backdrop-blur"><span className="bg-gradient-to-br from-white to-[#dfc27c] bg-clip-text text-transparent">S</span></span>
            <span className="text-sm font-semibold tracking-wide sm:text-base">StudySpark</span>
          </a>
          <button type="button" onClick={finish} className="rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/75 transition hover:border-white/50 hover:bg-white/10 hover:text-white sm:text-sm">
            Skip intro <span aria-hidden="true" className="ml-1.5 text-white/45">Esc</span>
          </button>
        </div>

        <div className="grid items-center gap-8 rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_35px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:gap-12 sm:p-9 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:p-14">
          <div className="relative z-10">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#e3c981] sm:text-xs">
              <span className="h-px w-7 bg-[#e3c981]/80" />
              {sceneCopy[scene].eyebrow}
            </p>
            <h1 key={scene} className="mt-5 max-w-xl text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.055em] text-white intro-copy sm:text-5xl lg:text-[3.65rem]">
              {sceneCopy[scene].title}
            </h1>
            <p key={`detail-${scene}`} className="mt-5 max-w-md text-sm leading-7 text-slate-300 intro-copy sm:text-base">
              {sceneCopy[scene].detail}
            </p>
            <div className="mt-8 flex items-center gap-3 text-xs text-white/60 sm:mt-10 sm:text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e3c981]/25 bg-[#e3c981]/10 text-[#e3c981]"><Sparkles size={15} /></span>
              <span>Personal guidance. Practical progress. Learning that lasts.</span>
            </div>
            <div className="mt-8 max-w-xs sm:mt-10">
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-white/40">
                <span>Welcome experience</span><span>{String(scene + 1).padStart(2, "0")} / 03</span>
              </div>
              <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
                <div className="h-full origin-left rounded-full bg-gradient-to-r from-[#65c8bb] via-[#e3c981] to-white intro-progress" style={{ animationDuration: `${introDuration}ms` }} />
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[235px] w-full max-w-[430px] items-center justify-center sm:min-h-[300px] lg:min-h-[390px]">
            <div className="absolute h-[76%] w-[76%] rounded-full border border-white/[0.07] intro-ring" />
            <div className="absolute h-[96%] w-[96%] rounded-full border border-dashed border-white/[0.08] intro-ring intro-ring-slow" />
            <div className="absolute h-3 w-3 rounded-full bg-[#e3c981] shadow-[0_0_28px_8px_rgba(227,201,129,0.28)] intro-star" />
            <div className="absolute right-[13%] top-[20%] h-2 w-2 rounded-full bg-[#7bd5c9] shadow-[0_0_22px_7px_rgba(123,213,201,0.3)] intro-star intro-star-delay" />
            <div className="absolute bottom-[17%] left-[18%] h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_18px_6px_rgba(255,255,255,0.25)] intro-star intro-star-slow" />
            <div className="relative flex h-44 w-52 items-center justify-center sm:h-56 sm:w-64 lg:h-64 lg:w-72">
              <div className="absolute inset-0 rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/[0.12] to-white/[0.025] shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl intro-book-glow" />
              <div className="relative z-10 grid w-[76%] grid-cols-2 gap-2.5">
                <div className="col-span-2 mb-1 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e3c981]/15 text-[#e3c981]"><BookOpen size={16} /></div>
                  <div><p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-white/45">Your next chapter</p><p className="mt-0.5 text-xs font-semibold text-white">Start with a spark</p></div>
                </div>
                <div className="col-span-2 h-px bg-white/10" />
                {[["01", "Understand"], ["02", "Plan"], ["03", "Grow"], ["04", "Thrive"]].map(([number, label], index) => (
                  <div key={number} className={`rounded-xl border p-2.5 intro-tile intro-tile-${index + 1} ${index === scene ? "border-[#e3c981]/30 bg-[#e3c981]/[0.08]" : "border-white/[0.07] bg-white/[0.035]"}`}>
                    <span className={`text-[9px] font-medium ${index === scene ? "text-[#e3c981]" : "text-white/35"}`}>{number}</span>
                    <p className="mt-1 text-[10px] font-medium text-white/80 sm:text-[11px]">{label}</p>
                  </div>
                ))}
              </div>
              <span className="absolute -right-4 top-[23%] flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-[#15283b] text-[#e3c981] shadow-xl sm:-right-6 sm:h-12 sm:w-12"><Lightbulb size={21} /></span>
              <span className="absolute -bottom-4 left-[12%] flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-[#15283b] text-[#8ad8cd] shadow-xl sm:-bottom-5 sm:h-11 sm:w-11"><CheckCircle2 size={20} /></span>
            </div>
          </div>
        </div>
        <p className="mt-5 text-center text-[10px] tracking-wide text-white/35 sm:mt-6 sm:text-xs">A calm beginning to something meaningful.</p>
      </div>

      <style>{`
        @keyframes intro-copy { from { opacity: 0; transform: translateY(14px); filter: blur(5px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes intro-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes intro-orbit { 0%, 100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(22px,16px,0) scale(1.08); } }
        @keyframes intro-ring { from { transform: rotate(0) scale(.96); } to { transform: rotate(360deg) scale(1.04); } }
        @keyframes intro-star { 0%, 100% { transform: translateY(0) scale(.9); opacity: .65; } 50% { transform: translateY(-10px) scale(1.15); opacity: 1; } }
        @keyframes intro-breathe { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .intro-copy { animation: intro-copy .7s cubic-bezier(.2,.7,.2,1) both; }
        .intro-progress { animation: intro-progress linear both; }
        .intro-orbit { animation: intro-orbit 9s ease-in-out infinite; }
        .intro-orbit-delay { animation-delay: -4.5s; }
        .intro-ring { animation: intro-ring 36s linear infinite; }
        .intro-ring-slow { animation-duration: 52s; animation-direction: reverse; }
        .intro-star { animation: intro-star 3.5s ease-in-out infinite; }
        .intro-star-delay { animation-delay: -1.4s; }
        .intro-star-slow { animation-delay: -2.3s; }
        .intro-book-glow { animation: intro-breathe 5s ease-in-out infinite; }
        .intro-tile-1 { animation: intro-breathe 4.4s ease-in-out infinite; }
        .intro-tile-2 { animation: intro-breathe 4.4s ease-in-out -1s infinite; }
        .intro-tile-3 { animation: intro-breathe 4.4s ease-in-out -2s infinite; }
        .intro-tile-4 { animation: intro-breathe 4.4s ease-in-out -3s infinite; }
        .intro-grain { opacity: .12; background-image: radial-gradient(rgba(255,255,255,.4) .5px, transparent .5px); background-size: 6px 6px; mask-image: linear-gradient(to bottom, black, transparent 85%); }
        @media (prefers-reduced-motion: reduce) {
          .intro-copy, .intro-progress, .intro-orbit, .intro-ring, .intro-star, .intro-book-glow, .intro-tile-1, .intro-tile-2, .intro-tile-3, .intro-tile-4 { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesGrid />
      <ExpertCards />
      <HowItWorks />
      <FeaturesGrid />
      <ReviewCards />
      <ResourcesSection />
      <FAQAccordion />
      <PageCallout title="Get practical help with your next study task" />
    </>
  );
}

function ServicesPage() {
  return (
    <>
      <PageHeading eyebrow="Our services" title="Find the right kind of academic support" description="From early planning to final review, choose a support area and tell us what you are working towards. Our guidance is designed to help you learn and develop your own work." />
      <ServicesGrid />
      <HowItWorks />
      <FeaturesGrid />
      <FAQAccordion />
      <PageCallout />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = window.localStorage.getItem("studySparkTheme");
      if (savedTheme === "dark") return true;
      if (savedTheme === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (err) {
      return false;
    }
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return window.sessionStorage.getItem("studySparkIntroSeen") !== "true";
    } catch (err) {
      return true;
    }
  });
  const [siteRevealed, setSiteRevealed] = useState(() => {
    try {
      return window.sessionStorage.getItem("studySparkIntroSeen") === "true";
    } catch (err) {
      return false;
    }
  });
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    if (!siteRevealed || !OFFER_ENABLED) return undefined;
    try {
      if (window.sessionStorage.getItem("offerDismissed") === "true") return undefined;
    } catch (err) {
      console.warn("Session storage is unavailable; showing the configured offer.");
    }
    const timer = window.setTimeout(() => setShowOffer(true), 1600);
    return () => window.clearTimeout(timer);
  }, [siteRevealed]);

  function finishIntro() {
    try {
      window.sessionStorage.setItem("studySparkIntroSeen", "true");
    } catch (err) {
      console.warn("Could not save intro state for this browser tab.");
    }
    setSiteRevealed(true);
    setShowIntro(false);
  }

  function dismissOffer() {
    setShowOffer(false);
    try {
      window.sessionStorage.setItem("offerDismissed", "true");
    } catch (err) {
      console.warn("Could not save offer dismissal for this session.");
    }
  }

  function toggleDarkMode() {
    setDarkMode((currentMode) => {
      const nextMode = !currentMode;
      try {
        window.localStorage.setItem("studySparkTheme", nextMode ? "dark" : "light");
      } catch (err) {
        console.warn("Could not save the theme preference for this browser.");
      }
      return nextMode;
    });
  }

  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const pageTitles = {
    "/": "StudySpark | Academic Guidance That Helps You Grow",
    "/about-us": "About StudySpark | Learner-First Academic Support",
    "/reviews": "StudySpark Reviews | Learner Feedback",
    "/experts": "StudySpark Experts | Find Subject Support",
    "/samples": "Study Samples | StudySpark",
    "/free-samples": "Study Samples | StudySpark",
    "/blog": "StudySpark Blog | Practical Study Advice",
    "/services": "Academic Support Services | StudySpark",
  };
  useEffect(() => {
    document.title = pageTitles[currentPath] || pageTitles["/"];
  }, [currentPath]);

  const pageContent = (() => {
    switch (currentPath) {
      case "/about-us":
        return <AboutPage />;
      case "/reviews":
        return <ReviewsPage />;
      case "/experts":
        return <ExpertsPage />;
      case "/samples":
      case "/free-samples":
        return <SamplesPage />;
      case "/blog":
        return <BlogPage />;
      case "/services":
        return <ServicesPage />;
      default:
        return <HomePage />;
    }
  })();
  const isHome = currentPath === "/" || currentPath === "/index.html";

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased transition-colors">
        {showIntro && <IntroSplash onFinish={finishIntro} />}

        <div
          className={`transition-opacity duration-700 ease-out ${siteRevealed ? "opacity-100" : "opacity-0"}`}
        >
          <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
          <main>
            {pageContent}
          </main>
          <Footer />
          <FloatingActionButtons chatOpen={chatOpen} onToggleChat={() => setChatOpen((v) => !v)} />
          {showOffer && <OfferPopup onClose={dismissOffer} />}
        </div>
      </div>
    </div>
  );
}
