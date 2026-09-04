(function () {
  "use strict";

  const USERS_KEY = "gcdz_users";
  const CURRENT_USER_KEY = "gcdz_user";

  const PERMISSIONS = {
    manager: ["*"],

    deputy: [
      "view_warehouses",
      "manage_warehouses",
      "receive",
      "transfer",
      "inspect",
      "alerts",
      "reports",
      "chat",
      "manage_users"
    ],

    inspector: [
      "view_warehouses",
      "inspect",
      "alerts",
      "reports",
      "chat"
    ]
  };

  function getCurrentUser() {
    try {
      return JSON.parse(
        localStorage.getItem(CURRENT_USER_KEY) || "null"
      );
    } catch (e) {
      return null;
    }
  }

  function can(permission) {
    const user = getCurrentUser();

    if (!user) return false;

    const list = PERMISSIONS[user.role] || [];

    return list.includes("*") || list.includes(permission);
  }

  window.gcCan = can;

  function getUsers() {
    try {
      const users = JSON.parse(
        localStorage.getItem(USERS_KEY) || "[]"
      );

      return Array.isArray(users) ? users : [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(users)
    );
  }

  function roleName(role) {
    if (role === "manager") return "المسير";
    if (role === "deputy") return "نائب مدير النوعية";
    if (role === "inspector") return "مراقب النوعية";

    return role || "";
  }

  function showModal(html) {
    const modal = document.getElementById("modal");
    const box = document.getElementById("modalbox");

    if (!modal || !box) {
      alert("تعذر فتح نافذة المستخدمين.");
      return;
    }

    box.innerHTML = html;
    modal.classList.add("on");
  }

  window.gcCloseUsers = function () {
    const modal = document.getElementById("modal");

    if (modal) {
      modal.classList.remove("on");
    }
  };

  /*
   * =========================================================
   * المستخدمون
   * =========================================================
   */

  window.openUsers = function () {

    if (!can("manage_users")) {
      alert("لا تملك الصلاحية لإدارة المستخدمين.");
      return;
    }

    const users = getUsers();

    const rows = users.map(function (user) {

      return `
        <tr>
          <td>${user.name || ""}</td>
          <td>${user.username || ""}</td>
          <td>${roleName(user.role)}</td>
          <td>
            ${user.active === false ? "غير نشط" : "نشط"}
          </td>
          <td>
            ${
              user.role === "manager"
                ? "حساب رئيسي"
                : `
                 <button
  type="button"
  class="btn secondary"
  onclick="gcEditUser('${user.id}')">
  ✏️ تعديل
</button>

<button
  type="button"
  class="btn secondary"
  onclick="gcToggleUser('${user.id}')">
  ${
    user.active === false
      ? "تفعيل"
      : "تعطيل"
  }
</button>
                `
            }
          </td>
        </tr>
      `;

    }).join("");

    showModal(`
      <div class="toolbar">
        <h2>👥 المستخدمون والصلاحيات</h2>

        <button
          type="button"
          class="btn secondary"
          onclick="gcCloseUsers()">
          ✕ إغلاق
        </button>
      </div>

      <div class="panel">

        <p class="muted">
          إدارة حسابات المستخدمين والأدوار والصلاحيات.
        </p>

        <div class="actions">

          <button
            type="button"
            class="btn primary"
            onclick="gcAddUser()">
            ＋ إضافة مستخدم
          </button>

          <button
            type="button"
            class="btn secondary"
            onclick="gcCloseUsers()">
            العودة
          </button>

        </div>

        <div style="overflow:auto;margin-top:15px">

          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>اسم المستخدم</th>
                <th>الدور</th>
                <th>الحالة</th>
                <th>الإجراء</th>
              </tr>
            </thead>

            <tbody>
              ${
                rows ||
                `
                <tr>
                  <td colspan="5">
                    لا يوجد مستخدمون.
                  </td>
                </tr>
                `
              }
            </tbody>
          </table>

        </div>

      </div>
    `);
  };

  window.gcAddUser = function () {

    if (!can("manage_users")) {
      alert("لا تملك الصلاحية.");
      return;
    }

    showModal(`
      <div class="toolbar">

        <h2>＋ إضافة مستخدم</h2>

        <button
          type="button"
          class="btn secondary"
          onclick="openUsers()">
          ← رجوع
        </button>

      </div>

      <div class="panel">

        <div class="grid">

          <div>
            <label for="gcUserName">
              الاسم الكامل
            </label>

            <input
              id="gcUserName"
              type="text"
              autocomplete="name"
              placeholder="أدخل الاسم الكامل">
          </div>

          <div>
            <label for="gcUserUsername">
              اسم المستخدم
            </label>

            <input
              id="gcUserUsername"
              type="text"
              autocomplete="username"
              placeholder="أدخل اسم المستخدم">
          </div>

          <div>
            <label for="gcUserPassword">
              كلمة المرور
            </label>

            <input
              id="gcUserPassword"
              type="password"
              autocomplete="new-password"
              placeholder="أدخل كلمة المرور">
          </div>

          <div>
            <label for="gcUserRole">
              نوع الحساب
            </label>

            <select
              id="gcUserRole"
              onchange="gcUpdateWarehouseField()">

              <option value="manager">
                المسير
              </option>

              <option value="deputy">
                نائب مدير النوعية
              </option>

              <option value="inspector">
                مراقب النوعية
              </option>

            </select>

            <div
              id="gcWarehouseField"
              style="display:none;margin-top:12px">

              <label for="gcUserWarehouse">
                المخزن المخصص
              </label>

              <div id="gcUserWarehouse" class="warehouse-checkbox-list"></div>

            </div>

          </div>

        </div>

        <div class="actions">

          <button
            type="button"
            class="btn primary"
            onclick="gcSaveUser()">
            حفظ المستخدم
          </button>

          <button
            type="button"
            class="btn secondary"
            onclick="openUsers()">
            إلغاء
          </button>

        </div>

      </div>
    `);

    setTimeout(function () {

      const input =
        document.getElementById("gcUserName");

      if (input) {
        input.focus();
      }

      gcUpdateWarehouseField();

    }, 50);
  };

  /*
   * =========================================================
   * المخزن المخصص للمراقب
   * =========================================================
   */

  window.gcUpdateWarehouseField = function () {

    const roleElement =
      document.getElementById("gcUserRole");

    const field =
      document.getElementById("gcWarehouseField");

    const container =
      document.getElementById("gcUserWarehouse");

    if (!roleElement || !field || !container) {
      return;
    }

    if (roleElement.value !== "inspector") {
      field.style.display = "none";
      container.innerHTML = "";
      return;
    }

    field.style.display = "";

    let data = null;

    try {
      data = JSON.parse(
        localStorage.getItem("gcdz_v2") || "null"
      );
    } catch (e) {
      data = null;
    }

    const warehouses =
      data && Array.isArray(data.warehouses)
        ? data.warehouses
        : [];

    container.innerHTML = "";

    warehouses.forEach(function (w) {

      const label =
        document.createElement("label");

      label.style.display = "block";
      label.style.marginBottom = "8px";
      label.style.cursor = "pointer";

      const checkbox =
        document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.className = "gcWarehouseCheckbox";
      checkbox.value = String(w.id);
      checkbox.style.marginLeft = "8px";

      label.appendChild(checkbox);

      const text =
        document.createTextNode(
          w.name || "Ù…Ø®Ø²Ù† Ø¨Ø¯ÙˆÙ† Ø§Ø³Ù…"
        );

      label.appendChild(text);

      container.appendChild(label);
    });
  };

  /*
   * =========================================================
   * حفظ المستخدم
   * =========================================================
   */

  window.gcSaveUser = function () {

    if (!can("manage_users")) {
      alert("لا تملك الصلاحية.");
      return;
    }

    const nameElement =
      document.getElementById("gcUserName");

    const usernameElement =
      document.getElementById("gcUserUsername");

    const passwordElement =
      document.getElementById("gcUserPassword");

    const roleElement =
      document.getElementById("gcUserRole");

    if (
      !nameElement ||
      !usernameElement ||
      !passwordElement ||
      !roleElement
    ) {
      alert("تعذر قراءة بيانات المستخدم.");
      return;
    }

    const name =
      nameElement.value.trim();

    const username =
      usernameElement.value.trim();

    const password =
      passwordElement.value;

    const role =
      roleElement.value;

    const warehouseElement =
      document.getElementById("gcUserWarehouse");
    const selectedWarehouseIds =
      warehouseElement
        ? Array.from(
            warehouseElement.querySelectorAll(
              ".gcWarehouseCheckbox:checked"
            )
          )
          .map(function (checkbox) {
            return String(checkbox.value);
          })
          .filter(Boolean)
        : [];

    const warehouseId =
      selectedWarehouseIds.length
        ? selectedWarehouseIds[0]
        : null;

    if (!name || !username || !password) {
      alert("يرجى إكمال جميع البيانات.");
      return;
    }

    if (
      role === "inspector" && !selectedWarehouseIds.length
    ) {
      alert("يجب تعيين مخزن لمراقب النوعية.");
      return;
    }

    const users = getUsers();

    if (
      users.some(function (u) {

        return (
          String(u.username || "").toLowerCase() ===
          username.toLowerCase()
        );

      })
    ) {
      alert("اسم المستخدم موجود مسبقًا.");
      return;
    }

    users.push({

      id:
        "user-" +
        Date.now(),

      username:
        username,

      password:
        password,

      name:
        name,

      role:
        role,

      warehouseId:
        role === "inspector"
          ? warehouseId
          : null,

      warehouseIds:
        role === "inspector"
          ? selectedWarehouseIds
          : [],

      active:
        true

    });

    saveUsers(users);

    alert("تمت إضافة المستخدم بنجاح.");

    openUsers();
  };

  /*
   * =========================================================
   * تفعيل / تعطيل المستخدم
   * =========================================================
  */

window.gcToggleUser = function (id) {

  if (!can("manage_users")) {
    alert("لا تملك الصلاحية.");
    return;
  }

  const users =
    getUsers();

  const user =
    users.find(function (u) {
      return u.id === id;
    });

  if (!user) {
    alert("المستخدم غير موجود.");
    return;
  }

  if (user.role === "manager") {
    alert(
      "لا يمكن تعطيل حساب المسير الرئيسي."
    );
    return;
  }

  user.active =
    user.active === false;

  saveUsers(users);

  openUsers();
};


/*
 * =========================================================
 * تعديل المستخدم وتغيير المخزن
 * =========================================================
 */

window.gcEditUser = function (id) {

  if (!can("manage_users")) {
    alert("لا تملك الصلاحية.");
    return;
  }

  const users = getUsers();

  const user = users.find(function (u) {
    return u.id === id;
  });

  if (!user) {
    alert("المستخدم غير موجود.");
    return;
  }

  let data = null;

  try {
    data = JSON.parse(
      localStorage.getItem("gcdz_v2") || "null"
    );
  } catch (e) {
    data = null;
  }

  const warehouses =
    data && Array.isArray(data.warehouses)
      ? data.warehouses
      : [];

  const currentWarehouseId =
    user.warehouseId != null
      ? String(user.warehouseId)
      : (
          Array.isArray(user.warehouseIds) &&
          user.warehouseIds.length
            ? String(user.warehouseIds[0])
            : ""
        );

  showModal(`
    <div class="toolbar">

      <h2>✏️ تعديل المستخدم</h2>

      <button
        type="button"
        class="btn secondary"
        onclick="openUsers()">
        ← رجوع
      </button>

    </div>

    <div class="panel">

      <div class="grid">

        <div>
          <label>الاسم الكامل</label>

          <input
            id="gcEditUserName"
            type="text"
            value="${user.name || ""}">
        </div>

        <div>
          <label>اسم المستخدم</label>

          <input
            id="gcEditUserUsername"
            type="text"
            value="${user.username || ""}">
        </div>

        <div>
          <label>كلمة المرور</label>

          <input
            id="gcEditUserPassword"
            type="password"
            placeholder="اتركها فارغة للإبقاء على الحالية">
        </div>

        <div>
          <label>نوع الحساب</label>

          <select
            id="gcEditUserRole"
            onchange="gcUpdateEditWarehouseField()">

            <option value="manager"
              ${user.role === "manager" ? "selected" : ""}>
              المسير
            </option>

            <option value="deputy"
              ${user.role === "deputy" ? "selected" : ""}>
              نائب مدير النوعية
            </option>

            <option value="inspector"
              ${user.role === "inspector" ? "selected" : ""}>
              مراقب النوعية
            </option>

          </select>

          <div
            id="gcEditWarehouseField"
            style="display:none;margin-top:12px">

            <label>المخزن المخصص</label>

            <select id="gcEditUserWarehouse">

              <option value="">
                اختر المخزن
              </option>

              ${
                warehouses.map(function (w) {

                  const selected =
                    String(w.id) === currentWarehouseId
                      ? "selected"
                      : "";

                  return `
                    <option
                      value="${String(w.id)}"
                      ${selected}>
                      ${w.name || "مخزن بدون اسم"}
                    </option>
                  `;

                }).join("")
              }

            </select>

          </div>

        </div>

      </div>

      <div class="actions">

        <button
          type="button"
          class="btn primary"
          onclick="gcSaveEditedUser('${user.id}')">
          حفظ التعديلات
        </button>

        <button
          type="button"
          class="btn secondary"
          onclick="openUsers()">
          إلغاء
        </button>

      </div>

    </div>
  `);

  setTimeout(function () {
    gcUpdateEditWarehouseField();
  }, 50);
};


/*
 * =========================================================
 * إظهار مخزن المستخدم المعدل
 * =========================================================
 */

window.gcUpdateEditWarehouseField = function () {

  const roleElement =
    document.getElementById("gcEditUserRole");

  const field =
    document.getElementById("gcEditWarehouseField");

  if (!roleElement || !field) {
    return;
  }

  if (roleElement.value === "inspector") {
    field.style.display = "";
  } else {
    field.style.display = "none";
  }
};


/*
 * =========================================================
 * حفظ تعديل المستخدم
 * =========================================================
 */

window.gcSaveEditedUser = function (id) {

  if (!can("manage_users")) {
    alert("لا تملك الصلاحية.");
    return;
  }

  const users = getUsers();

  const user = users.find(function (u) {
    return u.id === id;
  });

  if (!user) {
    alert("المستخدم غير موجود.");
    return;
  }

  const nameElement =
    document.getElementById("gcEditUserName");

  const usernameElement =
    document.getElementById("gcEditUserUsername");

  const passwordElement =
    document.getElementById("gcEditUserPassword");

  const roleElement =
    document.getElementById("gcEditUserRole");

  const warehouseElement =
    document.getElementById("gcEditUserWarehouse");

  if (
    !nameElement ||
    !usernameElement ||
    !passwordElement ||
    !roleElement
  ) {
    alert("تعذر قراءة بيانات المستخدم.");
    return;
  }

  const name =
    nameElement.value.trim();

  const username =
    usernameElement.value.trim();

  const password =
    passwordElement.value;

  const role =
    roleElement.value;

  if (!name || !username) {
    alert("يرجى إدخال الاسم واسم المستخدم.");
    return;
  }

  const duplicate =
    users.some(function (u) {
      return (
        u.id !== id &&
        String(u.username || "").toLowerCase() ===
        username.toLowerCase()
      );
    });

  if (duplicate) {
    alert("اسم المستخدم موجود مسبقًا.");
    return;
  }

  let warehouseId = null;

  if (role === "inspector") {

    if (!warehouseElement) {
      alert("تعذر قراءة المخزن.");
      return;
    }

    warehouseId =
      warehouseElement.value
        ? String(warehouseElement.value)
        : null;

    if (!warehouseId) {
      alert("يجب تعيين مخزن لمراقب النوعية.");
      return;
    }
  }

  user.name =
    name;

  user.username =
    username;

  user.role =
    role;

  if (password) {
    user.password =
      password;
  }

  if (role === "inspector") {

    user.warehouseId =
      warehouseId;

    user.warehouseIds =
      [warehouseId];

  } else {

    user.warehouseId =
      null;

    user.warehouseIds =
      [];
  }

  saveUsers(users);

  alert("تم حفظ تعديلات المستخدم بنجاح.");

  openUsers();
};
/*
   * =========================================================
   * عزل مخزن مراقب النوعية
   * =========================================================
   */

  function isInspector() {

    const user =
      getCurrentUser();

    return !!user &&
      user.role === "inspector";
  }

  function assignedWarehouseIds() {

    const user =
      getCurrentUser();

    if (!user) {
      return [];
    }

    if (
      Array.isArray(user.warehouseIds) &&
      user.warehouseIds.length
    ) {
      return user.warehouseIds.map(function (id) {
        return String(id);
      }).filter(Boolean);
    }

    if (
      user.warehouseId != null &&
      user.warehouseId !== ""
    ) {
      return [String(user.warehouseId)];
    }

    return [];
  }

  function assignedWarehouseId() {

    const ids =
      assignedWarehouseIds();

    return ids.length
      ? ids[0]
      : null;
  }

  function inspectorOwnsWarehouse(id) {

    if (!isInspector()) {
      return true;
    }

    const assigned =
      assignedWarehouseIds();

    if (!assigned.length) {
      return false;
    }
    return assigned.includes(String(id));
  }

  window.gcInspectorOwnsWarehouse =
    inspectorOwnsWarehouse;

  function denyWarehouseAccess() {

    alert(
      "لا تملك الصلاحية للوصول إلى هذا المخزن."
    );
  }

  /*
   * =========================================================
   * حماية المخازن
   * =========================================================
   */

  const originalOpenW =
    window.openW;

  const originalAddW =
    window.addW;

  const originalDelW =
    window.delW;

  const originalWarehouseCard =
    window.warehouseCard;

  const originalGcWarehouseProducts =
    window.gcWarehouseProducts;

  const originalGcAddProduct =
    window.gcAddProduct;

  const originalGcSaveNewProduct =
    window.gcSaveNewProduct;

  const originalOpenProductInspection =
    window.openProductInspection;

  if (typeof originalOpenW === "function") {

    window.openW = function () {

      if (isInspector()) {

        alert(
          "مراقب النوعية لا يملك صلاحية إضافة مخزن."
        );

        return;
      }

      return originalOpenW.apply(
        this,
        arguments
      );
    };
  }

  if (typeof originalAddW === "function") {

    window.addW = function () {

      if (isInspector()) {

        alert(
          "مراقب النوعية لا يملك صلاحية إضافة مخزن."
        );

        return;
      }

      return originalAddW.apply(
        this,
        arguments
      );
    };
  }

  if (typeof originalDelW === "function") {

    window.delW = function (id) {

      if (isInspector()) {

        alert(
          "مراقب النوعية لا يملك صلاحية حذف المخازن."
        );

        return;
      }

      return originalDelW.apply(
        this,
        arguments
      );
    };
  }

  if (typeof originalWarehouseCard === "function") {

    window.warehouseCard = function (id) {

      if (
        !inspectorOwnsWarehouse(id)
      ) {

        denyWarehouseAccess();
        return;
      }

      return originalWarehouseCard.apply(
        this,
        arguments
      );
    };
  }

  if (
    typeof originalGcWarehouseProducts ===
    "function"
  ) {

    window.gcWarehouseProducts =
      function (id) {

        if (
          !inspectorOwnsWarehouse(id)
        ) {

          denyWarehouseAccess();
          return;
        }

        return originalGcWarehouseProducts.apply(
          this,
          arguments
        );
      };
  }

  if (typeof originalGcAddProduct === "function") {

    window.gcAddProduct =
      function (id) {

        if (
          !inspectorOwnsWarehouse(id)
        ) {

          denyWarehouseAccess();
          return;
        }

        return originalGcAddProduct.apply(
          this,
          arguments
        );
      };
  }

  if (
    typeof originalGcSaveNewProduct ===
    "function"
  ) {

    window.gcSaveNewProduct =
      function (id) {

        if (
          !inspectorOwnsWarehouse(id)
        ) {

          denyWarehouseAccess();
          return;
        }

        return originalGcSaveNewProduct.apply(
          this,
          arguments
        );
      };
  }

  if (
    typeof originalOpenProductInspection ===
    "function"
  ) {

    window.openProductInspection =
      function (
        warehouseId,
        productId
      ) {

        if (
          !inspectorOwnsWarehouse(
            warehouseId
          )
        ) {

          denyWarehouseAccess();
          return;
        }

        return originalOpenProductInspection.apply(
          this,
          arguments
        );
      };
  }

  /*
   * =========================================================
   * إخفاء المخازن الأخرى من واجهة مراقب النوعية
   * =========================================================
   */

  function getVisibleWarehouses() {

    const user =
      getCurrentUser();

    if (
      !user ||
      user.role !== "inspector"
    ) {
      return S.warehouses;
    }

   const ids =
  Array.isArray(user.warehouseIds) &&
  user.warehouseIds.length
    ? user.warehouseIds.map(function (id) {
        return String(id);
      })
    : (
        user.warehouseId != null &&
        user.warehouseId !== ""
          ? [String(user.warehouseId)]
          : []
      );

return S.warehouses.filter(
  function (w) {
    return ids.includes(String(w.id));
  }
);
}
  window.gcGetVisibleWarehouses =
    getVisibleWarehouses;

  /*
   * =========================================================
   * حماية فتح فحص جديد
   * =========================================================
   */

  const originalOpenI =
    window.openI;

  if (typeof originalOpenI === "function") {

    window.openI = function () {

      if (!isInspector()) {
        return originalOpenI.apply(
          this,
          arguments
        );
      }

      const user =
        getCurrentUser();

      if (
        !user ||
        user.warehouseId == null
      ) {

        alert(
          "لم يتم تعيين مخزن لهذا المراقب."
        );

        return;
      }

      return originalOpenI.apply(
        this,
        arguments
      );
    };
  }

  /*
   * =========================================================
   * تطبيق الصلاحيات على القائمة
   * =========================================================
   */

  function gcApplyPermissions() {

    const user =
      getCurrentUser();

    if (!user) {
      return;
    }

    const rules = {

      warehouses:
        "view_warehouses",

      receive:
        "receive",

      transfer:
        "transfer",

      inspections:
        "inspect",

      alerts:
        "alerts",

      reports:
        "reports",

      chat:
        "chat",

      more:
        "manage_users"

    };

    document
      .querySelectorAll("#nav button")
      .forEach(function (button) {

        const text =
          button.textContent || "";

        let section =
          null;

        if (text.includes("المخازن"))
          section = "warehouses";

        else if (text.includes("الاستقبال"))
          section = "receive";

        else if (text.includes("التحويل"))
          section = "transfer";

        else if (text.includes("الفحوصات"))
          section = "inspections";

        else if (text.includes("التنبيهات"))
          section = "alerts";

        else if (text.includes("التقارير"))
          section = "reports";

        else if (text.includes("المحادثات"))
          section = "chat";

        else if (text.includes("المزيد"))
          section = "more";

        if (
          section &&
          !can(rules[section])
        ) {

          button.style.display =
            "none";

        } else {

          button.style.display =
            "";
        }

      });
  }

  window.gcApplyPermissions =
    gcApplyPermissions;

  /*
   * =========================================================
   * تسجيل الخروج
   * =========================================================
   */

  window.gcLogout =
    function () {

      if (
        !confirm(
          "هل تريد تسجيل الخروج؟"
        )
      ) {
        return;
      }

      localStorage.removeItem(
        CURRENT_USER_KEY
      );

      window.location.href =
        "login.html";
    };

  document.addEventListener(
    "DOMContentLoaded",
    function () {

      gcApplyPermissions();

    }
  );

  setTimeout(
    function () {

      gcApplyPermissions();

    },
    300
  );

})();
