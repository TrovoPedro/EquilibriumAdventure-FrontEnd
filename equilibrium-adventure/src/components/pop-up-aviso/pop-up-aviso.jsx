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
            showCancelButton: false,
            confirmButtonText: confirmButtonText,
            customClass: {
                confirmButton: 'swal2-confirm-warning'
            },
            buttonsStyling: false, 
        }).then((result) => {
            if (result.isConfirmed && onConfirm) {
                onConfirm();
            }
        });
    };

    React.useEffect(() => {
        showAlert();
    }, []);

    return null;
};

export default PopUpAviso;