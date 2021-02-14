import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import { FirebaseContext } from '../firebase';

// Validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

import Error404 from '../components/layout/404';

const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    url: '',
    descripcion: ''
}

const NuevoProducto = () => {

    // State de las imágenes
    const [imagen, subirImagen] = useState('');

    const [nombreimagen, guardarNombre] = useState('');
    const [subiendo, guardarSubiendo] = useState(false);
    const [progreso, guardarProgreso] = useState(0); // esto es de la librería que no estoy usando
    const [urlImage, setUrlImage] = useState('');

    const [error, guardarError] = useState(false);

    const [image, setImage] = useState(null);

    const {
        valores,
        errores,
        handleSubmit,
        handleChange,
        handleBlur
    } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

    const { nombre, empresa, url, descripcion } = valores;

    // hook de routing para redireccionar 
    const router = useRouter();

    // Context con las operaciones CRUD de Firebase
    const { usuario, firebase } = useContext(FirebaseContext);

    const handleFile = e => {
        if (e.target.files[0]) {
            //console.log(e.target.files[0])
            setImage(e.target.files[0])
        }
    }

    async function crearProducto() {

        // si el usuario no esta autenticado llevar al login
        if (!usuario) {
            return router.push('/login');
        }

        // crear el objeto de nuevo producto
        const producto = {
            nombre,
            empresa,
            url,
            descripcion,
            urlImage,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: { // cuando creemeos otro producto añadirá esta información
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado: []

        }

        //console.log(producto);
        // insertarlo en una base de datos
        await firebase.db.collection('productos').add(producto);
        return router.push('/');
    }

    /*  const handleUploadStart = () => {
         guardarProgreso(0);
         guardarSubiendo(true);
     } */

    /*    const handleProgress = async (progreso, task) => {
           console.log(progreso);
           guardarProgreso(progreso);
           if (progreso === 100) {
               handleUploadSuccess(task.snapshot.ref.name);
           }
       } */

    /*  const handleUploadError = error => {
         guardarSubiendo(error);
         console.error(error);
     } */

    /*   const handleUploadSuccess = nombre => {
          guardarProgreso(100);
          guardarSubiendo(false);
          guardarNombre(nombre)
          firebase
              .storage
              .ref("productos")
              .child(nombre)
              .getDownloadURL()
              .then(url => {
                  console.log('esta es la url de la imagen', url);
                  guardarUrlImagen(url);
              });
      };
   */
    const onChange = async (e) => {

        const file = e.target.files[0]; // acceder al file subido con el input

        // asignar donde se guardara el file  
        const storageRef = await firebase.storage.ref("productos");

        // asignar el nombre del archivo en el storage de firebase
        const fileRef = storageRef.child(file.name);

        await fileRef.put(file); // termina de agregar el archivo

        setUrlImage(await fileRef.getDownloadURL()); // add urlFile al state

        /* getDownloadURL(); // - permite extraer url del file subido, sirve tanto con await y .then */
    };


    return (
        <div>
            <Layout>
                {!usuario ? <Error404 /> : (
                    <>
                        <h1 css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                        > Nuevo Producto</h1 >
                        <Formulario
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <fieldset>
                                <legend>Información General</legend>

                                <Campo>
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        placeholder="Nombre del producto..."
                                        name="nombre"
                                        value={nombre}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.nombre && <Error>{errores.nombre}</Error>}

                                <Campo>
                                    <label htmlFor="empresa">Empresa</label>
                                    <input
                                        type="text"
                                        id="empresa"
                                        placeholder="Nombre de Empresa o Compañía"
                                        name="empresa"
                                        value={empresa}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.empresa && <Error>{errores.empresa}</Error>}

                                <Campo>
                                    <label htmlFor="image">Imagen del producto</label>
                                    <input
                                        accept="image/*"
                                        onChange={onChange}
                                        type="file"
                                        id="image"
                                        name="image"
                                    />

                                </Campo>
                                <Campo>
                                    <label htmlFor="url">URL</label>
                                    <input
                                        type="url"
                                        id="url"
                                        name="url"
                                        placeholder="URL de tu producto"
                                        value={url}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.url && <Error>{errores.url}</Error>}

                            </fieldset>

                            <fieldset>
                                <legend>Sobre tu Producto</legend>
                                <Campo>
                                    <label htmlFor="descripcion">Descripción</label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={descripcion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.descripcion && <Error>{errores.descripcion}</Error>}

                            </fieldset>


                            {error && <Error>{error}</Error>}
                            <InputSubmit
                                type="submit"
                                value="Crear Producto"
                            />
                        </Formulario>
                    </>
                )}
            </Layout >
        </div >
    )
}

export default NuevoProducto;