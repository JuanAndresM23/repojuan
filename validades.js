const expresiones = {
    nombre_producto: /^[\w\s,.\:@!¡"()+'*`´%&#°áéíóúÁÉÍÓÚäëïöüÄËÏÖÜàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãõÃÕñÑçÇ]{1,50}$/,
    marca: /^[\w\s,.\:@!¡"()+'*`´%&#°áéíóúÁÉÍÓÚäëïöüÄËÏÖÜàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãõÃÕñÑçÇ]{3,30}$/,
    categoria: /^(Hombres|Mujeres|Niños|Accesorios)$/,
    talla: /^(XS|S|M|L|XL|XXL)$/,
    color: /^[\w\s,.\:@!¡"()+'*`´%&#°áéíóúÁÉÍÓÚäëïöüÄËÏÖÜàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãõÃÕñÑçÇ]{3,30}$/,
    precio: /^[0-9]+(\.[0-9]{1,2})?$/,
    descripcion: /^[\w\s,.\:@!¡"()+'*`´%&#°áéíóúÁÉÍÓÚäëïöüÄËÏÖÜàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãõÃÕñÑçÇ]{0,500}$/
};

const alertas = {
    nombre_producto: 'El valor ingresado no es válido. Ejemplo: Camiseta',
    marca: 'El valor ingresado no es válido. Ejemplo: Nike',
    categoria: 'El valor ingresado no es válido. Ejemplo: Hombres',
    talla: 'El valor ingresado no es válido. Ejemplo: M',
    color: 'El valor ingresado no es válido. Ejemplo: Rojo',
    precio: 'El valor ingresado no es válido. Ejemplo: 19.99',
    descripcion: 'El valor ingresado no es válido. Ejemplo: Camiseta de algodón, cómoda y ligera.',
    positivo: 'Validado correctamente (^-^)',
    registrado: 'El producto fue registrado correctamente (^-^)',
    noRegistrado: 'El producto ya se encuentra registrado',
    camposFaltantes: 'Algunos campos no están completos'
};

const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');
const selects = document.querySelectorAll("#formulario select");
const textareas = document.querySelectorAll("#formulario textarea");

const campos = {
    nombre_producto: false,
    marca: false,
    categoria: false,
    talla: false,
    color: false,
    precio: false,
    descripcion: true
};

const validarCampos = (expresion, tipoCampo, campo) => {
    if (expresion.test(tipoCampo.value)) {
        document.getElementById(campo).classList.remove("is-invalid");
        document.getElementById(campo).classList.add("is-valid");

        document.getElementById(`alert_${campo}`).classList.remove("invisible");
        document.getElementById(`alert_${campo}`).classList.remove("alert-danger");
        document.getElementById(`alert_${campo}`).classList.add("alert-success");

        document.getElementById(`alert_${campo}`).innerText = alertas.positivo;
        campos[campo] = true;
    } else {
        document.getElementById(campo).classList.remove("is-valid");
        document.getElementById(campo).classList.add("is-invalid");

        document.getElementById(`alert_${campo}`).classList.remove("invisible");
        document.getElementById(`alert_${campo}`).classList.remove("alert-success");
        document.getElementById(`alert_${campo}`).classList.add("alert-danger");

        document.getElementById(`alert_${campo}`).innerText = alertas[campo];
        campos[campo] = false;
    }
};

const validarFormulario = (e) => {
    const campo = e.target.name;
    const expresion = expresiones[campo];

    if (expresion) {
        validarCampos(expresion, e.target, campo);
    }
};

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

selects.forEach((select) => {
    select.addEventListener('change', validarFormulario);
    select.addEventListener("blur", validarFormulario);
});

textareas.forEach((textarea) => {
    textarea.addEventListener('keyup', validarFormulario);
    textarea.addEventListener("blur", validarFormulario);
});

const crearProducto = () => {
    return {
        nombre_producto: document.getElementById('nombre_producto').value,
        marca: document.getElementById('marca').value,
        categoria: document.getElementById('categoria').value,
        talla: document.getElementById('talla').value,
        color: document.getElementById('color').value,
        precio: document.getElementById('precio').value,
        descripcion: document.getElementById("descripcion").value
    };
};

const mostrarAlerta = (tipo, mensaje) => {
    const alertSubmit = document.getElementById("alert_submit");
    alertSubmit.classList.remove("invisible");
    alertSubmit.classList.add(tipo);
    alertSubmit.innerText = mensaje;

    setTimeout(() => {
        alertSubmit.classList.add("invisible");
        alertSubmit.classList.remove(tipo);
        alertSubmit.innerText = '';
    }, 5000);
};

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    if (Object.values(campos).every(Boolean)) {
        const producto = crearProducto();
        fetch('/enviar-producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Error al registrar el producto');
            }
        })
        .then(message => {
            mostrarAlerta('alert-info', alertas.registrado);
            formulario.reset();
            Object.keys(campos).forEach(campo => campos[campo] = false);
        })
        .catch(error => {
            mostrarAlerta('alert-danger', alertas.noRegistrado);
        });
    } else {
        mostrarAlerta('alert-danger', alertas.camposFaltantes);
    }
});
