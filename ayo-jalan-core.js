window.AYO_CONFIG = {
  // === PENGATURAN WAJIB (MODE WHATSAPP & QRIS) ===
  ADMIN_WA: '6285785068226',          // Ganti dengan No. WA Admin (awalan 62)
  MERCHANT_NAME: 'AYO JALAN BONDOWOSO',
  QRIS_STRING: '00020101021126610014COM.GO-JEK.WWW01189360091438346395280210G8346395280303UMI51440014ID.CO.QRIS.WWW0215ID10265474193030303UMI5204478953033605802ID5923Ayo Jalan, Transportasi6009BONDOWOSO61056821162070703A01630423B8',                    // Tempel String QRIS Statis resmi Anda (000201...)
  DRIVER_PIN: '1234',                 // PIN default mode offline/WA
  ADMIN_PIN: '9999',                  // PIN masuk ke admin.html
  GPS_CHECKIN_RADIUS_M: 200,          // Radius maksimal (meter) agar tombol Jemput/Sampai aktif

  // === OPSIONAL: ISI UNTUK MODE REAL-TIME OTOMATIS (SUPABASE GRATIS) ===
  SUPABASE_URL: 'https://mrqbjiqdaeoaqguvwebk.supabase.co',                   // Contoh: 'https://xyzcompany.supabase.co'
  SUPABASE_ANON_KEY: 'sb_publishable_tydCnrRz9KoTET0aBfgSLQ_gLSPDk2k'               // Anon Public Key dari Project Settings -> API
};

window.AYO_CORE = (() => {
  const BONDOWOSO_CENTER = [-7.9135, 113.8215];
  const BONDOWOSO_ZOOM = 13;
  const JATIM_BBOX = { minLng: 110.85, minLat: -8.85, maxLng: 115.95, maxLat: -5.75 };

  // 28 Titik Populer & Pusat 23 Kecamatan se-Kabupaten Bondowoso
  const BONDOWOSO_POIS = [
    { name: 'Alun-Alun RBA Ki Ronggo Bondowoso', area: 'Kec. Bondowoso (Pusat Kota)', lat: -7.9135, lng: 113.8215 },
    { name: 'Terminal Bondowoso', area: 'Jl. Imam Bonjol, Bondowoso', lat: -7.9158, lng: 113.8317 },
    { name: 'Pasar Induk Bondowoso', area: 'Badean, Kec. Bondowoso', lat: -7.9139, lng: 113.8278 },
    { name: 'Citiplaza Bondowoso', area: 'Nangkaan, Kec. Bondowoso', lat: -7.9277, lng: 113.8143 },
    { name: 'RSUD dr. H. Koesnadi Bondowoso', area: 'Jl. Kapten Piere Tendean, Bondowoso', lat: -7.9189, lng: 113.8146 },
    { name: 'Monumen Gerbong Maut / Stasiun Lama', area: 'Blindungan, Bondowoso', lat: -7.9175, lng: 113.8195 },
    { name: 'UNEJ Kampus Bondowoso / Curahdami', area: 'Kec. Curahdami, Bondowoso', lat: -7.9135, lng: 113.7917 },
    { name: 'Kecamatan Tenggarang (Gapura Kota)', area: 'Kec. Tenggarang, Bondowoso', lat: -7.9303, lng: 113.8503 },
    { name: 'Kecamatan Tegalampel', area: 'Sekarputih, Kec. Tegalampel', lat: -7.8974, lng: 113.8275 },
    { name: 'Kecamatan Taman Krocok', area: 'Desa Taman, Taman Krocok', lat: -7.8683, lng: 113.8442 },
    { name: 'Kecamatan Binakal (Kantor Camat)', area: 'Kec. Binakal, Bondowoso', lat: -7.8984, lng: 113.7680 },
    { name: 'Kecamatan Pakem', area: 'Patemon, Kec. Pakem', lat: -7.9056, lng: 113.7072 },
    { name: 'Pasar Wringin / Rest Area Arak-Arak', area: 'Kec. Wringin, Bondowoso', lat: -7.8199, lng: 113.7582 },
    { name: 'Kecamatan Grujugan (Pasar Dadapan)', area: 'Kec. Grujugan, Bondowoso', lat: -7.9850, lng: 113.7631 },
    { name: 'Kecamatan Maesan', area: 'Desa Maesan, Bondowoso', lat: -8.0228, lng: 113.7714 },
    { name: 'Alun-Alun Kecamatan Tamanan', area: 'Kec. Tamanan, Bondowoso', lat: -8.0179, lng: 113.8261 },
    { name: 'Kecamatan Jambesari Darus Sholah', area: 'Kec. Jambesari DS, Bondowoso', lat: -7.9818, lng: 113.8417 },
    { name: 'Pasar Pujer / Kecamatan Pujer', area: 'Kec. Pujer, Bondowoso', lat: -7.9746, lng: 113.8817 },
    { name: 'Kantor Camat Tlogosari', area: 'Pakisan, Kec. Tlogosari', lat: -7.9857, lng: 113.9194 },
    { name: 'Kecamatan Wonosari', area: 'Kec. Wonosari, Bondowoso', lat: -7.9144, lng: 113.8956 },
    { name: 'Pasar Tapen / Bendung Sampean Baru', area: 'Kec. Tapen, Bondowoso', lat: -7.8528, lng: 113.9347 },
    { name: 'Pasar Sukosari / Kec. Sukosari', area: 'Kec. Sukosari, Bondowoso', lat: -7.9448, lng: 113.9654 },
    { name: 'Kecamatan Sumberwringin (Lereng Raung)', area: 'Kec. Sumberwringin, Bondowoso', lat: -7.9801, lng: 113.9944 },
    { name: 'Kecamatan Klabang', area: 'Kec. Klabang, Bondowoso', lat: -7.8658, lng: 113.9850 },
    { name: 'PG Prajekan / Kec. Prajekan', area: 'Kec. Prajekan, Bondowoso', lat: -7.8111, lng: 113.9728 },
    { name: 'Pasar Cermee / Wisata Batu So\'on', area: 'Kec. Cermee, Bondowoso', lat: -7.7774, lng: 114.0480 },
    { name: 'Kecamatan Botolinggo', area: 'Kec. Botolinggo, Bondowoso', lat: -7.8261, lng: 114.0150 },
    { name: 'Kecamatan Ijen / Sempol', area: 'Kec. Ijen, Bondowoso', lat: -8.0080, lng: 114.1452 },
    { name: 'Kawah Wurung (Wisata Alam)', area: 'Kec. Ijen, Bondowoso', lat: -8.0646, lng: 114.1614 },
    { name: 'Pos Paltuding Kawah Ijen', area: 'TWA Ijen, Bondowoso', lat: -8.0731, lng: 114.2235 }
  ];

  const DEFAULT_TARIFFS = {
    motor_rate: 2500, motor_min: 8000,
    hemat_rate: 3800, reguler_rate: 6000, xl_rate: 7500, car_min: 15000,
    mountain_pct: 20
  };

  let supabaseClient = null;
  function getSupabase() {
    if (supabaseClient) return supabaseClient;
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.AYO_CONFIG;
    if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
  }

  async function fetchActiveTariffs() {
    const sb = getSupabase();
    if (!sb) return { ...DEFAULT_TARIFFS };
    try {
      const { data } = await sb.from('app_settings').select('*').eq('id', 1).single();
      return data ? { ...DEFAULT_TARIFFS, ...data } : { ...DEFAULT_TARIFFS };
    } catch { return { ...DEFAULT_TARIFFS }; }
  }

  function formatIDR(n) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(n || 0));
  }

  function formatDuration(sec) {
    if (!sec || sec <= 0) return '-';
    const m = Math.max(1, Math.round(sec / 60)), h = Math.floor(m / 60), rem = m % 60;
    return h > 0 ? (rem > 0 ? `${h} jam ${rem} mnt` : `${h} jam`) : `${rem} mnt`;
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function isWithinJatim(lat, lng) {
    return lat >= JATIM_BBOX.minLat && lat <= JATIM_BBOX.maxLat && lng >= JATIM_BBOX.minLng && lng <= JATIM_BBOX.maxLng;
  }

  function detectMountainRoute(pickup, dropoff) {
    const keywords = ['ijen', 'wurung', 'paltuding', 'sempol', 'argopuro', 'kalipait', 'botolinggo', 'cermee'];
    const check = (pt) => {
      if (!pt) return false;
      const lbl = (pt.label || '').toLowerCase();
      if (keywords.some(k => lbl.includes(k))) return true;
      return pt.lat <= -8.00 && pt.lng >= 114.05;
    };
    return check(pickup) || check(dropoff);
  }

  function getAutoSurge() {
    const now = new Date();
    const totalMin = now.getHours() * 60 + now.getMinutes();
    if ((totalMin >= 390 && totalMin <= 510) || (totalMin >= 960 && totalMin <= 1110)) return { multiplier: 1.2, label: 'Jam Sibuk (1.2x)', badge: 'Jam Sibuk • 1.2x' };
    if (totalMin >= 1320 || totalMin < 300) return { multiplier: 1.2, label: 'Tarif Malam (1.2x)', badge: 'Tarif Malam • 1.2x' };
    return { multiplier: 1.0, label: 'Normal (1.0x)', badge: 'Tarif Normal' };
  }

  // Biaya Platform Progresif (Makin Jauh, % Makin Kecil)
  function calcPlatformFee(distanceKm, baseDistanceFare, vehicleType) {
    if (distanceKm <= 0 && baseDistanceFare <= 0) return { fee: 0, pctLabel: 'Hemat', note: 'Tarif ringan, makin jauh % makin kecil' };
    let pct = 0, minFee = 0, maxFee = 0, tierLabel = '';
    if (vehicleType === 'Motor') {
      maxFee = 5000;
      if (distanceKm <= 5) { pct = 0.05; minFee = 1000; tierLabel = '5% (Dekat)'; }
      else if (distanceKm <= 15) { pct = 0.04; minFee = 1500; tierLabel = '4% (Menengah)'; }
      else if (distanceKm <= 30) { pct = 0.03; minFee = 1500; tierLabel = '3% (Jauh)'; }
      else { pct = 0.02; minFee = 2000; tierLabel = '2% (Luar Kota)'; }
    } else {
      maxFee = 12000;
      if (distanceKm <= 5) { pct = 0.06; minFee = 2000; tierLabel = '6% (Dekat)'; }
      else if (distanceKm <= 15) { pct = 0.05; minFee = 2500; tierLabel = '5% (Menengah)'; }
      else if (distanceKm <= 30) { pct = 0.035; minFee = 3500; tierLabel = '3.5% (Jauh)'; }
      else { pct = 0.025; minFee = 4500; tierLabel = '2.5% (Luar Kota)'; }
    }
    const rounded = Math.round((baseDistanceFare * pct) / 500) * 500;
    return {
      fee: Math.min(maxFee, Math.max(minFee, rounded)),
      pctLabel: tierLabel,
      note: `Skema hemat ${vehicleType}: makin jauh, % makin ringan`
    };
  }

  // Konverter QRIS Statis -> Dinamis (EMVCo CRC16-CCITT)
  function crc16Ccitt(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= (str.charCodeAt(i) & 0xFF) << 8;
      for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  function buildDynamicQris(staticQris, amount) {
    const clean = (staticQris || '').trim();
    if (!clean.startsWith('0002')) return null;
    const tags = []; let idx = 0;
    while (idx + 4 <= clean.length) {
      const tag = clean.slice(idx, idx + 2), len = parseInt(clean.slice(idx + 2, idx + 4), 10);
      if (isNaN(len) || idx + 4 + len > clean.length) break;
      const val = clean.slice(idx + 4, idx + 4 + len); idx += 4 + len;
      if (tag === '63') break;
      tags.push({ tag, val });
    }
    if (!tags.length) return null;
    const filtered = tags.filter(t => t.tag !== '54').map(t => t.tag === '01' ? { tag: '01', val: '12' } : t);
    const amtObj = { tag: '54', val: String(Math.round(amount)) };
    const p58 = filtered.findIndex(t => t.tag === '58');
    if (p58 !== -1) filtered.splice(p58, 0, amtObj); else filtered.push(amtObj);
    const body = filtered.map(t => `${t.tag}${String(t.val.length).padStart(2, '0')}${t.val}`).join('') + '6304';
    return body + crc16Ccitt(body);
  }

  // Bunyi Notifikasi Order Baru (Tanpa File MP3)
  function playOrderChime() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      [880, 1174.66].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.16);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.16 + 0.35);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.16);
        osc.stop(ctx.currentTime + i * 0.16 + 0.36);
      });
    } catch {}
  }

  function normalizePhoneWa(raw) {
    let c = String(raw || '').replace(/\D/g, '');
    if (c.startsWith('0')) c = '62' + c.slice(1);
    return c;
  }

  return {
    BONDOWOSO_CENTER, BONDOWOSO_ZOOM, JATIM_BBOX, BONDOWOSO_POIS, DEFAULT_TARIFFS,
    getSupabase, fetchActiveTariffs, formatIDR, formatDuration, escapeHtml,
    isWithinJatim, detectMountainRoute, getAutoSurge, calcPlatformFee,
    buildDynamicQris, playOrderChime, normalizePhoneWa
  };
})();
