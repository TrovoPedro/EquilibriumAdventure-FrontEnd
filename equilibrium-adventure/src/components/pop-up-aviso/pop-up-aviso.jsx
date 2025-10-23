import React from 'react';
import './pop-up-aviso.css';
import Swal from 'sweetalert2';

const PopUpAviso = ({ 
    title = "Atenção!", 
    message = "Informação importante!", 
    onConfirm,
    onCancel,
    showCancelButton = false,
    confirmButtonText = "OK",
    cancelButtonText = "Cancelar"
}) => {

    const showAlert = () => {
        Swal.fire({
            title: title,
            text: message,
            icon: "warning",
            draggable: true,
            showCancelButton: showCancelButton,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            customClass: {
                confirmButton: 'swal2-confirm-warning',
                cancelButton: 'swal2-cancel-warning'
            },
            buttonsStyling: false, // Usar nossos estilos CSS customizados
        }).then((result) => {
            if (result.isConfirmed && onConfirm) {
                onConfirm();
            } else if (result.isDismissed && onCancel) {
                onCancel();
            }
        });
    };

    React.useEffect(() => {
        showAlert();
    }, []);

    return null;
};

export default PopUpAviso;