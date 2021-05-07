import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { fauna } from '../../services/fauna';
import { query as q } from 'faunadb'
import { stripe } from "../../services/stripe"

type User = {
    ref: {
        id: string;
    }
    data: {
        stripe_customer_id: string
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // se for post, crio uma sessão do stripe


        // pego o meu usuário do fauna, que está nos cookies.
        const session = await getSession({ req });

        // pega o usuário do faunadb
        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id
        // se o usuario que está no banco ainda não tem um customer_id, aí sim eu crio o usuário e atualizado~
        console.log("customerId: ",
         customerId)
        if (!customerId) {
            
            // cria usuário no stripe
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                // metadata:
            })

            // atualiza o usuário no faunadb com a subscription
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id
        } else {
            console.log("Usuário já criado no stripe")
        }


        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1IkajdGqgkvgXPT0WQQZSfOf', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })
        // Retorna Sucesso
        return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    } else {
        // esse a função só aceita post.
        // se nao for method HTTP POST, 
        res.setHeader('Allow', 'POST') // aqui está explicando pro front-end (pra quem está fazendo a requisição) que o método que essa rota aceita é POST
        res.status(405).end('Method not allowed') // devolvo uma resposta com o erro 405
    }
}