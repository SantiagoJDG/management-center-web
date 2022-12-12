import Head from 'next/head';
import MainHeader from '../components/MainHeader';
import Script from 'next/script';
import useAuth from '../hooks/useAuth';

const MainLayout = (props) => {
  const { setUserToken, setWaitingUser } = useAuth();

  const saveToken = async (response) => {
    sessionStorage.setItem('center-token', response.credential);
    setUserToken(response.credential);
    setWaitingUser(false);
  };

  return (
    <>
      <Head>
        <title>Management Center</title>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon-apple.png" />

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Management center was created by Consultec-TI"
        />
      </Head>

      <div className="d-flex flex-column min-vh-100">
        <MainHeader></MainHeader>

        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
          onReady={() => {
            google.accounts.id.initialize({
              client_id:
                process.env.MANAGEMENT_CENTER_CLIENT_ID ??
                '40846289904-t2cb0fvm6ttte1ksfoms7t197e68ddch.apps.googleusercontent.com',
              callback: saveToken
            });

            const token = sessionStorage.getItem('center-token');

            if (!token) {
              google.accounts.id.renderButton(
                document.getElementById('buttonDiv'),
                {
                  theme: 'filled_blue',
                  size: 'large',
                  text: 'continue_with',
                  shape: 'pill',
                  width: '150',
                  select_by: 'auto'
                }
              );

              google.accounts.id.prompt();
            }
          }}
        />

        <content>
          <div>{props.children}</div>
        </content>
      </div>
    </>
  );
};

export default MainLayout;
