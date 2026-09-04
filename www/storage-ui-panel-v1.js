/* =========================================================
   GrainControl DZ
   Storage Units Upgrade V1
   مستودعات + صوامع + خلايا + تخزين سائب
   ========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "gcdz_storage_units";

  function loadUnits() {
    try {
      const data = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function saveUnits(units) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(units)
    );
  }

  function createStorageUnit(data) {
    const unit = {
      id: Date.now() + Math.floor(Math.random() * 1000),

      name: String(data.name || "").trim(),

      type: data.type || "warehouse",

      parentId: data.parentId || null,

      capacity: Number(data.capacity || 0),

      quantity: Number(data.quantity || 0),

      product: data.product || "غير محدد",

      lot: data.lot || "",

      location: data.location || "غير محدد",

      status: data.status || "مستقر",

      moisture: data.moisture || "",

      grainTemperature: data.grainTemperature || "",

      fillLevel: data.fillLevel || "",

      ventilation: data.ventilation || "غير محددة",

      pestStatus: data.pestStatus || "غير محددة",

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),

      history: [],

      inspections: [],

      alerts: [],

      correctiveActions: []
    };

    unit.history.push({
      date: new Date().toISOString(),

      type: "إنشاء وحدة تخزين",

      details:
        "تم إنشاء وحدة التخزين وإضافتها إلى النظام."
    });

    return unit;
  }

  function addStorageUnit(data) {
    const units = loadUnits();

    const unit = createStorageUnit(data);

    if (!unit.name) {
      throw new Error(
        "يجب إدخال اسم أو رقم وحدة التخزين."
      );
    }

    if (
      unit.type === "cell" &&
      !unit.parentId
    ) {
      throw new Error(
        "الخلية يجب أن تكون مرتبطة بصومعة."
      );
    }

    units.push(unit);

    saveUnits(units);

    return unit;
  }

  function updateStorageUnit(id, changes) {
    const units = loadUnits();

    const unit = units.find(function (x) {
      return String(x.id) === String(id);
    });

    if (!unit) {
      throw new Error(
        "وحدة التخزين غير موجودة."
      );
    }

    Object.keys(changes || {}).forEach(
      function (key) {
        if (
          key === "id" ||
          key === "createdAt"
        ) {
          return;
        }

        unit[key] = changes[key];
      }
    );

    unit.updatedAt =
      new Date().toISOString();

    unit.history = Array.isArray(
      unit.history
    )
      ? unit.history
      : [];

    unit.history.unshift({
      date: new Date().toISOString(),

      type: "تعديل بيانات وحدة التخزين",

      details:
        "تم تعديل بيانات الوحدة."
    });

    saveUnits(units);

    return unit;
  }

  function deleteStorageUnit(id) {
    const units = loadUnits();

    const target = units.find(function (x) {
      return String(x.id) === String(id);
    });

    if (!target) {
      return false;
    }

    if (target.type === "silo") {
      const hasCells = units.some(
        function (x) {
          return (
            x.type === "cell" &&
            String(x.parentId) ===
              String(target.id)
          );
        }
      );

      if (hasCells) {
        throw new Error(
          "لا يمكن حذف الصومعة قبل نقل أو حذف الخلايا المرتبطة بها."
        );
      }
    }

    const filtered = units.filter(
      function (x) {
        return (
          String(x.id) !== String(id)
        );
      }
    );

    saveUnits(filtered);

    return true;
  }

  function getStorageUnits() {
    return loadUnits();
  }    );
  }

  function getWarehouses() {
    return loadUnits().filter(
      function (x) {
        return x.type === "warehouse";
      }
    );
  }

  function getBulkStorage() {
    return loadUnits().filter(
      function (x) {
        return x.type === "bulk";
      }
    );
  }

  window.gcStorageUnits = {
    load: loadUnits,
    save: saveUnits,
    add: addStorageUnit,
    update: updateStorageUnit,
    remove: deleteStorageUnit,
    all: getStorageUnits,    warehouses: getWarehouses,
    bulk: getBulkStorage
  };

  console.log(
    "GrainControl DZ Storage Units V1 loaded successfully."
  );

})();
