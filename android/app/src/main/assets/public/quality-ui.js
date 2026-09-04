(function () {
  "use strict";

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getPestProfile(pest) {
    const data = {
      "Sitophilus spp.": {
        name: "سوسة الحبوب",
        scientific: "Sitophilus spp.",
        category: "آفة من آفات الحبوب المخزنة",
        signs:
          "ثقوب أو آثار تغذية في الحبوب، وجود أفراد بالغة أو يرقات، وزيادة الإصابة داخل البؤرة.",
        inspect:
          "فحص عينات من الحبوب والأكياس، خاصة مناطق التكديس والبؤر المشبوهة، وتحديد مدى الانتشار.",
        action:
          "تحديد البؤرة وتنظيف المخزن وإزالة بقايا الحبوب وتكثيف المعاينات، مع تقييم وسيلة مكافحة معتمدة وفق إجراءات المؤسسة.",
        priority: "متوسطة"
      },

      "Tribolium castaneum": {
        name: "خنفساء الطحين الحمراء",
        scientific: "Tribolium castaneum",
        category: "خنفساء مخازن شائعة",
        signs:
          "وجود خنافس بالغة وقد ترتبط الإصابة ببقايا الحبوب والغبار والمواد المتراكمة.",
        inspect:
          "فحص المنتج والغبار وبقايا الحبوب وحواف وأركان المخزن وتحديد مصدر الإصابة.",
        action:
          "تنظيف مصادر الغذاء والغبار، تحديد البؤرة وتكثيف المراقبة وتقييم المكافحة المعتمدة عند الحاجة.",
        priority: "متوسطة"
      },

      "Tribolium confusum": {
        name: "خنفساء الطحين المتشابهة",
        scientific: "Tribolium confusum",
        category: "خنفساء مخازن",
        signs:
          "وجود خنافس بالغة وآثار وجودها في الحبوب أو المواد المتراكمة.",
        inspect:
          "فحص المنتج والمناطق المحيطة وبقايا المواد وتحديد مصدر الإصابة ونطاقها.",
        action:
          "تحسين النظافة وإزالة البقايا والغبار وتكثيف المتابعة وتقييم المكافحة المعتمدة عند الحاجة.",
        priority: "متوسطة"
      },

      "Oryzaephilus surinamensis": {
        name: "خنفساء المخزن المسننة",
        scientific: "Oryzaephilus surinamensis",
        category: "آفة مخازن",
        signs:
          "خنافس صغيرة في المنتج أو الأكياس أو المناطق المخفية وبقايا المواد الغذائية.",
        inspect:
          "فحص الأكياس والمنتج والمناطق المخفية ومصادر الغذاء المتبقية.",
        action:
          "تنظيف المخزن وإزالة مصادر الغذاء المتبقية وتحديد البؤرة وتكثيف المراقبة.",
        priority: "متوسطة"
      },

      "Cryptolestes spp.": {
        name: "خنافس الحبوب المسطحة",
        scientific: "Cryptolestes spp.",
        category: "آفة حبوب مخزنة",
        signs:
          "حشرات صغيرة مرتبطة بالحبوب ومناطق التكديس.",
        inspect:
          "فحص الحبوب والأكياس والمناطق ذات التهوية الضعيفة وتحديد البؤرة.",
        action:
          "تحسين النظافة والتهوية حسب ظروف المخزن وتحديد البؤرة وتكثيف المتابعة.",
        priority: "متوسطة"
      },

      "Plodia interpunctella": {
        name: "عثة الحبوب الهندية",
        scientific: "Plodia interpunctella",
        category: "عثة مخزنية",
        signs:
          "يرقات أو خيوط حول المنتج أو فراشات بالغة وآثار تغذية.",
        inspect:
          "البحث عن اليرقات وآثار التغذية والشبكات وفحص المنتج والمناطق المجاورة.",
        action:
          "تحديد البؤرة وتنظيف المخزن وفحص المناطق المجاورة وتكثيف المتابعة.",
        priority: "متوسطة"
      },

      "Sitotroga cerealella": {
        name: "عثة الحبوب",
        scientific: "Sitotroga cerealella",
        category: "آفة حبوب",
        signs:
          "علامات إصابة على الحبوب ووجود فراشات أو مراحل غير بالغة.",
        inspect:
          "فحص الحبوب والأكياس بحثًا عن علامات الإصابة ومتابعة تطورها.",
        action:
          "تحديد البؤرة وتكثيف المعاينات الدورية وتقييم المكافحة المعتمدة عند الحاجة.",
        priority: "متوسطة"
      },

      "Trogoderma spp.": {
        name: "خنفساء الجلد/المخزن",
        scientific: "Trogoderma spp.",
        category: "آفة مخازن مهمة",
        signs:
          "وجود خنافس أو يرقات أو جلود انسلاخ وآثار الإصابة في الأكياس أو المنتج والمناطق المحيطة.",
        inspect:
          "توسيع المعاينة حول البؤرة، فحص الأكياس والمنتج والمناطق المجاورة وتحديد نطاق الانتشار.",
        action:
          "تحديد نطاق الإصابة وعزل المنطقة المتأثرة عند الحاجة، وتنفيذ إجراءات النظافة والمتابعة، مع تقييم وسيلة مكافحة معتمدة وفق إجراءات المؤسسة.",
        priority: "عالية"
      },

      "يرقات": {
        name: "يرقات حشرية",
        scientific: "غير محدد",
        category: "مرحلة غير بالغة",
        signs:
          "وجود يرقات في المنتج أو الأكياس أو المخزن.",
        inspect:
          "تحديد نوع اليرقات ومصدرها ونطاق انتشارها مع توثيق مكان العثور عليها.",
        action:
          "تكثيف المعاينة وتحديد البؤرة قبل اختيار أي إجراء مكافحة.",
        priority: "متوسطة"
      },

      "حشرات أخرى": {
        name: "حشرة غير محددة",
        scientific: "غير محدد",
        category: "تحتاج تحديد هوية",
        signs:
          "وجود حشرة غير محددة في المنتج أو المخزن.",
        inspect:
          "تصوير الحشرة أو وصفها وتحديد مكان وجودها ونطاق انتشارها ثم تأكيد الهوية إن أمكن.",
        action:
          "تحديد الهوية ومصدر الإصابة وتكثيف المراقبة قبل اتخاذ إجراء مكافحة.",
        priority: "متوسطة"
      }
    };

    return data[pest] || null;
  }

  function getPestPriority(basePriority, severity) {
    if (severity === "شديدة") return "عالية";
    if (severity === "خفيفة" && basePriority === "متوسطة") {
      return "منخفضة إلى متوسطة";
    }
    return basePriority;
  }

  function updatePestRecommendation() {
    const pestEl = document.getElementById("gcqPest");
    const severityEl = document.getElementById("gcqPestSeverity");
    const box = document.querySelector(
      "#gcqPestRecommendation .gcq-recommendation-box"
    );

    if (!pestEl || !box) return;

    const pest = pestEl.value;
    const severity = severityEl ? severityEl.value : "غير محددة";

    if (pest === "لا توجد") {
      box.innerHTML =
        "<b>الحالة:</b> لا توجد آفة مسجلة.<br>" +
        "<b>التوصية:</b> الاستمرار في المراقبة الدورية.";
      return;
    }

    const info = getPestProfile(pest) || {
      name: pest,
      scientific: "",
      category: "غير محدد",
      signs: "تحتاج الآفة إلى تحديد الهوية.",
      inspect: "تحديد النوع ومكان وجودها ونطاق انتشارها.",
      action:
        "تكثيف المراقبة وتحديد الإجراء المناسب وفق إجراءات المؤسسة.",
      priority: "متوسطة"
    };

    const priority = getPestPriority(info.priority, severity);

    box.innerHTML =
      "<div class='gcq-pest-title'><b>" +
      esc(info.name) +
      "</b>" +
      (info.scientific ? " — " + esc(info.scientific) : "") +
      "</div>" +
      "<div><b>التصنيف:</b> " +
      esc(info.category) +
      "</div>" +
      "<div><b>الأولوية:</b> " +
      esc(priority) +
      "</div>" +
      "<div><b>علامات يجب البحث عنها:</b> " +
      esc(info.signs) +
      "</div>" +
      "<div><b>المعاينة المقترحة:</b> " +
      esc(info.inspect) +
      "</div>" +
      "<div><b>الحل/الإجراء المقترح:</b> " +
      esc(info.action) +
      "</div>" +
      "<div><b>شدة الإصابة:</b> " +
      esc(severity) +
      "</div>" +
      "<small>التوصية إرشادية ولا تستبدل إجراءات المؤسسة أو تعليمات المنتج أو المكافحة المعتمدة.</small>";
  }

  function qualityUI() {
    if (document.getElementById("gcQualityOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "gcQualityOverlay";

    overlay.innerHTML = `
      <div class="gcq-modal">
        <div class="gcq-head">
          <div>
            <div class="gcq-title">🌾 معاينة مراقبة الجودة</div>
            <div class="gcq-sub">نيابة النوعية — GHP / HACCP</div>
          </div>
          <button class="gcq-close" id="gcqClose">×</button>
        </div>

        <div class="gcq-body">

          <div class="gcq-section">
            <h3>01 — بيانات المعاينة</h3>

            <div class="gcq-grid">
              <div>
                <label>رقم المعاينة</label>
                <input id="gcqNumber" readonly>
              </div>

              <div>
                <label>التاريخ</label>
                <input id="gcqDate" readonly>
              </div>

              <div>
                <label>المخزن</label>
                <input id="gcqWarehouse" placeholder="اسم أو رقم المخزن">
              </div>

              <div>
                <label>المنتج</label>
                <input id="gcqProduct" value="قمح صلب">
              </div>

              <div>
                <label>الكمية — قنطار</label>
                <input id="gcqQuantity" type="number">
              </div>

              <div>
                <label>مراقب النوعية</label>
                <input id="gcqInspector" value="أسامة بلعيدي">
              </div>
            </div>
          </div>

          <div class="gcq-section">
            <h3>02 — ظروف التخزين والنظافة</h3>

            <div class="gcq-checks">
              <label class="gcq-check">
                <input type="checkbox" data-label="نظافة المخزن" checked>
                <span>نظافة المخزن</span>
              </label>

              <label class="gcq-check">
                <input type="checkbox" data-label="سلامة الأكياس" checked>
                <span>سلامة الأكياس</span>
              </label>

              <label class="gcq-check">
                <input type="checkbox" data-label="سلامة الأرضية والجدران" checked>
                <span>الأرضية والجدران</span>
              </label>

              <label class="gcq-check">
                <input type="checkbox" data-label="التهوية" checked>
                <span>التهوية</span>
              </label>

              <label class="gcq-check">
                <input type="checkbox" data-label="عدم وجود تسرب مياه" checked>
                <span>عدم وجود تسرب مياه</span>
              </label>

              <label class="gcq-check">
                <input type="checkbox" data-label="عدم وجود روائح غير طبيعية" checked>
                <span>عدم وجود روائح</span>
              </label>

              <label class="gcq-check">
                <input type="checkbox" data-label="عدم وجود آثار قوارض أو طيور" checked>
                <span>القوارض / الطيور</span>
              </label>

              <label class="gcq-check">
                <input type="checkbox" data-label="ترتيب التكديس" checked>
                <span>ترتيب التكديس</span>
              </label>
            </div>
          </div>

          <div class="gcq-section">
            <h3>03 — مراقبة المنتج</h3>

            <div class="gcq-grid">

              <div>
                <label>درجة الحرارة °C</label>
                <input id="gcqTemp" type="number" step="0.1">
              </div>

              <div>
                <label>الرطوبة %</label>
                <input id="gcqHumidity" type="number" step="0.1">
              </div>

              <div>
                <label>الحشرات</label>
                <select id="gcqPest">
                  <option value="لا توجد">لا توجد</option>
                  <option value="Sitophilus spp.">سوسة الحبوب — Sitophilus spp.</option>
                  <option value="Tribolium castaneum">خنفساء الطحين الحمراء — Tribolium castaneum</option>
                  <option value="Tribolium confusum">خنفساء الطحين المتشابهة — Tribolium confusum</option>
                  <option value="Oryzaephilus surinamensis">خنفساء المخزن المسننة — Oryzaephilus surinamensis</option>
                  <option value="Cryptolestes spp.">خنافس الحبوب المسطحة — Cryptolestes spp.</option>
                  <option value="Plodia interpunctella">عثة الحبوب الهندية — Plodia interpunctella</option>
                  <option value="Sitotroga cerealella">عثة الحبوب — Sitotroga cerealella</option>
                  <option value="Trogoderma spp.">خنفساء الجلد/المخزن — Trogoderma spp.</option>
                  <option value="يرقات">يرقات</option>
                  <option value="حشرات أخرى">حشرات أخرى</option>
                </select>
              </div>

              <div>
                <label>شدة الإصابة</label>
                <select id="gcqPestSeverity">
                  <option value="غير محددة">غير محددة</option>
                  <option value="خفيفة">خفيفة — فردية/محدودة</option>
                  <option value="متوسطة">متوسطة — أكثر من بؤرة</option>
                  <option value="شديدة">شديدة — انتشار واضح</option>
                </select>
              </div>

              <div class="gcq-pest-recommendation" id="gcqPestRecommendation">
                <label>التوصية المقترحة</label>
                <div class="gcq-recommendation-box">
                  لا توجد توصية خاصة — استمر في المراقبة الدورية.
                </div>
              </div>

              <div>
                <label>الشوائب</label>
                <select id="gcqImpurity">
                  <option>ضمن الحالة المقبولة</option>
                  <option>تحتاج متابعة</option>
                  <option>مرتفعة</option>
                </select>
              </div>
            </div>

            <label>ملاحظات المنتج</label>
            <textarea id="gcqProductNotes" placeholder="أدخل الملاحظات..."></textarea>
          </div>

          <div class="gcq-section">
            <h3>04 — تقييم المخاطر HACCP</h3>

            <div class="gcq-grid">
              <div>
                <label>نوع الخطر</label>
                <select id="gcqRiskType">
                  <option value="">لا يوجد خطر مسجل</option>
                  <option>بيولوجي</option>
                  <option>كيميائي</option>
                  <option>فيزيائي</option>
                </select>
              </div>

              <div>
                <label>شدة الخطر</label>
                <select id="gcqSeverity">
                  <option value="1">1 — منخفضة</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 — مرتفعة</option>
                </select>
              </div>

              <div>
                <label>احتمالية الحدوث</label>
                <select id="gcqProbability">
                  <option value="1">1 — ضعيفة</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 — مرتفعة</option>
                </select>
              </div>

              <div>
                <label>الإجراء الرقابي</label>
                <input id="gcqControl" placeholder="إجراء التحكم أو المراقبة">
              </div>
            </div>

            <div id="gcqRiskResult" class="gcq-risk">
              لم يتم تسجيل خطر.
            </div>
          </div>

          <div class="gcq-section">
            <h3>05 — الانحراف والإجراء التصحيحي</h3>

            <label class="gcq-deviation">
              <input id="gcqDeviation" type="checkbox">
              توجد حالة انحراف تحتاج إلى إجراء تصحيحي
            </label>

            <label>الإجراء التصحيحي</label>
            <textarea id="gcqCorrective"
              placeholder="اذكر الإجراء المتخذ لمعالجة الحالة..."></textarea>

            <div class="gcq-grid">
              <div>
                <label>مسؤول تنفيذ الإجراء</label>
                <input id="gcqActionOwner" placeholder="اسم المسؤول">
              </div>

              <div>
                <label>تاريخ المتابعة</label>
                <input id="gcqFollowDate" type="date">
              </div>
            </div>
          </div>

          <div class="gcq-section">
            <h3>06 — ملاحظات مراقب النوعية</h3>
            <textarea id="gcqNotes"
              placeholder="الملاحظات النهائية للمعاينة..."></textarea>
          </div>

          <div id="gcqPreview" class="gcq-preview">
            <h3>الخلاصة التلقائية</h3>
            <p>أكمل بيانات المعاينة لإظهار الخلاصة.</p>
          </div>
        </div>

        <div class="gcq-footer">
          <div class="gcq-sign">
            <div>أعدّ المعاينة</div>
            <b id="gcqSignName">أسامة بلعيدي</b>
            <small>مراقب النوعية</small>
            <div class="gcq-line">________________</div>
          </div>

          <div class="gcq-sign">
            <div>المراجعة والاعتماد</div>
            <b>نائب مدير النوعية</b>
            <small>الاعتماد</small>
            <div class="gcq-line">________________</div>
          </div>
        </div>

        <div class="gcq-actions">
          <button class="btn secondary" id="gcqCancel">إلغاء</button>
          <button class="btn primary" id="gcqSave">حفظ المعاينة والتقرير</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    const style = document.createElement("style");

    style.textContent = `
      #gcQualityOverlay{
        position:fixed;
        inset:0;
        z-index:99999;
        background:rgba(7,26,42,.72);
        backdrop-filter:blur(5px);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:18px;
        direction:rtl;
      }

      .gcq-modal{
        width:min(1100px,100%);
        max-height:94vh;
        overflow:auto;
        background:#f6f8fa;
        border-radius:20px;
        box-shadow:0 30px 80px rgba(0,0,0,.35);
        border-top:5px solid #c9a227;
        color:#111111;
        font-family:"Cairo","Tajawal","Segoe UI",Arial,sans-serif;
      }

      .gcq-head{
        background:linear-gradient(135deg,#071a2a,#193c55);
        color:white;
        padding:20px 24px;
        display:flex;
        justify-content:space-between;
        align-items:center;
      }

      .gcq-title{
        font-size:23px;
        font-weight:900;
        color:white;
      }

      .gcq-sub{
        margin-top:5px;
        color:#d9e4eb;
        font-size:13px;
        font-weight:600;
      }

      .gcq-close{
        border:0;
        background:rgba(255,255,255,.1);
        color:white;
        font-size:28px;
        width:42px;
        height:42px;
        border-radius:10px;
        cursor:pointer;
      }

      .gcq-body{
        padding:20px;
      }

      .gcq-section{
        background:white;
        border:1px solid #dce3e8;
        border-radius:15px;
        padding:17px;
        margin-bottom:15px;
        color:#111111;
      }

      .gcq-section h3{
        margin-top:0;
        color:#080808;
        font-weight:900;
        border-right:4px solid #c9a227;
        padding-right:10px;
      }

      .gcq-grid{
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:12px;
      }

      .gcq-grid label,
      .gcq-pest-recommendation > label{
        display:block;
        font-weight:800;
        font-size:13px;
        margin-bottom:5px;
        color:#111111;
      }

      .gcq-grid input,
      .gcq-grid select,
      .gcq-section textarea,
      .gcq-section input,
      .gcq-section select{
        width:100%;
        padding:11px;
        border:1px solid #bfcbd3;
        border-radius:9px;
        font:inherit;
        color:#111111;
        background:white;
        font-weight:600;
      }

      .gcq-grid input:focus,
      .gcq-grid select:focus,
      .gcq-section textarea:focus{
        outline:none;
        border-color:#087443;
        box-shadow:0 0 0 3px rgba(8,116,67,.12);
      }

      .gcq-section textarea{
        min-height:90px;
        margin-top:5px;
        resize:vertical;
      }

      .gcq-checks{
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:9px;
      }

      .gcq-check{
        display:flex;
        align-items:center;
        gap:9px;
        padding:11px;
        border:1px solid #e0e6ea;
        border-radius:10px;
        cursor:pointer;
        color:#111111;
        font-weight:700;
      }

      .gcq-check:hover{
        background:#fafafa;
      }

      .gcq-check input{
        width:18px;
        height:18px;
        accent-color:#c9a227;
      }

      .gcq-pest-recommendation{
        grid-column:1 / -1;
        margin-top:4px;
      }

      .gcq-recommendation-box{
        margin-top:6px;
        padding:15px;
        border:1px solid #d9c98b;
        border-right:5px solid #c9a227;
        border-radius:12px;
        background:#fffdf5;
        color:#111111;
        line-height:1.95;
        font-weight:600;
      }

      .gcq-recommendation-box b{
        color:#080808;
        font-weight:900;
      }

      .gcq-recommendation-box small{
        display:block;
        margin-top:9px;
        color:#111111;
        font-weight:600;
      }

      .gcq-pest-title{
        font-size:17px;
        margin-bottom:6px;
        color:#080808;
      }

      .gcq-risk{
        margin-top:12px;
        padding:13px;
        border-radius:10px;
        background:#eef3f6;
        color:#111111;
        font-weight:800;
      }

      .gcq-deviation{
        display:flex;
        gap:10px;
        align-items:center;
        margin-bottom:12px;
        font-weight:800;
        color:#111111;
      }

      .gcq-deviation input{
        width:18px;
        height:18px;
        accent-color:#a51f1f;
      }

      .gcq-preview{
        background:#fffdf5;
        border:1px solid #e6d8a6;
        border-right:5px solid #c9a227;
        border-radius:14px;
        padding:17px;
        line-height:1.95;
        color:#111111;
      }

      .gcq-preview h3{
        margin-top:0;
        color:#080808;
        font-weight:900;
      }

      .gcq-preview p,
      .gcq-preview b{
        color:#111111;
      }

      .gcq-footer{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:30px;
        padding:20px;
        background:white;
        border-top:1px solid #dce3e8;
      }

      .gcq-sign{
        text-align:center;
        padding:12px;
        color:#111111;
        font-weight:600;
      }

      .gcq-sign b{
        display:block;
        margin-top:8px;
        color:#080808;
        font-weight:900;
      }

      .gcq-sign small{
        color:#111111;
        font-weight:600;
      }

      .gcq-line{
        margin-top:15px;
        color:#111111;
      }

      .gcq-actions{
        padding:15px 20px 20px;
        display:flex;
        gap:10px;
        justify-content:flex-start;
        background:white;
      }

      .gcq-actions button{
        font-family:"Cairo","Tajawal","Segoe UI",Arial,sans-serif;
        font-weight:900;
      }

      @media(max-width:650px){
        .gcq-grid,
        .gcq-checks,
        .gcq-footer{
          grid-template-columns:1fr;
        }

        .gcq-title{
          font-size:18px;
        }

        .gcq-body{
          padding:12px;
        }
      }
    `;

    document.head.appendChild(style);

    const now = new Date();

    document.getElementById("gcqNumber").value =
      window.GrainQuality
        ? window.GrainQuality.generateInspectionNumber()
        : "GC-" + now.getFullYear() + "-0001";

    document.getElementById("gcqDate").value =
      now.toLocaleString("ar-DZ");

    updateRisk();
    updatePestRecommendation();
    updatePreview();

    document.getElementById("gcqClose").onclick = close;
    document.getElementById("gcqCancel").onclick = close;

document.getElementById("gcqSave").onclick = saveInspection;

    document.getElementById("gcqRiskType").onchange = updateRisk;
    document.getElementById("gcqSeverity").onchange = updateRisk;
    document.getElementById("gcqProbability").onchange = updateRisk;

    const pestSelect =
      document.getElementById("gcqPest");

    const pestSeverity =
      document.getElementById("gcqPestSeverity");

    if (pestSelect) {
      pestSelect.addEventListener("change", function () {
        updatePestRecommendation();
        updatePreview();
      });
    }

    if (pestSeverity) {
      pestSeverity.addEventListener("change", function () {
        updatePestRecommendation();
        updatePreview();
      });
    }

    document.querySelectorAll(
      "#gcQualityOverlay input, #gcQualityOverlay select, #gcQualityOverlay textarea"
    ).forEach(el => {
      el.addEventListener("input", updatePreview);
      el.addEventListener("change", updatePreview);
    });
    function updateRisk() {
      const type =
        document.getElementById("gcqRiskType").value;

      if (!type) {
        document.getElementById("gcqRiskResult").textContent =
          "لم يتم تسجيل خطر.";
        return;
      }

      const severity =
        Number(document.getElementById("gcqSeverity").value);

      const probability =
        Number(document.getElementById("gcqProbability").value);

      const score = severity * probability;

      let level = "منخفض";

      if (score >= 9) {
        level = "مرتفع";
      } else if (score >= 4) {
        level = "متوسط";
      }

      document.getElementById("gcqRiskResult").textContent =
        `الخطر: ${type} — درجة التقييم: ${score}/25 — المستوى: ${level}`;
    }

    function updatePreview() {
      const warehouse =
        document.getElementById("gcqWarehouse").value ||
        "المخزن غير محدد";

      const product =
        document.getElementById("gcqProduct").value ||
        "المنتج غير محدد";

      const temp =
        document.getElementById("gcqTemp").value;

      const humidity =
        document.getElementById("gcqHumidity").value;

      const pest =
        document.getElementById("gcqPest").value;

      const severityEl =
        document.getElementById("gcqPestSeverity");

      const pestSeverity =
        severityEl ? severityEl.value : "غير محددة";

      const impurity =
        document.getElementById("gcqImpurity").value;

      const deviation =
        document.getElementById("gcqDeviation").checked;

      const problems = [];

      document.querySelectorAll(
        ".gcq-check input:not(:checked)"
      ).forEach(input => {
        problems.push(input.dataset.label);
      });

      if (pest !== "لا توجد") {
        problems.push(
          `وجود ${pest}${pestSeverity !== "غير محددة"
            ? ` — شدة الإصابة: ${pestSeverity}`
            : ""}`
        );
      }

      if (impurity !== "ضمن الحالة المقبولة") {
        problems.push(`الشوائب: ${impurity}`);
      }

      if (deviation) {
        problems.push(
          "وجود انحراف يحتاج إلى إجراء تصحيحي"
        );
      }

      const status =
        problems.length
          ? "تحتاج إلى متابعة"
          : "مستقرة";

      const pestInfo =
        pest !== "لا توجد"
          ? getPestProfile(pest)
          : null;

      const text =
        `بناءً على المعاينة المنجزة على مستوى ${warehouse} ` +
        `للمنتج ${product}، وبعد تقييم ظروف التخزين وحالة المنتج ` +
        `ومؤشرات المراقبة، تبين أن الحالة العامة ${status}. ` +
        (temp
          ? `وقد بلغت درجة الحرارة المسجلة ${temp} °C. `
          : "") +
        (humidity
          ? `وسجلت رطوبة قدرها ${humidity} %. `
          : "") +
        (pestInfo
          ? `تم تسجيل آفة ${pestInfo.name} بدرجة شدة ${pestSeverity}. ` +
            `${pestInfo.action} `
          : "") +
        (problems.length
          ? `وتتمثل أهم الملاحظات في: ${problems.join("، ")}. ` +
            `يوصى باتخاذ الإجراء التصحيحي المناسب ومتابعة فعاليته.`
          : `لم تسجل المعاينة الحالية ملاحظات تستوجب إجراءً تصحيحيًا فوريًا، ` +
            `مع الاستمرار في برنامج المراقبة الدورية والتوثيق.`);

      document.getElementById("gcqPreview").innerHTML = `
        <h3>الخلاصة التلقائية</h3>
        <p>${esc(text)}</p>
        <b>الحالة: ${status}</b>
        ${
          pestInfo
            ? `
              <div style="
                margin-top:12px;
                padding:12px;
                border:1px solid #d9c98b;
                border-radius:10px;
                background:#fffdf5;
                color:#111;
              ">
                <b>توصية الآفة:</b>
                ${esc(pestInfo.action)}
              </div>
            `
            : ""
        }
      `;

      document.getElementById("gcqSignName").textContent =
        document.getElementById("gcqInspector").value ||
        "مراقب النوعية";
    }

function gcGetCurrentQualityUser() {
  try {

    return JSON.parse(
      localStorage.getItem("gcdz_user") || "null"
    );

  } catch (e) {
    return null;

  }

}

    function saveInspection() {
      const warehouse =
        document.getElementById("gcqWarehouse").value.trim();

      if (!warehouse) {
        alert("أدخل اسم أو رقم المخزن.");
        return;
      }

      const pest =
        document.getElementById("gcqPest").value;

      const pestSeverityEl =
        document.getElementById("gcqPestSeverity");

      const pestSeverity =
        pestSeverityEl
          ? pestSeverityEl.value
          : "غير محددة";

      const pestInfo =
        pest !== "لا توجد"
          ? getPestProfile(pest)
          : null;

      const pestPriority =
        pestInfo
          ? getPestPriority(
              pestInfo.priority,
              pestSeverity
            )
          : "غير applicable";

      const recommendation =
        pestInfo
          ? pestInfo.action
          : "لا توجد توصية خاصة — الاستمرار في المراقبة الدورية.";

      const inspection = {
        number:
          document.getElementById("gcqNumber").value,

        date:
          document.getElementById("gcqDate").value,

        warehouse,

        product:
          document.getElementById("gcqProduct").value,

        quantity:
          document.getElementById("gcqQuantity").value,

        inspector:
  document.getElementById("gcqInspector").value,

inspectorId:
  (function () {
    try {
      const user = JSON.parse(
        localStorage.getItem("gcdz_user") || "null"
      );

      return user && user.id
        ? String(user.id)
        : null;
    } catch (e) {
      return null;
    }
  })(),


temperature:
          document.getElementById("gcqTemp").value,

        humidity:
          document.getElementById("gcqHumidity").value,

        pest,

        pestSeverity,

        pestPriority,

        pestRecommendation: recommendation,

        pestInspectionAdvice:
          pestInfo ? pestInfo.inspect : "",

        pestSigns:
          pestInfo ? pestInfo.signs : "",

        impurity:
          document.getElementById("gcqImpurity").value,

        deviation:
          document.getElementById("gcqDeviation").checked,

        correctiveAction:
          document.getElementById("gcqCorrective").value,

        actionOwner:
          document.getElementById("gcqActionOwner").value,

        followUpDate:
          document.getElementById("gcqFollowDate").value,

        notes:
          document.getElementById("gcqNotes").value,

        productNotes:
          document.getElementById("gcqProductNotes").value,

        riskType:
          document.getElementById("gcqRiskType").value,

        riskSeverity:
          document.getElementById("gcqSeverity").value,

        riskProbability:
          document.getElementById("gcqProbability").value,

        riskControl:
          document.getElementById("gcqControl").value,

        checks:
          Array.from(
            document.querySelectorAll(".gcq-check input")
          ).map(input => ({
            label: input.dataset.label,
            ok: input.checked
          })),

        createdAt: Date.now()
      };

      if (window.GrainQuality) {
        try {
          window.GrainQuality.createInspection({
            warehouse: inspection.warehouse,
            product: inspection.product,
            quantity: inspection.quantity,
            inspector: inspection.inspector,
            temperature: inspection.temperature,
            humidity: inspection.humidity,
            pest: inspection.pest,
            deviation: inspection.deviation,
            correctiveAction:
              inspection.correctiveAction,
            followUpDate:
              inspection.followUpDate,
            notes: inspection.notes,

            checks: inspection.checks,

            risks: inspection.riskType
              ? [{
                  type: inspection.riskType,
                  severity: inspection.riskSeverity,
                  probability: inspection.riskProbability
                }]
              : []
          });
        } catch (error) {
          console.error(
            "GrainQuality error:",
            error
          );
        }
      }

      let saved =
        JSON.parse(
          localStorage.getItem(
            "gcdz_quality_records"
          ) || "[]"
        );

      if (!Array.isArray(saved)) {
        saved =
          saved &&
          typeof saved === "object"
            ? [saved]
            : [];
      }

      saved.unshift(inspection);

      localStorage.setItem(
        "gcdz_quality_records",
        JSON.stringify(saved)
      );

      alert(
        "تم حفظ معاينة الجودة والتوصية الخاصة بالآفة بنجاح."
      );

      close();

      if (typeof render === "function") {
        render();
      }
    }

    function close() {
      overlay.remove();
    }
  }

  window.openProfessionalQuality = qualityUI;

})();

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const buttons =
      document.querySelectorAll(
        'button[data-gc-quality-test]'
      );

    if (!buttons.length) {
      const button =
        document.createElement("button");

      button.innerHTML =
        "🧪 مراقبة الجودة";

      button.style.cssText =
        "position:fixed;" +
        "bottom:25px;" +
        "right:25px;" +
        "z-index:9998;" +
        "padding:13px 20px;" +
        "border:0;" +
        "border-radius:12px;" +
        "background:#087443;" +
        "color:white;" +
        "font-weight:bold;" +
        "font-size:15px;" +
        "cursor:pointer;";

      button.onclick = function () {
        if (
          window.openProfessionalQuality
        ) {
          window.openProfessionalQuality();
        } else {
          alert(
            "نظام مراقبة الجودة لم يتم تحميله بعد."
          );
        }
      };

      document.body.appendChild(button);
    }
  }
);

(function () {
  const recordsButton =
    document.createElement("button");

  recordsButton.textContent =
    "📋 سجل المعاينات";

  recordsButton.style.cssText =
    "position:fixed;" +
    "bottom:25px;" +
    "right:190px;" +
    "z-index:99999;" +
    "padding:14px 20px;" +
    "border:0;" +
    "border-radius:12px;" +
    "background:#193c55;" +
    "color:white;" +
    "font-weight:bold;" +
    "font-size:15px;" +
    "cursor:pointer;";

  recordsButton.onclick =
    function () {
   const allRecords =
  JSON.parse(
    localStorage.getItem(
      "gcdz_quality_records"
    ) || "[]"
  );

let currentUser = null;

try {
  currentUser = JSON.parse(
    localStorage.getItem("gcdz_user") || "null"
  );
} catch (e) {
  currentUser = null;
}

let records = Array.isArray(allRecords)
  ? allRecords
  : [];

if (
  currentUser &&
  currentUser.role === "inspector"
) {
  records =
    records.filter(function (record) {

      return String(
        record.inspectorId || ""
      ) === String(
        currentUser.id || ""
      );

    });
}

      const box =
        document.createElement("div");

      box.style.cssText =
        "position:fixed;" +
        "inset:0;" +
        "z-index:100000;" +
        "background:#0008;" +
        "display:flex;" +
        "align-items:center;" +
        "justify-content:center;" +
        "padding:20px;";

      box.innerHTML = `
        <div style="
          background:white;
          width:min(1000px,100%);
          max-height:90vh;
          overflow:auto;
          border-radius:18px;
          padding:22px;
          direction:rtl;
          font-family:Cairo,Tajawal,Segoe UI,Arial;
          color:#111;
        ">
          <h2 style="color:#080808">
            📋 سجل معاينات الجودة
          </h2>

          <p style="color:#111">
            عدد المعاينات المحفوظة:
            <b>${records.length}</b>
          </p>

          ${
            records.length === 0
              ? `
                <div style="
                  padding:25px;
                  background:#f4f7f5;
                  border-radius:12px;
                  text-align:center;
                  color:#111;
                ">
                  لا توجد معاينات محفوظة.
                </div>
              `
              :
              records.map((r, i) => `
                <div style="
                  border:1px solid #dce3e8;
                  border-radius:12px;
                  padding:16px;
                  margin:10px 0;
                  color:#111;
                ">
                  <h3 style="color:#080808">
                    ${esc(r.number || "معاينة")}
                  </h3>

                  <p>
                    <b>المخزن:</b>
                    ${esc(r.warehouse || "—")}
                  </p>

                  <p>
                    <b>المنتج:</b>
                    ${esc(r.product || "—")}
                  </p>

                  <p>
                    <b>التاريخ:</b>
                    ${esc(r.date || "—")}
                  </p>

                  <p>
                    <b>الحرارة:</b>
                    ${esc(r.temperature || "—")} °C
                  </p>

                  <p>
                    <b>الرطوبة:</b>
                    ${esc(r.humidity || "—")} %
                  </p>

                  <p>
                    <b>الآفة:</b>
                    ${esc(r.pest || "لا توجد")}
                  </p>

                  ${
                    r.pest &&
                    r.pest !== "لا توجد"
                      ? `
                        <p>
                          <b>شدة الإصابة:</b>
                          ${esc(r.pestSeverity || "غير محددة")}
                        </p>

                        <p>
                          <b>الأولوية:</b>
                          ${esc(r.pestPriority || "متوسطة")}
                        </p>

                        <p>
                          <b>التوصية:</b>
                          ${esc(r.pestRecommendation || "—")}
                        </p>
                      `
                      : ""
                  }

                  <p>
                    <b>المعاين:</b>
                    ${esc(r.inspector || "—")}
                  </p>

                  <button
                    data-report="${i}"
                    style="
                      margin-top:10px;
                      padding:9px 14px;
                      border:0;
                      border-radius:9px;
                      background:#087443;
                      color:white;
                      font-weight:bold;
                      cursor:pointer;
                    "
                  >
                    📄 فتح التقرير
                  </button>
                </div>
              `).join("")
          }

          <button
            id="closeQualityRecords"
            style="
              margin-top:15px;
              padding:11px 18px;
              border:0;
              border-radius:9px;
              background:#e8f3ed;
              color:#087443;
              font-weight:bold;
              cursor:pointer;
            "
          >
            إغلاق
          </button>
        </div>
      `;

      document.body.appendChild(box);

      document.getElementById(
        "closeQualityRecords"
      ).onclick =
        () => box.remove();

      box.querySelectorAll(
        "[data-report]"
      ).forEach(button => {

        button.onclick =
          function () {
            const record =
              records[
                Number(
                  this.dataset.report
                )
              ];

            if (
              window.GrainQuality &&
              window.GrainQuality.exportQualityReport
            ) {
              window.GrainQuality
                .exportQualityReport({
                  number: record.number,
                  date: record.date,
                  warehouse: record.warehouse,
                  product: record.product,
                  quantity: record.quantity,
                  inspector: record.inspector,
                  temperature: record.temperature,
                  humidity: record.humidity,
                  pest: record.pest,
                  pestSeverity:
                    record.pestSeverity,
                  pestPriority:
                    record.pestPriority,
                  pestRecommendation:
                    record.pestRecommendation,
                  deviation:
                    record.deviation,
                  correctiveAction:
                    record.correctiveAction,
                  followUpDate:
                    record.followUpDate,
                  notes: record.notes,
                  checks:
                    record.checks || [],
                  risks: []
                });
            } else {
              alert(
                "محرك التقارير غير محمل."
              );
            }
          };
      });
    };

  document.body.appendChild(recordsButton);
})();