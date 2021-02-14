import React from 'react';
import { css } from '@emotion/react';

const Error404 = () => {
   return (
      <>
         <h1
            css={css`
         margin-top: 5rem;
         text-align: center;
      `}
         > ¡Ups! No deberias estar aquí. Vuelve por donde has venido. </h1>
         <p
            css={css`
               margin-top: 5rem;
               text-align: center;
            `}
         >Es todo más fácil cuando te logueas y vas por el camino correcto! Nos vemos dentro.</p>
      </>);
}

export default Error404;