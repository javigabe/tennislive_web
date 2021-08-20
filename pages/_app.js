import 'bootstrap/dist/css/bootstrap.min.css';

import TennisNavBar from '../components/navbar'


export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <TennisNavBar />
            <Component {...pageProps} />
        </>
    )
}
