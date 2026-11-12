export const FormValidator = {
  validateLahan(data) {
    const errors = {};
    if (!data.petani_id) {
      errors.petani_id = 'Pemilik lahan wajib dipilih.';
    }
    if (!data.nama_lahan || data.nama_lahan.trim() === '') {
      errors.nama_lahan = 'Nama lahan wajib diisi.';
    }
    if (!data.lokasi || data.lokasi.trim() === '') {
      errors.lokasi = 'Lokasi lahan wajib diisi.';
    }
    if (!data.luas_hektar || Number(data.luas_hektar) <= 0) {
      errors.luas_hektar = 'Luas lahan harus berupa angka lebih dari 0.';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validateTanaman(data) {
    const errors = {};
    if (!data.lahan_id) {
      errors.lahan_id = 'Lokasi lahan tanam wajib dipilih.';
    }
    if (!data.nama_tanaman || data.nama_tanaman.trim() === '') {
      errors.nama_tanaman = 'Nama tanaman wajib diisi.';
    }
    if (!data.varietas || data.varietas.trim() === '') {
      errors.varietas = 'Varietas tanaman wajib diisi.';
    }
    if (!data.tanggal_tanam) {
      errors.tanggal_tanam = 'Tanggal tanam wajib diisi.';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validatePetani(data) {
    const errors = {};
    if (!data.nama_petani || data.nama_petani.trim() === '') {
      errors.nama_petani = 'Nama petani wajib diisi.';
    }
    if (!data.no_hp || data.no_hp.trim() === '') {
      errors.no_hp = 'Nomor HP wajib diisi.';
    }
    if (!data.alamat || data.alamat.trim() === '') {
      errors.alamat = 'Alamat lengkap wajib diisi.';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};
