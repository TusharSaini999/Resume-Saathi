import { X, Sun, Moon, Laptop } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../../context/themeSlice";
import Logout from "./Logout";
import { Link, useLocation } from "react-router";
import { BUTTON_CLASS, UNDERLINE_CLASS } from "../../constants/style";

const navItems = [
  { label: "Overview", id: "overview" },
  { label: "How it works", id: "how-it-works" },
  { label: "Features", id: "features" },
  { label: "ATS tips", id: "ats-tips" },
  { label: "About", id: "about" },
  { label: "Support", id: "support" },
];

const dashboardNavItems = [
  { label: "Resume", path: "/dashboard" },
  { label: "Career openings", path: "/dashboard/careers" },
  { label: "Job description", path: "/dashboard/job" },
  { label: "Chat", path: "/dashboard/chat" },
  { label: "Settings", path: "/dashboard/settings" },
];

const publicBaseUrl = import.meta.env.BASE_URL;

// Constants - extracted to reduce string duplication
const ACTIVE_SECTION_STORAGE_KEY = "activeSection";
const THEME_STORAGE_KEY = "theme";

const getStoredActiveSection = () => {
  const stored = localStorage.getItem(ACTIVE_SECTION_STORAGE_KEY);
  return navItems.some((item) => item.label === stored) ? stored : null;
};

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const isRootPage = location.pathname === "/";
  const showDashboardNav = isLoggedIn && !isRootPage;



  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState(() => getStoredActiveSection() || navItems[0].label);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);
  const [btnTheme, setBtnTheme] = useState(
    localStorage.getItem(THEME_STORAGE_KEY) || "system"
  );
  const isDark = useSelector((state) => state.theme.isDark);
  const isClickScrolling = useRef(false);
  const clickScrollTimer = useRef(null);
  const navRef = useRef(null);

  const scrollToSection = useCallback((label, sectionId) => {
    setActive(label);
    setMobileMenuOpen(false);

    isClickScrolling.current = true;
    if (clickScrollTimer.current) clearTimeout(clickScrollTimer.current);

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    clickScrollTimer.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
  }, []);

  const applyTheme = useCallback(() => {
    if (btnTheme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", systemPrefersDark);
      dispatch(setTheme({ theme: btnTheme, isDark: systemPrefersDark }));
    } else if (btnTheme === "light") {
      document.documentElement.classList.remove("dark");
      dispatch(setTheme({ theme: btnTheme, isDark: false }));
    } else {
      document.documentElement.classList.add("dark");
      dispatch(setTheme({ theme: btnTheme, isDark: true }));
    }
  }, [btnTheme, dispatch]);

  const handleThemeToggle = useCallback(() => {
    setBtnTheme(prev => {
      if (prev === "system") return "light";
      if (prev === "light") return "dark";
      return "system";
    });
  }, []);

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    applyTheme();

    const handleChange = () => {
      if (btnTheme === "system") applyTheme();
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [btnTheme, applyTheme]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, btnTheme);
  }, [btnTheme]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_SECTION_STORAGE_KEY, active);
  }, [active]);

  useEffect(() => {
    const storedActiveSection = getStoredActiveSection();
    if (!storedActiveSection || storedActiveSection === navItems[0].label) return;

    const targetItem = navItems.find((item) => item.label === storedActiveSection);
    if (!targetItem) return;

    let retryTimer = null;

    const scrollToStoredSection = (remainingAttempts = 10) => {
      const section = document.getElementById(targetItem.id);

      if (section) {
        isClickScrolling.current = true;
        section.scrollIntoView({ behavior: "smooth", block: "start" });

        if (clickScrollTimer.current) clearTimeout(clickScrollTimer.current);
        clickScrollTimer.current = setTimeout(() => {
          isClickScrolling.current = false;
        }, 1000);
        return;
      }

      if (remainingAttempts > 0) {
        retryTimer = setTimeout(() => scrollToStoredSection(remainingAttempts - 1), 120);
      }
    };

    scrollToStoredSection();
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  useEffect(() => {
    const hasStoredActiveSection = Boolean(getStoredActiveSection());

    const updateActiveSection = () => {
      if (isClickScrolling.current) return;

      const scrollMarker = window.scrollY + 160;
      let currentSection = navItems[0].label;

      for (const item of navItems) {
        const section = document.getElementById(item.id);
        if (section && scrollMarker >= section.offsetTop) {
          currentSection = item.label;
        }
      }

      setActive((previous) => (previous === currentSection ? previous : currentSection));
    };

    if (!hasStoredActiveSection) {
      updateActiveSection();
    }

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handlePointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setTimeout(() => setMobileMenuOpen(false), 0);
  }, [location.pathname]);

  const getNavItemClass = useCallback((isActive) =>
    `w-full lg:w-auto text-center text-sm font-medium relative transition-colors duration-150 py-1 ${
      isActive
        ? "text-[#fe3e91] font-semibold"
        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
    }`, []);

  return (
    <header>
      <nav
        ref={navRef}
        className="fixed top-0 w-full z-25 border-b border-zinc-200/80 bg-white/90 px-4 py-3 backdrop-blur-md
                   transition-colors duration-150 dark:border-zinc-800/90 dark:bg-[#141415]/90 lg:px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center gap-2.5"
            onClick={() => scrollToSection("Overview", "overview")}
          >
            <img
              src={!isDark ? `${publicBaseUrl}Logo/lightLogo.png` : `${publicBaseUrl}Logo/darkLogo.png`}
              alt="Resume Saathi Logo"
              loading="eager"
              fetchPriority="high"
              className="w-8 h-8 rounded-lg object-contain"
            />

            <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Resume <span className="text-[#fe3e91]">Saathi</span>
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center lg:order-2 space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-1.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-600 dark:text-zinc-400"
              aria-label="Toggle Theme"
            >
              {btnTheme === "light" && <Sun size={18} />}
              {btnTheme === "dark" && <Moon size={18} />}
              {btnTheme === "system" && <Laptop size={18} />}
            </button>

            {/* Get Started Button */}
            {!showDashboardNav && (
              <Link
                to={isLoggedIn ? "/dashboard" : "/auth/login"}
                className={`hidden sm:inline-flex ${BUTTON_CLASS}`}
              >
                Get started
              </Link>
            )}

            {/* Logout Button */}
            {isLoggedIn && showDashboardNav && (
              <Logout style={`hidden sm:inline-flex ${BUTTON_CLASS}`} />
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={20} />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Navigation */}
          <div
            className={`w-full transition-all duration-150 lg:order-1 lg:flex lg:w-auto ${
              mobileMenuOpen ? "block mt-4" : "hidden lg:block"
            }`}
          >
            <ul className="flex flex-col items-center lg:flex-row lg:space-x-7 space-y-2 lg:space-y-0">
              {/* Show landing nav items if on root page or not logged in */}
              {!showDashboardNav && navItems.map(({ label, id }) => (
                <li key={label} className="relative w-full lg:w-auto">
                  <button
                    onClick={() => scrollToSection(label, id)}
                    className={getNavItemClass(active === label)}
                  >
                    {label}
                  </button>
                </li>
              ))}

              {/* Show dashboard nav items if logged in and not on root page */}
              {showDashboardNav && dashboardNavItems.map(({ label, path }) => (
                <li key={label} className="relative w-full lg:w-auto">
                  <Link
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={getNavItemClass(location.pathname === path)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Buttons */}
            {mobileMenuOpen && !showDashboardNav && (
              <Link
                to={isLoggedIn ? "/dashboard" : "/auth/login"}
                className={`flex sm:hidden ${BUTTON_CLASS} mt-4 w-full justify-center`}
              >
                Get started
              </Link>
            )}

            {isLoggedIn && mobileMenuOpen && showDashboardNav && (
              <Logout style={`flex sm:hidden ${BUTTON_CLASS} mt-4 w-full justify-center`} />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;