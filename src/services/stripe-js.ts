import { loadStripe } from '@stripe/stripe-js'

export async function getStripeJs() {
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) // A variavel começa com NEXT_PUBLIC que é a unica maneira de acessar a variavel de ambiente no front-end

    return stripeJs
}