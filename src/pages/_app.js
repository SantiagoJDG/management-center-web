import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import MainLayout from 'layouts/MainLayout';
import { AuthProvider } from 'context/AuthProvider';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AuthProvider>
  );
}

export default MyApp;
