import 'bootstrap/dist/css/bootstrap.min.css';

import TennisNavBar from '../components/navbar';
import '../styles/main.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <TennisNavBar />
      <Component {...pageProps} />
    </>
  );
}
