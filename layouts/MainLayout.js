import Head from 'next/head';
import MainHeader from '../components/MainHeader'

const MainLayout = props => {

  return (
    <>
      <Head>

        <title>Management Center</title>
        <link rel="icon" href="/favicon.ico" sizes='32x32' />
        <link rel="apple-touch-icon" href="/favicon-apple.png" />

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Management center was created by Consultec-TI" />
      </Head>

      <div className="d-flex flex-column min-vh-100">

        <MainHeader></MainHeader>

        <content>
          <div>
            {props.children}
          </div>
        </content>
      </div>
    </>
  );
}


export default MainLayout;
