import type { GetManyStudentResponse } from '../types/student';
import type { ReportKind } from '../components/student/StudentReportCardPrintDialog';
import { FileBaseUrl } from './axios';

const GRADING_TABLE = [
  ['A1', '75 – 100', 'Excellent'], ['B2', '70 – 74', 'Very Good'], ['B3', '65 – 69', 'Very Good'],
  ['C4', '60 – 64', 'Good'], ['C5', '55 – 59', 'Good'], ['C6', '50 – 54', 'Good'],
  ['D7', '45 – 49', 'Fair'], ['E8', '40 – 44', 'Poor'], ['F9', '01 – 39', 'Very Poor'],
];

const EFFECTIVENESS_ITEMS = [
  'Punctuality', 'Neatness', 'Honesty', 'Cooperation with others', 'Leadership',
  'Helping others', 'Health', 'Attitude to school Activities', 'Attentiveness', 'Speaking/Handwriting',
];

const PRINT_STYLES = `
*{margin:0;padding:0;box-sizing:border-box}
.page{width:100%}
body{font-family:'Segoe UI',Arial,sans-serif;padding:6px;color:#222;font-size:10px;line-height:1.15;font-weight:500}
.header{display:flex;align-items:center;justify-content:space-between;gap:12px;background:__PRIMARY__;color:#fff;padding:12px 14px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.header .logo{width:54px;height:54px;flex:0 0 54px;border-radius:50%;background:#fff;padding:4px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.header .logo img{width:100%;height:100%;object-fit:contain}
.header .meta{flex:1;text-align:center}
.header .student-photo{width:84px;height:102px;flex:0 0 84px;border-radius:8px;background:#fff;padding:3px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.header .student-photo img{width:100%;height:100%;object-fit:cover;border-radius:6px}
.header h1{font-size:22px;text-transform:uppercase;letter-spacing:1.5px;font-weight:900;-webkit-text-stroke:.25px currentColor}
.header .sub{font-size:10px;color:#d9e8f4;margin-top:3px;text-transform:uppercase;letter-spacing:2px}
table{width:100%;border-collapse:collapse}td,th{border:1px solid #aaa;padding:9px 8px;color:#222}.c{text-align:center}.b{font-weight:800}.subj{font-weight:600;text-transform:uppercase}
.info td{font-size:11px;line-height:1.45;padding:10px 8px;color:#111}.lbl{font-weight:800;color:#111;-webkit-text-stroke:.12px currentColor}
.sh{background:__PRIMARY__;color:#fff;font-weight:800;font-size:10px;text-transform:uppercase;padding:4px 6px;letter-spacing:.5px;-webkit-text-stroke:.2px currentColor;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.at th{background:__PRIMARY__;color:#fff;font-size:10px;padding:9px 6px;font-weight:800;-webkit-text-stroke:.2px currentColor;-webkit-print-color-adjust:exact;print-color-adjust:exact}.at td{font-size:11px;padding:9px 6px}.at tr:nth-child(even){background:#f0f5fa;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.bg{display:grid;grid-template-columns:1fr 1fr;border:1px solid #aaa;border-top:0}.bg>div{padding:8px}.bg>div:first-child{border-right:1px solid #aaa}.bg h4{font-size:10px;text-transform:uppercase;font-weight:800;margin-bottom:4px;color:__PRIMARY__;-webkit-text-stroke:.15px currentColor}.bg table{border:0}.bg td,.bg th{border:0;border-bottom:1px solid #e5e5e5;padding:7px 6px;font-size:10px}
.bx{width:12px;height:12px;border:1px solid #999;display:inline-block;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cm{border:1px solid #bbb;border-top:0;padding:12px 10px;font-size:10px;line-height:1.5}.so{border:1px solid #bbb;border-top:0;padding:8px 8px;text-align:right;font-size:10px}.so .in{display:inline-block;text-align:center}.so .ln{width:150px;border-bottom:1px solid #666;margin-bottom:2px}
.siggrid{display:flex;justify-content:space-between;gap:22px;border:1px solid #bbb;border-top:0;padding:8px 10px;font-size:10px}.siggrid .in{flex:1}.siggrid .in:first-child{text-align:left!important}.siggrid .in:last-child{text-align:right!important}.sigbox{height:23px;border-bottom:2px solid #666;display:flex;align-items:flex-end;justify-content:flex-start!important;padding-bottom:2px}.siggrid .in:last-child .sigbox{justify-content:flex-end!important}.sigbox img{max-height:21px;max-width:100%;object-fit:contain}
@media print{@page{margin:6mm}body{padding:0}.page{break-inside:avoid;page-break-inside:avoid}.page+.page{break-before:page;page-break-before:always}}
`;

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character] || character));

const mediaUrl = (path?: string | null) => {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${FileBaseUrl}/${path.replace(/^\/+/, '')}`;
};

const valueOf = (source: any, ...names: string[]) => names.map((name) => source?.[name]).find((value) => value !== undefined && value !== null && value !== '');

export function mapReportForStudentPrint(report: any, student: GetManyStudentResponse) {
  return {
    ...report,
    studentName: valueOf(report, 'studentName', 'StudentName') || student.fullName,
    studentUin: valueOf(report, 'studentUin', 'StudentUin') || student.uin,
    gender: valueOf(report, 'gender', 'Gender') || student.gender || '',
    className: valueOf(report, 'className', 'ClassName') || student.className,
    schoolName: valueOf(report, 'schoolName', 'SchoolName') || 'School',
    schoolLogo: valueOf(report, 'schoolLogo', 'SchoolLogo') || null,
    studentPhotoUrl: valueOf(report, 'studentPhotoUrl', 'StudentPhotoUrl', 'studentPhotoURL', 'StudentPhotoURL', 'profilePictureUrl', 'ProfilePictureUrl') || student.profilePicture || null,
    classTeacherComment: valueOf(report, 'classTeacherComment', 'ClassTeacherComment', 'classTeacherResultComment', 'ClassTeacherResultComment', 'teacherComment', 'TeacherComment') || '',
    classTeacherSignatureUrl: valueOf(report, 'classTeacherSignatureUrl', 'ClassTeacherSignatureUrl', 'classTeacherSignature', 'ClassTeacherSignature') || null,
    principalSignatureUrl: valueOf(report, 'principalSignatureUrl', 'PrincipalSignatureUrl', 'principalSignature', 'PrincipalSignature') || null,
    studentSignatureUrl: valueOf(report, 'studentSignatureUrl', 'StudentSignatureUrl', 'studentSignature', 'StudentSignature') || null,
    principalRemark: valueOf(report, 'principalRemark', 'PrincipalRemark') || '',
    subjects: (valueOf(report, 'subjects', 'Subjects') || []).map((subject: any) => ({
      subjectName: valueOf(subject, 'subjectName', 'SubjectName') || '',
      firstCA: valueOf(subject, 'firstCA', 'FirstCA') ?? valueOf(subject, 'first_CA_Score', 'First_CA_Score') ?? 0,
      secondCA: valueOf(subject, 'secondCA', 'SecondCA') ?? valueOf(subject, 'second_CA_Score', 'Second_CA_Score') ?? 0,
      thirdCA: valueOf(subject, 'thirdCA', 'ThirdCA') ?? valueOf(subject, 'third_CA_Score', 'Third_CA_Score') ?? 0,
      exam: valueOf(subject, 'exam', 'Exam') ?? valueOf(subject, 'exam_Score', 'Exam_Score') ?? 0,
      totalScore: valueOf(subject, 'totalScore', 'TotalScore') ?? 0,
      grade: valueOf(subject, 'grade', 'Grade') || '',
      remark: valueOf(subject, 'remark', 'Remark') || '',
      first_CA_Score: valueOf(subject, 'first_CA_Score', 'First_CA_Score') ?? 0,
      second_CA_Score: valueOf(subject, 'second_CA_Score', 'Second_CA_Score') ?? 0,
      third_CA_Score: valueOf(subject, 'third_CA_Score', 'Third_CA_Score') ?? 0,
      continuousAssessmentTotal: valueOf(subject, 'continuousAssessmentTotal', 'ContinuousAssessmentTotal') ?? 0,
      firstTermTotal: valueOf(subject, 'firstTermTotal', 'FirstTermTotal') ?? 0,
      secondTermTotal: valueOf(subject, 'secondTermTotal', 'SecondTermTotal') ?? 0,
      thirdTermTotal: valueOf(subject, 'thirdTermTotal', 'ThirdTermTotal') ?? 0,
      averageScore: valueOf(subject, 'averageScore', 'AverageScore') ?? 0,
    })),
  };
}

function formatPosition(position: number) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const remainder = position % 100;
  return `${position}${suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]}`;
}

function buildReportPage(data: any, kind: ReportKind, selectedTerm: number) {
  const termName = String(kind === 'midterm' ? data.term : (selectedTerm === 1 ? 'first' : selectedTerm === 2 ? 'second' : 'third')).toLowerCase();
  const termLabel = termName === 'first' ? '1ST TERM' : termName === 'second' ? '2ND TERM' : '3RD TERM';
  const position = kind === 'cumulative' ? data.cumulativePosition : data.position;
  const percentage = kind === 'cumulative' ? data.cumulativePercentage : data.percentage;
  const resumeDate = data.nextTermBeginsOn
    ? new Date(data.nextTermBeginsOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
  const subjectRows = data.subjects.map((subject: any) => {
    if (kind === 'midterm') {
      return `<tr><td class="subj">${escapeHtml(subject.subjectName.toUpperCase())}</td><td class="c">${escapeHtml(subject.first_CA_Score)}</td><td class="c">${escapeHtml(subject.second_CA_Score)}</td><td class="c">${escapeHtml(subject.third_CA_Score)}</td><td class="c b">${escapeHtml(subject.continuousAssessmentTotal)}</td></tr>`;
    }
    if (kind === 'cumulative') {
      return `<tr><td class="subj">${escapeHtml(subject.subjectName.toUpperCase())}</td><td class="c">${escapeHtml(subject.firstTermTotal || '—')}</td><td class="c">${escapeHtml(subject.secondTermTotal || '—')}</td><td class="c">${escapeHtml(subject.thirdTermTotal || '—')}</td><td class="c b">${Number(subject.averageScore || 0).toFixed(1)}</td><td class="c b">${escapeHtml(subject.grade)}</td><td class="c">${escapeHtml(subject.remark)}</td></tr>`;
    }
    const caTotal = Number(subject.firstCA || 0) + Number(subject.secondCA || 0) + Number(subject.thirdCA || 0);
    return `<tr><td class="subj">${escapeHtml(subject.subjectName.toUpperCase())}</td><td class="c">100</td><td class="c">${caTotal}</td><td class="c">${escapeHtml(subject.exam)}</td><td class="c b">${escapeHtml(subject.totalScore)}</td><td class="c b">${escapeHtml(subject.grade)}</td><td class="c">${escapeHtml(subject.remark)}</td></tr>`;
  }).join('');
  const headers = kind === 'midterm' ? ['SUBJECTS', '1st CA', '2nd CA', '3rd CA', 'CA Total']
    : kind === 'cumulative' ? ['SUBJECTS', '1st Term Total', '2nd Term Total', '3rd Term Total', 'Average', 'Grade', 'Remarks']
      : ['SUBJECTS', 'Marks Obtainable', 'Continuous Assessment', 'Exam Score', `${termLabel} Score (%)`, 'Grade', 'Remarks'];
  const gradingRows = GRADING_TABLE.map(([grade, range, remark]) => `<tr><td style="font-weight:600">${grade} = ${range}</td><td>${remark}</td></tr>`).join('');
  const effectivenessRows = EFFECTIVENESS_ITEMS.map((item) => `<tr><td>${item}</td>${[5, 4, 3, 2, 1].map(() => '<td class="c"><div class="bx"></div></td>').join('')}</tr>`).join('');
  const studentInfo = kind === 'cumulative'
    ? `<tr><td><span class="lbl">STUDENT ID:</span> ${escapeHtml(data.studentUin)}</td><td><span class="lbl">NO. IN CLASS:</span> ${escapeHtml(data.totalStudents)}</td><td><span class="lbl">POSITION:</span> ${formatPosition(Number(position || 0))}</td><td><span class="lbl">GENDER:</span> ${escapeHtml(data.gender)}</td></tr>`
    : `<tr><td><span class="lbl">NO. IN CLASS:</span> ${escapeHtml(data.totalStudents)}</td><td><span class="lbl">POSITION:</span> ${formatPosition(Number(position || 0))}</td><td><span class="lbl">GENDER:</span> ${escapeHtml(data.gender)}</td><td colspan="2"><span class="lbl">STUDENT ID:</span> ${escapeHtml(data.studentUin)}</td></tr>`;
  const signature = (url: string | null, alt: string) => url ? `<img src="${mediaUrl(url)}" style="max-height:21px;max-width:100%;object-fit:contain" alt="${alt}">` : '';
  const attendance = `<table><tr><td class="sh" style="width:50%">Attendance</td><td class="sh">Weight / Height</td></tr></table><table><tr><td style="width:25%">No. of Times School Opened</td><td style="width:25%"></td><td style="width:25%">Expected Date of Resumption</td><td style="width:25%">${escapeHtml(resumeDate)}</td></tr><tr><td>No. of Times Present</td><td></td><td>Height at the end of term</td><td></td></tr><tr><td>No. of Times Punctual</td><td></td><td>Weight at the beginning of term</td><td></td></tr><tr><td></td><td></td><td>Weight at the end of term</td><td></td></tr></table>`;
  const photo = mediaUrl(data.studentPhotoUrl);
  const subtitle = kind === 'cumulative' ? `Cumulative Report Sheet — ${escapeHtml(data.session)}` : 'Report Sheet';

  return `<div class="page">
    <div class="header"><div class="logo">${data.schoolLogo ? `<img src="${mediaUrl(data.schoolLogo)}" alt="${escapeHtml(data.schoolName)} logo">` : ''}</div><div class="meta"><h1>${escapeHtml(data.schoolName)}</h1><div class="sub">${subtitle}</div></div><div class="student-photo">${photo ? `<img data-student-photo="true" src="${photo}" alt="${escapeHtml(data.studentName)} profile">` : '<span style="font-size:9px;color:#666;text-align:center;line-height:1.2;padding:4px">No photo uploaded</span>'}</div></div>
    <table class="info"><tr><td><span class="lbl">STUDENT'S NAME:</span> ${escapeHtml(data.studentName)}</td><td><span class="lbl">SESSION:</span> ${escapeHtml(data.session)}</td>${kind !== 'cumulative' ? `<td><span class="lbl">TERM:</span> ${termLabel}</td>` : ''}<td><span class="lbl">CLASS:</span> ${escapeHtml(data.className)}</td><td><span class="lbl">PERFORMANCE:</span> ${Number(percentage || 0).toFixed(1)}%</td></tr>${studentInfo}</table>
    ${attendance}<table><tr><td class="sh" colspan="${headers.length}">${kind === 'midterm' ? 'Mid-term Assessment — Continuous Assessment Only' : kind === 'cumulative' ? 'Assessment — Cumulative' : 'Assessment'}</td></tr></table>
    <table class="at"><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${subjectRows || `<tr><td class="c" colspan="${headers.length}">No results available.</td></tr>`}</tbody></table>
    <div class="bg"><div><h4>Grading Method</h4><table>${gradingRows}</table></div><div><h4>Effectiveness</h4><table><tr><th></th>${[5, 4, 3, 2, 1].map((score) => `<th class="c">${score}</th>`).join('')}</tr>${effectivenessRows}</table></div></div>
    <div class="cm"><span class="lbl">Class Teacher's Comment:</span> <em style="white-space:pre-wrap">${escapeHtml(data.classTeacherComment || '')}</em> ______________________________________________ &nbsp;&nbsp;
      <span class="lbl">Signature:</span> <span style="display:inline-flex;width:72px;height:22px;align-items:flex-end;justify-content:center;border-bottom:1px solid #999">${signature(data.classTeacherSignatureUrl, 'Class teacher signature')}</span></div>
    <div class="cm"><span class="lbl">Principal's Comment:</span> <em>${escapeHtml(data.principalRemark || '')}</em></div><div class="cm"></div>
    <div class="siggrid"><div class="in"><div class="sigbox">${signature(data.principalSignatureUrl, 'Principal signature')}</div><strong><em>Principal</em></strong><br><strong>${escapeHtml(data.schoolName).toUpperCase()}</strong></div><div class="in"><div class="sigbox">${signature(data.studentSignatureUrl, 'Student signature')}</div><strong><em>Student</em></strong><br><strong>${escapeHtml(data.studentName)}</strong></div></div>
  </div>`;
}

export function makeStudentDashboardPrintDocument(reports: { report: any; student: GetManyStudentResponse }[], kind: ReportKind, term: number, title: string) {
  const primary = typeof window !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue('--primary') || '#1e3a5f'
    : '#1e3a5f';
  const pages = reports.map(({ report, student }) => buildReportPage(mapReportForStudentPrint(report, student), kind, term)).join('');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${PRINT_STYLES.replace(/__PRIMARY__/g, primary.trim())}.page+.page{break-before:page;page-break-before:always}</style></head><body>${pages}</body></html>`;
}

export async function waitForReportImages(doc: Document) {
  await Promise.all(Array.from(doc.images).map(async (image) => {
    if (!image.complete) {
      await new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve(), { once: true });
        image.addEventListener('error', () => resolve(), { once: true });
      });
    }
    if (image.dataset.studentPhoto === 'true' && image.naturalWidth === 0) {
      image.remove();
      const fallback = doc.createElement('span');
      fallback.textContent = 'Student photo unavailable';
      fallback.style.cssText = 'font-size:9px;color:#666;text-align:center;line-height:1.2;padding:4px';
      image.parentElement?.appendChild(fallback);
    }
    await image.decode?.().catch(() => undefined);
  }));
  await doc.fonts?.ready;
}

export async function renderStudentDashboardReportPdf(html: string): Promise<Blob> {
  const [pdfModule, canvasModule] = await Promise.all([
    import('../vendor/pdf/jspdf.umd.min.js'),
    import('../vendor/pdf/html2canvas.min.js'),
  ]);
  const pdfExports = pdfModule as any;
  const canvasExports = canvasModule as any;
  const JsPdfConstructor = (window as any).jspdf?.jsPDF
    ?? pdfExports.jsPDF
    ?? pdfExports.default?.jsPDF
    ?? pdfExports.default;
  const html2canvas = (window as any).html2canvas
    ?? canvasExports.html2canvas
    ?? canvasExports.default;
  if (typeof JsPdfConstructor !== 'function' || typeof html2canvas !== 'function') {
    throw new Error('The PDF tools could not be loaded. Please refresh and try again.');
  }

  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;left:-12000px;top:0;width:794px;height:1200px;border:0;visibility:hidden';
  document.body.appendChild(frame);
  try {
    await new Promise<void>((resolve, reject) => {
      frame.onload = () => resolve();
      frame.onerror = () => reject(new Error('Could not prepare a report card for PDF export.'));
      frame.srcdoc = html;
    });
    const doc = frame.contentDocument;
    const page = doc?.querySelector<HTMLElement>('.page');
    if (!doc || !page) throw new Error('The report card page could not be rendered.');
    // The student dashboard's print media rule removes the body's screen padding.
    // Apply the same rule here because html2canvas captures screen media.
    doc.body.style.padding = '0';
    await waitForReportImages(doc);

    const width = Math.ceil(Math.max(page.getBoundingClientRect().width, page.scrollWidth));
    const height = Math.ceil(Math.max(page.getBoundingClientRect().height, page.scrollHeight));
    frame.style.height = `${height + 24}px`;
    const canvas = await html2canvas(page, {
      backgroundColor: '#ffffff',
      scale: 1.75,
      useCORS: true,
      allowTaint: false,
      logging: false,
      width,
      height,
      windowWidth: width + 12,
      windowHeight: height + 12,
      scrollX: 0,
      scrollY: 0,
    });

    const isLandscape = canvas.width > canvas.height;
    const pdf = new JsPdfConstructor({ orientation: isLandscape ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = isLandscape ? 297 : 210;
    const pageHeight = isLandscape ? 210 : 297;
    const margin = 6;
    const fitScale = Math.min((pageWidth - margin * 2) / canvas.width, (pageHeight - margin * 2) / canvas.height);
    const imageWidth = canvas.width * fitScale;
    const imageHeight = canvas.height * fitScale;
    const x = (pageWidth - imageWidth) / 2;
    const y = margin;
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', x, y, imageWidth, imageHeight);
    return pdf.output('blob');
  } finally {
    frame.remove();
  }
}
