import React from 'react';
import Header from '../layout/Header';
import { Global, css } from '@emotion/react';
import Head from 'next/head';

const Layout = props => {
    return (
        <>
            <Global
                styles={css`
                    :root {
                        --gris: #3d3d3d;
                        --gris2: #6f6f6f;
                        --gris3: #e1e1e1;
                        --naranja: #da552f;
                    }

                    html {
                        font-size: 62.5%;
                        box-sizing: border-box;
                    }

                    *,*:before, *:after {
                        box-sizing: inherit;
                    }

                    body {
                        font-size: 1.6rem;
                        line-height: 1.5;
                        font-family: 'PT Sans', sans-serif;
                    }

                    h1, h2, h3, h4, h5, h6 {
                        margin: 0 0 2rem 0;
                        line-height: 1.5;
                    }

                    h1, h2 {
                        font-family: 'Roboto Slab', serif;
                        font-weight: 700;
                    }

                    h3 {
                        font-family: 'PT Sans', sans-serif;
                    }

                    ul {
                        list-style: none;
                        margin: 0;
                        padding: 0; 
                    }

                    a {
                        text-decoration: none;
                    }
                    img{
                        max-width: 100%;
                    }
                ` }
            />

            <Head>
                <html lang="es"></html>
                <title>Product Hunt Firebase y Next</title>

                {/* NORMALIZE */}
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />

                {/* GOOGLE FONTS */}
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet" />

                {/* CUSTOM FONTS */}

                {/*HAN DE IMPORTARSE EN _APP.JS <link href="../../styles/app.css" rel="stylesheet" /> */}
            </Head>

            <Header />
            <main>
                {props.children}
            </main>

        </>
    );
}

export default Layout;