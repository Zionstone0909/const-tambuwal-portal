import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import crest from "@/assets/cons-tambuwal-logo.png";

type NavItem = {
  to: string;
  label: string;
  children?: { to: string; label: string }[];
};

const navItems: NavItem[] = [
  { to: "/", label: "Home" },
  {
    to: "/admission",
    label: "Students",
    children: [
      { to: "/admission", label: "Nursing" },
      { to: "/admission", label: "Midwifery" },
    ],
  },
  { to: "/staff", label: "Staff" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
];

export function PortalHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenSubmenu(null);
  };

  return (
    <header className="sticky top-0 z-30 w-full shadow-sm">
      {/* Top band: logo + institution name */}
      <div className="bg-card/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 md:py-5 flex items-center gap-3 md:gap-8">
          <Link
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-3 md:gap-8 min-w-0 flex-1"
          >
            <img
              src={crest}
              alt="College of Nursing Sciences Tambuwal crest"
              width={200}
              height={200}
              className="h-14 w-14 sm:h-20 sm:w-20 md:h-28 md:w-28 object-contain drop-shadow-md shrink-0"
            />
            <div className="leading-tight min-w-0">
              <h1 className="font-display font-extrabold text-primary text-base sm:text-xl md:text-3xl lg:text-4xl tracking-tight">
                College of Nursing Sciences,
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>Tambuwal
              </h1>
              <p
                className="mt-0.5 md:mt-1 text-primary/80 text-sm sm:text-base md:text-xl"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Electronic Portal
              </p>
            </div>
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md text-primary hover:bg-primary/10 transition shrink-0"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Desktop navigation band */}
      <nav className="hidden md:block bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ul className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => (
              <li key={item.label} className="relative group">
                {item.children ? (
                  <Link
                    to={item.to}
                    preload="intent"
                    activeProps={{ className: "text-gold" }}
                    className="inline-flex items-center gap-1 px-3 md:px-4 py-3 text-sm md:text-base font-semibold tracking-wide hover:text-gold focus:text-gold transition whitespace-nowrap"
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to={item.to}
                    preload="intent"
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "text-gold" }}
                    className="inline-flex items-center gap-1 px-3 md:px-4 py-3 text-sm md:text-base font-semibold tracking-wide hover:text-gold transition whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && (
                  <ul className="absolute left-0 top-full min-w-[12rem] bg-gold text-primary shadow-lg opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-75 z-40">
                    {item.children.map((child, idx) => (
                      <li key={`${child.label}-${idx}`}>
                        <Link
                          to={child.to}
                          preload="intent"
                          className="block px-4 py-2 text-sm font-semibold hover:bg-primary hover:text-gold transition whitespace-nowrap"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile navigation panel */}
      {mobileOpen && (
        <nav className="md:hidden bg-primary text-primary-foreground border-t border-primary-foreground/10">
          <ul className="flex flex-col px-2 py-2">
            {navItems.map((item) => (
              <li key={item.label} className="border-b border-primary-foreground/10 last:border-0">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSubmenu((cur) => (cur === item.label ? null : item.label))
                      }
                      aria-expanded={openSubmenu === item.label}
                      className="w-full flex items-center justify-between px-3 py-3 text-base font-semibold hover:text-gold transition"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openSubmenu === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openSubmenu === item.label && (
                      <ul className="bg-primary-foreground/5 pb-2">
                        {item.children.map((child, idx) => (
                          <li key={`${child.label}-${idx}`}>
                            <Link
                              to={child.to}
                              preload="intent"
                              onClick={closeMobile}
                              className="block px-6 py-2.5 text-sm font-semibold hover:text-gold transition"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.to}
                    onClick={closeMobile}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "text-gold" }}
                    className="block px-3 py-3 text-base font-semibold hover:text-gold transition"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
