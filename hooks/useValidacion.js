import React, { useState, useEffect } from 'react';

/**
 * El hook toma 3 parámetros: 
 * 1.- state inicial 
 * 2.- que es lo que vamos a validar
 * 3.- la fn que se va ejecutar cuando se haga el submit
 * - La idea de este hook es utilizarlos para crear cuenta, login y crear productos
 * */
const useValidacion = (stateInicial, validar, fn) => {

    const [valores, guardarValores] = useState(stateInicial);
    const [errores, guardarErrores] = useState({});
    const [submitForm, guardarSubmitForm] = useState(false);

    useEffect(() => {
        if (submitForm) {
            const noErrores = Object.keys(errores).length === 0;

            if (noErrores) {
                fn(); // Fn = Función que se ejecuta en el componente
            }
            guardarSubmitForm(false);
        }
    }, [errores])

    // Función que se ejecuta conforme el usuario escribe algo
    const handleChange = e => {
        guardarValores({
            ...valores,
            [e.target.name]: e.target.value
        });
    }

    // Función que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
        guardarSubmitForm(true);
    }

    // Cuando se realiza wl wvwnto de blur
    const handleBlur = () => {
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
    }

    return {
        valores,
        errores,
        submitForm,
        handleSubmit,
        handleChange,
        handleBlur
    }
}

export default useValidacion;