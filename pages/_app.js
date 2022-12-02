import '../styles/globals.css'
import Head from 'next/head';
import styles from '../styles/Home.module.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="Management center was created by Consultec-TI" />
        <title>Management Center</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>

        <main className={styles.main}>
          <Component {...pageProps} />
        </main>

        <footer className={styles.footer}>
          <a
            href="https://www.consultec-ti.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span >
              Consultec-TI. Todos los derechos Reservados 2022 &copy;
            </span>
          </a>
        </footer>
      </div>
    </>
  )
}

export default MyApp
