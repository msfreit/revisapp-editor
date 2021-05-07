import { useSession, signIn } from 'next-auth/client'
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string;
}

// vc só pode fazer uma operação que precisa de segurança, usar as variaveis de ambiente em 3 lugares:
// getServerSideProps (SSR)
// getStaticProps (SSG)
// API Routs (pasta API)

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const [session] = useSession()

    async function handleSubscribe() {
        // se o usuário não estiver logado, ele vai se logar
        if (!session) {
            signIn('github')
            return;
        }

        // criação da checkout session
        // pra chamar a API Route (subscribe.ts), precisamos ter uma forma de comunicar o front-end com as nossas API routes.
        // como é uma rota do tipo POST, é preciso acessar via FETCH, ou AXIOS, etc..... vamos usar o AXIOS - yarn add axios

        try {
            const response = await api.post('/subscribe') // /subscribe pq o nome do arquivo é sempre o nome da rota

            const { sessionId } = response.data

            const stripe = await getStripeJs()
            await stripe.redirectToCheckout({sessionId: sessionId})
        } catch (err) {
            alert(err.message);
        }

    }


    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >

            Subscribe Now
        </button>
    )
}