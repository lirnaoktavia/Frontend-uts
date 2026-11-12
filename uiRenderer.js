export const UIRenderer = {
  escape(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
  },

  showAlert(message, type = 'success') {
    const box = document.getElementById('alert-box');
    if (!box) return;
    box.textContent = message;
    box.className = `alert alert-${type}`;
    setTimeout(() => box.classList.add('hidden'), 3500);
  },

  showErrors(prefix, errors) {
    this.clearErrors(prefix);
    if (!errors) return;
    Object.entries(errors).forEach(([field, message]) => {
      const errSpan = document.getElementById(`err-${prefix}-${field}`);
      const inputEl = document.querySelector(`#form-${prefix} [name="${field}"]`);
      if (errSpan) errSpan.textContent = message;
      if (inputEl) inputEl.classList.add('input-error');
    });
  },

  clearErrors(prefix) {
    document.querySelectorAll(`#form-${prefix} .error-text`).forEach(el => el.textContent = '');
    document.querySelectorAll(`#form-${prefix} .input-error`).forEach(el => el.classList.remove('input-error'));
  },

  populateSelect(selectEl, items, labelKey, placeholder) {
    if (!selectEl) return;
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item[labelKey];
      selectEl.appendChild(opt);
    });
  }
};
