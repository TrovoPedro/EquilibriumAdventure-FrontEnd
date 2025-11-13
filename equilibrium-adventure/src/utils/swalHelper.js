import Swal from 'sweetalert2';

export const showSuccess = (message, title = 'Sucesso', buttonText = 'OK') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonText: buttonText,
    customClass: { confirmButton: 'swal2-confirm' },
    buttonsStyling: false,
    draggable: true
    ,
    didOpen: (popup) => {
      try {
        const container = popup && popup.closest('.swal2-container');
        if (container) container.style.zIndex = '100010';
      } catch (e) {
        // ignore
      }
    }
  });
};

export const showError = (message, title = 'Erro', buttonText = 'OK') => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: buttonText,
    customClass: { confirmButton: 'swal2-confirm-error' },
    buttonsStyling: false,
    draggable: true
    ,
    didOpen: (popup) => {
      try {
        const container = popup && popup.closest('.swal2-container');
        if (container) container.style.zIndex = '100010';
      } catch (e) {
        // ignore
      }
    }
  });
};

export const showWarning = (
  message,
  title = 'Atenção',
  confirmButtonText = 'OK',
  cancelButtonText = 'Cancelar',
  showCancel = false
) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'warning',
    showCancelButton: showCancel,
    showCloseButton: true,
    confirmButtonText,
    cancelButtonText,
    customClass: {
      confirmButton: 'swal2-confirm-warning',
      cancelButton: 'swal2-cancel-warning'
    },
    buttonsStyling: false,
    draggable: true
    ,
    didOpen: (popup) => {
      try {
        const container = popup && popup.closest('.swal2-container');
        if (container) container.style.zIndex = '100010';
      } catch (e) {
        // ignore
      }
    }
  });
};

export default { showSuccess, showError, showWarning };
