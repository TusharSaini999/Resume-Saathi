import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import careerService from "../services/careerService";

export const fetchCompaniesThunk = createAsyncThunk(
  "career/fetchCompanies",
  async (_, { rejectWithValue }) => {
    const res = await careerService.getCompanies();
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const fetchCareerJobsThunk = createAsyncThunk(
  "career/fetchCareerJobs",
  async (params, { rejectWithValue }) => {
    const res = await careerService.getCareerJobs(params);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const fetchTrackedJobsThunk = createAsyncThunk(
  "career/fetchTrackedJobs",
  async (_, { rejectWithValue }) => {
    const res = await careerService.getTrackedJobs();
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const trackJobThunk = createAsyncThunk(
  "career/trackJob",
  async (jobData, { rejectWithValue }) => {
    const res = await careerService.trackJob(jobData);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const updateTrackedStatusThunk = createAsyncThunk(
  "career/updateTrackedStatus",
  async ({ id, data }, { rejectWithValue }) => {
    const res = await careerService.updateTrackedStatus(id, data);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const deleteTrackedJobThunk = createAsyncThunk(
  "career/deleteTrackedJob",
  async (id, { rejectWithValue }) => {
    const res = await careerService.deleteTrackedJob(id);
    if (!res.success) return rejectWithValue(res.message);
    return id;
  }
);

export const purgeCacheThunk = createAsyncThunk(
  "career/purgeCache",
  async (_, { rejectWithValue }) => {
    const res = await careerService.purgeCache();
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const scanCompanyPortalThunk = createAsyncThunk(
  "career/scanCompanyPortal",
  async (params, { rejectWithValue }) => {
    const res = await careerService.scanCompanyPortal(params);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const postJobProfileThunk = createAsyncThunk(
  "career/postJobProfile",
  async (jobData, { rejectWithValue }) => {
    const res = await careerService.postJobProfile(jobData);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

const initialState = {
  companies: [],
  categories: [],
  jobs: [],
  totalJobs: 0,
  candidateProfile: {
    isFresher: false,
    experienceYears: 0,
    experienceLevel: "Fresher / Entry-Level (0-1 yr)",
    track: {
      id: "tech",
      label: "Tech & Engineering",
      icon: "💻",
    },
    primaryStream: {
      id: "all",
      label: "All Career Domains",
      icon: "🌐",
    },
    secondaryStream: null,
    streamScores: [],
    skillsCount: 0,
    skills: [],
    inferredStacks: [],
    primaryInferredStack: null,
    derivedRoleTitles: [],
    derivedSearchKeywords: [],
    stackExplanationBullets: [],
  },
  availableTracks: [],
  availableStreams: [],
  candidateSkillsDetected: [],
  hasResume: false,
  trackedJobs: [],
  selectedCompany: "",
  roleFilter: "",
  trackFilter: "All", // "All" | "my_track" | "tech" | "management"
  streamFilter: "All", // "All" | "my_stream" | specific stream id
  employmentTypeFilter: "All", // "All" | "Internship" | "Full-time"
  experienceLevelFilter: "All", // "All" | "Fresher" | "Junior" | "Mid" | "Senior"
  fresherOnlyFilter: false,
  minScoreFilter: 0,
  categoryFilter: "All",
  locationFilter: "All", // "All" | "Remote" | "Bengaluru" | "Hyderabad" | "Pune" | "Delhi NCR" | "Mumbai" | "Chennai" | etc.
  countryFilter: "India", // "All" | "India" | "United States" | "United Kingdom" | "Canada" | "Germany" | "Singapore" | "Remote"
  availableCountries: [],
  realOnlyFilter: true, // Guarantees real verified openings only
  portalSourceFilter: "All", // "All" | "official" | "linkedin" | "third_party"
  portalCounts: { all: 0, official: 0, linkedin: 0, third_party: 0 },
  scannedAt: null,
  isLiveScan: false,
  scanTelemetry: null,
  activeTrack: "All",
  isAutoDomainMatched: false,
  strictAiOnlyFilter: false,
  isAiDeepMatched: false,
  strictAiOnlyActive: false,
  portalScanLoading: false,
  portalScanResults: null,
  loading: false,
  trackingLoading: false,
  error: null,
};

const careerSlice = createSlice({
  name: "career",
  initialState,
  reducers: {
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
    setRoleFilter: (state, action) => {
      state.roleFilter = action.payload;
    },
    setTrackFilter: (state, action) => {
      state.trackFilter = action.payload;
    },
    setStreamFilter: (state, action) => {
      state.streamFilter = action.payload;
    },
    setEmploymentTypeFilter: (state, action) => {
      state.employmentTypeFilter = action.payload;
    },
    setExperienceLevelFilter: (state, action) => {
      state.experienceLevelFilter = action.payload;
    },
    setFresherOnlyFilter: (state, action) => {
      state.fresherOnlyFilter = action.payload;
    },
    setLocationFilter: (state, action) => {
      state.locationFilter = action.payload;
    },
    setCountryFilter: (state, action) => {
      state.countryFilter = action.payload;
    },
    setMinScoreFilter: (state, action) => {
      state.minScoreFilter = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setStrictAiOnlyFilter: (state, action) => {
      state.strictAiOnlyFilter = action.payload;
    },
    setRealOnlyFilter: (state, action) => {
      state.realOnlyFilter = action.payload;
    },
    setPortalSourceFilter: (state, action) => {
      state.portalSourceFilter = action.payload;
    },
    clearFilters: (state) => {
      state.selectedCompany = "";
      state.roleFilter = "";
      state.trackFilter = "All";
      state.streamFilter = "All";
      state.employmentTypeFilter = "All";
      state.experienceLevelFilter = "All";
      state.locationFilter = "All";
      state.countryFilter = "India";
      state.portalSourceFilter = "All";
      state.fresherOnlyFilter = false;
      state.strictAiOnlyFilter = false;
      state.realOnlyFilter = true;
      state.minScoreFilter = 0;
    },
  },
  extraReducers: (builder) => {
    // Companies
    builder.addCase(fetchCompaniesThunk.fulfilled, (state, action) => {
      state.companies = action.payload.companies || [];
      state.categories = action.payload.categories || [];
    });

    // Career Jobs
    builder
      .addCase(fetchCareerJobsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCareerJobsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs || [];
        state.totalJobs = action.payload.totalJobs || 0;
        if (action.payload.portalCounts) {
          state.portalCounts = action.payload.portalCounts;
        }
        state.availableTracks = action.payload.availableTracks || [];
        state.availableStreams = action.payload.availableStreams || [];
        state.availableCountries = action.payload.availableCountries || [];
        if (action.payload.activeCountry) {
          state.countryFilter = action.payload.activeCountry;
        }
        state.candidateProfile = action.payload.candidateProfile || {
          isFresher: false,
          experienceYears: 0,
          experienceLevel: "Fresher / Entry-Level (0-1 yr)",
          track: {
            id: "tech",
            label: "Tech & Engineering",
            icon: "💻",
          },
          primaryStream: {
            id: "all",
            label: "All Career Domains",
            icon: "🌐",
          },
          secondaryStream: null,
          streamScores: [],
          skillsCount: 0,
          skills: [],
        };
        state.candidateSkillsDetected = action.payload.candidateProfile?.skills || [];
        state.hasResume = action.payload.hasResume || false;
        state.scannedAt = action.payload.scannedAt || new Date().toISOString();
        state.isLiveScan = Boolean(action.payload.isLiveScan);
        state.scanTelemetry = action.payload.scanTelemetry || null;
        state.activeTrack = action.payload.activeTrack || "All";
        state.isAutoDomainMatched = Boolean(action.payload.isAutoDomainMatched);
        state.isAiDeepMatched = Boolean(action.payload.isAiDeepMatched);
        state.strictAiOnlyActive = Boolean(action.payload.strictAiOnlyActive);
        if (action.payload.isAutoDomainMatched && action.payload.candidateProfile?.track?.id) {
          if (state.trackFilter === "All" || state.trackFilter === "my_track") {
            state.trackFilter = action.payload.candidateProfile.track.id;
          }
        }
      })
      .addCase(fetchCareerJobsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load jobs";
      });

    // Purge Cache
    builder.addCase(purgeCacheThunk.fulfilled, (state) => {
      state.jobs = [];
      state.totalJobs = 0;
      state.scannedAt = null;
    });

    // Tracked Jobs
    builder.addCase(fetchTrackedJobsThunk.fulfilled, (state, action) => {
      state.trackedJobs = action.payload || [];
    });

    builder.addCase(trackJobThunk.fulfilled, (state, action) => {
      const existingIdx = state.trackedJobs.findIndex((j) => j._id === action.payload._id);
      if (existingIdx !== -1) {
        state.trackedJobs[existingIdx] = action.payload;
      } else {
        state.trackedJobs.unshift(action.payload);
      }
    });

    builder.addCase(updateTrackedStatusThunk.fulfilled, (state, action) => {
      const idx = state.trackedJobs.findIndex((j) => j._id === action.payload._id);
      if (idx !== -1) {
        state.trackedJobs[idx] = action.payload;
      }
    });

    builder.addCase(deleteTrackedJobThunk.fulfilled, (state, action) => {
      state.trackedJobs = state.trackedJobs.filter((j) => j._id !== action.payload);
    });

    // Scan Company Original Portal
    builder
      .addCase(scanCompanyPortalThunk.pending, (state) => {
        state.portalScanLoading = true;
      })
      .addCase(scanCompanyPortalThunk.fulfilled, (state, action) => {
        state.portalScanLoading = false;
        state.portalScanResults = action.payload;
        if (action.payload?.jobs?.length) {
          const existingIds = new Set(state.jobs.map((j) => j.id || j.externalId));
          const newJobs = action.payload.jobs.filter((j) => !existingIds.has(j.id || j.externalId));
          state.jobs = [...newJobs, ...state.jobs];
          state.totalJobs = state.jobs.length;
        }
      })
      .addCase(scanCompanyPortalThunk.rejected, (state, action) => {
        state.portalScanLoading = false;
        state.error = action.payload;
      })
      // Post Job Profile
      .addCase(postJobProfileThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const newJob = action.payload;
          const existingIds = new Set(state.jobs.map((j) => j.id || j.externalId));
          if (!existingIds.has(newJob.id || newJob.externalId)) {
            state.jobs = [newJob, ...state.jobs];
            state.totalJobs += 1;
          }
        }
      });
  },
});

export const {
  setSelectedCompany,
  setRoleFilter,
  setTrackFilter,
  setStreamFilter,
  setEmploymentTypeFilter,
  setExperienceLevelFilter,
  setFresherOnlyFilter,
  setLocationFilter,
  setCountryFilter,
  setMinScoreFilter,
  setCategoryFilter,
  setStrictAiOnlyFilter,
  setRealOnlyFilter,
  setPortalSourceFilter,
  clearFilters,
} = careerSlice.actions;

export default careerSlice.reducer;
