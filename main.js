import { DataService } from './dataService.js';
import { UIRenderer } from './uiRenderer.js';
import { FormValidator } from './formValidator.js';
import { DOMRenderer } from './domRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
  DOMRenderer.refreshIndexPage();
  DOMRenderer.refreshFormDropdowns();
  DOMRenderer.refreshCatalogPage();

  // Switcher Tab di form.html
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.form-panel').forEach(p => p.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target)?.classList.remove('hidden');
    });
  });

  // Submit Form Lahan
  const formLahan = document.getElementById('form-lahan');
  formLahan?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      petani_id: Number(formLahan.petani_id.value),
      nama_lahan: formLahan.nama_lahan.value,
      lokasi: formLahan.lokasi.value,
      luas_hektar: parseFloat(formLahan.luas_hektar.value)
    };
    const { isValid, errors } = FormValidator.validateLahan(payload);
    if (!isValid) return UIRenderer.showErrors('lahan', errors);
    UIRenderer.clearErrors('lahan');

    try {
      const res = await DataService.createLahan(payload);
      UIRenderer.showAlert(res.message);
      formLahan.reset();
      DOMRenderer.refreshFormDropdowns();
    } catch (err) {
      UIRenderer.showErrors('lahan', err.errors);
      UIRenderer.showAlert(err.message, 'error');
    }
  });

  // Submit Form Tanaman
  const formTanaman = document.getElementById('form-tanaman');
  formTanaman?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      lahan_id: Number(formTanaman.lahan_id.value),
      nama_tanaman: formTanaman.nama_tanaman.value,
      varietas: formTanaman.varietas.value,
      tanggal_tanam: formTanaman.tanggal_tanam.value,
      status_tumbuh: formTanaman.status_tumbuh.value
    };
    const { isValid, errors } = FormValidator.validateTanaman(payload);
    if (!isValid) return UIRenderer.showErrors('tanaman', errors);
    UIRenderer.clearErrors('tanaman');

    try {
      const res = await DataService.createTanaman(payload);
      UIRenderer.showAlert(res.message);
      formTanaman.reset();
    } catch (err) {
      UIRenderer.showErrors('tanaman', err.errors);
      UIRenderer.showAlert(err.message, 'error');
    }
  });

  // Submit Form Petani
  const formPetani = document.getElementById('form-petani');
  formPetani?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      nama_petani: formPetani.nama_petani.value,
      no_hp: formPetani.no_hp.value,
      alamat: formPetani.alamat.value
    };
    const { isValid, errors } = FormValidator.validatePetani(payload);
    if (!isValid) return UIRenderer.showErrors('petani', errors);
    UIRenderer.clearErrors('petani');

    try {
      const res = await DataService.createPetani(payload);
      UIRenderer.showAlert(res.message);
      formPetani.reset();
      DOMRenderer.refreshFormDropdowns();
    } catch (err) {
      UIRenderer.showErrors('petani', err.errors);
      UIRenderer.showAlert(err.message, 'error');
    }
  });

  // Filter & Pencarian di indexcard.html
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.catalog-section').forEach(s => s.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById(`view-${btn.dataset.view}`)?.classList.remove('hidden');
    });
  });

  const searchInput = document.getElementById('search-catalog');
  searchInput?.addEventListener('input', (e) => {
    DOMRenderer.refreshCatalogPage(e.target.value);
  });

  // Hapus Card
  document.body.addEventListener('click', async (e) => {
    const type = e.target.dataset.delete;
    const id = e.target.dataset.id;
    if (!type || !id) return;

    if (!confirm(`Yakin ingin menghapus data ${type} ini?`)) return;

    try {
      let res;
      if (type === 'lahan') res = await DataService.deleteLahan(id);
      if (type === 'tanaman') res = await DataService.deleteTanaman(id);
      if (type === 'petani') res = await DataService.deletePetani(id);

      UIRenderer.showAlert(res.message);
      DOMRenderer.refreshIndexPage();
      DOMRenderer.refreshCatalogPage(searchInput?.value || '');
    } catch (err) {
      UIRenderer.showAlert(err.message, 'error');
    }
  });
});
