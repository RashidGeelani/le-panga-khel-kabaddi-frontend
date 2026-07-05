import { useState, useEffect, ReactNode, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import RegistrationLoading from "./components/components/RegistrationLoading";
import RegistrationSuccess from "./components/components/RegistrationSuccess";
import RegistrationError from "./components/components/RegistrationError";
import GlassCard from "./components/components/GlassCard";
// import TEAMS from "../data/teams"
import FIXTURES from "../data/fixtures"
import RULES_DATA from "../data/rules"
import qrScanner from "../assets/qrcode.jpeg"
import logonav from "../assets/logo.jpeg"
import {
  Trophy, Users, Calendar, MapPin, Phone, Mail,
  Instagram, Facebook, Youtube, ChevronDown, Search,
  ArrowRight, Clock, Home, List, BookOpen,
  PhoneCall, Upload, Award, CheckCircle, Star,
  Target, MessageCircle, User,
  ShieldCheck,
  Copy,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

type Page = "home" | "register" | "teams" | "team-detail" | "fixtures" | "rules" | "contact";
type FixtureFilter = "upcoming" | "completed";
type RegistrationStatus = "form" | "loading" | "success" | "error";
interface Team {
  id: string;
  registrationId: string;
  teamName: string;
  captainName: string;
  managerName: string;
  district: string;
  phone: string;
  email: string;
  players: {
  name: string;
  photo: File | null;
}[]
  logo: string;
  payment: string;
  status: string;
}
type Player = {
  name: string;
  photo: File | null;
};

type RegistrationForm = {
  teamName: string;
  captainName: string;
  managerName: string;
  phone: string;
  altPhone: string;
  email: string;
  district: string;
  players: Player[];
};



interface Fixture {
  id: number;
  team1: string;
  team2: string;
  date: string;
  time: string;
  ground: string;
  status: "upcoming" | "completed";
  score1?: string;
  score2?: string;
  winner?: string;
}
export const gradient =
  "linear-gradient(135deg, #4338CA 0%, #9333EA 30%, #EC4899 65%, #F59E0B 100%)";
// ─── Data ────────────────────────────────────────────────────────────────────

const TOURNAMENT_START = new Date("2026-09-18T09:00:00").getTime();







const GAS_URL = "https://script.google.com/macros/s/AKfycbwRVal_hknnzkStwUsMZERGmCMttHpWrmV7JfTavpkLCjX-nqJXSVXSqMh1CkcCybYlzg/exec";

// ─── Countdown Hook ──────────────────────────────────────────────────────────

function useCountdown(target: number) {
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── Reusable UI ─────────────────────────────────────────────────────────────



function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-10">
      <span className="text-xs font-semibold tracking-widest uppercase text-purple-400 mb-3 block">{label}</span>
      <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">{title}</h2>
      {subtitle && <p className="text-white/40 text-sm max-w-sm mx-auto">{subtitle}</p>}
    </div>
  );
}

function TeamAvatar({ logo, gradient, size = "md" }: { logo: string; gradient: string; size?: "sm" | "md" | "lg" }) {
  const sz = { sm: "w-10 h-10 text-xs", md: "w-14 h-14 text-sm", lg: "w-20 h-20 text-lg" }[size];
  return (
    <div className={`${sz} rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white shadow-lg flex-shrink-0 mx-auto`}>
      {logo}
    </div>
  );
}

function InputField({
  label, value, onChange, placeholder, type = "text", required = false, optional = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string; required?: boolean; optional?: boolean;
}) {
  return (
    <div>
      <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
        {label} {optional && <span className="text-white/20 normal-case tracking-normal">(Optional)</span>}
      </label>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} type={type} required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.07] transition-all"
      />
    </div>
  );
}

// ─── Top Navigation ───────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "teams", label: "Teams", icon: Users },
  { id: "fixtures", label: "Fixtures", icon: List },
  { id: "rules", label: "Rules", icon: BookOpen },
  { id: "contact", label: "Contact", icon: PhoneCall },
] as const;

function TopNav({ current, navigate }: { current: Page; navigate: (p: Page) => void }) {
  return (
    <nav className="hidden md:flex fixed top-0 inset-x-0 z-50 h-16 bg-black/50 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <button onClick={() => navigate("home")} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_16px_rgba(109,94,248,0.5)]">
            {/* <Trophy size={14} className="text-white" /> */}
            <img
            className="rounded-md"
             src={logonav} 
             alt="LPKK" />
          </div>
          <div>
            <div className="font-bold text-white text-sm leading-none">Le Panga Khel</div>
            <div className="text-white/30 text-[10px]">Kabaddi Season 11</div>
          </div>
        </button>

        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.map(({ id, label }) => {
            const active = current === id || (current === "team-detail" && id === "teams");
            return (
              <button key={id} onClick={() => navigate(id as Page)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${active ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}>
                {label}
              </button>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate("register")}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-[0_0_20px_rgba(109,94,248,0.35)] hover:shadow-[0_0_30px_rgba(109,94,248,0.5)] transition-all"
        >
          Register Team
        </motion.button>
      </div>
    </nav>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav({ current, navigate }: { current: Page; navigate: (p: Page) => void }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 md:hidden z-50 bg-black/70 backdrop-blur-2xl border-t border-white/[0.08]">
      <div className="flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = current === id || (current === "team-detail" && id === "teams") || (current === "register" && id === "home");
          return (
            <button key={id} onClick={() => navigate(id as Page)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${active ? "text-purple-400" : "text-white/30"}`}>
              <Icon size={19} />
              <span className="text-[9px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
// const [selectedTeam, setSelectedTeam] = useState<string>("");
function HomePage({
   navigate, onSelect, 
  }: { 
    navigate: (p: Page) => void 
    onSelect: (id: string) => void;
  }) {
  const time = useCountdown(TOURNAMENT_START);
  const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const [teams, setTeams] = useState<Team[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadTeams();
}, []);

async function loadTeams() {
  try {
    const res = await fetch(`${API_URL}/api/teams`);
    const data = await res.json();

    if (data.success) {
      setTeams(data.teams);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 pt-16 pb-40 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-purple-700/25 blur-[130px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-blue-700/20 blur-[110px]" />
          <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full bg-violet-700/15 blur-[90px]" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#09090B_100%)]" />
        </div>
        

        {/* logo */}

        <div className="relative flex justify-center mb-10">

  {/* Glow */}
  <div className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-purple-600/30 via-blue-500/20 to-purple-600/30 blur-3xl animate-pulse" />

  {/* Logo Container */}
  <motion.div
  initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
  animate={{ opacity: 1, scale: 1, rotate: 0 }}
  transition={{
    duration: 0.8,
    type: "spring",
    stiffness: 120,
  }}
  className="relative flex justify-center mb-10"
>
  <div className="relative w-40 h-40 rounded-full p-[3px] bg-gradient-to-br from-purple-500 via-fuchsia-500 to-blue-500 shadow-[0_0_50px_rgba(168,85,247,0.35)]">

    <div className="w-full h-full rounded-full bg-[#111111] backdrop-blur-xl border border-white/10 flex items-center justify-center">

      <img
        src={logonav}
        alt="Le Panga Khel Kabaddi"
        className="w-28 h-28 object-contain drop-shadow-2xl rounded-2xl"
      />

    </div>

  </div>
</motion.div>
  

</div>





        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
            className="mb-6">
            <span className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold px-4 py-2 rounded-full">
              <Trophy size={11} /> STATE LEVEL — INTER DISTRICT
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none mb-2">
            Le Panga Khel Kabaddi
          </h1>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-300 to-blue-400 bg-clip-text text-transparent mb-3">
             Season 11
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white/40 text-sm ">
            <span className="flex items-center gap-1.5"><MapPin size={13} />Nowpora Kalan, Sopore</span>
            <span className="flex items-center gap-1.5"><Calendar size={13} />Organised By Sports forum Nowpora</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 p-4 ">
             
             <span className="text-2xl sm:text-xl md:text-4xl font-semibold bg-gradient-to-r text-white/40">
                President 
            </span>
             <span className=" text-white text-2xl sm:text-xl md:text-4xl font-bold">
                Jalal Uddin Qadir
            </span>
          </div>
          {/* Countdown */}
          <div className="text-center mb-10">

  <p className="text-sm uppercase tracking-[0.35em] text-purple-400 font-semibold mb-5">
    Tournament Begins In
  </p>

  <div className="flex items-center justify-center gap-1 sm:gap-3 md:gap-4">

  {[
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ].map(({ label, value }, i) => (
    <div
      key={label}
      className="flex items-center gap-1 sm:gap-3"
    >
      <GlassCard className="relative overflow-hidden w-14 h-16 sm:w-20 sm:h-auto md:w-24 lg:w-28 p-2 sm:p-4 lg:p-5 text-center">

        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />

        <div className="relative z-10">
          <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tabular-nums leading-none">
            {String(value).padStart(2, "0")}
          </div>

          <div className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider text-white/40 font-semibold">
            {label}
          </div>
        </div>

      </GlassCard>

      {i < 3 && (
        <span className="text-purple-400 text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black animate-pulse">
          :
        </span>
      )}
    </div>
  ))}

</div>

</div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate("register")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-8 py-4 rounded-2xl text-base flex items-center gap-2.5 shadow-[0_0_40px_rgba(109,94,248,0.45)] hover:shadow-[0_0_60px_rgba(109,94,248,0.6)] transition-all w-full sm:w-auto justify-center">
              <Trophy size={17} /> Register Your Team
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate("fixtures")}
              className="bg-white/5 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl text-base flex items-center gap-2.5 hover:bg-white/10 hover:border-white/20 transition-all w-full sm:w-auto justify-center">
              View Fixtures <ArrowRight size={17} />
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="absolute bottom-20 md:bottom-6 left-4 right-4 max-w-lg mx-auto">
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Users, v: "16", l: "Teams" },
              { icon: Target, v: "32", l: "Matches" },
              { icon: Calendar, v: "5", l: "Days" },
              { icon: Award, v: "₹50K", l: "Prize" },
            ].map(({ icon: Icon, v, l }) => (
              <GlassCard key={l} className="p-2.5 sm:p-4 text-center">
                <Icon size={14} className="text-purple-400 mx-auto mb-1" />
                <div className="text-base sm:text-xl font-black text-white">{v}</div>
                <div className="text-[9px] sm:text-xs text-white/30 font-medium">{l}</div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Announcements */}
      <section className="px-4 py-14 max-w-3xl mx-auto">
        <SectionHeader label="Latest News" title="Announcements" />
        <div className="space-y-3">
          {[
            { type: "warning", color: "bg-amber-500", title: "Registration closes on 15 September", date: "1 Sep", body: "All teams must complete registration and payment before 15 September 2026. No late entries will be accepted." },
            { type: "info", color: "bg-blue-500", title: "Entry Fee: ₹3,000 per team", date: "28 Aug", body: "Participation fee is ₹3,000 per team. Submit payment proof (PhonePe/GPay) with your registration form." },
            { type: "success", color: "bg-emerald-500", title: "Venue Confirmed: Nowpora Kalan Ground", date: "25 Aug", body: "All matches will be held at Nowpora Kalan Ground, Sopore with two playing arenas and dedicated spectator stands." },
          ].map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-4 flex gap-3 hover:border-white/20 transition-all">
                <div className={`w-0.5 rounded-full flex-shrink-0 ${a.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm">{a.title}</h3>
                    <span className="text-white/25 text-xs flex-shrink-0">{a.date}</span>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed">{a.body}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Teams Preview */}
      <section className="px-4 py-14 max-w-5xl mx-auto">
        <SectionHeader label="Participants" title="Competing Teams" subtitle="Teams Across J&K battle for the championship" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {teams.slice(0,3).map((team, i) => (
            <motion.div key={team.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }}>
              <GlassCard
                onClick={() => {
                onSelect(team.registrationId);
                navigate("team-detail");
              }}
                className="p-4 text-center hover:border-white/20 transition-all cursor-pointer">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.teamName}
                    className="w-16 h-16 rounded-full object-cover mx-auto border border-white/10"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold mx-auto">
                    {team.teamName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}

                <div className="mt-2.5">
                  <div className="text-white text-xs font-bold leading-tight">
                    {team.teamName}
                  </div>

                  <div className="text-white/30 text-[10px] mt-0.5">
                    {team.captainName}
                  </div>
                </div>

              </GlassCard>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-6">
          <button onClick={() => navigate("teams")} className="inline-flex items-center gap-1.5 text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors">
            View All Teams <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Quick Fixtures Preview */}
      <section className="px-4 pb-14 max-w-3xl mx-auto">
        <SectionHeader label="Schedule" title="Upcoming Matches" />
        <div className="space-y-3">
          {FIXTURES.filter(f => f.status === "upcoming").slice(0, 3).map((f, i) => {
            const t1 = teams.find(t => t.teamName === f.team1);
            const t2 = teams.find(t => t.teamName === f.team2);
            return (
              <motion.div key={f.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {t1 && <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>{
                      <img 
                            //  className="w-16 h-16 rounded-full object-cover mx-auto border border-white/10"
                            className="rounded-md"
                             src={t1.logo}
                             alt={t1.teamName.substring(0,3)} 
                             />
                            }
                      </div>}
                    <span className="text-white text-xs font-semibold truncate">{f.team1}</span>
                  </div>
                  <div className="text-center flex-shrink-0 px-2">
                    <div className="text-white/25 text-[10px] font-black">VS</div>
                    <div className="text-white/30 text-[9px] mt-0.5 flex items-center gap-0.5"><Clock size={8} />{f.time}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    <span className="text-white text-xs font-semibold truncate text-right">{f.team2}</span>
                    {t2 && <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>{
                      <img 
                            //  className="w-16 h-16 rounded-full object-cover mx-auto border border-white/10"
                            className="rounded-md"
                             src={t2.logo}
                             alt={t2.teamName.substring(0,3)} 
                             />
                      }</div>}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center mt-6">
          <button onClick={() => navigate("fixtures")} className="inline-flex items-center gap-1.5 text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors">
            Full Schedule <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────

function RegisterPage() {
  const [form, setForm] = useState<RegistrationForm>({
  teamName: "",
  captainName: "",
  managerName: "",
  phone: "",
  altPhone: "",
  email: "",
  district: "",
  players: Array.from({ length: 12 }, () => ({
    name: "",
    photo: null as File | null,
  })),
});
  const [logo, setLogo] = useState<File | null>(null);
  const [payment, setPayment] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<RegistrationStatus>("form");
  const [registrationId, setRegistrationId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [registeredTeam, setRegisteredTeam] = useState({
  teamName: "",
  captainName: "",
  district: "",
});
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const setPlayer = (index: number, name: string) => {
    setForm((prev) => { 
      const players = [...prev.players];
      players[index].name = name;
      return {
        ...prev,
        players,
      };
    });
  };

  const setPlayerPhoto = (index: number, file: File | null) => {
    setForm((prev) => {
      const players = [...prev.players];
      players[index].photo = file;

      return {
        ...prev,
        players,
      };
    });
  };


  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const upiId = "syedraashidgeelani@okicici";
const name = encodeURIComponent("Le Panga Khel Kabaddi");
const amount = 3000;

const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (submitting) return;

  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const teamName = form.teamName.trim();
  const captainName = form.captainName.trim();
  const managerName = form.managerName.trim();
  const phone = form.phone.trim();
  const altPhone = form.altPhone.trim();
  const email = form.email.trim();
  const district = form.district.trim();

  const players = form.players
    .filter((player) => player.name.trim() !== ""
  );
    

  // Required Fields
  if (!teamName)
    return toast.error("Please enter your team name.");

  if (!captainName)
    return toast.error("Please enter the captain's name.");

  if (!phone)
    return toast.error("Please enter your phone number.");

  if (!email)
    return toast.error("Please enter your email address.");

  if (!district)
    return toast.error("Please select your district.");

  // Phone Validation
  if (!phoneRegex.test(phone))
    return toast.error("Please enter a valid 10-digit mobile number.");

  if (altPhone) {
    if (!phoneRegex.test(altPhone))
      return toast.error("Please enter a valid alternate number.");

    if (phone === altPhone)
      return toast.error(
        "Phone number and alternate phone cannot be the same."
      );
  }

  // Email Validation
  if (!emailRegex.test(email))
    return toast.error("Please enter a valid email address.");

  // Length Validation
  if (teamName.length < 3)
    return toast.error("Team name is too short.");

  if (captainName.length < 3)
    return toast.error("Captain name is too short.");

  // Players Validation
  if (players.length < 7)
    return toast.error("Please enter at least 7 player names.");

  const uniquePlayers = new Set(
    players.map((player) => player.name.toLowerCase())
  );

  if (uniquePlayers.size !== players.length)
    return toast.error("Duplicate player names are not allowed.");

  // Logo Validation
  if (logo) {
    if (!logo.type.startsWith("image/"))
      return toast.error("Team logo must be an image.");

    if (logo.size > 2 * 1024 * 1024)
      return toast.error("Team logo must be under 2 MB.");
  }

  // Payment Validation
  if (!payment)
    return toast.error("Please upload the payment screenshot.");

  if (!payment.type.startsWith("image/"))
    return toast.error("Payment proof must be an image.");

  if (payment.size > 2 * 1024 * 1024)
    return toast.error("Payment screenshot must be under 2 MB.");
  setStatus("loading");
  setSubmitting(true);

  try {
  const fd = new FormData();

  fd.append("teamName", teamName);
  fd.append("captainName", captainName);
  fd.append("managerName", managerName);
  fd.append("phone", phone);
  fd.append("altPhone", altPhone);
  fd.append("email", email);
  fd.append("district", district);
  fd.append("players", JSON.stringify(
    form.players.filter((p)=> p.name.trim())
    .map((p)=> p.name.trim())
  ));
  form.players.forEach((player, index) => {
    if (player.name.trim() && player.photo) {
      fd.append(`playerPhoto${index + 1}`, player.photo);
    }
  }); 

    if (logo) {
      fd.append("logo", logo);
    }

  fd.append("payment", payment);

  const response = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    body: fd,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed.");
  }

  setRegistrationId(result.registrationId);

  setRegisteredTeam({
    teamName,
    captainName,
    district,
  });

  // Reset form
  setForm({
    teamName: "",
    captainName: "",
    managerName: "",
    phone: "",
    altPhone: "",
    email: "",
    district: "",
    players: Array(12).fill(""),
  });

  setLogo(null);
  setPayment(null);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  // Show success screen AFTER everything is reset
  setStatus("success");

} catch (error: any) {
  console.error(error);

  setErrorMessage(
    error.message || "Unable to submit registration. Please try again."
  );

  setStatus("error");

} finally {
  setSubmitting(false);
}
  };

  if (status === "loading") {
  return <RegistrationLoading />;
}

if (status === "success") {
  return (
    <RegistrationSuccess
      registrationId={registrationId}
      teamName={registeredTeam.teamName}
      captainName={registeredTeam.captainName}
      district={registeredTeam.district}
      onRegisterAnother={() => {
        setStatus("form");
        setRegistrationId("");
        setRegisteredTeam({
          teamName: "",
          captainName: "",
          district: "",
        });
      }}
    />
  );
}

if (status === "error") {
  return (
    <RegistrationError
      message={errorMessage}
      onRetry={() => setStatus("form")}
    />
  );
}


  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <SectionHeader label="Join the Tournament" title="Register Your Team" subtitle="Secure your spot before 15 September 2026" />

        <GlassCard className="p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-7">

            {/* Team Info */}
            <div className="space-y-4">
              <div className="text-white/30 text-xs font-semibold uppercase tracking-widest border-b border-white/[0.06] pb-2">Team Information</div>
              <InputField label="Team Name" value={form.teamName} onChange={v => set("teamName", v)} placeholder="e.g. Warriors United" required />
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Team Logo <span className="text-white/20 normal-case tracking-normal">(Optional)</span>
                </label>
                <label className="flex items-center gap-3 bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-4 cursor-pointer hover:border-purple-500/30 hover:bg-white/[0.07] transition-all">
                  <Upload size={16} className="text-white/25" />
                  <span className="text-sm text-white/30 truncate">{logo ? logo.name : "Upload team logo image"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setLogo(e.target.files?.[0] ?? null)} />
                </label>
              </div>
            </div>

            {/* Officials */}
            <div className="space-y-4">
              <div className="text-white/30 text-xs font-semibold uppercase tracking-widest border-b border-white/[0.06] pb-2">Team Officials</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField  label="Captain Name"  value={form.captainName} onChange={v => set("captainName", v)} placeholder="Captain's full name" required />
                <InputField label="Manager Name" value={form.managerName} onChange={v => set("managerName", v)} placeholder="Manager's full name" />
                <InputField label="Phone Number" value={form.phone} onChange={v => set("phone", v)} placeholder="+91 XXXXX XXXXX" type="tel" required />
                <InputField label="Alternate Phone" value={form.altPhone} onChange={v => set("altPhone", v)} placeholder="+91 XXXXX XXXXX" type="tel" optional />
                <InputField label="Email Address" value={form.email} onChange={v => set("email", v)} placeholder="sultan@gmail.com" type="email" required />

                <div>
  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
    District
     {/* <span className="text-red-400">*</span> */}
  </label>

  <select
    value={form.district}
    onChange={(e) => set("district", e.target.value)}
    required
    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.07] transition-all"
  >
    <option value="" className="bg-[#111]">
      Select District
    </option>

    <option value="Anantnag" className="bg-[#111]">Anantnag</option>
    <option value="Bandipora" className="bg-[#111]">Bandipora</option>
    <option value="Baramulla" className="bg-[#111]">Baramulla</option>
    <option value="Budgam" className="bg-[#111]">Budgam</option>
    <option value="Doda" className="bg-[#111]">Doda</option>
    <option value="Ganderbal" className="bg-[#111]">Ganderbal</option>
    <option value="Jammu" className="bg-[#111]">Jammu</option>
    <option value="Kathua" className="bg-[#111]">Kathua</option>
    <option value="Kishtwar" className="bg-[#111]">Kishtwar</option>
    <option value="Kulgam" className="bg-[#111]">Kulgam</option>
    <option value="Kupwara" className="bg-[#111]">Kupwara</option>
    <option value="Poonch" className="bg-[#111]">Poonch</option>
    <option value="Pulwama" className="bg-[#111]">Pulwama</option>
    <option value="Rajouri" className="bg-[#111]">Rajouri</option>
    <option value="Ramban" className="bg-[#111]">Ramban</option>
    <option value="Reasi" className="bg-[#111]">Reasi</option>
    <option value="Samba" className="bg-[#111]">Samba</option>
    <option value="Shopian" className="bg-[#111]">Shopian</option>
    <option value="Srinagar" className="bg-[#111]">Srinagar</option>
    <option value="Udhampur" className="bg-[#111]">Udhampur</option>
  </select>
</div>

              </div>
            </div>

            {/* Players */}
            <div className="space-y-4">
              <div className="text-white/30 text-xs font-semibold uppercase tracking-widest border-b border-white/[0.06] pb-2">
                Squad — 12 Players
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {form.players.map((player, i) => (
    <div
      key={i}
      className="bg-white/[0.03] border border-white/10 rounded-2xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-white font-semibold">
          Player {i + 1}
          {/* {i < 7 && <span className="text-red-400"> *</span>} */}
        </span>
      </div>

      {/* Player Name */}
      <input
        value={player.name}
        onChange={(e) => setPlayer(i, e.target.value)}
        placeholder={i === 0 ? "Captain Name" : `Player ${i + 1} Name`}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 mb-3"
      />

      {/* Player Photo */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setPlayerPhoto(i, e.target.files?.[0] || null)
        }
        className="w-full text-sm text-white/70
          file:mr-4
          file:px-4
          file:py-2
          file:rounded-lg
          file:border-0
          file:bg-purple-600
          file:text-white
          file:cursor-pointer
          file:hover:bg-purple-500"
      />

      {/* Preview */}
      {player.photo && (
        <div className="mt-3 flex items-center gap-3">
          <img
            src={URL.createObjectURL(player.photo)}
            alt={player.name}
            className="w-14 h-14 rounded-xl object-cover border border-white/10"
          />

          <span className="text-xs text-white/60 truncate">
            {player.photo.name}
          </span>
        </div>
      )}
    </div>
  ))}
</div>
            </div>

              {/* pay through */}
            
            

<GlassCard className="relative overflow-hidden p-6 sm:p-8 mb-8">

  {/* Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

  <div className="relative z-10">

    {/* Header */}
    <div className="flex items-center justify-between mb-6">

      <div>
        <h3 className="text-2xl font-bold text-white">
          Registration Fee
        </h3>

        <p className="text-white/50 mt-1">
          Complete the payment before submitting your registration form.
        </p>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-full">
        <ShieldCheck size={16} className="text-green-400" />
        <span className="text-xs text-green-300 font-semibold">
          Secure UPI Payment
        </span>
      </div>

    </div>

    <div className="grid md:grid-cols-[220px_1fr] gap-8">

      {/* QR */}
      <div className="flex justify-center">

        <div className="rounded-3xl p-[2px] bg-gradient-to-br from-purple-500 via-blue-500 to-purple-500">

          <div className="bg-white rounded-[22px] p-3">

            <img
              src={qrScanner}
              alt="Payment QR"
              className="w-48 h-48 object-contain"
            />

          </div>

        </div>

      </div>

      {/* Payment Details */}

      <div className="flex flex-col justify-center">

        <div>

          <p className="uppercase tracking-[0.25em] text-xs text-white/40 font-semibold">
            Registration Fee
          </p>

          <h2 className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mt-2">
            ₹3000
          </h2>

        </div>

        <div className="mt-6">

          <p className="uppercase tracking-[0.25em] text-xs text-white/40 font-semibold mb-2">
            UPI ID
          </p>

          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-4">

            <span className="text-lg font-semibold text-white">
              syedraashidgeelani@okicici|₹3,000
            </span>

            <button
              onClick={() => {
                navigator.clipboard.writeText(upiId+amount);
                toast.success("UPI ID copied!");
              }}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
            >
              <Copy size={18} />
              Copy
            </button>

          </div>

        </div>

        <a
         onClick={() => console.log("Clicked")}
          href={upiLink}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 py-4 text-center text-lg font-bold text-white shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
          Pay via UPI
        </a>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/40">

          <span className="bg-white/5 rounded-full px-3 py-1">
            PhonePe
          </span>

          <span className="bg-white/5 rounded-full px-3 py-1">
            Google Pay
          </span>

          <span className="bg-white/5 rounded-full px-3 py-1">
            Paytm
          </span>

          <span className="bg-white/5 rounded-full px-3 py-1">
            BHIM
          </span>

        </div>

      </div>

    </div>

    {/* Important */}

    <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 backdrop-blur p-5">

      <h4 className="text-lg font-semibold text-amber-300 mb-3">
        Important Instructions
      </h4>

      <ul className="space-y-2 text-sm text-white/70 list-disc pl-5">

        <li>
          Pay the <strong>₹500</strong> registration fee before submitting the form.
        </li>

        <li>
          Upload a clear payment screenshot below.
        </li>

        <li>
          Mention your <strong>Team Name</strong> in the payment note if possible.
        </li>

        <li>
          Registrations are verified manually after payment confirmation.
        </li>

      </ul>

    </div>

  </div>

</GlassCard>



            {/* Payment */}
            <div>
              <div className="text-white/30 text-xs font-semibold uppercase tracking-widest border-b border-white/[0.06] pb-2 mb-4">Payment Proof</div>
              <label className="flex items-center gap-3 bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-4 cursor-pointer hover:border-purple-500/30 hover:bg-white/[0.07] transition-all">
                <Upload size={16} className="text-white/25" />
                <span className="text-sm text-white/30 truncate">{payment ? payment.name : "Upload payment screenshot"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => setPayment(e.target.files?.[0] ?? null)} />
              </label>
              <p className="text-white/25 text-xs mt-2">Entry fee ₹3,000 · Pay to 9622XXXXXX via PhonePe / GPay / Paytm</p>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-2xl text-base shadow-[0_0_30px_rgba(109,94,248,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2.5">
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><Trophy size={17} /> Register Team</>
              )}
            </motion.button>

            <p className="text-center text-white/25 text-xs flex items-center justify-center gap-1.5">
              <CheckCircle size={11} /> Your registration will be securely stored in Google Sheets
            </p>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}

// ─── Teams Page ───────────────────────────────────────────────────────────────

function TeamsPage({
  navigate,
  onSelect,
}: {
  navigate: (p: Page) => void;
  onSelect: (id: string) => void;
}) {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    try {
      const res = await fetch(`${API_URL}/api/teams`);
      const data = await res.json();

      if (data.success) {
        setTeams(data.teams);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Teams...
      </div>
    );
  }

  const filtered = teams.filter(
    (t) =>
      t.teamName.toLowerCase().includes(search.toLowerCase()) ||
      t.captainName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <SectionHeader
        label="Participants"
        title="Registered Teams"
        subtitle="Click any team to view full squad details"
      />

      <div className="relative max-w-md mx-auto mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search team..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-white/40 py-20">
          No registered teams yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((team) => (
            <GlassCard
              key={team.registrationId}
              className="p-4 cursor-pointer"
              onClick={() => {
                onSelect(team.registrationId);
                navigate("team-detail");
              }}
            >
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={team.teamName}
                  className="w-16 h-16 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-600 mx-auto flex items-center justify-center text-white font-bold">
                  {team.teamName
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              )}

              <h3 className="text-white mt-3 text-center font-semibold">
                {team.teamName}
              </h3>

              <p className="text-white/50 text-center text-sm">
                {team.captainName}
              </p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
// ─── Team Detail Page ─────────────────────────────────────────────────────────

function TeamDetailPage({
  teamId,
  navigate,
}: {
  teamId: string;
  navigate: (p: Page) => void;
}) {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  async function loadTeam() {
    try {
      const res = await fetch(`${API_URL}/api/teams/${teamId}`);
      const data = await res.json();

      if (data.success) {
        setTeam(data.team);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Team...
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Team not found.
      </div>
    );
  }

  return (
    <div>
      <GlassCard className="relative overflow-hidden p-8">

  {/* Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10" />

  <div className="relative z-10 flex flex-col items-center text-center">

    <img
      src={team.logo}
      alt={team.teamName}
      className="w-28 h-28 rounded-full object-cover border-4 border-purple-500/30 shadow-2xl"
    />

    <h1 className="mt-6 text-3xl md:text-4xl font-black text-white">
      {team.teamName}
    </h1>

    <p className="mt-2 text-white/50 flex items-center gap-2">
      📍 {team.district}
    </p>

    {/* Status */}
    <div className="mt-5">
      <span
        className={`px-4 py-2 rounded-full text-sm font-semibold ${
          team.status === "Approved"
            ? "bg-green-500/20 text-green-400"
            : "bg-yellow-500/20 text-yellow-400"
        }`}
      >
        {team.status}
      </span>
    </div>

  </div>

  {/* Info Cards */}
  <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <p className="text-xs text-white/40 uppercase tracking-wider">
        Captain
      </p>

      <h3 className="mt-2 text-lg font-bold text-white">
        {team.captainName}
      </h3>
    </div>

    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <p className="text-xs text-white/40 uppercase tracking-wider">
        Manager
      </p>

      <h3 className="mt-2 text-lg font-bold text-white">
        {team.managerName}
      </h3>
    </div>

    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <p className="text-xs text-white/40 uppercase tracking-wider">
        Contact No: 
      </p>

      <h3 className="mt-2 text-lg font-bold text-white">
        {team.phone} 
      </h3>
    </div>

    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <p className="text-xs text-white/40 uppercase tracking-wider">
        Squad
      </p>

      <h3 className="mt-2 text-lg font-bold text-white">
        {team.players.length} Players
      </h3>
    </div>

  </div>

</GlassCard>

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">

{team.players.map((player:any,index:number)=>(

<motion.div
key={index}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
transition={{delay:index*0.05}}
>

<GlassCard className="p-4 text-center">

<img
src={player.photo}
className="w-24 h-24 rounded-full object-cover mx-auto border"
/>

<h3 className="mt-3 font-bold">

#{player.number}

</h3>

<p className="text-white/70">

{player.name}

</p>

</GlassCard>

</motion.div>

))}

</div>
    </div>
  );
}

// ─── Fixtures Page ────────────────────────────────────────────────────────────

function FixturesPage() {
  const [filter, setFilter] = useState<FixtureFilter>("upcoming");
  const filtered = FIXTURES.filter(f => f.status === filter);
   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
   const [teams, setTeams] = useState<Team[]>([]);
   const [loading, setLoading] = useState(true);
   useEffect(() => {
  fetch(`${API_URL}/api/teams`)
    .then(r => r.json())
    .then(data => { if(data.success) setTeams(data.teams); });
}, []);
  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <SectionHeader label="Schedule" title="Match Fixtures" />

        {/* Filter Tabs */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 max-w-xs mx-auto mb-8">
          {(["upcoming", "completed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === f ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" : "text-white/35 hover:text-white/60"}`}>
              {f === "upcoming" ? "Upcoming" : "Completed"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div key={filter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {filtered.map((fixture, i) => {
                const t1 = teams.find(t => t.teamName === fixture.team1);
                const t2 = teams.find(t => t.teamName === fixture.team2);
                return (
                  <motion.div key={fixture.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <GlassCard className="p-5 hover:border-white/20 transition-all">
                      {/* Header row */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${fixture.status === "upcoming" ? "bg-purple-500/15 text-purple-400 border border-purple-500/25" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"}`}>
                          {fixture.status === "upcoming" ? "Upcoming" : "Completed"}
                        </span>
                        <div className="flex items-center gap-3 text-white/25 text-xs">
                          <span className="flex items-center gap-1"><MapPin size={10} />{fixture.ground}</span>
                        </div>
                      </div>

                      {fixture.status === "upcoming" ? (
                        <div className="flex items-center gap-3">
                          {/* Team 1 */}
                          <div className="flex-1 text-center">
                            {t1 && 
                            // <TeamAvatar logo={t1.logo} gradient={gradient} size="md" />
                            <img 
                             className="w-16 h-16 rounded-full object-cover mx-auto border border-white/10"
                             src={t1.logo}
                             alt={t1.teamName.substring(0,3)} 
                             />
                            }
                            <div className="text-white font-bold text-sm mt-2 leading-tight">{fixture.team1}</div>
                          </div>
                          {/* Center */}
                          <div className="flex-shrink-0 text-center px-2">
                            <div className="text-white/20 text-sm font-black mb-1.5">VS</div>
                            <div className="text-white/30 text-xs flex items-center gap-1 justify-center"><Calendar size={9} />{fixture.date}</div>
                            <div className="text-white/30 text-xs flex items-center gap-1 justify-center mt-0.5"><Clock size={9} />{fixture.time}</div>
                          </div>
                          {/* Team 2 */}
                          <div className="flex-1 text-center">
                            {t2 && 
                            <img 
                             className="w-16 h-16 rounded-full object-cover mx-auto border border-white/10"
                             src={t2.logo}
                             alt={t2.teamName.substring(0,3)} 
                             />
                            }
                            <div className="text-white font-bold text-sm mt-2 leading-tight">{fixture.team2}</div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            {/* Team 1 */}
                            <div className="flex-1 text-center">
                              {t1 && 
                                <img 
                             className="w-16 h-16 rounded-full object-cover mx-auto border border-white/10"
                             src={t1.logo}
                             alt={t1.teamName.substring(0,3)} 
                             />
                            }
                            
                              <div className="text-white font-bold text-sm mt-2">{fixture.team1}</div>
                              <div className={`text-3xl font-black mt-1 tabular-nums ${fixture.winner === fixture.team1 ? "text-emerald-400" : "text-white/30"}`}>
                                {fixture.score1}
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-white/15 text-xs font-black">FINAL</div>
                            {/* Team 2 */}
                            <div className="flex-1 text-center">
                              {t2 && 
                                <img 
                             className="w-16 h-16 rounded-full object-cover mx-auto border border-white/10"
                             src={t2.logo}
                             alt={t2.teamName.substring(0,3)} 
                             />
                            }

                              <div className="text-white font-bold text-sm mt-2">{fixture.team2}</div>
                              <div className={`text-3xl font-black mt-1 tabular-nums ${fixture.winner === fixture.team2 ? "text-emerald-400" : "text-white/30"}`}>
                                {fixture.score2}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2.5">
                            <Trophy size={13} className="text-emerald-400" />
                            <span className="text-emerald-400 font-bold text-sm">Winner: {fixture.winner}</span>
                          </div>
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Rules Page ───────────────────────────────────────────────────────────────

function RulesPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <SectionHeader label="Guidelines" title="Rules & Regulations" subtitle="Read carefully before completing registration" />

        <div className="space-y-2">
          {RULES_DATA.map((rule, i) => (
            <GlassCard key={i} className="overflow-hidden hover:border-white/15 transition-all">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 text-[10px] font-bold">{i + 1}</span>
                  </div>
                  <span className="font-semibold text-white text-sm">{rule.title}</span>
                </div>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={15} className="text-white/30 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1 border-t border-white/[0.05]">
                      <ul className="space-y-2.5 mt-3">
                        {rule.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <CheckCircle size={13} className="text-purple-400 flex-shrink-0 mt-[2px]" />
                            <span className="text-white/50 text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────

function ContactPage() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <SectionHeader label="Get In Touch" title="Contact Us" subtitle="Reach out for registrations, queries, or partnerships" />

        <div className="space-y-4">
          {/* Organizer */}
          <GlassCard className="p-5 sm:p-6">
            <h3 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
              <Users size={14} className="text-purple-400" /> Tournament Committee
            </h3>
            <div className="space-y-2.5">
              {[
                { href: "tel:+919622000000", icon: Phone, label: "Phone", value: "+91 9622 XXXXXX", bg: "bg-green-500/10", iconColor: "text-green-400" },
                { href: "https://wa.me/919622000000", icon: MessageCircle, label: "WhatsApp", value: "+91 9622 XXXXXX", bg: "bg-emerald-500/10", iconColor: "text-emerald-400" },
                { href: "mailto:lepangakhel@gmail.com", icon: Mail, label: "Email", value: "lepangakhel@gmail.com", bg: "bg-blue-500/10", iconColor: "text-blue-400" },
              ].map(({ href, icon: Icon, label, value, bg, iconColor }) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] rounded-xl p-3.5 transition-all group">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={15} className={iconColor} />
                  </div>
                  <div>
                    <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider">{label}</div>
                    <div className="text-white text-sm font-semibold mt-0.5">{value}</div>
                  </div>
                  <ArrowRight size={13} className="ml-auto text-white/15 group-hover:text-white/40 transition-colors" />
                </a>
              ))}
            </div>
          </GlassCard>

          {/* Venue */}
          <GlassCard className="p-5 sm:p-6">
            <h3 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
              <MapPin size={14} className="text-blue-400" /> Venue
            </h3>
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 mb-4">
              <div className="text-white font-bold text-sm">Nowpora Kalan Ground</div>
              <div className="text-white/40 text-sm mt-0.5">Nowpora Kalan, Sopore</div>
              <div className="text-white/40 text-sm">Baramulla, Jammu & Kashmir — 193201</div>
            </div>
            <div className="rounded-xl overflow-hidden h-48 bg-white/5">
              <iframe
                src="https://maps.google.com/maps?q=Sopore+Kashmir&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                title="Venue Map"
              />
            </div>
          </GlassCard>

          {/* Social */}
          <GlassCard className="p-5 sm:p-6">
            <h3 className="text-white font-bold mb-4 text-sm">Follow for Updates</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Instagram, label: "Instagram", gradient: "from-pink-600 to-purple-700", handle: "@lepangakhel" },
                { icon: Facebook, label: "Facebook", gradient: "from-blue-700 to-blue-500", handle: "Le Panga Khel" },
                { icon: Youtube, label: "YouTube", gradient: "from-red-700 to-red-500", handle: "Le Panga Khel" },
              ].map(({ icon: Icon, label, gradient, handle }) => (
                <motion.button key={label} whileHover={{ y: -3 }}
                  className="flex flex-col items-center gap-2 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] rounded-xl p-4 transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="text-white text-xs font-semibold">{label}</div>
                  <div className="text-white/25 text-[9px]">{handle}</div>
                </motion.button>
              ))}
            </div>
          </GlassCard>

          {/* Organizer Info */}
          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(109,94,248,0.3)]">
                <Trophy size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold">Le Panga Khel Kabaddi</div>
                <div className="text-white/40 text-sm mt-0.5">Organised by the Youth Sports Committee</div>
                <div className="text-white/30 text-xs mt-0.5">Nowpora Kalan, Sopore, Kashmir</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

 function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  const navigate = (p: Page, teamId?: string) => {
    setPage(p);
    if (teamId !== undefined) setSelectedTeam(teamId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#09090B] font-[Inter,system-ui,sans-serif]">
      <Toaster position="top-center" theme="dark" richColors />
      <TopNav current={page} navigate={navigate} />

      <div className="pt-0 md:pt-16 pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}>
            {page === "home" && <HomePage onSelect={setSelectedTeam}  navigate={navigate}  />}
            {page === "register" && <RegisterPage />}
            {page === "teams" && <TeamsPage navigate={navigate} onSelect={setSelectedTeam} />}
            {page === "team-detail" && <TeamDetailPage teamId={selectedTeam} navigate={navigate} />}
            {page === "fixtures" && <FixturesPage />}
            {page === "rules" && <RulesPage />}
            {page === "contact" && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav current={page} navigate={navigate} />
    </div>
  )
};


export default App;