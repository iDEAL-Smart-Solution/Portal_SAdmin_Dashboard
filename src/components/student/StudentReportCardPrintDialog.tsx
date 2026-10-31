import { useEffect, useMemo, useState } from 'react';
import { Printer } from 'lucide-react';
import Modal from '../ui/modal';
import { useAcademicStore } from '../../stores/academic-store';
import type { GetManyStudentResponse } from '../../types/student';
import { convertTermToNumber } from '../../types/academic';
import axiosInstance, { FileBaseUrl } from '../../lib/axios';
import { showError } from '../../lib/notifications';

export type ReportKind = 'term' | 'midterm' | 'cumulative';

interface Props {
  student: GetManyStudentResponse | null;
  onClose: () => void;
}

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character] || character));

const mediaUrl = (path?: string | null) => {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${FileBaseUrl}/${path.replace(/^\/+/, '')}`;
};

const formatPosition = (position: number) => {
  const suffix = position % 100 >= 11 && position % 100 <= 13
    ? 'th'
    : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[position % 10] || 'th';
  return `${position}${suffix}`;
};

export function makePrintHtml(
  data: any,
  kind: ReportKind,
  selectedTerm: number,
  documentTitle?: string,
  autoPrint = true,
): string {
  const termLabel = String(data.term || (selectedTerm === 1 ? 'first' : selectedTerm === 2 ? 'second' : 'third')).toUpperCase();
  let headers: string[];
  let rows: string;

  if (kind === 'midterm') {
    headers = ['SUBJECTS', '1st CA', '2nd CA', '3rd CA', 'CA TOTAL'];
    rows = (data.subjects || []).map((subject: any) => `<tr><td>${escapeHtml(subject.subjectName)}</td><td class="c">${escapeHtml(subject.first_CA_Score)}</td><td class="c">${escapeHtml(subject.second_CA_Score)}</td><td class="c">${escapeHtml(subject.third_CA_Score)}</td><td class="c b">${escapeHtml(subject.continuousAssessmentTotal)}</td></tr>`).join('');
  } else if (kind === 'cumulative') {
    headers = ['SUBJECTS', '1st TERM', '2nd TERM', '3rd TERM', 'AVERAGE', 'GRADE', 'REMARK'];
    rows = (data.subjects || []).map((subject: any) => `<tr><td>${escapeHtml(subject.subjectName)}</td><td class="c">${escapeHtml(subject.firstTermTotal)}</td><td class="c">${escapeHtml(subject.secondTermTotal)}</td><td class="c">${escapeHtml(subject.thirdTermTotal)}</td><td class="c b">${escapeHtml(subject.averageScore)}</td><td class="c">${escapeHtml(subject.grade)}</td><td>${escapeHtml(subject.remark)}</td></tr>`).join('');
  } else {
    headers = ['SUBJECTS', '1st CA', '2nd CA', '3rd CA', 'EXAM', 'TOTAL', 'GRADE', 'REMARK'];
    rows = (data.subjects || []).map((subject: any) => `<tr><td>${escapeHtml(subject.subjectName)}</td><td class="c">${escapeHtml(subject.firstCA)}</td><td class="c">${escapeHtml(subject.secondCA)}</td><td class="c">${escapeHtml(subject.thirdCA)}</td><td class="c">${escapeHtml(subject.exam)}</td><td class="c b">${escapeHtml(subject.totalScore)}</td><td class="c">${escapeHtml(subject.grade)}</td><td>${escapeHtml(subject.remark)}</td></tr>`).join('');
  }

  const tableHead = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('');
  const term = kind === 'cumulative' ? 'CUMULATIVE' : `${termLabel} TERM`;
  const performance = kind === 'cumulative' ? data.cumulativePercentage : data.percentage;
  const position = kind === 'cumulative' ? data.cumulativePosition : data.position;
  const aggregate = kind === 'cumulative' ? data.cumulativeAggregate : data.aggregate;
  const logo = mediaUrl(data.schoolLogo ?? data.schoolLogoUrl ?? data.SchoolLogo);
  const photo = mediaUrl(data.studentPhotoUrl ?? data.studentPhotoURL ?? data.profilePictureUrl ?? data.ProfilePictureUrl ?? data.StudentPhotoUrl);
  const resumeDate = data.nextTermBeginsOn ? new Date(data.nextTermBeginsOn).toLocaleDateString() : '';
  const classTeacherSignature = mediaUrl(data.classTeacherSignatureUrl);
  const principalSignature = mediaUrl(data.principalSignatureUrl);
  const studentSignature = mediaUrl(data.studentSignatureUrl);
  const gradeRows = [
    ['A1 = 75–100', 'Excellent'], ['B2 = 70–74', 'Very Good'], ['B3 = 65–69', 'Very Good'],
    ['C4 = 60–64', 'Good'], ['C5 = 55–59', 'Good'], ['C6 = 50–54', 'Good'],
    ['D7 = 45–49', 'Fair'], ['E8 = 40–44', 'Poor'], ['F9 = 01–39', 'Very Poor'],
  ].map(([grade, remark]) => `<tr><td>${grade}</td><td>${remark}</td></tr>`).join('');
  const effectiveness = ['Punctuality', 'Neatness', 'Honesty', 'Cooperation with others', 'Leadership', 'Helping others', 'Health', 'Attitude to school Activities', 'Attentiveness', 'Speaking/Handwriting']
    .map((item) => `<tr><td>${item}</td>${[5, 4, 3, 2, 1].map(() => '<td class="c"><span class="box"></span></td>').join('')}</tr>`).join('');

  const title = documentTitle || `${term} Report Card — ${data.studentName}`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
  <style>
    @page{size:A4 landscape;margin:7mm}*{box-sizing:border-box}body{font:10px Arial,sans-serif;color:#14213a;margin:0}.page{border:1px solid #d5dbe5;padding:7px}.header{height:58px;background:#203f8b;color:#fff;display:grid;grid-template-columns:75px 1fr 75px;align-items:center;text-align:center;padding:4px 10px}.header img{max-height:48px;max-width:65px;object-fit:contain}.header .photo{width:46px;height:46px;object-fit:cover;border-radius:50%;justify-self:end}.header h1{font-size:18px;margin:0 0 3px;text-transform:uppercase}.header p{margin:0;font-size:10px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #d8dee8;padding:4px 5px}th,.section{background:#203f8b;color:white;font-weight:bold;text-transform:uppercase}.info td{font-size:9px}.label{font-weight:bold}.summary{display:grid;grid-template-columns:repeat(4,1fr);margin:5px 0}.summary div{border:1px solid #d8dee8;padding:5px}.summary b{display:block;font-size:8px;color:#314b7d;text-transform:uppercase;margin-bottom:2px}.c{text-align:center}.b{font-weight:bold}.bottom{display:grid;grid-template-columns:1fr 1fr;border:1px solid #d8dee8;border-top:0}.bottom>div{padding:6px}.bottom>div+div{border-left:1px solid #d8dee8}.bottom h3{font-size:9px;color:#203f8b;text-transform:uppercase;margin:0 0 4px}.bottom table td{padding:2px 4px;border:0;border-bottom:1px solid #e6e9ef;font-size:8px}.box{display:inline-block;width:9px;height:9px;border:1px solid #aab1bd}.comments{border:1px solid #d8dee8;border-top:0;padding:6px;min-height:24px}.sigline{display:inline-flex;width:76px;height:20px;border-bottom:1px solid #888;align-items:flex-end;justify-content:center;vertical-align:bottom}.sigline img{max-width:100%;max-height:19px;object-fit:contain}.commenttext{display:inline-block;min-width:50%;font-style:italic}.foot{display:grid;grid-template-columns:1fr 1fr;border:1px solid #d8dee8;border-top:0;padding:8px 12px}.foot>div:last-child{text-align:right}.sign{height:28px;border-bottom:2px solid #555;display:flex;align-items:flex-end;padding-bottom:2px}.foot img{max-height:25px;max-width:100%;object-fit:contain}.small{font-size:8px;font-weight:bold;text-transform:uppercase;margin-top:3px}
    @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.page{break-inside:avoid}}
  </style></head><body><main class="page">
    <div class="header"><div>${logo ? `<img src="${logo}" alt="School logo">` : ''}</div><div><h1>${escapeHtml(data.schoolName)}</h1><p>${escapeHtml(term)} REPORT SHEET</p></div><div>${photo ? `<img class="photo" src="${photo}" alt="Student photo">` : ''}</div></div>
    <table class="info"><tr><td><span class="label">STUDENT:</span> ${escapeHtml(data.studentName)}</td><td><span class="label">SESSION:</span> ${escapeHtml(data.session)}</td><td><span class="label">TERM:</span> ${escapeHtml(term)}</td><td><span class="label">CLASS:</span> ${escapeHtml(data.className)}</td><td><span class="label">PERFORMANCE:</span> ${escapeHtml(performance)}%</td></tr><tr><td><span class="label">STUDENT ID:</span> ${escapeHtml(data.studentUin)}</td><td><span class="label">GENDER:</span> ${escapeHtml(data.gender)}</td><td><span class="label">POSITION:</span> ${escapeHtml(formatPosition(Number(position || 0)))}</td><td><span class="label">NO. IN CLASS:</span> ${escapeHtml(data.totalStudents)}</td><td><span class="label">AGGREGATE:</span> ${escapeHtml(aggregate)}</td></tr></table>
    <div class="section" style="padding:5px">${kind === 'midterm' ? 'MID-TERM CONTINUOUS ASSESSMENT' : kind === 'cumulative' ? 'CUMULATIVE ASSESSMENT' : 'ASSESSMENT'}</div>
    <table><thead><tr>${tableHead}</tr></thead><tbody>${rows || '<tr><td colspan="8" class="c">No results available.</td></tr>'}</tbody></table>
    <div class="bottom"><div><h3>Grading Method</h3><table>${gradeRows}</table></div><div><h3>Effectiveness</h3><table><thead><tr><th></th>${[5,4,3,2,1].map((n)=>`<th class="c">${n}</th>`).join('')}</tr></thead><tbody>${effectiveness}</tbody></table></div></div>
    <div class="comments"><span class="label">CLASS TEACHER'S COMMENT:</span> <span class="commenttext">${escapeHtml(data.classTeacherComment || '')}</span> &nbsp; <span class="label">SIGNATURE:</span> <span class="sigline">${classTeacherSignature ? `<img src="${classTeacherSignature}" alt="Class teacher signature">` : ''}</span></div>
    <div class="comments"><span class="label">PRINCIPAL'S COMMENT:</span> <i>${escapeHtml(data.principalRemark || '')}</i>${resumeDate ? ` &nbsp; <span class="label">NEXT TERM BEGINS:</span> ${escapeHtml(resumeDate)}` : ''}</div>
    <div class="foot"><div><div class="sign">${principalSignature ? `<img src="${principalSignature}" alt="Principal signature">` : ''}</div><div class="small">Principal · ${escapeHtml(data.schoolName)}</div></div><div><div class="sign">${studentSignature ? `<img src="${studentSignature}" alt="Student signature">` : ''}</div><div class="small">Student · ${escapeHtml(data.studentName)}</div></div></div>
  </main>${autoPrint ? '<script>window.addEventListener("load",()=>setTimeout(()=>window.print(),350))</script>' : ''}</body></html>`;
}

// Shared print layout follows the student portal's A4 report card structure.
export function makeStandardReportPrintHtml(data: any, kind: ReportKind, selectedTerm: number, title: string, primaryColor: string) {
  const esc = escapeHtml;
  const termName = String(data.term || (selectedTerm === 1 ? 'first' : selectedTerm === 2 ? 'second' : 'third')).toLowerCase();
  const termLabel = termName === 'first' ? '1ST TERM' : termName === 'second' ? '2ND TERM' : '3RD TERM';
  const primary = /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(primaryColor) ? primaryColor : '#2563eb';
  const stylesheet = `
    *{margin:0;padding:0;box-sizing:border-box}.page{width:100%}body{font-family:'Segoe UI',Arial,sans-serif;padding:6px;color:#333;font-size:10px;line-height:1.15}
    .header{display:flex;align-items:center;justify-content:space-between;gap:12px;background:${primary};color:#fff;padding:12px 14px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .logo{width:54px;height:54px;flex:0 0 54px;border-radius:50%;background:#fff;padding:4px;display:flex;align-items:center;justify-content:center;overflow:hidden}.logo img{width:100%;height:100%;object-fit:contain}
    .meta{flex:1;text-align:center}.photo{width:84px;height:102px;flex:0 0 84px;border-radius:8px;background:#fff;padding:3px;display:flex;align-items:center;justify-content:center;overflow:hidden}.photo img{width:100%;height:100%;object-fit:cover;border-radius:6px}
    h1{font-size:22px;text-transform:uppercase;letter-spacing:1.5px;font-weight:800}.sub{font-size:10px;color:#fff;margin-top:3px;text-transform:uppercase;letter-spacing:2px}
    table{width:100%;border-collapse:collapse}td,th{border:1px solid #bbb;padding:4px 6px}.info td{font-size:11px;padding:3px 6px}.lbl{font-weight:700}.c{text-align:center}.b{font-weight:700}.subj{font-weight:500;text-transform:uppercase}
    .sh,.at th{background:${primary};color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}.sh{font-weight:700;font-size:10px;text-transform:uppercase;padding:4px 6px;letter-spacing:.5px}.at th{font-size:10px;padding:5px 4px;font-weight:600}.at td{font-size:11px}.at tr:nth-child(even){background:#f0f5fa;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .bg{display:grid;grid-template-columns:1fr 1fr;border:1px solid #bbb;border-top:0}.bg>div{padding:6px}.bg>div:first-child{border-right:1px solid #bbb}.bg h4{font-size:10px;text-transform:uppercase;font-weight:700;margin-bottom:4px;color:${primary}}.bg table{border:0}.bg td,.bg th{border:0;border-bottom:1px solid #eee;padding:2px 4px;font-size:10px}.bx{width:12px;height:12px;border:1px solid #999;display:inline-block}
    .cm{border:1px solid #bbb;border-top:0;padding:5px 8px;font-size:10px}.siggrid{display:flex;justify-content:space-between;gap:22px;border:1px solid #bbb;border-top:0;padding:8px 10px;font-size:10px}.siggrid .in{flex:1}.siggrid .in:last-child{text-align:right}.sigbox{height:23px;border-bottom:2px solid #666;display:flex;align-items:flex-end;padding-bottom:2px}.siggrid .in:last-child .sigbox{justify-content:flex-end}.sigbox img{max-height:21px;max-width:100%;object-fit:contain}
    @media print{@page{size:A4 portrait;margin:6mm}body{padding:0}.page{page-break-inside:avoid;break-inside:avoid}}
  `;
  const rows = kind === 'midterm'
    ? (data.subjects || []).map((s: any) => `<tr><td class="subj">${esc(s.subjectName).toUpperCase()}</td><td class="c">${esc(s.first_CA_Score)}</td><td class="c">${esc(s.second_CA_Score)}</td><td class="c">${esc(s.third_CA_Score)}</td><td class="c b">${esc(s.continuousAssessmentTotal)}</td></tr>`).join('')
    : kind === 'cumulative'
      ? (data.subjects || []).map((s: any) => `<tr><td class="subj">${esc(s.subjectName).toUpperCase()}</td><td class="c">${esc(s.firstTermTotal || '—')}</td><td class="c">${esc(s.secondTermTotal || '—')}</td><td class="c">${esc(s.thirdTermTotal || '—')}</td><td class="c b">${Number(s.averageScore || 0).toFixed(1)}</td><td class="c b">${esc(s.grade)}</td><td>${esc(s.remark)}</td></tr>`).join('')
      : (data.subjects || []).map((s: any) => `<tr><td class="subj">${esc(s.subjectName).toUpperCase()}</td><td class="c">100</td><td class="c">${Number(s.firstCA || 0) + Number(s.secondCA || 0) + Number(s.thirdCA || 0)}</td><td class="c">${esc(s.exam)}</td><td class="c b">${esc(s.totalScore)}</td><td class="c b">${esc(s.grade)}</td><td>${esc(s.remark)}</td></tr>`).join('');
  const headers = kind === 'midterm' ? ['SUBJECTS', '1st CA', '2nd CA', '3rd CA', 'CA Total']
    : kind === 'cumulative' ? ['SUBJECTS', '1st Term Total', '2nd Term Total', '3rd Term Total', 'Average', 'Grade', 'Remarks']
      : ['SUBJECTS', 'Marks Obtainable', 'Continuous Assessment', 'Exam Score', `${termLabel} Score (%)`, 'Grade', 'Remarks'];
  const grades = [['A1','75 – 100','Excellent'],['B2','70 – 74','Very Good'],['B3','65 – 69','Very Good'],['C4','60 – 64','Good'],['C5','55 – 59','Good'],['C6','50 – 54','Good'],['D7','45 – 49','Fair'],['E8','40 – 44','Poor'],['F9','01 – 39','Very Poor']]
    .map(([g,r,m]) => `<tr><td style="font-weight:600">${g} = ${r}</td><td>${m}</td></tr>`).join('');
  const effectiveness = ['Punctuality','Neatness','Honesty','Cooperation with others','Leadership','Helping others','Health','Attitude to school Activities','Attentiveness','Speaking/Handwriting']
    .map((item) => `<tr><td>${item}</td>${[5,4,3,2,1].map(() => '<td class="c"><span class="bx"></span></td>').join('')}</tr>`).join('');
  const position = kind === 'cumulative' ? data.cumulativePosition : data.position;
  const percentage = kind === 'cumulative' ? data.cumulativePercentage : data.percentage;
  const resume = data.nextTermBeginsOn ? new Date(data.nextTermBeginsOn).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : '';
  const studentInfo = kind === 'cumulative'
    ? `<tr><td><span class="lbl">STUDENT ID:</span> ${esc(data.studentUin)}</td><td><span class="lbl">NO. IN CLASS:</span> ${esc(data.totalStudents)}</td><td><span class="lbl">POSITION:</span> ${esc(formatPosition(Number(position||0)))}</td><td><span class="lbl">GENDER:</span> ${esc(data.gender)}</td></tr>`
    : `<tr><td><span class="lbl">NO. IN CLASS:</span> ${esc(data.totalStudents)}</td><td><span class="lbl">POSITION:</span> ${esc(formatPosition(Number(position||0)))}</td><td><span class="lbl">GENDER:</span> ${esc(data.gender)}</td><td colspan="2"><span class="lbl">STUDENT ID:</span> ${esc(data.studentUin)}</td></tr>`;
  const logo = mediaUrl(data.schoolLogo);
  const photo = mediaUrl(data.studentPhotoUrl);
  const signature = (url: string | null | undefined, alt: string) => url ? `<img src="${mediaUrl(url)}" alt="${alt}">` : '';
  const attendance = `<table><tr><td class="sh" style="width:50%">Attendance</td><td class="sh">Weight / Height</td></tr></table><table><tr><td style="width:25%">No. of Times School Opened</td><td style="width:25%"></td><td style="width:25%">Expected Date of Resumption</td><td style="width:25%">${esc(resume)}</td></tr><tr><td>No. of Times Present</td><td></td><td>Height at the end of term</td><td></td></tr><tr><td>No. of Times Punctual</td><td></td><td>Weight at the beginning of term</td><td></td></tr><tr><td></td><td></td><td>Weight at the end of term</td><td></td></tr></table>`;
  const subtitle = kind === 'cumulative' ? `Cumulative Report Sheet — ${esc(data.session)}` : 'Report Sheet';
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>${stylesheet}</style></head><body><div class="page">
    <div class="header"><div class="logo">${logo ? `<img src="${logo}" alt="School logo">` : ''}</div><div class="meta"><h1>${esc(data.schoolName)}</h1><div class="sub">${subtitle}</div></div><div class="photo">${photo ? `<img src="${photo}" alt="Student photo">` : '<span>No photo uploaded</span>'}</div></div>
    <table class="info"><tr><td><span class="lbl">STUDENT'S NAME:</span> ${esc(data.studentName)}</td><td><span class="lbl">SESSION:</span> ${esc(data.session)}</td>${kind !== 'cumulative' ? `<td><span class="lbl">TERM:</span> ${termLabel}</td>` : ''}<td><span class="lbl">CLASS:</span> ${esc(data.className)}</td><td><span class="lbl">PERFORMANCE:</span> ${Number(percentage||0).toFixed(1)}%</td></tr>${studentInfo}</table>
    ${attendance}<table><tr><td class="sh" colspan="${headers.length}">${kind === 'midterm' ? 'Mid-term Assessment — Continuous Assessment Only' : kind === 'cumulative' ? 'Assessment — Cumulative' : 'Assessment'}</td></tr></table>
    <table class="at"><thead><tr>${headers.map((h)=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows || `<tr><td class="c" colspan="${headers.length}">No results available.</td></tr>`}</tbody></table>
    <div class="bg"><div><h4>Grading Method</h4><table>${grades}</table></div><div><h4>Effectiveness</h4><table><tr><th></th>${[5,4,3,2,1].map((n)=>`<th class="c">${n}</th>`).join('')}</tr>${effectiveness}</table></div></div>
    <div class="cm"><span class="lbl">Class Teacher's Comment:</span> <em style="white-space:pre-wrap">${esc(data.classTeacherComment||'')}</em> &nbsp;&nbsp;<span class="lbl">Signature:</span> <span style="display:inline-flex;width:72px;height:22px;align-items:flex-end;justify-content:center;border-bottom:1px solid #999">${signature(data.classTeacherSignatureUrl,'Class teacher signature')}</span></div>
    <div class="cm"><span class="lbl">Principal's Comment:</span> <em>${esc(data.principalRemark||'')}</em></div><div class="cm"></div>
    <div class="siggrid"><div class="in"><div class="sigbox">${signature(data.principalSignatureUrl,'Principal signature')}</div><strong><em>Principal</em></strong><br><strong>${esc(data.schoolName).toUpperCase()}</strong></div><div class="in"><div class="sigbox">${signature(data.studentSignatureUrl,'Student signature')}</div><strong><em>Student</em></strong><br><strong>${esc(data.studentName)}</strong></div></div>
  </div></body></html>`;
}

export default function StudentReportCardPrintDialog({ student, onClose }: Props) {
  const { currentSession, fetchCurrentSession, getAllSessions } = useAcademicStore();
  const [sessions, setSessions] = useState<string[]>([]);
  const [session, setSession] = useState('');
  const [term, setTerm] = useState(1);
  const [kind, setKind] = useState<ReportKind>('term');
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (!student) return;
    void fetchCurrentSession();
    void getAllSessions().then((result: any) => {
      const source = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];
      const names = source.map((item: any) => item.Current_Session ?? item.current_Session ?? item.name ?? item.Name).filter(Boolean);
      setSessions(names);
    }).catch(() => setSessions([]));
  }, [student?.id]);

  useEffect(() => {
    const current = currentSession?.Current_Session;
    if (current) {
      setSession((value) => value || current);
      setSessions((values) => values.includes(current) ? values : [current, ...values]);
      setTerm(convertTermToNumber(currentSession.Current_Term));
    }
  }, [currentSession]);

  const availableSessions = useMemo(() => [...new Set(sessions)], [sessions]);

  const printReportCard = async () => {
    if (!student || !session) {
      showError('Select an academic session before printing.');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showError('Allow pop-ups for this site to print report cards.');
      return;
    }
    printWindow.document.write('<!doctype html><title>Preparing report card...</title><p style="font:16px Arial;padding:24px">Preparing report card...</p>');
    printWindow.document.close();
    setIsPrinting(true);
    try {
      const endpoint = kind === 'midterm' ? '/ReportCard/midterm' : kind === 'cumulative' ? '/ReportCard/cumulative' : '/ReportCard/single-term';
      const params = kind === 'cumulative'
        ? { studentId: student.userId, session }
        : { studentId: student.userId, session, term };
      const response = await axiosInstance.get(endpoint, { params });
      const report = response.data?.data ?? response.data?.Data ?? response.data;
      if (!report || !report.studentName) throw new Error(response.data?.message || 'The report card could not be loaded.');
      printWindow.document.open();
      printWindow.document.write(makePrintHtml(report, kind, term));
      printWindow.document.close();
    } catch (error: any) {
      printWindow.close();
      showError(error?.response?.data?.message || error?.message || 'Could not prepare this report card.');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Modal
      isOpen={!!student}
      onClose={onClose}
      title="Print student report card"
      size="md"
      footer={(
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={printReportCard} disabled={isPrinting || !session} className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            <Printer className="h-4 w-4" />{isPrinting ? 'Preparing...' : 'Print report card'}
          </button>
        </div>
      )}
    >
        <p className="mb-4 text-sm text-gray-600">Select the report card period for {student?.fullName}.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium"><span>Report type</span>
            <select value={kind} onChange={(event) => setKind(event.target.value as ReportKind)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal">
              <option value="term">Term report</option><option value="midterm">Mid-term report</option><option value="cumulative">Cumulative report</option>
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium"><span>Academic session</span>
            <select value={session} onChange={(event) => setSession(event.target.value)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal">
              <option value="">Select session</option>{availableSessions.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          {kind !== 'cumulative' && <label className="space-y-1 text-sm font-medium sm:col-span-2"><span>Term</span>
            <select value={term} onChange={(event) => setTerm(Number(event.target.value))} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal">
              <option value={1}>First Term</option><option value={2}>Second Term</option><option value={3}>Third Term</option>
            </select>
          </label>}
        </div>
    </Modal>
  );
}
