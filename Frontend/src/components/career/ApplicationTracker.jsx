import React from "react";
import {
  Bookmark,
  Send,
  MessageSquare,
  Award,
  Search,
  FileSpreadsheet,
  Globe,
  MapPin,
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
  const tabs = [
    { id: "all", label: "All" },
    { id: "saved", label: "Saved" },
    { id: "applied", label: "Applied" },
    { id: "interviewing", label: "Interviewing" },
    { id: "offered", label: "Offered" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Title + Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Application Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Track official applications from discovery to offer with full source traceability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            {trackedJobs.length} saved
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Total Saved
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-medium text-zinc-900 dark:text-zinc-100">
              {trackedJobs.length}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            <Bookmark className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Applied
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-medium text-[#fe3e91]">
              {trackedJobs.filter((j) => j.status === "applied").length}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-[#fe3e91]/10 text-[#fe3e91]">
            <Send className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Interviewing
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-medium text-amber-600 dark:text-amber-400">
              {trackedJobs.filter((j) => j.status === "interviewing").length}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Offers
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-medium text-emerald-600 dark:text-emerald-400">
              {trackedJobs.filter((j) => j.status === "offered").length}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Award className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => {
            const count =
              tab.id === "all"
                ? trackedJobs.length
                : trackedJobs.filter((j) => j.status === tab.id).length;
            const active = trackerStatusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusTabChange(tab.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  active
                    ? "bg-[#fe3e91] text-white dark:bg-[#fe3e91] dark:text-white shadow-2xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                  active ? "bg-white/20 dark:bg-black/20" : "bg-black/5 dark:bg-white/10"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={trackerSearch}
            onChange={(e) => onTrackerSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
          />
        </div>
      </div>

      {filteredTrackedJobs.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <Bookmark className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            No applications in this view
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Save roles from the openings board to track your pipeline.
          </p>
          <button
            onClick={onGoToOpenings}
            className={`px-4 py-2 rounded-lg text-xs font-medium text-white ${GRADIENT_PRIMARY || "bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac]"} shadow-xs transition-all`}
          >
            Discover openings
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#19191b]">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 text-[11px] font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-200/80 dark:border-zinc-800">
                <tr>
                  <th className="py-3 px-4 font-medium">Role &amp; Company</th>
                  <th className="py-3 px-4 font-medium">Source</th>
                  <th className="py-3 px-4 font-medium">Location</th>
                  <th className="py-3 px-4 font-medium">Match %</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Interview Notes</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredTrackedJobs.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {item.company_name}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-750">
                        <Globe className="w-3 h-3 text-zinc-400" />
                        <span>{item.source_portal || item.source || "Official Portal"}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-xs">
                      {item.location || "Remote / India"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs text-zinc-900 dark:text-zinc-100">
                        {item.match_score || 0}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item._id, e.target.value)}
                        className="text-xs font-normal py-1 px-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400"
                      >
                        <option value="saved">Saved</option>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offered">Offered</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      {editingNotesId === item._id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={noteText}
                            onChange={(e) => onChangeNoteText(e.target.value)}
                            placeholder="Add notes..."
                            className="text-xs px-2 py-1 rounded-md border border-zinc-400 bg-white dark:bg-zinc-900 focus:outline-none text-zinc-900 dark:text-zinc-100"
                          />
                          <button
                            onClick={() => onSaveNotes(item._id)}
                            className="p-1 rounded bg-[#fe3e91] text-white hover:bg-[#e11d48] dark:bg-[#fe3e91]"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={onCancelEditingNote}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => onStartEditingNote(item._id, item.notes || "")}
                          className="text-xs text-zinc-500 dark:text-zinc-400 italic cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 group"
                          title="Click to edit notes"
                        >
                          <span className="line-clamp-1">{item.notes || "Add notes..."}</span>
                          <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <a
                        href={item.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <span>Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => onDeleteTracked(item._id)}
                        className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
                className="p-4 rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      {item.company_name}
                    </span>
                    <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                    {item.match_score || 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location || "Remote / India"}
                  </span>
                  <span className="font-mono text-[11px]">{item.source_portal || item.source || "Official Portal"}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Stage:
                  </label>
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item._id, e.target.value)}
                    className="w-full text-xs font-medium py-1.5 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
                  >
                    <option value="saved">Saved</option>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800 text-xs">
                  {editingNotesId === item._id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => onChangeNoteText(e.target.value)}
                        placeholder="Add notes..."
                        className="flex-1 text-xs px-2 py-1 rounded-md border border-zinc-400 bg-white dark:bg-zinc-900"
                      />
                      <button
                        onClick={() => onSaveNotes(item._id)}
                        className="p-1 rounded bg-[#fe3e91] text-white hover:bg-[#e11d48] dark:bg-[#fe3e91]"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={onCancelEditingNote} className="p-1 text-zinc-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => onStartEditingNote(item._id, item.notes || "")}
                      className="cursor-pointer italic text-zinc-500 dark:text-zinc-400 flex justify-between items-center"
                    >
                      <span className="line-clamp-1">{item.notes || "Add note..."}</span>
                      <Edit3 className="w-3 h-3 text-zinc-400 ml-1 shrink-0" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <a
                    href={item.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-white bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac] shadow-xs transition-all"
                  >
                    <span>Open Application</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => onDeleteTracked(item._id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-zinc-200 dark:border-zinc-800"
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
