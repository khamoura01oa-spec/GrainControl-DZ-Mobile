/* GrainControl DZ - Quality Module
   GHP / HACCP inspired quality inspection engine
*/

(function () {
  "use strict";

  const QUALITY_KEY = "gcdz_quality_v1";

  function getQualityData() {
    try {
      return JSON.parse(localStorage.getItem(QUALITY_KEY)) || {
        inspections: [],
        correctiveActions: []
      };
    } catch {
      return {
        inspections: [],
        correctiveActions: []
      };
    }
  }

  function saveQualityData(data) {
    localStorage.setItem(QUALITY_KEY, JSON.stringify(data));
  }

  function generateInspectionNumber() {
    const data = getQualityData();
    const year = new Date().getFullYear();
    return `GC-${year}-${String(data.inspections.length + 1).padStart(4, "0")}`;
  }

  function riskLevel(type, severity, probability) {
    const s = Number(severity) || 1;
    const p = Number(probability) || 1;
    const score = s * p;

    let level = "منخفض";

    if (score >= 9) level = "مرتفع";
    else if (score >= 4) level = "متوسط";

    return {
      type,
      severity: s,
      probability: p,
      score,
      level
    };
  }

  function buildAutomaticReport(inspection) {
    const issues = [];

    if (inspection.pest && inspection.pest !== "لا توجد") {
      issues.push(`تم تسجيل وجود ${inspection.pest}`);
    }

    if (inspection.temperature !== "" &&
        Number(inspection.temperature) > 35) {
      issues.push("تم تسجيل ارتفاع في درجة الحرارة");
    }

    if (inspection.humidity !== "" &&
        Number(inspection.humidity) > 14) {
      issues.push("تم تسجيل رطوبة تستوجب المتابعة وفق معيار الموقع المعتمد");
    }

    inspection.checks.forEach(check => {
      if (!check.ok) issues.push(check.label);
    });

    inspection.risks.forEach(risk => {
      if (risk.level === "مرتفع") {
        issues.push(`خطر ${risk.type} بمستوى مرتفع`);
      }
    });

    let conclusion = "";
    let recommendation = "";

    if (issues.length === 0) {
      conclusion =
        "أظهرت نتائج المعاينة أن الحالة العامة للمخزن والمنتج مستقرة، " +
        "ولم يتم تسجيل انحرافات تستوجب إجراءً تصحيحيًا فوريًا.";
      recommendation =
        "يوصى بمواصلة برنامج المراقبة الدورية والتوثيق وفق إجراءات الجودة المعتمدة.";
    } else {
      conclusion =
        "أظهرت نتائج المعاينة تسجيل بعض الملاحظات والانحرافات التي تستوجب المتابعة، " +
        "وقد تم توثيقها ضمن سجل مراقبة الجودة.";
      recommendation =
        "يوصى باتخاذ الإجراءات التصحيحية المناسبة، وتحديد المسؤول عن التنفيذ، " +
        "ثم إجراء متابعة للتحقق من فعالية الإجراء المتخذ.";
    }

    return (
      `خلاصة معاينة الجودة رقم ${inspection.number}: ` +
      `بتاريخ ${inspection.date} تم إجراء معاينة على مستوى المخزن ` +
      `${inspection.warehouse} للمنتج ${inspection.product}. ` +
      ` ${conclusion} ` +
      (issues.length
        ? `وقد تم تسجيل الملاحظات التالية: ${issues.join("، ")}. `
        : "") +
      ` ${recommendation}`
    );
  }

  function createInspection(data) {
    const quality = getQualityData();

    const inspection = {
      number: generateInspectionNumber(),
      date: new Date().toLocaleString("ar-DZ"),

      warehouse: data.warehouse || "غير محدد",
      product: data.product || "غير محدد",
      quantity: data.quantity || "",

      inspector: data.inspector || "مراقب النوعية",

      temperature: data.temperature ?? "",
      humidity: data.humidity ?? "",
      pest: data.pest || "لا توجد",

      checks: data.checks || [],

      risks: (data.risks || []).map(r =>
        riskLevel(
          r.type,
          r.severity,
          r.probability
        )
      ),

      deviation: Boolean(data.deviation),

      correctiveAction: data.correctiveAction || "",

      followUpDate: data.followUpDate || "",

      notes: data.notes || "",

      status: data.deviation ? "تحتاج متابعة" : "مستقر"
    };

    inspection.report = buildAutomaticReport(inspection);

    quality.inspections.unshift(inspection);
    saveQualityData(quality);

    return inspection;
  }

  function getInspections() {
    return getQualityData().inspections;
  }

  function exportQualityReport(inspection) {
    const html = `
<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>${inspection.number}</title>

<style>
body{
  font-family:Tahoma,Arial,sans-serif;
  margin:40px;
  color:#172936;
  line-height:1.9;
}

.header{
  border-bottom:4px solid #c9a227;
  padding-bottom:15px;
  margin-bottom:25px;
}

.title{
  font-size:25px;
  font-weight:bold;
  color:#10283d;
}

.subtitle{
  color:#66757f;
}

.box{
  border:1px solid #dce3e8;
  border-radius:12px;
  padding:15px;
  margin:15px 0;
}

table{
  width:100%;
  border-collapse:collapse;
}

th,td{
  border:1px solid #dce3e8;
  padding:9px;
}

th{
  background:#10283d;
  color:white;
}

.signature{
  margin-top:60px;
  display:flex;
  justify-content:space-between;
}
@media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 11px;
    line-height: 1.45;
  }

  .header {
    padding-bottom: 6px;
    margin-bottom: 10px;
  }

  .title {
    font-size: 18px;
  }

  h1 {
    font-size: 17px;
    margin: 8px 0;
  }

  .box {
    padding: 7px;
    margin: 7px 0;
    border-radius: 6px;
  }

  .box h3 {
    margin: 3px 0;
    font-size: 13px;
  }

  table {
    font-size: 10px;
  }

  th,
  td {
    padding: 5px;
  }

  .signature {
    margin-top: 20px;
  }
}
</style>
</head>

<body>

<div class="header">
  <div class="title">🌾 GrainControl DZ</div>
  <div class="subtitle">نيابة النوعية — نظام مراقبة جودة الحبوب</div>
</div>

<h1>تقرير معاينة ومراقبة الجودة</h1>

<div class="box">
<b>رقم المعاينة:</b> ${inspection.number}<br>
<b>التاريخ:</b> ${inspection.date}<br>
<b>المخزن:</b> ${inspection.warehouse}<br>
<b>المنتج:</b> ${inspection.product}<br>
<b>الكمية:</b> ${inspection.quantity || "غير محددة"} قنطار
</div>

<div class="box">
<h3>نتائج القياسات</h3>

<table>
<tr>
<th>درجة الحرارة</th>
<th>الرطوبة</th>
<th>الحشرات</th>
<th>الحالة</th>
</tr>

<tr>
<td>${inspection.temperature || "—"} °C</td>
<td>${inspection.humidity || "—"} %</td>
<td>${inspection.pest}</td>
<td>${inspection.status}</td>
</tr>
</table>
</div>

<div class="box">
<h3>تقييم المخاطر</h3>

<table>
<tr>
<th>نوع الخطر</th>
<th>الشدة</th>
<th>الاحتمالية</th>
<th>المستوى</th>
</tr>

${inspection.risks.map(r => `
<tr>
<td>${r.type}</td>
<td>${r.severity}</td>
<td>${r.probability}</td>
<td>${r.level}</td>
</tr>
`).join("")}

</table>
</div>

<div class="box">
<h3>الخلاصة المهنية</h3>

<p>${inspection.report}</p>
</div>

<div class="box">
<h3>الإجراء التصحيحي والمتابعة</h3>

<p>
${inspection.correctiveAction || "لا يوجد إجراء تصحيحي مسجل."}
</p>

<p>
<b>موعد المتابعة:</b>
${inspection.followUpDate || "غير محدد"}
</p>
</div>

<div class="box">
<h3>ملاحظات مراقب النوعية</h3>

<p>${inspection.notes || "لا توجد ملاحظات إضافية."}</p>
</div>

<div class="signature">

<div>
<b>أعدّ المعاينة:</b><br>
${inspection.inspector}<br>
مراقب النوعية<br><br>
الإمضاء: __________________
</div>

<div>
<b>المراجعة والاعتماد:</b><br>
نائب مدير النوعية<br><br>
الإمضاء: __________________
</div>

</div>

</body>
</html>
`;

    const win = window.open("", "_blank");

    if (!win) {
      alert("تعذر فتح التقرير. اسمح للتطبيق بفتح نافذة التقرير.");
      return;
    }

    win.document.write(html);
    win.document.close();
setTimeout(() => {
  if (win && !win.isDestroyed()) {
    win.focus();

    win.webContents.print(
      {
        silent: false,
        printBackground: true
      },
      (success, failureReason) => {
        if (!success) {
          console.error("Print failed:", failureReason);
        }
      }
    );
  }
}, 800);
  }

  window.GrainQuality = {
    createInspection,
    getInspections,
    exportQualityReport,
    generateInspectionNumber,
    riskLevel,
    buildAutomaticReport
  };

})();