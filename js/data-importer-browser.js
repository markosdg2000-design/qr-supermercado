(function (global) {
  function normalizeHeader(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[\n\r]/g, " ")
      .replace(/\s+/g, "")
      .replace(/[º°]/g, "N")
      .replace("N.", "N");
  }

  function cleanValue(v) {
    if (v === null || v === undefined) return "";
    if (typeof v === "number" && Number.isInteger(v)) return String(v);
    return String(v).trim();
  }

  function getFirst(record, aliases) {
    const norm = {};
    Object.keys(record || {}).forEach((k) => {
      norm[normalizeHeader(k)] = record[k];
    });
    for (const alias of aliases) {
      const v = norm[normalizeHeader(alias)];
      if (cleanValue(v)) return cleanValue(v);
    }
    return "";
  }

  function normalizeStation(rawStation, fallback) {
    const s = cleanValue(rawStation).toUpperCase().replace(/\s+/g, "");
    if (!s) return fallback;
    if (s === "ES0304" || s === "0304") return "ES0304";
    if (s === "ES05" || s === "05" || s === "5") return "ES05";

    const m = s.match(/^ES0?([0-9]{1,2})$/);
    if (m) return `ES${String(parseInt(m[1], 10)).padStart(2, "0")}`;
    const m2 = s.match(/^0?([0-9]{1,2})$/);
    if (m2) return `ES${String(parseInt(m2[1], 10)).padStart(2, "0")}`;
    return fallback;
  }

  function pushUnique(arr, obj) {
    if (!arr.some((x) => JSON.stringify(x) === JSON.stringify(obj))) arr.push(obj);
  }

  function buildGrandes(rows, defaultStation) {
    const stations = {};

    rows.forEach((r) => {
      const station = normalizeStation(getFirst(r, ["ESTACION", "AGRUP", "AREA"]), defaultStation || "ES05");
      const model = getFirst(r, ["COCHE", "MODELO", "MODEL"]);
      const qr = getFirst(r, ["COMPONENTE", "QR", "CODIGOQR", "CODIGO", "COMPONENT"]);
      if (!model || !qr) return;

      const entry = {
        Operacion: getFirst(r, ["TEXTOBREVEDEMATERIAL", "OPERACION", "MATERIAL", "TEXTOBREVE", "DESCRIPCION"]),
        Ubicacion: getFirst(r, ["UBICACIONDESEADA", "UBICACION"]),
        BloqueBol: getFirst(r, ["BLOQUEBOL", "BLOQUE", "BOL"]),
        InstruccionPrep: getFirst(r, ["DESCRIPCIONDECOMOHAYQUEPREPARARELBLOQUE", "INSTRUCCIONPREP", "PREPARACION", "DESCRIPCIONPREP"]),
      };

      const diaSec = getFirst(r, ["DIASEC", "DIASECUENCIA", "DIA SEC.", "DIA SEC", "DIA_SECUENCIA"]);
      if (diaSec) entry.DiaSec = diaSec;

      stations[station] = stations[station] || { models: {} };
      const models = stations[station].models;
      if (!models[model]) models[model] = {};
      if (!models[model][qr]) models[model][qr] = [];
      pushUnique(models[model][qr], entry);
    });

    return {
      generated_utc: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      stations,
    };
  }

  function buildMedianos(rows, defaultStation) {
    const data = {};

    rows.forEach((r) => {
      const station = normalizeStation(getFirst(r, ["ESTACION", "AGRUP", "AREA"]), defaultStation || "ES05");
      const model = getFirst(r, ["COCHE", "MODELO", "MODEL"]);
      if (!model) return;

      const component = getFirst(r, ["MATERIAL", "COMPONENTE_PADRE", "COMPONENTEBASE", "COMPONENTE"]);
      const qr = getFirst(r, ["NºSERIE", "N SERIE", "NSERIE", "QR", "CODIGOQR", "COMPONENTE"]);
      if (!qr) return;

      const entry = {
        Operacion: getFirst(r, ["TEXTOBREVEDEMATERIAL", "OPERACION", "MATERIAL", "TEXTOBREVE"]),
        Ubicacion: getFirst(r, ["UBICACIONDESEADA", "UBICACION", "ESTACION"]),
        Maleta: getFirst(r, ["MALETA", "BLOQUEBOL", "BLOQUE"]),
      };
      const diaSec = getFirst(r, ["DIASEC", "DIASECUENCIA", "DIA SEC.", "DIA SEC", "DIA_SECUENCIA"]);
      if (diaSec) entry.DiaSec = diaSec;

      data[station] = data[station] || {};
      data[station][model] = data[station][model] || {};

      if (component && component !== qr) {
        data[station][model][component] = data[station][model][component] || {};
        data[station][model][component][qr] = data[station][model][component][qr] || [];
        pushUnique(data[station][model][component][qr], entry);
      } else {
        data[station][model][qr] = data[station][model][qr] || [];
        pushUnique(data[station][model][qr], entry);
      }
    });

    return data;
  }

  global.QRImporter = {
    buildGrandes,
    buildMedianos,
    getFirst,
  };
})(window);
