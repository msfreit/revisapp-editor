import { AppProps } from 'next/app'
import Header from '../components/Header';
import { Provider as NextAuthProvider } from 'next-auth/client' // context - compartilha as invormações pra toda a aplicação... igual o contexto ensinado no Ignite
// as informações se meu usuário está logado ou não chegarão através do pageProps.


import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}> 
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp

