import { UIRenderer } from './uiRenderer.js';

export const CardRenderer = {
  renderLahanCards(container, items) {
    if (!container) return;
    if (!items.length) {
      container.innerHTML = '<p>Belum ada data lahan tersimpan.</p>';
      return;
    }
    container.innerHTML = items.map(item => `
      <article class="data-card">
        <div>
          <div class="card-top">
            <h3>${UIRenderer.escape(item.nama_lahan)}</h3>
            <span class="badge">${item.luas_hektar} Ha</span>
          </div>
          <div class="card-body">
            <div class="card-row"><span>Pemilik</span><strong>${UIRenderer.escape(item.pemilik || '-')}</strong></div>
            <div class="card-row"><span>Lokasi</span><strong>${UIRenderer.escape(item.lokasi)}</strong></div>
            <div class="card-row"><span>Komoditas</span><strong>${item.jumlah_tanaman} Tanaman</strong></div>
          </div>
        </div>
        <div class="card-footer">
          <button type="button" class="btn-delete" data-delete="lahan" data-id="${item.id}">Hapus</button>
        </div>
      </article>
    `).join('');
  },

  renderTanamanCards(container, items) {
    if (!container) return;
    if (!items.length) {
      container.innerHTML = '<p>Belum ada data tanaman tersimpan.</p>';
      return;
    }
    container.innerHTML = items.map(item => `
      <article class="data-card">
        <div>
          <div class="card-top">
            <h3>${UIRenderer.escape(item.nama_tanaman)}</h3>
            <span class="badge">${UIRenderer.escape(item.status_tumbuh)}</span>
          </div>
          <div class="card-body">
            <div class="card-row"><span>Varietas</span><strong>${UIRenderer.escape(item.varietas)}</strong></div>
            <div class="card-row"><span>Lahan</span><strong>${UIRenderer.escape(item.nama_lahan || '-')}</strong></div>
            <div class="card-row"><span>Pemilik</span><strong>${UIRenderer.escape(item.pemilik_lahan || '-')}</strong></div>
            <div class="card-row"><span>Tgl Tanam</span><strong>${UIRenderer.escape(item.tanggal_tanam)}</strong></div>
          </div>
        </div>
        <div class="card-footer">
          <button type="button" class="btn-delete" data-delete="tanaman" data-id="${item.id}">Hapus</button>
        </div>
      </article>
    `).join('');
  },

  renderPetaniCards(container, items) {
    if (!container) return;
    if (!items.length) {
      container.innerHTML = '<p>Belum ada data petani tersimpan.</p>';
      return;
    }
    container.innerHTML = items.map(item => `
      <article class="data-card">
        <div>
          <div class="card-top">
            <h3>${UIRenderer.escape(item.nama_petani)}</h3>
            <span class="badge">${item.jumlah_lahan} Lahan</span>
          </div>
          <div class="card-body">
            <div class="card-row"><span>No. HP</span><strong>${UIRenderer.escape(item.no_hp)}</strong></div>
            <div class="card-row"><span>Alamat</span><strong>${UIRenderer.escape(item.alamat)}</strong></div>
          </div>
        </div>
        <div class="card-footer">
          <button type="button" class="btn-delete" data-delete="petani" data-id="${item.id}">Hapus</button>
        </div>
      </article>
    `).join('');
  }
};
