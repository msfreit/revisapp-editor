import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

// precisamos fazer um codigo pra transformar o que o stripe envia de webhook para algo legível pra gente
// não precisamos entender esse codigo.. é muito especifico do node na parte de streaming
// ############################
async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}
// ############################

export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([ //Set é como se fosse um array, só que nao pode ter nada duplicado aqui dentro
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        // dentro desse buf temos a nossa requisição em si 
        const buf = await buffer(req)
        const secret = req.headers['stripe-signature']

        let event: Stripe.Event;

        try {
            // se ele conseguiu bater as duas variaveis e contruir o objeto de evento, quer dizer que deu tudo certo
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            // status 400: bad request
            return res.status(400).send(`Webhook error: ${err.message}`)
        }

        const { type } = event;
        // console.log('webhook_type', type)

        if (relevantEvents.has(type)) {
            try {
                switch (type) {
                    case 'customer.subscription.updated':
                        break;
                    case 'customer.subscription.deleted':
                        const subscription = event.data.object as Stripe.Subscription
                        // console.log('entrou', subscription)

                        await saveSubscription (
                            subscription.id,
                            subscription.customer.toString(),
                            false
                        )
                        
                        break;
                    case 'checkout.session.completed':

                        const checkoutSession = event.data.object as Stripe.Checkout.Session
                        // console.log(checkoutSession.subscription.toString())
                        // console.log(checkoutSession.customer.toString())

                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true
                        )
                        break;
                    default:
                        throw new Error('Unhandled event.')
                }
            } catch (err) {
                // se cair aqui, é pq isso aqui é um erro de desenvolvimento.
                return res.json({ error: 'Webhook handler failed' })
            }
        }

        res.json({ received: true })
    } else {
        // esse a função só aceita post.
        // se nao for method HTTP POST, 
        res.setHeader('Allow', 'POST') // aqui está explicando pro front-end (pra quem está fazendo a requisição) que o método que essa rota aceita é POST
        res.status(405).end('Method not allowed') // devolvo uma resposta com o erro 405
    }
}


// stripe listen --forward-to localhost:3000/api/webhooks