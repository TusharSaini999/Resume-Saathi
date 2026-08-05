import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { SERVER_URL } from "../../constants/envConfig";
import ScrollReveal from "../ScrollReveal";

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
      setStatusMessage(res.data?.message || "Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setIsSuccess(false);
      setStatusMessage(error.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="support"
      className="scroll-mt-28 relative bg-white dark:bg-[#111827] py-20 pb-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-3xl border border-[#E5E7EB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-[#1F2937] p-8 md:p-10 lg:p-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side: Content */}
            <div className="text-left">
              <p className="text-sm font-bold uppercase tracking-widest text-[#FE3E91]">
                Support
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-black text-[#1E293B] dark:text-white leading-tight">
                Need Help With
                <br className="hidden lg:block" />
                <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
                  {" "}Resume Optimization?
                </span>
              </h2>

              <p className="mt-4 text-base md:text-lg text-[#64748B] dark:text-[#94A3B8]">
                Our team is here to support product questions, scoring clarifications,
                and resume improvement guidance.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <ScrollReveal delay={0}>
                  <article className="rounded-xl border border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827] p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FE3E91]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
                    <h3 className="text-base font-bold text-[#1E293B] dark:text-white">
                      Realtime Chatbot Support
                    </h3>
                    <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                      Get instant AI help for resume analysis, section improvements,
                      and scoring clarification while editing.
                    </p>
                  </article>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <article className="rounded-xl border border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827] p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FE3E91]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
                    <h3 className="text-base font-bold text-[#1E293B] dark:text-white">
                      Account & Session Security
                    </h3>
                    <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                      Protect your privacy with IP-tracked session management and secure OAuth logins across devices.
                    </p>
                  </article>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <article className="rounded-xl border border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827] p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FE3E91]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
                    <h3 className="text-base font-bold text-[#1E293B] dark:text-white">
                      Resume ATS Analyzer
                    </h3>
                    <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                      Check ATS score, keyword gaps, and structure quality to increase
                      resume shortlist chances.
                    </p>
                  </article>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                  <article className="rounded-xl border border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827] p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FE3E91]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
                    <h3 className="text-base font-bold text-[#1E293B] dark:text-white">
                      Job Description Matcher
                    </h3>
                    <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                      Match your resume with job descriptions to find missing
                      requirements and improve role relevance.
                    </p>
                  </article>
                </ScrollReveal>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#374151] p-6 md:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none text-left h-fit w-full">
              <h3 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-6">Send us a message</h3>
              {statusMessage && (
                <div className={`p-4 rounded-lg mb-6 ${isSuccess ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {statusMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input type="text" id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CA25AF] focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input type="email" id="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CA25AF] focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <input type="text" id="subject" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CA25AF] focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea id="message" required rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CA25AF] focus:border-transparent outline-none transition-all resize-none"></textarea>
                </div>
                <button disabled={loading} type="submit" className="w-full mt-4 px-6 py-3.5 font-semibold rounded-xl text-white bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] dark:from-[#FF5FA7] dark:via-[#D340BD] dark:to-[#9D65D5] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Message"}
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