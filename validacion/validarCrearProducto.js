export default function validarCrearProducto(valores) {

    let errores = {};

    // Validar el nombre 
    if (!valores.nombre) {
        errores.nombre = "El nombre es obligatorio";
    }

    // Validar Empresa
    if (!valores.empresa) {
        errores.empresa = "El nombre de Empresa es Obligatorio";
    }

    // Validar URL
    if (!valores.url) {
        errores.url = "La URL del Producto es obligatoria";
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
        errores.url = "URL con formato incorrecto o no válida";
    }

    // Validar descripción
    if (!valores.descripcion) {
        errores.descripcion = "Deber añadir una descripción al producto";
    }


    return errores;
}
