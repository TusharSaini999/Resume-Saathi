import { useEffect, useRef, useState } from "react";

/**
 * ScrollReveal — animates its children (scale-up + fade-in) the first time
 * they enter the viewport via IntersectionObserver.
 *
 * Props:
 *   delay  — stagger delay in ms (default: 0)
 *   as     — HTML tag to render as (default: "div")
 *   className — extra classes forwarded to the wrapper element
 */
const ScrollReveal = ({ children, delay = 0, as: Tag = "div", className = "" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-6 scale-95"
      } ${className}`}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
