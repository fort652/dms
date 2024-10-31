import TopNav from '../components/TopNav';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from 'next/head';
import '../styles/globals.css';

const theme = createTheme();

export default function App({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/Dieoutjiemuisic.png" />
        <title>Play ~ Dieoutjiemuisic</title>
      </Head>
      <TopNav />
      <Component {...pageProps} />
    </div>
  );
}
