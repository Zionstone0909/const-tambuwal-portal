import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalHeader } from "@/components/PortalHeader";
import { Button } from "@/components/ui/button";
import consTambuwalLogo from "@/assets/cons-tambuwal-logo.png";
import {
  X,
  ChevronRight,
  GraduationCap,
  UserCog,
  FileText,
  CreditCard,
  BookOpen,
  Users,
  ShieldCheck,
  Award,
  HeartPulse,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome — College of Nursing Sciences, Tambuwal Electronic Portal" },
      { name: "description", content: "Official electronic portal of the College of Nursing Sciences, Tambuwal, Sokoto State. Access student, staff and applicant services." },
      { property: "og:title", content: "College of Nursing Sciences, Tambuwal — E-Portal" },
      { property: "og:description", content: "Welcome to the CONS Tambuwal E-Portal — your gateway to academic services." },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: Index,
});

const quickServices = [
  { icon: GraduationCap, title: "Student Login", desc: "Access courses, results & registration.", to: "/admission" },
  { icon: UserCog, title: "Staff Portal", desc: "Faculty & administrative tools.", to: "/staff" },
  { icon: FileText, title: "Applicants", desc: "Admissions & screening status.", to: "/admission" },
  { icon: CreditCard, title: "Fee Payment", desc: "Pay tuition & charges securely.", to: "/admission" },
];

const stats = [
  { value: "2,500+", label: "Enrolled Students" },
  { value: "120+", label: "Academic Staff" },
  { value: "15+", label: "Years of Excellence" },
  { value: "98%", label: "Graduation Rate" },
];

const news = [
  { tag: "Academics", title: "2024/2025 Resumption Notice", desc: "All returning students should resume by Oct 14.", date: "Oct 02, 2024" },
  { tag: "Admissions", title: "Post-UTME Results Released", desc: "Check your screening result on the portal.", date: "Sep 28, 2024" },
  { tag: "Finance", title: "Tuition Payment Window Open", desc: "Pay before the deadline to avoid late fees.", date: "Sep 20, 2024" },
];

function Index() {
  const [showNews, setShowNews] = useState(true);

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <PortalHeader />

      {/* Hero */}
      <section className="relative z-0 mx-auto max-w-7xl px-6 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
          <div className="max-w-3xl">
            <p className="text-5xl md:text-7xl font-display font-extrabold text-gold mb-4 leading-none">
              Welcome to
            </p>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-primary leading-tight tracking-tight uppercase">
              College of Nursing Sciences,<br />Tambuwal — Electronic Portal
            </h1>

            <p className="mt-4 text-sm md:text-base text-foreground/60 italic">
              Knowledge, Discipline &amp; Passion · P.M.B. 0011, Tambuwal, Sokoto State, Nigeria
            </p>

            <p className="mt-6 text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
              Your single sign-on gateway to academic records, course registration,
              results, fee payments and college services.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-elegant)] font-semibold tracking-wider px-8 py-6 rounded-md uppercase text-xs">
                <Link to="/admission">
                  Student Login <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold tracking-wider px-8 py-6 rounded-md uppercase text-xs">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>

          {showNews && (
            <aside className="w-full lg:w-80 bg-card rounded-lg shadow-[var(--shadow-elegant)] border border-border overflow-hidden self-start">
              <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
                <h3 className="font-display font-bold text-sm tracking-wide">NEWS &amp; UPDATES</h3>
                <button onClick={() => setShowNews(false)} aria-label="Close news" className="hover:text-gold transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ul className="p-4 space-y-3 text-sm">
                {news.map((n) => (
                  <li key={n.title} className="border-l-2 border-gold pl-3">
                    <p className="font-semibold text-foreground">{n.title}</p>
                    <p className="text-muted-foreground text-xs mt-1">{n.desc}</p>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>



      {/* About / Stats */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold font-semibold text-xs uppercase tracking-[0.2em] mb-2">About the College</p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-primary leading-tight">
              Shaping Nigeria's next generation of nursing professionals.
            </h2>
            <p className="mt-6 text-foreground/70 leading-relaxed">
              The College of Nursing Sciences, Tambuwal is committed to producing competent,
              compassionate and disciplined nurses. We combine rigorous academic instruction
              with practical clinical training to prepare our graduates for impactful service.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-gold mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-primary text-sm">Accredited</p>
                  <p className="text-xs text-muted-foreground">By N&amp;MCN</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HeartPulse className="h-5 w-5 text-gold mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-primary text-sm">Clinical-First</p>
                  <p className="text-xs text-muted-foreground">Hands-on training</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-gold mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-primary text-sm">Award-Winning</p>
                  <p className="text-xs text-muted-foreground">Faculty &amp; alumni</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-primary text-primary-foreground p-6 shadow-[var(--shadow-elegant)]">
                <p className="text-4xl md:text-5xl font-display font-extrabold text-gold">{s.value}</p>
                <p className="mt-2 text-sm uppercase tracking-wider opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News preview */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-gold font-semibold text-xs uppercase tracking-[0.2em] mb-2">Latest</p>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-primary">
                News &amp; Announcements
              </h2>
            </div>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/news">View all news <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item) => (
              <article key={item.title} className="rounded-xl border border-border bg-background overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all">
                <div className="h-2 bg-gold" />
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold uppercase tracking-wider">{item.tag}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-primary leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  <Link to="/news" className="mt-4 inline-flex items-center text-xs font-semibold text-gold uppercase tracking-wider hover:text-primary transition">
                    Read more <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Provost's Welcome */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-center">
          <div className="mx-auto lg:mx-0">
            <div className="relative">
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-2xl shadow-[var(--shadow-elegant)] overflow-hidden">
                <img 
                  src="/provost-safiya-ibrahim.jpg" 
                  alt="Dr. (Mrs.) SAFIYA IBRAHIM - Provost" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gold text-gold-foreground px-4 py-2 rounded-md shadow-md">
                <p className="font-display font-bold text-xs uppercase tracking-wider">The Provost</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gold font-semibold text-xs uppercase tracking-[0.2em] mb-2">Welcome Message</p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-primary leading-tight">
              A word from the Provost
            </h2>
            <blockquote className="mt-6 text-foreground/75 leading-relaxed border-l-4 border-gold pl-6 italic">
              "On behalf of the management, staff and students of the College of Nursing Sciences,
              Tambuwal, I warmly welcome you to our official electronic portal. Our college stands
              as a beacon of excellence in nursing education in Sokoto State and beyond — committed
              to producing competent, compassionate and ethically grounded nurses who will serve
              humanity with distinction.
              <br /><br />
              We invite you to explore our programmes, engage with our services, and join us on
              this noble journey of <span className="text-primary font-semibold not-italic">Knowledge, Discipline &amp; Passion.</span>"
            </blockquote>
            <div className="mt-6">
              <p className="font-display font-bold text-primary text-lg">Dr. (Mrs.) SAFIYA IBRAHIM</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Provost, CONS Tambuwal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-20">
        <div className="text-center mb-12">
          <p className="text-gold font-semibold text-xs uppercase tracking-[0.2em] mb-2">Academics</p>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-primary">
            Our Programmes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: "Basic General Nursing", desc: "A 3-year programme leading to the RN qualification." },
            { icon: HeartPulse, title: "Midwifery", desc: "Specialised training in maternal and child health." },
            { icon: Users, title: "Community Nursing", desc: "Public health-focused programme for community impact." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-8 hover:border-gold transition-all">
              <Icon className="h-8 w-8 text-gold" />
              <h3 className="mt-5 font-display font-bold text-xl text-primary">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold">
            Ready to access your <span className="text-gold">portal?</span>
          </h2>
          <p className="mt-4 text-base md:text-lg opacity-80 max-w-2xl mx-auto">
            Sign in to manage your academic records, fees and registrations — anytime, anywhere.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wider px-4 py-6 rounded-md uppercase text-xs">
              <Link to="/admission">Student Login <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-gold-foreground font-semibold tracking-wider px-8 py-6 rounded-md uppercase text-xs">
              <Link to="/staff">Staff Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and College Info - spans 2 columns on desktop */}
          <div className="md:col-span-2">
            <div className="flex items-start gap-4 mb-4">
              <img 
                src={consTambuwalLogo} 
                alt="College of Nursing Sciences, Tambuwal Logo" 
                className="h-12 w-12 object-contain flex-shrink-0"
              />
              <div>
                <p className="font-display font-extrabold text-primary text-lg">
                  COLLEGE OF NURSING SCIENCES, TAMBUWAL
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Knowledge, Discipline &amp; Passion
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              The official electronic portal of the College of Nursing Sciences, Tambuwal,
              Sokoto State, Nigeria.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-primary mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/admission" className="hover:text-gold transition">Student Login</Link></li>
              <li><Link to="/staff" className="hover:text-gold transition">Staff Login</Link></li>
              <li><Link to="/news" className="hover:text-gold transition">News</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-primary mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" /><span>P.M.B. 0011, Tambuwal, Sokoto State</span></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /><span>+234 (0) 800 000 0000</span></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /><span>info@constambuwal.edu.ng</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 md:px-12 py-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
            <p>© {new Date().getFullYear()} College of Nursing Sciences, Tambuwal. All rights reserved.</p>
            <p>Made with care · Knowledge, Discipline &amp; Passion</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
