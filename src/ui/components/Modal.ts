export class Modal {
  static showPrompt(title: string, placeholder: string, onSubmit: (val: string) => void): void {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    
    const modalHtml = `
      <div class="modal d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" id="modalClose"></button>
            </div>
            <div class="modal-body">
              <input type="text" class="form-control" id="modalInput" placeholder="${placeholder}">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="modalCancel">Скасувати</button>
              <button type="button" class="btn btn-primary" id="modalSubmit">Зберегти</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = modalHtml;
    document.body.appendChild(backdrop);
    document.body.appendChild(container);

    const close = () => {
      backdrop.remove();
      container.remove();
    };

    container.querySelector('#modalClose')?.addEventListener('click', close);
    container.querySelector('#modalCancel')?.addEventListener('click', close);
    container.querySelector('#modalSubmit')?.addEventListener('click', () => {
      const val = (container.querySelector('#modalInput') as HTMLInputElement).value;
      onSubmit(val);
      close();
    });
  }

  static showAlert(title: string, message: string): void {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    
    const modalHtml = `
      <div class="modal d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body text-center my-3">
              <p class="fs-5 mb-4">${message}</p>
              <button type="button" class="btn btn-primary px-4" id="modalOk">Зрозуміло!</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = modalHtml;
    document.body.appendChild(backdrop);
    document.body.appendChild(container);

    container.querySelector('#modalOk')?.addEventListener('click', () => {
      backdrop.remove();
      container.remove();
    });
  }
}