/* =========================================================
   GrainControl DZ
   Storage Units UI V1
   واجهة وحدات التخزين
   مستودعات + صوامع + خلايا + تخزين سائب
   ========================================================= */

(function () {
  "use strict";

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function typeName(type) {
    return {
      warehouse: "مستودع أكياس",
      bulk: "تخزين سائب"
    }[type] || "وحدة تخزين";
  }

  function statusBadge(status) {
    if (status === "خطر") return "🔴 خطر";
    if (status === "يحتاج متابعة") return "🟡 يحتاج متابعة";
    return "🟢 مستقر";
  }

  function getVisibleWarehouses() {
    try {
      const state = JSON.parse(
        localStorage.getItem("gcdz_v2") || "null"
      );

      const warehouses =
        state && Array.isArray(state.warehouses)
          ? state.warehouses
          : [];

      if (
        typeof window.gcIsInspector === "function" &&
        window.gcIsInspector() &&
        typeof window.gcAssignedWarehouseIds === "function"
      ) {
        const ids = window.gcAssignedWarehouseIds();

        return warehouses.filter(function (w) {
          return ids.includes(String(w.id));
        });
      }

      return warehouses;
    } catch (e) {
      return [];
    }
  }
  function getVisibleUnits() {
    const units = getUnits();

    if (
      typeof window.gcIsInspector !== "function" ||
      !window.gcIsInspector()
    ) {
      return units;
    }

    if (typeof window.gcCanAccessWarehouse !== "function") {
      return [];
    }

    return units.filter(function (u) {
      return (
        u.warehouseId !== null &&
        u.warehouseId !== undefined &&
        u.warehouseId !== "" &&
        window.gcCanAccessWarehouse(u.warehouseId)
      );
    });
  }
  function getUnits() {
    if (
      !window.gcStorageUnits ||
      typeof window.gcStorageUnits.all !== "function"
    ) {
      return [];
    }

    return window.gcStorageUnits.all();
  }

  function renderStorageUnits() {
    const container = document.getElementById("storageUnitsContent");
    if (!container) return;

    const units = getUnits();


    container.innerHTML = `
      <div class="toolbar">
        <h2>وحدات التخزين</h2>

        <button class="btn primary"
          onclick="gcOpenStorageUnitForm()">
          ＋ إضافة وحدة تخزين
        </button>
      </div>

      <div class="grid3">

        <div class="card">
          <small>إجمالي الوحدات</small>
          <b>${units.length}</b>
        </div>


      </div>

      <div class="panel">
        <h3>قائمة وحدات التخزين</h3>

        ${
          units.length
            ? `
              <div class="grid3">
                ${units.map(function (u) {
                  const parent = u.parentId
                    ? units.find(function (x) {
                        return String(x.id) === String(u.parentId);
                      })
                    : null;

                  return `
                      <div class=""card"">

 <div style='margin:0 0 16px;padding:12px;background:#f5f7f9;border-radius:12px;border:1px solid #d9dee3;'>
 <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'>
 <b>نسبة الامتلاء</b>
 <strong style='font-size:20px;color:#8a6a00;'>${Math.round(Number(u.fillLevel||0))}%</strong>
 </div>
 <div style='height:16px;background:#e3e7eb;border-radius:10px;overflow:hidden;'>
 <div style='height:100%;width:${Math.max(0,Math.min(100,Number(u.fillLevel||0)))}%;background:linear-gradient(90deg,#b58b16,#e2c34d);border-radius:10px;transition:width .5s;'></div>
 </div>
 </div>


                      <h3>${esc(u.name)}</h3>

                      <p>
                        <b>النوع:</b>
                        ${typeName(u.type)}
                      </p>


                      <p>
                        <b>المنتج:</b>
                        ${esc(u.product || "غير محدد")}
                      </p>

                      <p>
                        <b>الكمية:</b>
                        ${Number(u.quantity || 0).toLocaleString("ar-DZ")}
                        قنطار
                      </p>

                      ${
                        u.capacity
                          ? `
                            <p>
                              <b>السعة:</b>
                              ${Number(u.capacity).toLocaleString("ar-DZ")}
                              قنطار
                            </p>
                          `
                          : ""
                      }

                      ${
                        u.moisture !== ""
                          ? `
                            <p>
                              <b>الرطوبة:</b>
                              ${esc(u.moisture)} %
                            </p>
                          `
                          : ""
                      }

                      ${
                        u.grainTemperature !== ""
                          ? `
                            <p>
                              <b>حرارة الحبوب:</b>
                              ${esc(u.grainTemperature)} °C
                            </p>
                          `
                          : ""
                      }

                      <p>
                        <b>الحالة:</b>
                        ${statusBadge(u.status)}
                      </p>

                      <div class="actions">


                        <button class="btn secondary"
                          onclick="gcEditStorageUnit(${u.id})">
                          ✏️ تعديل
                        </button>

                        <button class="btn secondary"
                          onclick="gcDeleteStorageUnit(${u.id})">
                          🗑️ حذف
                        </button>

                      </div>

                    </div>
                  `;
                }).join("")}
              </div>
            `
            : `
              <div class="card">
                <p>
                  لا توجد وحدات تخزين بعد.
                </p>

                <p>
                  يمكنك إضافة عدد غير محدود من المستودعات والصوامع
                  والخلايا والتخزين السائب.
                </p>
              </div>
            `
        }
      </div>
    `;
  }

  function openStorageUnitForm() {
    const modalContent = `
      <h2>إضافة وحدة تخزين</h2>

      <div class="grid">

        <div>
          <label>اسم / رقم الوحدة</label>
          <input id="gc_su_name" type="text">
        </div>

        <div>
          <label>المجمع / المخزن</label>
          <select id="gc_su_warehouse">
            ${getVisibleWarehouses().map(function (w) {
              return `
                <option value="${w.id}">
                  ${esc(w.name)}
                </option>
              `;
            }).join("")}
          </select>
        </div>

        <div>
          <label>نوع وحدة التخزين</label>
          <select id="gc_su_type">
            <option value="warehouse">مستودع أكياس</option>
            <option value="bulk">تخزين سائب</option>
          </select>
        </div>

        <div>
          <label>المنتج</label>
          <input id="gc_su_product" type="text"
            value="قمح صلب">
        </div>

        <div>
          <label>الكمية (قنطار)</label>
          <input id="gc_su_quantity" type="number" min="0" value="0">
        </div>

        <div>
          <label>السعة (قنطار)</label>
          <input id="gc_su_capacity" type="number" min="0" value="0">
        </div>

        <div>
          <label>رقم الدفعة / Lot</label>
          <input id="gc_su_lot" type="text">
        </div>

        <div>
          <label>الموقع</label>
          <input id="gc_su_location" type="text">
        </div>

        <div>
          <label>الرطوبة (%)</label>
          <input id="gc_su_moisture" type="number"
            min="0" step="0.1">
        </div>

        <div>
          <label>درجة حرارة الحبوب (°C)</label>
          <input id="gc_su_temp" type="number"
            step="0.1">
        </div>

        <div>
          <label>مستوى الامتلاء (%)</label>
          <input id="gc_su_fill" type="number"
            min="0" max="100">
        </div>

        <div>
          <label>التهوية</label>
          <select id="gc_su_ventilation">
            <option>غير محددة</option>
            <option>متوقفة</option>
            <option>تعمل</option>
            <option>تحتاج صيانة</option>
          </select>
        </div>

        <div>
          <label>حالة الآفات</label>
          <select id="gc_su_pests">
            <option>غير محددة</option>
            <option>لا توجد</option>
            <option>مراقبة</option>
            <option>موجودة</option>
          </select>
        </div>

        <div>
          <label>الحالة</label>
          <select id="gc_su_status">
            <option>مستقر</option>
            <option>يحتاج متابعة</option>
            <option>خطر</option>
          </select>
        </div>

      </div>

      <div class="actions">

        <button class="btn primary"
          onclick="gcSaveNewStorageUnit()">
          حفظ
        </button>

        <button class="btn secondary"
          onclick="closeM()">
          إلغاء
        </button>

      </div>
    `;

    if (typeof modal === "function") {
      modal(modalContent);
    } else {
      alert("واجهة النوافذ المنبثقة غير متاحة.");
    }
  }

  function saveNewStorageUnit() {
    try {
      const data = {
        name: document.getElementById("gc_su_name").value.trim(),
        type: document.getElementById("gc_su_type").value,
        parentId: null,
        warehouseId: document.getElementById("gc_su_warehouse").value,
        product: document.getElementById("gc_su_product").value.trim(),
        quantity: Number(document.getElementById("gc_su_quantity").value || 0),
        capacity: Number(document.getElementById("gc_su_capacity").value || 0),
        lot: document.getElementById("gc_su_lot").value.trim(),
        location: document.getElementById("gc_su_location").value.trim(),
        moisture: document.getElementById("gc_su_moisture").value,
        grainTemperature: document.getElementById("gc_su_temp").value,
        fillLevel: document.getElementById("gc_su_fill").value,
        ventilation: document.getElementById("gc_su_ventilation").value,
        pestStatus: document.getElementById("gc_su_pests").value,
        status: document.getElementById("gc_su_status").value
      };

      if (!data.name) {
        return alert("أدخل اسم أو رقم وحدة التخزين.");
      }

      if (data.type !== "warehouse" && data.type !== "bulk") {
        return alert("نوع وحدة التخزين غير صالح.");
      }

      window.gcStorageUnits.add(data);

      if (typeof closeM === "function") {
        closeM();
      }

      renderStorageUnits();
      alert("تمت إضافة وحدة التخزين بنجاح.");
    } catch (e) {
      alert(e.message || "حدث خطأ أثناء إضافة وحدة التخزين.");
    }
  }

  function editStorageUnit(id) {
    const unit = getUnits().find(function (u) {
      return String(u.id) === String(id);
    });

    if (!unit) return;


    const modalContent = `
      <h2>تعديل وحدة التخزين: ${esc(unit.name)}</h2>

      <div class="grid">

        <div>
          <label>اسم / رقم الوحدة</label>
          <input id="gc_edit_name"
            value="${esc(unit.name)}">
        </div>

        <div>
          <label>المنتج</label>
          <input id="gc_edit_product"
            value="${esc(unit.product)}">
        </div>

        <div>
          <label>الكمية (قنطار)</label>
          <input id="gc_edit_quantity"
            type="number"
            value="${Number(unit.quantity || 0)}">
        </div>

        <div>
          <label>السعة (قنطار)</label>
          <input id="gc_edit_capacity"
            type="number"
            value="${Number(unit.capacity || 0)}">
        </div>

        <div>
          <label>الرطوبة (%)</label>
          <input id="gc_edit_moisture"
            type="number"
            step="0.1"
            value="${esc(unit.moisture)}">
        </div>

        <div>
          <label>درجة حرارة الحبوب (°C)</label>
          <input id="gc_edit_temp"
            type="number"
            step="0.1"
            value="${esc(unit.grainTemperature)}">
        </div>

        <div>
          <label>مستوى الامتلاء (%)</label>
          <input id="gc_edit_fill"
            type="number"
            min="0"
            max="100"
            value="${esc(unit.fillLevel)}">
        </div>

        <div>
          <label>التهوية</label>
          <select id="gc_edit_vent">
            <option ${unit.ventilation === "غير محددة" ? "selected" : ""}>
              غير محددة
            </option>
            <option ${unit.ventilation === "متوقفة" ? "selected" : ""}>
              متوقفة
            </option>
            <option ${unit.ventilation === "تعمل" ? "selected" : ""}>
              تعمل
            </option>
            <option ${unit.ventilation === "تحتاج صيانة" ? "selected" : ""}>
              تحتاج صيانة
            </option>
          </select>
        </div>

        <div>
          <label>حالة الآفات</label>
          <select id="gc_edit_pests">
            <option ${unit.pestStatus === "غير محددة" ? "selected" : ""}>
              غير محددة
            </option>
            <option ${unit.pestStatus === "لا توجد" ? "selected" : ""}>
              لا توجد
            </option>
            <option ${unit.pestStatus === "مراقبة" ? "selected" : ""}>
              مراقبة
            </option>
            <option ${unit.pestStatus === "موجودة" ? "selected" : ""}>
              موجودة
            </option>
          </select>
        </div>

        <div>
          <label>الحالة</label>
          <select id="gc_edit_status">
            <option ${unit.status === "مستقر" ? "selected" : ""}>
              مستقر
            </option>
            <option ${unit.status === "يحتاج متابعة" ? "selected" : ""}>
              يحتاج متابعة
            </option>
            <option ${unit.status === "خطر" ? "selected" : ""}>
              خطر
            </option>
          </select>
        </div>

      </div>

      <div class="actions">

        <button class="btn primary"
          onclick="gcSaveStorageEdit(${unit.id})">
          حفظ التعديل
        </button>

        <button class="btn secondary"
          onclick="closeM()">
          إلغاء
        </button>

      </div>
    `;

    modal(modalContent);
  }

  function saveStorageEdit(id) {
    try {
      window.gcStorageUnits.update(id, {
        name: document.getElementById("gc_edit_name").value.trim(),
        product: document.getElementById("gc_edit_product").value.trim(),
        quantity: Number(
          document.getElementById("gc_edit_quantity").value || 0
        ),
        capacity: Number(
          document.getElementById("gc_edit_capacity").value || 0
        ),
        moisture:
          document.getElementById("gc_edit_moisture").value,
        grainTemperature:
          document.getElementById("gc_edit_temp").value,
        fillLevel:
          document.getElementById("gc_edit_fill").value,
        ventilation:
          document.getElementById("gc_edit_vent").value,
        pestStatus:
          document.getElementById("gc_edit_pests").value,
        status:
          document.getElementById("gc_edit_status").value
      });

      closeM();
      renderStorageUnits();

      alert("تم حفظ التعديل بنجاح.");
    } catch (e) {
      alert(e.message || "حدث خطأ أثناء التعديل.");
    }
  }

  function deleteStorageUnit(id) {
    if (!confirm("هل تريد حذف وحدة التخزين؟")) {
      return;
    }

    try {
      window.gcStorageUnits.remove(id);
      renderStorageUnits();
      alert("تم حذف وحدة التخزين.");
    } catch (e) {
      alert(e.message || "تعذر حذف الوحدة.");
    }
  }

  function createStorageSection() {
    if (document.getElementById("storageUnits")) {
      renderStorageUnits();
      return;
    }

    const section = document.createElement("section");

    section.id = "storageUnits";

    section.innerHTML = `
      <div id="storageUnitsContent"></div>
    `;

    const app = document.querySelector("main");

    if (app) {
      app.appendChild(section);
    } else {
      document.body.appendChild(section);
    }

    renderStorageUnits();
  }

  function addStoragePageToNavigation() {
    if (typeof pages === "undefined" || !Array.isArray(pages)) {
      return;
    }

    const exists = pages.some(function (p) {
      return p[0] === "storageUnits";
    });

    if (!exists) {
      const index = pages.findIndex(function (p) {
        return p[0] === "warehouses";
      });

      if (index >= 0) {
        pages.splice(index + 1, 0, [
          "storageUnits",
          "وحدات التخزين"
        ]);
      }
    }
  }

  window.gcOpenStorageUnitForm = function () {
    openStorageUnitForm();
  };

  window.gcSaveNewStorageUnit = function () {
    saveNewStorageUnit();
  };



  window.gcEditStorageUnit = function (id) {
    editStorageUnit(id);
  };

  window.gcSaveStorageEdit = function (id) {
    saveStorageEdit(id);
  };

  window.gcDeleteStorageUnit = function (id) {
    deleteStorageUnit(id);
  };

  window.gcRenderStorageUnits = renderStorageUnits;

  document.addEventListener("DOMContentLoaded", function () {
    addStoragePageToNavigation();
    createStorageSection();
  });

  console.log("GrainControl DZ Storage Units UI V1 loaded successfully.");
})();













