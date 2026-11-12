import { DataService } from './dataService.js';
import { UIRenderer } from './uiRenderer.js';
import { CardRenderer } from './cardRenderer.js';

export const DOMRenderer = {
  async refreshIndexPage() {
    const previewContainer = document.getElementById('dom-lahan-preview');
    if (!previewContainer) return;
    const res = await DataService.getLahan('');
    CardRenderer.renderLahanCards(previewContainer, res.data.slice(0, 3));
  },

  async refreshFormDropdowns() {
    const petaniSelect = document.getElementById('lahan-petani');
    const lahanSelect = document.getElementById('tanaman-lahan');
    if (!petaniSelect && !lahanSelect) return;

    const [petaniRes, lahanRes] = await Promise.all([
      DataService.getPetani(''),
      DataService.getLahan('')
    ]);
    UIRenderer.populateSelect(petaniSelect, petaniRes.data, 'nama_petani', '-- Pilih Petani --');
    UIRenderer.populateSelect(lahanSelect, lahanRes.data, 'nama_lahan', '-- Pilih Lahan --');
  },

  async refreshCatalogPage(search = '') {
    const lahanBox = document.getElementById('card-list-lahan');
    const tanamanBox = document.getElementById('card-list-tanaman');
    const petaniBox = document.getElementById('card-list-petani');
    if (!lahanBox && !tanamanBox && !petaniBox) return;

    const [lahanRes, tanamanRes, petaniRes] = await Promise.all([
      DataService.getLahan(search),
      DataService.getTanaman(search),
      DataService.getPetani(search)
    ]);

    CardRenderer.renderLahanCards(lahanBox, lahanRes.data);
    CardRenderer.renderTanamanCards(tanamanBox, tanamanRes.data);
    CardRenderer.renderPetaniCards(petaniBox, petaniRes.data);
  }
};
