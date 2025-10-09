import React from 'react';
import './pop-up-erro.css';
import Swal from 'sweetalert2';

const PopUpErro = ({ 
    title = "Oops...", 
    message = "Algo deu errado!", 
    onConfirm,
    buttonText = "OK"
}) => {

    const showAlert = () => {
        Swal.fire({
            icon: "error",
            title: title,
            text: message,
            confirmButtonText: buttonText,
            customClass: {
                confirmButton: 'swal2-confirm-error'
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

export default PopUpErro;
