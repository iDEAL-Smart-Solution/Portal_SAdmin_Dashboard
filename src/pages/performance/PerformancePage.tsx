import React, { useEffect, useMemo, useState } from 'react'
import axiosInstance from '../../lib/axios'
import { useAuthStore } from '../../stores/auth-store'
import { useClassStore } from '../../stores/class-store'
import { useSubjectStore } from '../../stores/subject-store'
import { Button } from '../../components/ui/button'

interface HistogramBucket {
  label: string
  count: number
  percentage: number
}

interface HistogramData {
  title: string
  xAxisLabel: string
  yAxisLabel: string
  data: HistogramBucket[]
  average: number
  median: number
  standardDeviation: number
}

interface StudentPerformance {
  studentId: string
  studentUin: string
  studentName: string
  className: string
  subjectCode: string
  subjectName: string
  term: number
  session: string
  firstCAScore: number
  secondCAScore: number
  thirdCAScore: number
  examScore: number
  totalScore: number
  grade: string | null
  remark: string | null
  createdAt: string
}

interface StudentComparisonPoint {
  studentId: string
  studentUin: string
  studentName: string
  score: number
  grade: string
  term: number
  session: string
}

interface ComparisonData {
  subjectCode: string
  subjectName: string
  term: number
  session: string
  students: StudentComparisonPoint[]
  classAverage: number
  classMedian: number
  bestPerformer: string
  lowestPerformer: string
}

interface PercentileRankings {
  schoolPercentile: number
  schoolRank: number
  schoolTotal: number
  classPercentile: number
  classRank: number
  classTotal: number
  subjectPercentile: number
  subjectRank: number
  subjectTotal: number
}

interface PerformanceMetrics {
  averageScore: number
  highestScore: number
  lowestScore: number
  scoreVariance: number
  mostCommonGrade: string
  totalResults: number
  passCount: number
  failCount: number
}

interface PerformanceAnalysisResult {
  metrics: PerformanceMetrics
  detailedResults: StudentPerformance[]
  scoreDistribution: HistogramData
  gradeProgression: HistogramData
  subjectComparison: HistogramData
  comparisonData: ComparisonData | null
  percentileRankings: PercentileRankings
  generatedAt: string
}

type ViewMode = 'class' | 'subject'

const PerformancePage: React.FC = () => {
  const { user } = useAuthStore()
  const { classList, fetchClassList } = useClassStore()
  const { subjectList, fetchSubjectList } = useSubjectStore()
  const [viewMode, setViewMode] = useState<ViewMode>('class')
  const [sessions, setSessions] = useState<string[]>([])
  const [currentSession, setCurrentSession] = useState<string>('')
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [selectedTerm, setSelectedTerm] = useState<string>('')
  const [selectedSession, setSelectedSession] = useState<string>('')
  const [analysis, setAnalysis] = useState<PerformanceAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonLoading, setComparisonLoading] = useState(false)

  const schoolId = user?.schoolId

  useEffect(() => {
    if (!schoolId) return

    fetchClassList()
    fetchSubjectList(schoolId)
  }, [schoolId, fetchClassList, fetchSubjectList])

  useEffect(() => {
    if (!schoolId) return

    const loadSessions = async () => {
      try {
        const [sessionsResponse, currentSessionResponse] = await Promise.all([
          axiosInstance.get(`/Performance/sessions/${schoolId}`),
          axiosInstance.get(`/Performance/current-session/${schoolId}`),
        ])

        const sessionList = sessionsResponse.data?.data || sessionsResponse.data || []
        const current = currentSessionResponse.data?.data || currentSessionResponse.data || ''

        setSessions(Array.isArray(sessionList) ? sessionList : [])
        setCurrentSession(current || '')
        setSelectedSession((prev) => prev || current || '')
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load sessions')
      }
    }

    loadSessions()
  }, [schoolId])

  const selectedClassName = useMemo(() => {
    return classList.find((item) => item.id === selectedClassId)?.name || ''
  }, [classList, selectedClassId])

  const selectedSubject = useMemo(() => {
    return subjectList.find((item) => item.id === selectedSubjectId) || null
  }, [subjectList, selectedSubjectId])

  const selectedTermValue = selectedTerm ? Number(selectedTerm) : undefined

  useEffect(() => {
    if (!schoolId) return

    if (viewMode === 'class' && !selectedClassId) {
      setAnalysis(null)
      return
    }

    if (viewMode === 'subject' && !selectedSubjectId) {
      setAnalysis(null)
      return
    }

    const controller = new AbortController()
    const loadAnalysis = async () => {
      setIsLoading(true)
      setError(null)
      setShowComparison(false)
      setComparisonLoading(false)

      try {
        const endpoint =
          viewMode === 'class'
            ? `/Performance/class/${schoolId}/${selectedClassId}`
            : `/Performance/school-subject/${schoolId}/${selectedSubjectId}`

        const params = new URLSearchParams()
        if (selectedTermValue) params.append('term', String(selectedTermValue))
        if (selectedSession) params.append('session', selectedSession)

        const response = await axiosInstance.get(endpoint, {
          params,
          signal: controller.signal,
        })

        setAnalysis(response.data?.data || response.data || null)
      } catch (err: any) {
        if (controller.signal.aborted) return
        setAnalysis(null)
        setError(err.response?.data?.message || 'Failed to load performance analytics')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    if (!selectedSession) {
      setAnalysis(null)
      return
    }

    loadAnalysis()

    return () => controller.abort()
  }, [schoolId, viewMode, selectedClassId, selectedSubjectId, selectedTermValue, selectedSession])

  useEffect(() => {
    if (!showComparison || !analysis || viewMode !== 'subject' || !selectedSubjectId || !schoolId) return
    if (analysis.comparisonData) return

    const studentIds = (analysis.detailedResults || [])
      .slice()
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 5)
      .map((item) => item.studentId)

    if (studentIds.length < 2) return

    const loadComparison = async () => {
      setComparisonLoading(true)
      try {
        const response = await axiosInstance.post('/Performance/compare', {
          schoolId,
          studentIds,
          subjectId: selectedSubjectId,
          term: selectedTermValue ?? null,
          session: selectedSession || null,
        })

        setAnalysis((current) => {
          if (!current) return current
          return {
            ...current,
            comparisonData: response.data?.data || response.data || null,
          }
        })
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load comparison data')
      } finally {
        setComparisonLoading(false)
      }
    }

    loadComparison()
  }, [showComparison, analysis, viewMode, selectedSubjectId, schoolId, selectedTermValue, selectedSession])

  const selectedLabel = viewMode === 'class' ? selectedClassName : selectedSubject?.name || ''

  if (!user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        You must be logged in to access this page.
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Performance</h1>
          <p className="text-sm text-text-tertiary">
            School-wide performance analytics with class, subject, term, and session filters.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setViewMode('class')}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'class'
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-neutral-200 bg-white text-text-secondary hover:bg-neutral-50'
            }`}
          >
            By Class
          </button>
          <button
            type="button"
            onClick={() => setViewMode('subject')}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'subject'
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-neutral-200 bg-white text-text-secondary hover:bg-neutral-50'
            }`}
          >
            By Subject
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            label="Class"
            value={selectedClassId}
            onChange={setSelectedClassId}
            placeholder="All classes"
            options={classList.map((item) => ({ value: item.id, label: item.name }))}
            disabled={viewMode !== 'class'}
          />
          <FilterSelect
            label="Subject"
            value={selectedSubjectId}
            onChange={setSelectedSubjectId}
            placeholder="All subjects"
            options={subjectList.map((item) => ({ value: item.id, label: `${item.code} - ${item.name}` }))}
            disabled={viewMode !== 'subject'}
          />
          <FilterSelect
            label="Term"
            value={selectedTerm}
            onChange={setSelectedTerm}
            placeholder="All terms"
            options={[
              { value: '1', label: 'First Term' },
              { value: '2', label: 'Second Term' },
              { value: '3', label: 'Third Term' },
            ]}
          />
          <FilterSelect
            label="Session"
            value={selectedSession}
            onChange={setSelectedSession}
            placeholder={currentSession || 'All sessions'}
            options={sessions.map((item) => ({ value: item, label: item }))}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => {
            setSelectedClassId('')
            setSelectedSubjectId('')
            setSelectedTerm('')
            setSelectedSession(currentSession || '')
            setAnalysis(null)
            setShowComparison(false)
          }}>
            Clear Filters
          </Button>
          <div className="text-sm text-text-tertiary">
            {selectedLabel ? `Viewing ${selectedLabel}` : 'Pick a class or subject to load analytics.'}
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-text-tertiary shadow-sm">
          Loading performance analytics...
        </div>
      )}

      {!isLoading && analysis && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Average Score" value={`${analysis.metrics.averageScore.toFixed(2)}/100`} hint="Filtered records" />
            <MetricCard label="Highest Score" value={analysis.metrics.highestScore.toFixed(2)} hint="Best result" />
            <MetricCard label="Lowest Score" value={analysis.metrics.lowestScore.toFixed(2)} hint="Lowest result" />
            <MetricCard label="Pass Rate" value={`${analysis.metrics.passCount}/${analysis.metrics.totalResults}`} hint="Students passing" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Median" value={analysis.scoreDistribution.median.toFixed(2)} hint="Score distribution median" />
            <MetricCard label="Std Deviation" value={analysis.scoreDistribution.standardDeviation.toFixed(2)} hint="Spread of scores" />
            <MetricCard label="Variance" value={analysis.metrics.scoreVariance.toFixed(2)} hint="Population variance" />
            <MetricCard label="Most Common Grade" value={analysis.metrics.mostCommonGrade} hint="Dominant grade band" />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <HistogramCard data={analysis.scoreDistribution} />
            <HistogramCard data={analysis.gradeProgression} />
          </div>

          <HistogramCard data={analysis.subjectComparison} />

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Student Comparison</h2>
                <p className="text-sm text-text-tertiary">
                  Compare the strongest students for the selected {viewMode === 'subject' ? 'subject' : 'class'}.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowComparison((value) => !value)}
                disabled={viewMode !== 'subject' || !selectedSubjectId}
              >
                {showComparison ? 'Hide' : 'Show'} Comparison
              </Button>
            </div>

            {viewMode !== 'subject' && (
              <p className="mt-4 text-sm text-text-tertiary">
                Comparison is available in subject view because the backend compares students within a single subject.
              </p>
            )}

            {comparisonLoading && (
              <p className="mt-4 text-sm text-text-tertiary">Loading comparison data...</p>
            )}

            {showComparison && viewMode === 'subject' && analysis.comparisonData && (
              <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200">
                <table className="min-w-full divide-y divide-neutral-200 text-sm">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-text-secondary">Student</th>
                      <th className="px-4 py-3 text-left font-semibold text-text-secondary">UIN</th>
                      <th className="px-4 py-3 text-left font-semibold text-text-secondary">Score</th>
                      <th className="px-4 py-3 text-left font-semibold text-text-secondary">Grade</th>
                      <th className="px-4 py-3 text-left font-semibold text-text-secondary">Session</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 bg-white">
                    {analysis.comparisonData.students.map((student) => (
                      <tr key={student.studentId}>
                        <td className="px-4 py-3 text-text-primary">{student.studentName}</td>
                        <td className="px-4 py-3 text-text-secondary">{student.studentUin}</td>
                        <td className="px-4 py-3 font-medium text-text-primary">{student.score.toFixed(2)}</td>
                        <td className="px-4 py-3 text-text-secondary">{student.grade}</td>
                        <td className="px-4 py-3 text-text-secondary">{student.session}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="grid gap-4 border-t border-neutral-200 bg-neutral-50 p-4 md:grid-cols-3">
                  <InfoPill label="Class Average" value={analysis.comparisonData.classAverage.toFixed(2)} />
                  <InfoPill label="Class Median" value={analysis.comparisonData.classMedian.toFixed(2)} />
                  <InfoPill label="Best Performer" value={analysis.comparisonData.bestPerformer} />
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Detailed Results</h2>
                <p className="text-sm text-text-tertiary">Student-level result rows used to build the analytics.</p>
              </div>
              <div className="text-sm text-text-tertiary">Generated {new Date(analysis.generatedAt).toLocaleString()}</div>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200">
              <table className="min-w-full divide-y divide-neutral-200 text-sm">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Student</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Class</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Subject</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Term</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Session</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Total</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {analysis.detailedResults.map((item) => (
                    <tr key={item.studentId + item.subjectCode + item.term + item.session}>
                      <td className="px-4 py-3 text-text-primary">{item.studentName}</td>
                      <td className="px-4 py-3 text-text-secondary">{item.className}</td>
                      <td className="px-4 py-3 text-text-secondary">{item.subjectCode}</td>
                      <td className="px-4 py-3 text-text-secondary">Term {item.term}</td>
                      <td className="px-4 py-3 text-text-secondary">{item.session}</td>
                      <td className="px-4 py-3 font-medium text-text-primary">{item.totalScore.toFixed(2)}</td>
                      <td className="px-4 py-3 text-text-secondary">{item.grade || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {!isLoading && !analysis && !error && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary">No analytics loaded yet</h2>
          <p className="mt-2 text-sm text-text-tertiary">
            Select a class or subject, then choose a term and session to view the performance analytics.
          </p>
        </section>
      )}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: Array<{ value: string; label: string }>
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-tertiary">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary-500 disabled:cursor-not-allowed disabled:bg-neutral-50"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
      <p className="mt-1 text-sm text-text-tertiary">{hint}</p>
    </section>
  )
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-text-primary">{value}</p>
    </div>
  )
}

function HistogramCard({ data }: { data: HistogramData }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{data.title}</h3>
          <p className="text-sm text-text-tertiary">
            {data.xAxisLabel} vs {data.yAxisLabel}
          </p>
        </div>
        <div className="text-right text-xs text-text-tertiary">
          <p>Avg: {data.average.toFixed(2)}</p>
          <p>Median: {data.median.toFixed(2)}</p>
          <p>Std Dev: {data.standardDeviation.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {data.data.length === 0 ? (
          <p className="text-sm text-text-tertiary">No data available.</p>
        ) : (
          data.data.map((bucket) => (
            <div key={bucket.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-text-primary">{bucket.label}</span>
                <span className="text-text-tertiary">
                  {bucket.count} {data.yAxisLabel.toLowerCase()}
                </span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100">
                <div
                  className="h-2 rounded-full bg-primary-500"
                  style={{ width: `${Math.max(4, Math.min(bucket.percentage, 100))}%` }}
                />
              </div>
              <p className="text-xs text-text-tertiary">Value: {bucket.percentage.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default PerformancePage
