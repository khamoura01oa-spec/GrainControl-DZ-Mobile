(function () {
  "use strict";

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem("gcdz_user") || "null");
    } catch (e) {
      return null;
    }
  }

  function isInspector() {
    const user = getCurrentUser();
    return !!user && user.role === "inspector";
  }

    function assignedWarehouseIds() {
    const user = getCurrentUser();

    if (!user) return [];

    // مراقب النوعية: مخزن واحد فقط
    if (
      user.warehouseId !== null &&
      user.warehouseId !== undefined &&
      user.warehouseId !== ""
    ) {
      return [String(user.warehouseId)];
    }

    // توافق مع البيانات القديمة
    if (
      Array.isArray(user.warehouseIds) &&
      user.warehouseIds.length
    ) {
      return [String(user.warehouseIds[0])];
    }

    return [];
  }

  function canAccessWarehouse(id) {
    if (!isInspector()) return true;

    return assignedWarehouseIds().includes(String(id));
  }

  window.gcIsInspector = isInspector;
  window.gcAssignedWarehouseIds = assignedWarehouseIds;
  window.gcCanAccessWarehouse = canAccessWarehouse;

  const originalOpenW = window.openW;

  if (typeof originalOpenW === "function") {
    window.openW = function () {
      if (isInspector()) {
        alert("لا يملك مراقب النوعية صلاحية إضافة مخزن.");
        return;
      }

      return originalOpenW.apply(this, arguments);
    };
  }

  const originalDelW = window.delW;

  if (typeof originalDelW === "function") {
    window.delW = function (id) {
      if (isInspector()) {
        alert("لا يملك مراقب النوعية صلاحية حذف المخزن.");
        return;
      }

      return originalDelW.apply(this, arguments);
    };
  }

  const originalWarehouseCard = window.warehouseCard;

  if (typeof originalWarehouseCard === "function") {
    window.warehouseCard = function (id) {
      if (!canAccessWarehouse(id)) {
        alert("لا يمكنك الوصول إلى هذا المخزن.");
        return;
      }

      return originalWarehouseCard.apply(this, arguments);
    };
  }

  const originalWarehouseProducts = window.gcWarehouseProducts;

  if (typeof originalWarehouseProducts === "function") {
    window.gcWarehouseProducts = function (id) {
      if (!canAccessWarehouse(id)) {
        alert("لا يمكنك الوصول إلى منتجات هذا المخزن.");
        return;
      }

      return originalWarehouseProducts.apply(this, arguments);
    };
  }

  const originalProductInspection = window.openProductInspection;

  if (typeof originalProductInspection === "function") {
    window.openProductInspection = function (warehouseId, productId) {
      if (!canAccessWarehouse(warehouseId)) {
        alert("لا يمكنك فحص منتج في مخزن غير مخصص لك.");
        return;
      }

      return originalProductInspection.apply(this, arguments);
    };
  }

  const originalAddProduct = window.gcAddProduct;

  if (typeof originalAddProduct === "function") {
    window.gcAddProduct = function (id) {
      if (!canAccessWarehouse(id)) {
        alert("لا يمكنك إضافة منتج إلى مخزن غير مخصص لك.");
        return;
      }

      return originalAddProduct.apply(this, arguments);
    };
  }

  const originalSaveProduct = window.gcSaveNewProduct;

  if (typeof originalSaveProduct === "function") {
    window.gcSaveNewProduct = function (id) {
      if (!canAccessWarehouse(id)) {
        alert("لا يمكنك تعديل مخزن غير مخصص لك.");
        return;
      }

      return originalSaveProduct.apply(this, arguments);
    };
  }

})();
