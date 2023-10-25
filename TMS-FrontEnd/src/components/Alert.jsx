import Swal from 'sweetalert2'

export default function Alert(props) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
    })
    Toast.fire({
        icon: props.icon,
        title: props.title
    })
}