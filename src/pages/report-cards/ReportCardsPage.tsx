import { useEffect, useMemo, useRef, useState } from 'react';
import { Users, CheckSquare, Square, LoaderCircle, Download } from 'lucide-react';
import { useClassStore } from '../../stores/class-store';
import { useAcademicStore } from '../../stores/academic-store';
import type { GetManyStudentResponse } from '../../types/student';
import { convertTermToNumber } from '../../types/academic';
import axiosInstance, { FileBaseUrl } from '../../lib/axios';
import { showError, showSuccess } from '../../lib/notifications';
import type { ReportKind } from '../../components/student/StudentReportCardPrintDialog';
import { makeStudentDashboardPrintDocument, mapReportForStudentPrint, renderStudentDashboardReportPdf } from '../../lib/student-dashboard-report-print';

function safeFilenamePart(value: string) {
  return value.trim().replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-').replace(/\s+/g, '_').replace(/_+/g, '_');
}

const embeddedMediaCache = new Map<string, Promise<string>>();

async function embedReportImage(value: string) {
  if (!value || value.startsWith('data:')) return value;
  const url = /^https?:\/\//i.test(value) ? value : `${FileBaseUrl}/${value.replace(/^\/+/, '')}`;
  const cached = embeddedMediaCache.get(url);
  if (cached) return cached;
  const request = axiosInstance.get('/ReportCard/media', { params: { url }, responseType: 'blob' }).then(async ({ data }) => {
    try {
      const bitmap = await createImageBitmap(data);
      const ratio = Math.min(1, 720 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
      canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not prepare report image.');
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      return canvas.toDataURL('image/jpeg', 0.82);
    } catch {
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Could not embed report image.'));
        reader.onerror = () => reject(new Error('Could not read report image.'));
        reader.readAsDataURL(data);
      });
    }
  });
  embeddedMediaCache.set(url, request);
  request.catch(() => embeddedMediaCache.delete(url));
  return request;
}

async function embedReportImages(report: any, student: GetManyStudentResponse, schoolLogoFallback?: string) {
  const [schoolLogo, studentPhotoUrl, classTeacherSignatureUrl, principalSignatureUrl, studentSignatureUrl] = await Promise.all([
    embedReportImage(report.schoolLogo || report.SchoolLogo || report.schoolLogoUrl || report.SchoolLogoFilePath || schoolLogoFallback || ''),
    embedReportImage(report.studentPhotoUrl || report.StudentPhotoUrl || report.profilePicture || student.profilePicture || ''),
    embedReportImage(report.classTeacherSignatureUrl || report.ClassTeacherSignatureUrl || ''),
    embedReportImage(report.principalSignatureUrl || report.PrincipalSignatureUrl || ''),
    embedReportImage(report.studentSignatureUrl || report.StudentSignatureUrl || ''),
  ]);
  return { ...report, schoolLogo, studentPhotoUrl, classTeacherSignatureUrl, principalSignatureUrl, studentSignatureUrl };
}

function reportFilename(student: GetManyStudentResponse, kind: ReportKind, term: number, session: string) {
  const type = kind === 'midterm' ? 'MidTerm' : kind === 'cumulative' ? 'Cumulative' : 'Term';
  const termPart = kind === 'cumulative' ? '' : `_${safeFilenamePart(['First Term', 'Second Term', 'Third Term'][term - 1] || 'Term')}`;
  return `${safeFilenamePart(student.fullName)}_${type}${termPart}_${safeFilenamePart(session)}_Report_Card`;
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeZip(files: { name: string; content: Uint8Array }[]) {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const content = file.content;
    const crc = crc32(content);
    const local = new Uint8Array(30 + name.length + content.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true); localView.setUint16(4, 20, true); localView.setUint16(6, 0x0800, true);
    localView.setUint32(14, crc, true); localView.setUint32(18, content.length, true); localView.setUint32(22, content.length, true);
    localView.setUint16(26, name.length, true); local.set(name, 30); local.set(content, 30 + name.length);
    localParts.push(local);
    const central = new Uint8Array(46 + name.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true); centralView.setUint16(4, 20, true); centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true); centralView.setUint32(16, crc, true);
    centralView.setUint32(20, content.length, true); centralView.setUint32(24, content.length, true);
    centralView.setUint16(28, name.length, true); centralView.setUint32(42, offset, true); central.set(name, 46);
    centralParts.push(central);
    offset += local.length;
  }
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true); endView.setUint16(8, files.length, true); endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true); endView.setUint32(16, offset, true);
  const parts = [...localParts, ...centralParts, end];
  const archive = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
  let position = 0;
  for (const part of parts) { archive.set(part, position); position += part.length; }
  return new Blob([archive.buffer as ArrayBuffer], { type: 'application/zip' });
}

export default function ReportCardsPage() {
  const { classList, fetchClassList } = useClassStore();
  const { currentSession, currentBranding, fetchCurrentSession, getAllSessions } = useAcademicStore();
  const [students, setStudents] = useState<GetManyStudentResponse[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [sessions, setSessions] = useState<string[]>([]);
  const [session, setSession] = useState('');
  const [term, setTerm] = useState(1);
  const [kind, setKind] = useState<ReportKind>('term');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printProgress, setPrintProgress] = useState<{ current: number; total: number; studentName: string; phase: 'loading' | 'pdf' } | null>(null);
  const downloadInProgress = useRef(false);

  useEffect(() => {
    void fetchClassList();
    void fetchCurrentSession();
    void getAllSessions().then((result: any) => {
      const list = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];
      const names = list.map((item: any) => item.Current_Session ?? item.current_Session ?? item.name ?? item.Name).filter(Boolean);
      setSessions(names);
    }).catch(() => setSessions([]));
  }, [fetchClassList, fetchCurrentSession, getAllSessions]);

  useEffect(() => {
    const activeSession = currentSession?.Current_Session;
    if (!activeSession) return;
    setSession((value) => value || activeSession);
    setSessions((values) => values.includes(activeSession) ? values : [activeSession, ...values]);
    setTerm(convertTermToNumber(currentSession.Current_Term));
  }, [currentSession]);

  useEffect(() => {
    const selectedClass = classList.find((classItem) => classItem.id === selectedClassId);
    if (!selectedClassId || !selectedClass) {
      setStudents([]);
      setSelectedStudentIds([]);
      return;
    }

    let active = true;
    setIsLoadingStudents(true);
    setStudents([]);
    setSelectedStudentIds([]);
    axiosInstance.get('/Student/get-students-with-class', { params: { className: selectedClass.name } })
      .then(({ data }) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setStudents(list.map((item: any) => ({
          ...item,
          id: item.id ?? item.Id,
          userId: item.userId ?? item.UserId,
          fullName: item.fullName ?? item.FullName ?? '',
          uin: item.uin ?? item.UIN ?? '',
          className: item.className ?? item.ClassName ?? selectedClass.name,
          profilePicture: item.profilePicture ?? item.ProfilePicture ?? item.profilePictureUrl ?? item.ProfilePictureUrl ?? null,
        })));
      })
      .catch((error) => {
        if (active) showError(error?.response?.data?.message || `Could not load students in ${selectedClass.name}.`);
      })
      .finally(() => { if (active) setIsLoadingStudents(false); });

    return () => { active = false; };
  }, [classList, selectedClassId]);

  const availableSessions = useMemo(() => [...new Set(sessions)], [sessions]);
  const allSelected = students.length > 0 && selectedStudentIds.length === students.length;

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((previous) => previous.includes(studentId)
      ? previous.filter((id) => id !== studentId)
      : [...previous, studentId]);
  };

  const fetchReport = async (student: GetManyStudentResponse) => {
    if (!student.userId) throw new Error(`The student account ID is missing for ${student.fullName}. Refresh the student list after updating the API.`);
    const endpoint = kind === 'midterm' ? '/ReportCard/midterm' : kind === 'cumulative' ? '/ReportCard/cumulative' : '/ReportCard/single-term';
    const params = kind === 'cumulative'
      ? { studentId: student.userId, session }
      : { studentId: student.userId, term, session };
    const { data } = await axiosInstance.get(endpoint, { params });
    const report = mapReportForStudentPrint(data?.data ?? data?.Data ?? data, student);
    if (!report?.studentName) throw new Error(data?.message || `No report card was returned for ${student.fullName}.`);
    return report;
  };

  const downloadReports = async (queue: GetManyStudentResponse[]) => {
    if (downloadInProgress.current || queue.length === 0) return;
    if (!session) {
      showError('Select an academic session first.');
      return;
    }
    if (queue.some((student) => !student.userId)) {
      showError('The API student list is missing account IDs. Update/restart the API, then reload this page.');
      return;
    }

    downloadInProgress.current = true;
    setIsPrinting(true);

    try {
      setPrintProgress({ current: 0, total: queue.length, studentName: 'student reports', phase: 'loading' });
      const files: { name: string; content: Uint8Array }[] = [];
      for (let index = 0; index < queue.length; index += 1) {
        const student = queue[index];
        setPrintProgress({ current: index + 1, total: queue.length, studentName: student.fullName, phase: 'loading' });
        const fetchedReport = await fetchReport(student);
        const report = await embedReportImages(
          fetchedReport,
          student,
          typeof currentBranding?.SchoolLogoFilePath === 'string' ? currentBranding.SchoolLogoFilePath : undefined,
        );
        const filename = reportFilename(student, kind, term, session);
        const html = makeStudentDashboardPrintDocument([{ report, student }], kind, term, filename);
        setPrintProgress({ current: index + 1, total: queue.length, studentName: student.fullName, phase: 'pdf' });
        const pdf = await renderStudentDashboardReportPdf(html);
        files.push({ name: `${filename}.pdf`, content: new Uint8Array(await pdf.arrayBuffer()) });
      }
      const archive = makeZip(files);
      const objectUrl = URL.createObjectURL(archive);
      const anchor = document.createElement('a');
      const className = classList.find((item) => item.id === selectedClassId)?.name || 'Class';
      anchor.href = objectUrl;
      anchor.download = `${safeFilenamePart(className)}_Report_Cards_${safeFilenamePart(session)}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      showSuccess(`Downloaded ${files.length} report card${files.length === 1 ? '' : 's'} in a ZIP file.`);
    } catch (error: any) {
      showError(error?.response?.data?.message || error?.message || 'Could not create the report card download.');
    } finally {
      downloadInProgress.current = false;
      setIsPrinting(false);
      setPrintProgress(null);
    }
  };

  const selectAll = () => setSelectedStudentIds(allSelected ? [] : students.map((student) => student.id));

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Report Cards</h1>
        <p className="mt-2 text-gray-600">Download a report card for one student, selected students, or an entire class.</p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="space-y-1 text-sm font-medium text-gray-800"><span>Class</span>
            <select value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal">
              <option value="">Select a class</option>{classList.map((classItem) => <option key={classItem.id} value={classItem.id}>{classItem.name}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium text-gray-800"><span>Report type</span>
            <select value={kind} onChange={(event) => setKind(event.target.value as ReportKind)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal">
              <option value="term">Term report</option><option value="midterm">Mid-term report</option><option value="cumulative">Cumulative report</option>
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium text-gray-800"><span>Academic session</span>
            <select value={session} onChange={(event) => setSession(event.target.value)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal">
              <option value="">Select a session</option>{availableSessions.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          {kind !== 'cumulative' && <label className="space-y-1 text-sm font-medium text-gray-800"><span>Term</span>
            <select value={term} onChange={(event) => setTerm(Number(event.target.value))} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal">
              <option value={1}>First Term</option><option value={2}>Second Term</option><option value={3}>Third Term</option>
            </select>
          </label>}
        </div>
        <p className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-800">
          Download one ZIP containing a separately named PDF report card for each selected student.
        </p>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-semibold text-gray-900">{classList.find((item) => item.id === selectedClassId)?.name || 'Class roster'}</h2><p className="text-sm text-gray-500">{students.length} student{students.length === 1 ? '' : 's'}</p></div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={selectAll} disabled={!students.length || isPrinting} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50">
              {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}{allSelected ? 'Clear selection' : 'Select all'}
            </button>
            <button type="button" onClick={() => void downloadReports(students.filter((student) => selectedStudentIds.includes(student.id)))} disabled={!selectedStudentIds.length || isPrinting || !session} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              <Download className="h-4 w-4" />Download selected ({selectedStudentIds.length})
            </button>
            <button type="button" onClick={() => void downloadReports(students)} disabled={!students.length || isPrinting || !session} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
              <Users className="h-4 w-4" />Download whole class
            </button>
          </div>
        </div>

        {isPrinting && printProgress && (
          <div className="flex items-center gap-3 border-b border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <LoaderCircle className="h-4 w-4 animate-spin" />{printProgress.phase === 'loading' ? 'Loading report data and images…' : `Creating PDF ${printProgress.current} of ${printProgress.total}: ${printProgress.studentName}.`}
          </div>
        )}

        {!selectedClassId ? (
          <div className="p-12 text-center text-gray-500">Select a class to view its students.</div>
        ) : isLoadingStudents ? (
          <div className="p-12 text-center text-gray-500">Loading class roster…</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No students were found in this class.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr><th className="w-10 px-4 py-3"><span className="sr-only">Select</span></th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Student</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">UIN</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Class</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Action</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${student.fullName}`} checked={selectedStudentIds.includes(student.id)} disabled={isPrinting} onChange={() => toggleStudent(student.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600" /></td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.fullName}</td><td className="px-4 py-3 text-sm text-gray-600">{student.uin}</td><td className="px-4 py-3 text-sm text-gray-600">{student.className}</td>
                    <td className="px-4 py-3 text-right"><button type="button" onClick={() => void downloadReports([student])} disabled={isPrinting || !session} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"><Download className="h-4 w-4" />Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
