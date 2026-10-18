import React from "react";
import {
  Bookmark,
  Rocket,
  Sparkles,
  Award,
  Search,
  FileSpreadsheet,
  Globe,
  MapPin,
  Clock,
  Edit3,
  Check,
  X,
  ExternalLink,
  Trash2,
} from "lucide-react";

export default function ApplicationTracker({
  trackedJobs,
  filteredTrackedJobs,
  trackerStatusTab,
  onStatusTabChange,
  trackerSearch,
  onTrackerSearchChange,
  editingNotesId,
  noteText,
  onStartEditingNote,
  onChangeNoteText,
  onSaveNotes,
  onCancelEditingNote,
  onUpdateStatus,
  onDeleteTracked,
  onExportCSV,
  onGoToOpenings,
  GRADIENT_PRIMARY,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Title + Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Your Application Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track official applications from discovery to offer with full source traceability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-purple-400 shadow-2xs hover:shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">
            {trackedJobs.length} Saved
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Saved
            </span>
            <div className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {trackedJobs.length}
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Applied
            </span>
            <div className="text-xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {trackedJobs.filter((j) => j.status === "applied").length}
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Rocket className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Interviewing
            </span>
            <div className="text-xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {trackedJobs.filter((j) => j.status === "interviewing").length}
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Job Offers
            </span>
            <div className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {trackedJobs.filter((j) => j.status === "offered").length}
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", label: "All" },
            { id: "saved", label: "📌 Saved" },
            { id: "applied", label: "🚀 Applied" },
            { id: "interviewing", label: "💬 Interviewing" },
            { id: "offered", label: "🎉 Offered" },
            { id: "rejected", label: "❌ Rejected" },
          ].map((tab) => {
            const count =
              tab.id === "all"
                ? trackedJobs.length
                : trackedJobs.filter((j) => j.status === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusTabChange(tab.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  trackerStatusTab === tab.id
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={trackerSearch}
            onChange={(e) => onTrackerSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {filteredTrackedJobs.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Applications in this View
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Save roles from the Discover tab to build your interview pipeline.
          </p>
          <button
            onClick={onGoToOpenings}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white ${GRADIENT_PRIMARY} shadow-sm`}
          >
            Discover Openings
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Role & Company</th>
                  <th className="py-3.5 px-4">Found At</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Match %</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Interview Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTrackedJobs.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        {item.company_name}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80">
                        <Globe className="w-3 h-3 text-purple-500" />
                        <span>{item.source_portal || item.source || "Official Portal"}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                      {item.location || "Remote / India"}
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-md text-xs font-black bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                        {item.match_score || 0}%
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item._id, e.target.value)}
                        className="text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="saved">📌 Saved</option>
                        <option value="applied">🚀 Applied</option>
                        <option value="interviewing">💬 Interviewing</option>
                        <option value="offered">🎉 Offered</option>
                        <option value="rejected">❌ Rejected</option>
                      </select>
                    </td>

                    <td className="py-4 px-4">
                      {editingNotesId === item._id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={noteText}
                            onChange={(e) => onChangeNoteText(e.target.value)}
                            placeholder="Add notes..."
                            className="text-xs px-2 py-1 rounded-md border border-purple-400 bg-white dark:bg-slate-800 focus:outline-none text-slate-900 dark:text-white"
                          />
                          <button
                            onClick={() => onSaveNotes(item._id)}
                            className="p-1 rounded bg-purple-600 text-white"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={onCancelEditingNote}
                            className="p-1 rounded text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => onStartEditingNote(item._id, item.notes || "")}
                          className="text-xs text-slate-500 dark:text-slate-400 italic cursor-pointer hover:text-purple-600 flex items-center gap-1 group"
                          title="Click to edit notes"
                        >
                          <span className="line-clamp-1">{item.notes || "Add notes..."}</span>
                          <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right space-x-2">
                      <a
                        href={item.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                      >
                        <span>Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => onDeleteTracked(item._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Stack */}
          <div className="md:hidden space-y-3">
            {filteredTrackedJobs.map((item) => (
              <div
                key={item._id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {item.company_name}
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 shrink-0">
                    {item.match_score || 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location || "Remote / India"}
                  </span>
                  <span>{item.source_portal || item.source || "Official Portal"}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Stage:
                  </label>
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item._id, e.target.value)}
                    className="w-full text-xs font-semibold py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="saved">📌 Saved</option>
                    <option value="applied">🚀 Applied</option>
                    <option value="interviewing">💬 Interviewing</option>
                    <option value="offered">🎉 Offered</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs">
                  {editingNotesId === item._id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => onChangeNoteText(e.target.value)}
                        placeholder="Add notes..."
                        className="flex-1 text-xs px-2 py-1 rounded-md border border-purple-400 bg-white dark:bg-slate-800"
                      />
                      <button
                        onClick={() => onSaveNotes(item._id)}
                        className="p-1 rounded bg-purple-600 text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={onCancelEditingNote} className="p-1 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => onStartEditingNote(item._id, item.notes || "")}
                      className="cursor-pointer italic text-slate-500 dark:text-slate-400 flex justify-between items-center"
                    >
                      <span className="line-clamp-1">{item.notes || "Add note..."}</span>
                      <Edit3 className="w-3 h-3 text-purple-500 ml-1 shrink-0" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={item.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600"
                  >
                    <span>Open Application</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => onDeleteTracked(item._id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
