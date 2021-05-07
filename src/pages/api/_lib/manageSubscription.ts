import { query as q } from 'faunadb'
import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction: boolean,
) {
    // Buscar o usuário no banco do FaunaDb com o ID {customerId} - stripe_customer_id
    // Salvar os dados da subscription no FaunaDB
    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )

    // pra buscar todos os dados da subscription, preciso fazer o seguinte:
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscriptionId,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,

    }
    // console.log("subscription", subscription)
    // console.log("subscriptionData", subscriptionData)



    if (createAction) {
        // se é pra criar uma subscription, eu crio... se não, atualizo
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                { data: subscriptionData }
            )
        )
    } else {
        console.log('Subscription deletada', subscriptionId)

        await fauna.query(
            //aqui vou substituir toda a subscription
            q.Replace(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                                subscriptionId
                        )
                    )
                ),
                { data: subscriptionData }
            )
        )
    }

}