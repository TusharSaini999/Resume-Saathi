import { X, Sun, Moon, Laptop } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../../context/themeSlice";
import { Link } from "react-router";

const navItems = [
  { label: "Overview", id: "overview" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Features", id: "features" },
  { label: "ATS Tips", id: "ats-tips" },
  { label: "About", id: "about" },
  { label: "Support", id: "support" },
];

const ACTIVE_SECTION_STORAGE_KEY = "activeSection";
const THEME_STORAGE_KEY = "theme";

const getStoredActiveSection = () => {
  const stored = localStorage.getItem(ACTIVE_SECTION_STORAGE_KEY);
  return navItems.some((item) => item.label === stored) ? stored : null;
};

const Header = () => {
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState(() => getStoredActiveSection() || navItems[0].label);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const [btnTheme, setBtnTheme] = useState(
    localStorage.getItem(THEME_STORAGE_KEY) || "system"
  );
  const isDark = useSelector((state) => state.theme.isDark);
  const isClickScrolling = useRef(false);
  const clickScrollTimer = useRef(null);
  const navRef = useRef(null);

  const scrollToSection = (label, sectionId) => {
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
  };
  const applyTheme = () => {
    if (btnTheme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add("dark");
        dispatch(setTheme({ theme: btnTheme, isDark: true }));
      } else {
        document.documentElement.classList.remove("dark");
        dispatch(setTheme({ theme: btnTheme, isDark: false }));
      }
    } else if (btnTheme === "light") {
      document.documentElement.classList.remove("dark");
      dispatch(setTheme({ theme: btnTheme, isDark: false }));
    } else if (btnTheme === "dark") {
      dispatch(setTheme({ theme: btnTheme, isDark: true }));
      document.documentElement.classList.add("dark");
    }
  };

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    applyTheme();

    const handleChange = () => {
      if (btnTheme === "system") {
        applyTheme();
      }
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [btnTheme]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, btnTheme);
  }, [btnTheme]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_SECTION_STORAGE_KEY, active);
  }, [active]);

  useEffect(() => {
    const storedActiveSection = getStoredActiveSection();
    if (!storedActiveSection || storedActiveSection === navItems[0].label) {
      return;
    }

    const targetItem = navItems.find((item) => item.label === storedActiveSection);
    if (!targetItem) {
      return;
    }

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
        retryTimer = setTimeout(() => {
          scrollToStoredSection(remainingAttempts - 1);
        }, 120);
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
      if (isClickScrolling.current) {
        return;
      }

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
    if (!mobileMenuOpen) {
      return undefined;
    }

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

  const getNavItemClass = (item) =>
    `w-full lg:w-auto text-center text-sm font-bold uppercase tracking-wider relative
     transition-colors duration-300 py-1 ${active === item
      ? "text-[#fe3e91] dark:text-[#ff5fa7]"
      : "text-[#475569] dark:text-[#ffffff] hover:text-[#ff66a8] hover:dark:text-[#fa7db3]"
    }`;

  return (
    <>
      <header>
        <nav
          ref={navRef}
          className="fixed top-0 w-full z-20 border-b border-[#E5E7EB] bg-white/80 px-4 py-3 backdrop-blur-md
                     transition-colors duration-300 dark:border-[#374151] dark:bg-[#111827] lg:px-6"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
            {/* Logo */}
            <div
              className="group flex cursor-pointer items-center"
              onClick={() => scrollToSection("Overview", "overview")}
            >
              <img
                src={!isDark ? "./Logo/lightLogo.png" : "./Logo/darkLogo.png"}
                alt="ResumeSaathi Logo"
                className="w-10 h-10 mr-2 rounded-2xl border-2 border-[#fe3e91] shadow-lg shadow-pink-500/20
                           transition-transform duration-500 transform group-hover:rotate-12 group-hover:scale-110"
              />

              <span className="text-xl font-black tracking-tight text-[#1E293B] dark:text-white
                               transition-transform duration-500 group-hover:translate-x-1 group-hover:scale-105">
                Resume
                <span className="bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] 
                                 bg-clip-text text-transparent 
                                 dark:from-[#ff5fa7] dark:via-[#d340bd] dark:to-[#9d65d5]">
                  Saathi
                </span>
              </span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center lg:order-2 space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={() => {
                  if (btnTheme === "system") {
                    setBtnTheme("light");
                  } else if (btnTheme === "light") {
                    setBtnTheme("dark");
                  } else if (btnTheme === "dark") {
                    setBtnTheme("system");
                  }
                }}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400"
                aria-label="Toggle Theme"
              >
                {btnTheme === "light" && <Sun size={20} className="text-gray-600 dark:text-white" />}
                {btnTheme === "dark" && <Moon size={20} className="text-gray-600 dark:text-white" />}
                {btnTheme === "system" && <Laptop size={20} className="text-gray-600 dark:text-white" />}
              </button>

              {/* Get Started Button */}
              <Link
                to="/auth/login"
                className="hidden sm:inline-block items-center justify-center
  w-full sm:w-auto
  px-5 sm:px-6 py-2.5 sm:py-3
  text-sm sm:text-base font-bold text-white
  rounded-xl
  bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1]
  dark:from-[#ff5fa7] dark:via-[#d340bd] dark:to-[#9d65d5]
  hover:scale-105 active:scale-95
  shadow-lg shadow-purple-500/25
  transition-all"
              >
                Get Started
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-[#64748B] dark:text-[#94A3B8]"
              >
                {mobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className={`w-full transition-all duration-300 lg:order-1 lg:flex lg:w-auto ${mobileMenuOpen ? "block mt-4" : "hidden lg:block"
                }`}
            >
              <ul className="flex flex-col items-center lg:flex-row lg:space-x-8 space-y-2 lg:space-y-0">
                {navItems.map(({ label, id }) => (
                  <li key={label} className="relative w-full lg:w-auto">
                    <button
                      onClick={() => scrollToSection(label, id)}
                      className={getNavItemClass(label)}
                    >
                      {label}
                      {!mobileMenuOpen && (
                        <span className={`absolute left-0 -bottom-1 w-full h-0.5 rounded-full
                        bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1]
                        dark:from-[#ff5fa7] dark:via-[#d340bd] dark:to-[#9d65d5]
                        transition-all duration-300 ${active === label ? "scale-x-100" : "scale-x-0"
                          } origin-left`}
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              {mobileMenuOpen && (
                <Link
                  to="/auth/login"
                  className="flex sm:hidden items-center justify-center
    w-full sm:w-auto
    px-5 sm:px-6 py-2.5 sm:py-3
    text-sm sm:text-base font-bold text-white
    rounded-xl
    bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1]
    dark:from-[#ff5fa7] dark:via-[#d340bd] dark:to-[#9d65d5]
    hover:scale-105 active:scale-95
    shadow-lg shadow-purple-500/25
    transition-all"
                >
                  Get Started
                </Link>
              )}

            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;