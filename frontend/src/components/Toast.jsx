
import Swal from 'sweetalert2'

export function Toast(alert, message) {
    const ToastAlert = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    ToastAlert.fire({
        icon: alert,
        title: message
    });
}

