import { useEffect, useMemo, useRef, useState } from 'react';
import { Users, CheckSquare, Square, LoaderCircle, Download } from 'lucide-react';
import { useClassStore } from '../../stores/class-store';
import { useAcademicStore } from '../../stores/academic-store';
import type { GetManyStudentResponse } from '../../types/student';
import { convertTermToNumber } from '../../types/academic';
import axiosInstance, { FileBaseUrl } from '../../lib/axios';
import { showError, showSuccess } from '../../lib/notifications';
import { makeStandardReportPrintHtml, type ReportKind } from '../../components/student/StudentReportCardPrintDialog';

declare global {
  interface Window {
    jspdf: { jsPDF: new (options: { orientation: string; unit: string; format: string }) => {
      addImage(image: string, format: string, x: number, y: number, width: number, height: number): void;
      output(type: 'blob'): Blob;
    } };
    html2canvas: (element: HTMLElement, options: Record<string, unknown>) => Promise<HTMLCanvasElement>;
  }
}

const termNames = ['First Term', 'Second Term', 'Third Term'];
const embeddedMediaCache = new Map<string, Promise<string>>();

function firstMediaValue(report: any, names: string[]) {
  for (const name of names) {
    const value = report?.[name];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

async function blobToReportImage(blob: Blob) {
  try {
    const bitmap = await createImageBitmap(blob);
    const maxSize = 720;
    const ratio = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable for image preparation.');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL('image/jpeg', 0.86);
  } catch {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Could not embed a report image.'));
      reader.onerror = () => reject(new Error('Could not read a report image.'));
      reader.readAsDataURL(blob);
    });
  }
}

async function embedReportImage(value: string) {
  if (!value) return '';
  if (value.startsWith('data:')) return value;
  const url = /^https?:\/\//i.test(value) ? value : `${FileBaseUrl}/${value.replace(/^\/+/, '')}`;
  const existing = embeddedMediaCache.get(url);
  if (existing) return existing;

  const request = axiosInstance.get('/ReportCard/media', { params: { url }, responseType: 'blob' })
    .then(({ data }) => blobToReportImage(data));
  embeddedMediaCache.set(url, request);
  request.catch(() => embeddedMediaCache.delete(url));
  return request;
}

async function embedReportImages(report: any, student: GetManyStudentResponse, schoolLogoFallback?: string) {
  const [schoolLogo, studentPhotoUrl, classTeacherSignatureUrl, principalSignatureUrl, studentSignatureUrl] = await Promise.all([
    embedReportImage(firstMediaValue(report, ['schoolLogo', 'SchoolLogo', 'schoolLogoUrl', 'schoolLogoFilePath', 'SchoolLogoFilePath']) || schoolLogoFallback || ''),
    embedReportImage(firstMediaValue(report, ['studentPhotoUrl', 'StudentPhotoUrl', 'studentPhotoURL', 'profilePicture', 'profilePictureUrl', 'ProfilePicture', 'ProfilePictureUrl']) || student.profilePicture || ''),
    embedReportImage(firstMediaValue(report, ['classTeacherSignatureUrl', 'ClassTeacherSignatureUrl'])),
    embedReportImage(firstMediaValue(report, ['principalSignatureUrl', 'PrincipalSignatureUrl'])),
    embedReportImage(firstMediaValue(report, ['studentSignatureUrl', 'StudentSignatureUrl'])),
  ]);
  return { ...report, schoolLogo, studentPhotoUrl, classTeacherSignatureUrl, principalSignatureUrl, studentSignatureUrl };
}

function safeFilenamePart(value: string) {
  return value.trim().replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-').replace(/\s+/g, '_').replace(/_+/g, '_');
}

function makeFilename(student: GetManyStudentResponse, kind: ReportKind, term: number, session: string) {
  const typeName = kind === 'midterm' ? 'MidTerm' : kind === 'cumulative' ? 'Cumulative' : 'Term';
  const termName = kind === 'cumulative' ? '' : `_${safeFilenamePart(termNames[term - 1] || 'Term')}`;
  return `${safeFilenamePart(student.fullName)}_${typeName}${termName}_${safeFilenamePart(session)}_Report_Card`;
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
  let localSize = 0;
  const put16 = (view: DataView, offset: number, value: number) => view.setUint16(offset, value, true);
  const put32 = (view: DataView, offset: number, value: number) => view.setUint32(offset, value, true);

  for (const file of files) {
    const name = encoder.encode(file.name);
    const checksum = crc32(file.content);
    const local = new Uint8Array(30 + name.length);
    const localView = new DataView(local.buffer);
    put32(localView, 0, 0x04034b50); put16(localView, 4, 20); put16(localView, 6, 0x0800);
    put32(localView, 14, checksum); put32(localView, 18, file.content.length); put32(localView, 22, file.content.length); put16(localView, 26, name.length);
    local.set(name, 30);
    localParts.push(local, file.content);

    const central = new Uint8Array(46 + name.length);
    const centralView = new DataView(central.buffer);
    put32(centralView, 0, 0x02014b50); put16(centralView, 4, 20); put16(centralView, 6, 20); put16(centralView, 8, 0x0800);
    put32(centralView, 16, checksum); put32(centralView, 20, file.content.length); put32(centralView, 24, file.content.length);
    put16(centralView, 28, name.length); put32(centralView, 42, localSize);
    central.set(name, 46);
    centralParts.push(central);
    localSize += local.length + file.content.length;
  }

  const centralSize = centralParts.reduce((size, part) => size + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  put32(endView, 0, 0x06054b50); put16(endView, 8, files.length); put16(endView, 10, files.length);
  put32(endView, 12, centralSize); put32(endView, 16, localSize);
  const parts = [...localParts, ...centralParts, end];
  const archive = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
  let offset = 0;
  for (const part of parts) { archive.set(part, offset); offset += part.length; }
  return new Blob([archive.buffer as ArrayBuffer], { type: 'application/zip' });
}

async function renderReportPdf(html: string) {
  const [pdfModule, canvasModule] = await Promise.all([
    import('../../vendor/pdf/jspdf.umd.min.js'),
    import('../../vendor/pdf/html2canvas.min.js'),
  ]);
  const pdfExports = pdfModule as any;
  const canvasExports = canvasModule as any;
  const JsPdfConstructor = window.jspdf?.jsPDF
    ?? pdfExports.jsPDF
    ?? pdfExports.default?.jsPDF
    ?? pdfExports.default;
  const html2canvas = window.html2canvas
    ?? canvasExports.html2canvas
    ?? canvasExports.default;
  if (typeof JsPdfConstructor !== 'function' || typeof html2canvas !== 'function') {
    throw new Error('The PDF tools could not be loaded. Please refresh and try again.');
  }

  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;left:-12000px;top:0;width:794px;height:1122px;border:0;visibility:hidden';
  document.body.appendChild(frame);
  try {
    await new Promise<void>((resolve, reject) => {
      frame.onload = () => resolve();
      frame.onerror = () => reject(new Error('Could not prepare a report card for PDF export.'));
      frame.srcdoc = html;
    });
    const doc = frame.contentDocument;
    const page = doc?.querySelector<HTMLElement>('.page');
    if (!doc || !page || !frame.contentWindow) throw new Error('The report card page could not be rendered.');
    await Promise.all(Array.from(doc.images).map((image) => image.decode().catch(() => undefined)));
    await doc.fonts?.ready;
    const canvas = await html2canvas(page, {
      backgroundColor: '#ffffff', scale: 1, useCORS: true, logging: false,
      windowWidth: 794, windowHeight: 1122,
    });
    const pdf = new JsPdfConstructor({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
    return pdf.output('blob');
  } finally {
    frame.remove();
  }
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
    const report = data?.data ?? data?.Data ?? data;
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
      setPrintProgress({ current: 0, total: queue.length, studentName: 'student reports and images', phase: 'loading' });
      const prepared = await Promise.all(queue.map(async (student) => ({
        student,
        report: await embedReportImages(
          await fetchReport(student),
          student,
          typeof currentBranding?.SchoolLogoFilePath === 'string' ? currentBranding.SchoolLogoFilePath : undefined,
        ),
      })));
      const files: { name: string; content: Uint8Array }[] = [];
      for (let index = 0; index < prepared.length; index += 1) {
        const { student, report } = prepared[index];
        setPrintProgress({ current: index + 1, total: prepared.length, studentName: student.fullName, phase: 'pdf' });
        const filename = makeFilename(student, kind, term, session);
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#2563eb';
        const html = makeStandardReportPrintHtml(report, kind, term, filename, primaryColor);
        const pdf = await renderReportPdf(html);
        files.push({ name: `${filename}.pdf`, content: new Uint8Array(await pdf.arrayBuffer()) });
      }
      if (!files.length) return;
      const zip = makeZip(files);
      const zipName = `${safeFilenamePart(classList.find((item) => item.id === selectedClassId)?.name || 'Class')}_Report_Cards_${safeFilenamePart(session)}.zip`;
      const url = URL.createObjectURL(zip);
      const link = document.createElement('a');
      link.href = url;
      link.download = zipName;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      showSuccess(`Downloaded ${files.length} printable report card${files.length === 1 ? '' : 's'} in one ZIP file.`);
    } catch (error: any) {
      showError(error?.response?.data?.message || error?.message || 'Could not prepare the report card ZIP.');
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
        <p className="mt-2 text-gray-600">Print a report card for one student, selected students, or an entire class.</p>
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
            <LoaderCircle className="h-4 w-4 animate-spin" />{printProgress.phase === 'loading' ? 'Loading report data and images…' : `Rendering PDF ${printProgress.current} of ${printProgress.total}: ${printProgress.studentName}.`}
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
