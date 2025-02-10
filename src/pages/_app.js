import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { MessageProvider } from 'context/MessageProvider';
import { AuthProvider } from 'context/AuthProvider';

import MainLayout from 'layouts/MainLayout';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <MessageProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </MessageProvider>
    </AuthProvider>
  );
}

export default MyApp;
