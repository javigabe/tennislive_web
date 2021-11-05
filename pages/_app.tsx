import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import { ReactElement } from 'react';

import TennisNavBar from '../components/navbar';
import '../styles/main.css';

export default function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <TennisNavBar />
      <Component {...pageProps} />
    </>
  );
}
