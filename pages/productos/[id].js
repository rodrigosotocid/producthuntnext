import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import Layout from '../../components/layout/Layout'
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
   @media (min-width: 768px) {
      display:grid;
      grid-template-columns: 2fr 1fr;
      column-gap: 2rem;
   }
`;

const CreadorProducto = styled.p`
   padding: .5rem 2rem;
   background-color: #DA552F;
   color: #FFF;
   text-transform: uppercase;
   font-weight: bold;
   display: inline-block;
   text-align: center;
`;

const Producto = () => {

   // state del cmponente
   const [producto, guardarProducto] = useState({});
   const [error, setError] = useState(false);
   const [comentario, guardarComentario] = useState({});
   const [consultarDB, guardarConsultarDB] = useState(true)

   // Routing para obtener el id actual
   const router = useRouter();
   const { query: { id } } = router;

   // context de firebase
   const { firebase, usuario } = useContext(FirebaseContext);

   useEffect(() => {
      if (id && consultarDB) {
         const obtenerProducto = async () => {
            const productoQuery = await firebase.db.collection('productos').doc(id);
            const producto = await productoQuery.get();

            if (producto.exists) {
               guardarProducto(producto.data());
               guardarConsultarDB(false); // 
            }
            else {
               setError(true);
               guardarConsultarDB(false);
            }

         }
         obtenerProducto();
      }

   }, [id])

   if (Object.keys(producto).length === 0 && !error) return 'Cargando...';

   const {
      comentarios,
      creado,
      descripcion,
      empresa,
      nombre,
      url,
      urlImage,
      votos,
      creador,
      haVotado
   } = producto;

   // Administrar y validar los votos
   const votarProducto = () => {
      if (!usuario) {
         return router.push('/login');
      }

      // Obtener y sumar un nuevo voto
      const nuevoTotal = votos + 1;

      // Verificar si el ususario actual ha votado
      if (haVotado.includes(usuario.uid)) return;

      // guardar el id del usuario que ha votado
      const nuevoHaVotado = [...haVotado, usuario.uid];

      // Actualizar en la BD
      firebase.db.collection('productos').doc(id).update({
         votos: nuevoTotal,
         haVotado: nuevoHaVotado
      });

      // Actualizar el state
      guardarProducto({
         ...producto,
         votos: nuevoTotal
      })

      guardarConsultarDB(true); // Hay un VOTO por lo tanto consultar a la BD
   }

   // Funciones para crear comentarios
   const comentarioChange = e => {
      guardarComentario({
         ...comentario,
         [e.target.name]: e.target.value
      })
   }

   // Identifica si el comentario es del ccreador del producto
   const esCreador = id => {
      if (creador.id == id) {
         return true;
      }
   }

   const agregarComentario = e => {
      e.preventDefault();

      if (!usuario) {
         return router.push('/login')
      }

      // información extra al comentario
      comentario.usuarioId = usuario.uid;
      comentario.usuarioNombre = usuario.displayName;

      // tomar copia de comentarios y agragarlos al arreglo
      const nuevosComentarios = [...comentarios, comentario];

      // Actualizar la BD
      firebase.db.collection('productos').doc(id).update({
         comentarios: nuevosComentarios
      })

      // Actualizar el state
      guardarProducto({
         ...producto,
         comentarios: nuevosComentarios
      })
      guardarConsultarDB(true); // Hay un COMENTARIO por lo tanto consultar a la BD
   }

   /**
    * Función que revisa que el creador del producto sea el mismo que
    * está autenticado.
    */
   const puedeBorrar = () => {
      // No siempre van a estar autenticados los ususarios, entonces "return false"
      if (!usuario) return false;
      
      if (creador.id === usuario.uid) {
         return true;
      }
   }

   // Elimina un producto de la BD
   const eliminarProducto = async () => {
      
         if (!usuario) {
            return router.push('/login')
         }

         if (creador.id !== usuario.uid) {
            return router.push('/');
         }
      try {
         await firebase.db.collection('productos').doc(id).delete();
         router.push('/');

      } catch (error) {
         console.log(error);
      }
   }

   return (
      <Layout>
         <>
            {error ? <Error404 /> : (

            <div className="contenedor">
               <h1 css={css`
               text-align: center;
               margin-top: 5rem;
               `}
               >{nombre}</h1>
               <ContenedorProducto>
                  <div>
                     <p>Publicado hace: {formatDistanceToNow(new Date(creado), { locale: es })}</p>
                     <p>Por {creador.nombre} de {empresa}</p>
                     <img src={urlImage} />
                     <p>{descripcion}</p>

                     {usuario && (
                        <>
                           <h2>Agrega tu comentario</h2>

                           <form
                              onSubmit={agregarComentario}
                           >
                              <Campo>
                                 <input
                                    type="text"
                                    name="mensaje"
                                    onChange={comentarioChange}
                                 />
                              </Campo>

                              <InputSubmit
                                 type="submit"
                                 value="Añadir Comentario"
                              />
                           </form>
                        </>
                     )}

                     <h2 css={css`
                        margin:2rem 0;
                     `}>Comentarios</h2>

                     {comentarios.length === 0 ? "Aún no hay comentarios!" : (
                        <ul>
                           {comentarios.map((comentario, i) => (
                              <li
                                 key={`${comentario.usuarioId}-${i}`}
                                 css={css`
                                    border: 1px solid #e1e1e1;
                                    padding: 2rem;
                                 `}
                              >
                                 <p>{comentario.mensaje}</p>
                                 <p>Escrito por:
                                    
                                    <span
                                       css={css`
                                          font-weight: bold;
                                       `}
                                    >
                                       { ' ' } {comentario.usuarioNombre}
                                    </span>
                                 </p>
                                 {esCreador(comentario.usuarioId) && <CreadorProducto>Es creador</CreadorProducto>}
                              </li>
                           ))}
                        </ul>
                     )}


                  </div>
                  <aside>
                     <Boton
                        target="_blank"
                        bgColor="true"
                        href={url}
                     >Visitar URL</Boton>


                     <div css={css`
                        margin-top: 5rem;
                     `}>
                        <p css={css`
                        text-align: center;
                     `}>{votos} Votos</p>

                        {usuario && (
                           <Boton
                              onClick={votarProducto}
                           >
                              Votar
                           </Boton>
                        )}
                     </div>

                  </aside>
                  </ContenedorProducto>
                  
                  { puedeBorrar() && 
                     <Boton
                     onClick={eliminarProducto}   
                     >Eliminar Producto</Boton>
                  }
               </div>
            )}
         </>
      </Layout>);
}

export default Producto;