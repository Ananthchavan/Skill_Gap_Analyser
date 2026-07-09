import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Link2,
  Upload,
  FileText,
  Briefcase,
  Clock,
  ChevronRight,
  X,
  Loader2,
  Target,
  BookOpen,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Slider } from '../components/ui/slider'

/* ─────────────── small reusable helpers ─────────────── */

function SectionHeader({ icon: Icon, label, step }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0">
        {step}
      </div>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {label}
        </h2>
      </div>
    </div>
  )
}

function FieldLabel({ htmlFor, children, required }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
    >
      {children}
      {required && <span className="ml-1 text-indigo-500">*</span>}
    </label>
  )
}

function InputWrapper({ children }) {
  return <div className="relative">{children}</div>
}

const inputClass =
  'w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 ' +
  'px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 ' +
  'transition-all shadow-sm'

export default function NewAnalysis() {
  const navigate = useNavigate()
  const [targetRole, setTargetRole] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [studyHours, setStudyHours] = useState([10])
  const [weeksDuration, setWeeksDuration] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [successData, setSuccessData] = useState(null)
  const [selfAttestedSkills, setSelfAttestedSkills] = useState([])
  const [showAllSkills, setShowAllSkills] = useState(false)

  const SKILL_TIERS = {
    entry: [
      'Agile / Scrum Methodologies & Sprint Planning',
      'Testing Methodologies (TDD, BDD, E2E Testing with Cypress/Playwright)',
      'Technical Documentation & Technical Writing (Architecture Decision Records)',
      'Cloud Platforms (AWS, GCP, Azure)'
    ],
    junior: [
      'CI/CD Pipelines & Automation (GitHub Actions, Jenkins)',
      'API Design & Documentation (OpenAPI/Swagger, GraphQL Schemas)',
      'Application Security Best Practices (OWASP Top 10, OAuth, Encryption)'
    ],
    mid: [
      'Containerization & Orchestration (Docker, Kubernetes)',
      'Database Optimization & Data Modeling (Indexing, Sharding)',
      'Performance Optimization (Caching Strategies, Lazy Loading, CDN Configuration)'
    ],
    senior: [
      'System Design & Microservices Architecture',
      'Team Leadership, Mentoring & Code Review Workflows'
    ]
  }

  const fileInputRef = useRef(null)

  useEffect(() => {
    fetch('http://localhost:8080/api/current_user', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (user?.profileUrl) setGithubUrl(user.profileUrl)
      })
      .catch(() => { })
  }, [])

  /* ── drag & drop handlers ── */
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = useCallback((file) => {
    if (!file) return
    if (file.type !== 'application/pdf') {
      setErrors((p) => ({ ...p, resume: 'Only PDF files are allowed.' }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, resume: 'File must be under 5 MB.' }))
      return
    }
    setErrors((p) => ({ ...p, resume: undefined }))
    setResumeFile(file)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      processFile(e.dataTransfer.files[0])
    },
    [processFile]
  )

  const handleFileChange = useCallback(
    (e) => {
      processFile(e.target.files[0])
    },
    [processFile]
  )

  /* ── validation & submit ── */
  const validate = () => {
    const e = {}
    if (!targetRole.trim()) e.targetRole = 'Target role is required.'
    if (!experienceLevel) e.experienceLevel = 'Please select your experience level.'
    if (!jobDescription.trim()) e.jobDescription = 'Please paste the job description.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setIsSubmitting(true)

    /* Build multipart/form-data */
    const fd = new FormData()
    fd.append('targetRole', targetRole)
    fd.append('experienceLevel', experienceLevel)
    fd.append('githubUrl', githubUrl)
    fd.append('jobDescription', jobDescription)
    fd.append('studyHours', studyHours[0])
    fd.append('weeksDuration', weeksDuration)
    if (resumeFile) fd.append('resume', resumeFile)

    fd.append('selfAttestedSkills', JSON.stringify(selfAttestedSkills))

    try {
      const res = await fetch('http://localhost:8080/api/analysis/new', {
        method: 'POST',
        body: fd,
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      setSuccessData({ analysisId: data.analysisId });
      setTimeout(() => navigate('/dashboard'), 2500)
    } catch (err) {
      setErrors({ form: 'Something went wrong. Please try again once the backend is connected.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  let visibleSkills = []
  if (showAllSkills || !experienceLevel) {
    visibleSkills = [
      ...SKILL_TIERS.entry, ...SKILL_TIERS.junior, ...SKILL_TIERS.mid, ...SKILL_TIERS.senior
    ]
  } else {
    visibleSkills = [...SKILL_TIERS.entry]
    if (['junior', 'mid', 'senior'].includes(experienceLevel)) visibleSkills.push(...SKILL_TIERS.junior)
    if (['mid', 'senior'].includes(experienceLevel)) visibleSkills.push(...SKILL_TIERS.mid)
    if (experienceLevel === 'senior') visibleSkills.push(...SKILL_TIERS.senior)
  }

  return (
    <>
      {/* ── Success Modal ── */}
      {successData && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* card */}
          <div
            className="
            relative z-10 w-full max-w-sm rounded-2xl
            bg-white dark:bg-slate-900
            border border-gray-100 dark:border-slate-700
            shadow-2xl shadow-indigo-500/10
            p-8 flex flex-col items-center text-center
            animate-[fadeSlideUp_0.35s_ease-out]
          "
            style={{
              animation: 'fadeSlideUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            {/* animated check ring */}
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-400/30">
                <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              {/* pulse ring */}
              <span className="absolute inset-0 rounded-full bg-indigo-400/20 animate-ping" style={{ animationDuration: '1.4s' }} />
            </div>

            <h2 id="success-title" className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Analysis Submitted!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-1">
              Your roadmap is being generated.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
              Redirecting you to the dashboard…
            </p>

            {/* progress bar */}
            <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                style={{ animation: 'progressBar 2.5s linear both' }}
              />
            </div>

            <button
              id="go-to-dashboard-btn"
              onClick={() => navigate(`/dashboard/${successData.analysisId}`)}
              className="
              inline-flex items-center gap-2 px-6 py-2.5
              bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600
              text-white text-sm font-semibold rounded-xl
              shadow-md shadow-indigo-400/20
              transition-all duration-200 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            "
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* keyframe styles injected inline */}
          <style>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0)    scale(1);    }
          }
          @keyframes progressBar {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
        </div>
      )}
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
        <Navbar />

        {/* page header */}
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-3">
            <span>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">New Analysis</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Start a New Analysis
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
            Fill in the details below and we'll generate a personalised 30-day skill-gap roadmap
            tailored to your target role.
          </p>
        </div>

        {/* form card */}
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          noValidate
          className="max-w-3xl mx-auto px-4 pb-20"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">

            {/* ═══════════════ SECTION 1: CAREER GOALS ═══════════════ */}
            <div className="px-8 pt-8 pb-6">
              <SectionHeader icon={Target} label="Career Goals" step="1" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Target Role */}
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="targetRole" required>
                    Target Role
                  </FieldLabel>
                  <InputWrapper>
                    <input
                      id="targetRole"
                      type="text"
                      value={targetRole}
                      onChange={(e) => {
                        setTargetRole(e.target.value)
                        setErrors((p) => ({ ...p, targetRole: undefined }))
                      }}
                      placeholder="e.g. Senior Frontend Developer"
                      className={`${inputClass} ${errors.targetRole ? 'border-red-400 focus:border-red-400 focus:ring-red-300/40' : ''}`}
                      aria-describedby={errors.targetRole ? 'targetRole-error' : undefined}
                    />
                  </InputWrapper>
                  {errors.targetRole && (
                    <p id="targetRole-error" className="mt-1.5 text-xs text-red-500">
                      {errors.targetRole}
                    </p>
                  )}
                </div>

                {/* Experience Level */}
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="experienceLevel" required>
                    Current Experience Level
                  </FieldLabel>
                  <Select
                    value={experienceLevel}
                    onValueChange={(v) => {
                      setExperienceLevel(v)
                      setErrors((p) => ({ ...p, experienceLevel: undefined }))
                    }}
                  >
                    <SelectTrigger
                      id="experienceLevel"
                      className={`
                      w-full h-10 rounded-xl border bg-white dark:bg-slate-900 text-sm
                      text-slate-900 dark:text-slate-100 shadow-sm
                      focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
                      ${errors.experienceLevel
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-300/40'
                          : 'border-gray-200 dark:border-slate-700'}
                    `}
                      aria-describedby={errors.experienceLevel ? 'exp-error' : undefined}
                    >
                      <SelectValue placeholder="Select your experience level…" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50">
                      <SelectItem value="entry" className="text-sm text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer rounded-lg">
                        Entry-Level (0–1 yrs)
                      </SelectItem>
                      <SelectItem value="junior" className="text-sm text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer rounded-lg">
                        Junior (1–3 yrs)
                      </SelectItem>
                      <SelectItem value="mid" className="text-sm text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer rounded-lg">
                        Mid-Level (3–5 yrs)
                      </SelectItem>
                      <SelectItem value="senior" className="text-sm text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer rounded-lg">
                        Senior (5+ yrs)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.experienceLevel && (
                    <p id="exp-error" className="mt-1.5 text-xs text-red-500">
                      {errors.experienceLevel}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Divider />

            {/* ═══════════════ SECTION 2: BASELINE SKILLS ═══════════════ */}
            <div className="px-8 py-6">
              <SectionHeader icon={BookOpen} label="Baseline Skills" step="2" />

              {/* GitHub URL */}
              <div className="mb-5">
                <FieldLabel htmlFor="githubUrl">GitHub Profile URL</FieldLabel>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Link2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="githubUrl"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-username"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <FieldLabel htmlFor="resumeUpload">Resume Upload</FieldLabel>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload resume PDF"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  className={`
                  relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed
                  px-6 py-10 cursor-pointer transition-all duration-200 select-none
                  ${isDragging
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.01]'
                      : resumeFile
                        ? 'border-green-400 bg-green-50 dark:bg-green-900/10'
                        : 'border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'}
                `}
                >
                  <input
                    ref={fileInputRef}
                    id="resumeUpload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {resumeFile ? (
                    <>
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30">
                        <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {(resumeFile.size / 1024).toFixed(0)} KB · PDF
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setResumeFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors
                        ${isDragging
                            ? 'bg-indigo-100 dark:bg-indigo-900/40'
                            : 'bg-gray-100 dark:bg-slate-700'}`}
                      >
                        <Upload
                          className={`w-6 h-6 transition-colors
                          ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span className="text-indigo-600 dark:text-indigo-400">Click to upload</span>{' '}
                          or drag & drop
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          PDF only · Max 5 MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {errors.resume && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.resume}</p>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                <div className="flex justify-between items-end mb-3">
                  <FieldLabel htmlFor="unscrapableSkills">
                    Self-Attested Skills (Optional)
                  </FieldLabel>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  AI cannot reliably detect certain workflow or infrastructure skills just from reading code files. Select any skills you possess below so the AI does not falsely mark them as "Missing".
                </p>

                <div className="flex flex-wrap gap-2.5 transition-all">
                  {visibleSkills.map((skill) => {
                    const isSelected = selfAttestedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => {
                          setSelfAttestedSkills(prev =>
                            isSelected
                              ? prev.filter(s => s !== skill)
                              : [...prev, skill]
                          )
                        }}
                        className={`
                          px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                          ${isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300 shadow-sm'
                            : 'bg-white border-gray-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/50'
                          }
                        `}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />}
                        {skill}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <Divider />

            {/* ═══════════════ SECTION 3: BENCHMARK ═══════════════ */}
            <div className="px-8 py-6">
              <SectionHeader icon={Briefcase} label="The Benchmark" step="3" />

              <div>
                <FieldLabel htmlFor="jobDescription" required>
                  Company Requirements / Job Description
                </FieldLabel>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value)
                    setErrors((p) => ({ ...p, jobDescription: undefined }))
                  }}
                  rows={8}
                  placeholder="Paste the full job description here — requirements, responsibilities, tech stack, etc."
                  className={`${inputClass} resize-none leading-relaxed ${errors.jobDescription
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-300/40'
                    : ''
                    }`}
                  aria-describedby={errors.jobDescription ? 'jd-error' : undefined}
                />
                <div className="flex items-center justify-between mt-1.5">
                  {errors.jobDescription ? (
                    <p id="jd-error" className="text-xs text-red-500">
                      {errors.jobDescription}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
                    {jobDescription.length} chars
                  </span>
                </div>
              </div>
            </div>

            <Divider />

            {/* ═══════════════ SECTION 4: CONSTRAINTS ═══════════════ */}
            <div className="px-8 py-6">
              <SectionHeader icon={Clock} label="Constraints" step="4" />

              {/* ── Study Timeline ── */}
              <div className="mb-8">
                <FieldLabel htmlFor="weeksDuration">
                  Study Timeline
                </FieldLabel>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 -mt-0.5">
                  Choose a duration that matches your current skill gap and urgency.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="weeksDuration">
                  {[
                    {
                      weeks: 2,
                      label: '2 Weeks',
                      badge: 'Crash Course',
                      color: 'amber',
                      description:
                        'Already have ~80% of the skills? Use this rapid sprint to polish up for an upcoming interview or immediate project.',
                    },
                    {
                      weeks: 4,
                      label: '4 Weeks',
                      badge: 'Standard · 1 Month',
                      color: 'indigo',
                      description:
                        'The baseline plan. Ideal for learning one or two missing core technologies (e.g. Express + MongoDB) from scratch.',
                    },
                    {
                      weeks: 8,
                      label: '8 Weeks',
                      badge: 'Deep Dive · 2 Months',
                      color: 'violet',
                      description:
                        'Best for slight career pivots (e.g. Frontend → Full-Stack) with time to build a portfolio project alongside learning.',
                    },
                    {
                      weeks: 12,
                      label: '12 Weeks',
                      badge: 'Comprehensive · 3 Months',
                      color: 'rose',
                      description:
                        'Mimics a standard bootcamp timeline. For large skill gaps — Junior → Senior or complete beginner → Junior.',
                    },
                  ].map(({ weeks, label, badge, color, description }) => {
                    const isSelected = weeksDuration === String(weeks)
                    const colorMap = {
                      amber: {
                        border: isSelected ? 'border-amber-500' : 'border-gray-200 dark:border-slate-700',
                        bg: isSelected ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-white dark:bg-slate-800/60',
                        badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
                        ring: 'focus-visible:ring-amber-400',
                        dot: isSelected ? 'bg-amber-500' : 'bg-gray-300 dark:bg-slate-600',
                        weeks: isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-100',
                      },
                      indigo: {
                        border: isSelected ? 'border-indigo-500' : 'border-gray-200 dark:border-slate-700',
                        bg: isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-slate-800/60',
                        badge: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
                        ring: 'focus-visible:ring-indigo-400',
                        dot: isSelected ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-slate-600',
                        weeks: isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-100',
                      },
                      violet: {
                        border: isSelected ? 'border-violet-500' : 'border-gray-200 dark:border-slate-700',
                        bg: isSelected ? 'bg-violet-50 dark:bg-violet-900/20' : 'bg-white dark:bg-slate-800/60',
                        badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
                        ring: 'focus-visible:ring-violet-400',
                        dot: isSelected ? 'bg-violet-500' : 'bg-gray-300 dark:bg-slate-600',
                        weeks: isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-slate-800 dark:text-slate-100',
                      },
                      rose: {
                        border: isSelected ? 'border-rose-500' : 'border-gray-200 dark:border-slate-700',
                        bg: isSelected ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-white dark:bg-slate-800/60',
                        badge: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
                        ring: 'focus-visible:ring-rose-400',
                        dot: isSelected ? 'bg-rose-500' : 'bg-gray-300 dark:bg-slate-600',
                        weeks: isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100',
                      },
                    }
                    const c = colorMap[color]
                    return (
                      <button
                        key={weeks}
                        type="button"
                        onClick={() => setWeeksDuration(String(weeks))}
                        aria-pressed={isSelected}
                        className={`
                        relative text-left rounded-xl border-2 p-4 transition-all duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        ${c.border} ${c.bg} ${c.ring}
                        hover:shadow-md active:scale-[0.99]
                      `}
                      >
                        {/* selection dot */}
                        <span
                          className={`absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full transition-colors ${c.dot}`}
                        />
                        <span className={`text-lg font-bold tracking-tight ${c.weeks}`}>
                          {label}
                        </span>
                        <span
                          className={`mt-1 inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${c.badge}`}
                        >
                          {badge}
                        </span>
                        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Hours per week slider ── */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <FieldLabel htmlFor="studyHours">
                    Study Hours Available Per Week
                  </FieldLabel>
                  <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-lg px-3 py-1">
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {studyHours[0]}
                    </span>
                    <span className="text-xs font-medium text-indigo-400 dark:text-indigo-500">
                      hrs/wk
                    </span>
                  </div>
                </div>

                <div className="px-1">
                  <Slider
                    id="studyHours"
                    min={5}
                    max={40}
                    step={1}
                    value={studyHours}
                    onValueChange={setStudyHours}
                    className="[&_[data-slot=slider-track]]:bg-gray-200 dark:[&_[data-slot=slider-track]]:bg-slate-700 [&_[data-slot=slider-range]]:bg-indigo-500 dark:[&_[data-slot=slider-range]]:bg-indigo-500 [&_[data-slot=slider-thumb]]:border-indigo-500 [&_[data-slot=slider-thumb]]:ring-indigo-200 dark:[&_[data-slot=slider-thumb]]:ring-indigo-900/50 [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:shadow-md"
                    aria-label="Study hours per week"
                  />
                  <div className="flex justify-between mt-2.5 text-xs text-slate-400 dark:text-slate-500">
                    <span>5 hrs</span>
                    <span>40 hrs</span>
                  </div>
                </div>

                {/* Quick-pick buttons */}
                <div className="mt-4 flex gap-2 flex-wrap">
                  {[5, 10, 15, 20, 25, 30, 35, 40].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setStudyHours([h])}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                      ${studyHours[0] === h
                          ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-700 dark:border-indigo-700'
                          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                        }`}
                      aria-pressed={studyHours[0] === h}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══════════════ FOOTER / SUBMIT ═══════════════ */}
            {errors.form && (
              <div className="px-8 pb-4">
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
                  {errors.form}
                </p>
              </div>
            )}
            <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-sm">
                Fields marked <span className="text-indigo-500">*</span> are required. Your data is
                processed securely and never shared.
              </p>
              <button
                id="generate-roadmap-btn"
                type="submit"
                disabled={isSubmitting}
                className="
                inline-flex items-center justify-center gap-2.5
                px-7 py-3 rounded-xl
                bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600
                text-white font-semibold text-sm
                shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                transition-all duration-200 active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                dark:focus:ring-offset-slate-900
                min-w-[220px]
              "
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate 30-Day Roadmap
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

function Divider() {
  return (
    <div className="px-8">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent" />
    </div>
  )
}
