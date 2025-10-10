import React from 'react';
import './pop-up-ok.css';
import Swal from 'sweetalert2';

const PopUpOk = ({ 
    title = "Sucesso!", 
    message = "Operação realizada com sucesso!", 
    onConfirm,
    buttonColor = "#336948",
    buttonText = "OK"
}) => {

    const showAlert = () => {
        Swal.fire({
            title: title,
            text: message,
            icon: "success",
            draggable: true,
            confirmButtonText: buttonText,
            customClass: {
                confirmButton: 'swal2-confirm'
            },
            buttonsStyling: false, // Usar nossos estilos CSS customizados
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

export default PopUpOk;