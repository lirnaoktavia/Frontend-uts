const BASE_URL = 'http://127.0.0';
const KEYS = {
  petani: 'agri_petani',
  lahan: 'agri_lahan',
  tanaman: 'agri_tanaman'
};

function seedIfEmpty() {
  if (!localStorage.getItem(KEYS.petani)) {
    localStorage.setItem(KEYS.petani, JSON.stringify([
      { id: 1, nama_petani: 'Budi Santoso', no_hp: '081234567890', alamat: 'Kalipuro, Banyuwangi' }
    ]));
  }
  if (!localStorage.getItem(KEYS.lahan)) {
    localStorage.setItem(KEYS.lahan, JSON.stringify([
      { id: 1, nama_lahan: 'Sawah Blok Utara', lokasi: 'Desa Ketapang', luas_hektar: 1.5, petani_id: 1 }
    ]));
  }
  if (!localStorage.getItem(KEYS.tanaman)) {
    localStorage.setItem(KEYS.tanaman, JSON.stringify([
      { id: 1, nama_tanaman: 'Padi Organik', varietas: 'Inpari 32', tanggal_tanam: '2026-10-01', status_tumbuh: 'Masa Tanam', lahan_id: 1 }
    ]));
  }
}

function getLocal(key) {
  seedIfEmpty();
  return JSON.parse(localStorage.getItem(KEYS[key])) || [];
}

function setLocal(key, list) {
  localStorage.setItem(KEYS[key], JSON.stringify(list));
}

async function apiOrLocal(endpoint, options, fallbackFn) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      const err = new Error(json.message || 'Gagal memproses data');
      err.errors = json.errors || null;
      throw err;
    }
    return json;
  } catch (err) {
    if (err.errors) throw err;
    return fallbackFn();
  }
}

export const DataService = {
  getPetani(search = '') {
    return apiOrLocal(`/petani?search=${encodeURIComponent(search)}`, {}, () => {
      const lahan = getLocal('lahan');
      const data = getLocal('petani')
        .filter(p => p.nama_petani.toLowerCase().includes(search.toLowerCase()))
        .map(p => ({ ...p, jumlah_lahan: lahan.filter(l => l.petani_id == p.id).length }));
      return { status: 'success', data };
    });
  },

  createPetani(payload) {
    return apiOrLocal('/petani', { method: 'POST', body: JSON.stringify(payload) }, () => {
      const list = getLocal('petani');
      const item = { id: Date.now(), ...payload };
      list.push(item);
      setLocal('petani', list);
      return { status: 'success', message: 'Data petani berhasil disimpan!', data: item };
    });
  },

  deletePetani(id) {
    return apiOrLocal(`/petani/${id}`, { method: 'DELETE' }, () => {
      const lahanIds = getLocal('lahan').filter(l => l.petani_id == id).map(l => l.id);
      setLocal('tanaman', getLocal('tanaman').filter(t => !lahanIds.includes(t.lahan_id)));
      setLocal('lahan', getLocal('lahan').filter(l => l.petani_id != id));
      setLocal('petani', getLocal('petani').filter(p => p.id != id));
      return { status: 'success', message: 'Data petani berhasil dihapus!' };
    });
  },

  getLahan(search = '') {
    return apiOrLocal(`/lahan?page=1&per_page=100&search=${encodeURIComponent(search)}`, {}, () => {
      const petani = getLocal('petani');
      const tanaman = getLocal('tanaman');
      const data = getLocal('lahan')
        .filter(l => l.nama_lahan.toLowerCase().includes(search.toLowerCase()))
        .map(l => {
          const owner = petani.find(p => p.id == l.petani_id);
          return {
            ...l,
            pemilik: owner ? owner.nama_petani : '-',
            jumlah_tanaman: tanaman.filter(t => t.lahan_id == l.id).length
          };
        });
      return { status: 'success', data };
    });
  },

  createLahan(payload) {
    return apiOrLocal('/lahan', { method: 'POST', body: JSON.stringify(payload) }, () => {
      const list = getLocal('lahan');
      const item = { id: Date.now(), ...payload };
      list.push(item);
      setLocal('lahan', list);
      return { status: 'success', message: 'Data lahan berhasil disimpan!', data: item };
    });
  },

  deleteLahan(id) {
    return apiOrLocal(`/lahan/${id}`, { method: 'DELETE' }, () => {
      setLocal('tanaman', getLocal('tanaman').filter(t => t.lahan_id != id));
      setLocal('lahan', getLocal('lahan').filter(l => l.id != id));
      return { status: 'success', message: 'Data lahan berhasil dihapus!' };
    });
  },

  getTanaman(search = '') {
    return apiOrLocal(`/tanaman?page=1&per_page=100&search=${encodeURIComponent(search)}`, {}, () => {
      const petani = getLocal('petani');
      const lahan = getLocal('lahan');
      const data = getLocal('tanaman')
        .filter(t => t.nama_tanaman.toLowerCase().includes(search.toLowerCase()))
        .map(t => {
          const l = lahan.find(item => item.id == t.lahan_id);
          const p = l ? petani.find(owner => owner.id == l.petani_id) : null;
          return {
            ...t,
            nama_lahan: l ? l.nama_lahan : '-',
            pemilik_lahan: p ? p.nama_petani : '-'
          };
        });
      return { status: 'success', data };
    });
  },

  createTanaman(payload) {
    return apiOrLocal('/tanaman', { method: 'POST', body: JSON.stringify(payload) }, () => {
      const list = getLocal('tanaman');
      const item = { id: Date.now(), ...payload };
      list.push(item);
      setLocal('tanaman', list);
      return { status: 'success', message: 'Data tanaman berhasil disimpan!', data: item };
    });
  },

  deleteTanaman(id) {
    return apiOrLocal(`/tanaman/${id}`, { method: 'DELETE' }, () => {
      setLocal('tanaman', getLocal('tanaman').filter(t => t.id != id));
      return { status: 'success', message: 'Data tanaman berhasil dihapus!' };
    });
  }
};
