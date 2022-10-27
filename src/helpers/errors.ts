import Swal from 'sweetalert2';

export function errorAlert(error: unknown) {
    console.error(error);
    Swal.fire(
        'Error',
        'Something went wrong, please contact Ezra Magbanua',
        'error',
    );
}
