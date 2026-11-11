import { useState } from "react";
import axios from "axios";
import { Loader2, Mail } from "lucide-react";
import { SERVER_URL } from "../../constants/envConfig";
import ScrollReveal from "../ScrollReveal";
import { BUTTON_CLASS } from "../../constants/style";

const Support = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");
    try {
      const res = await axios.post(`${SERVER_URL}/contact`, formData);
      setIsSuccess(true);
      setStatusMessage(res.data?.message || "Message sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setIsSuccess(false);
      setStatusMessage(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="support"
      className="scroll-mt-28 relative bg-[#fafafa] dark:bg-[#141415] py-20 border-t border-zinc-200/80 dark:border-zinc-800/80"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#19191b] p-6 sm:p-8 md:p-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Side: Information */}
            <div className="lg:col-span-5">
              <p className="text-xs font-mono font-medium text-[#fe3e91]">
                Support &amp; feedback
              </p>

              <h2 className="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Have questions or need assistance?
              </h2>

              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Whether you have suggestions for new parser formats, need assistance reviewing your match score, or want to report an ATS feed update, our team is available to assist.
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                <Mail size={14} className="text-[#fe3e91]" />
                <span>support@resumesaathi.tusharsaini.tech</span>
              </div>
            </div>

            {/* Right Side: Clean Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Your name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#fe3e91] dark:focus:border-[#fe3e91] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#fe3e91] dark:focus:border-[#fe3e91] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ATS parser feedback or issue"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#fe3e91] dark:focus:border-[#fe3e91] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry or feedback..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#fe3e91] dark:focus:border-[#fe3e91] transition-colors"
                  ></textarea>
                </div>

                {statusMessage && (
                  <div
                    className={`p-3 rounded-lg text-xs font-medium ${
                      isSuccess
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                        : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800/60"
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`${BUTTON_CLASS} w-full sm:w-auto`}
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  <span>{loading ? "Sending..." : "Submit message"}</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Support;
