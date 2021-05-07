import { GetStaticProps } from 'next'
import Head from 'next/head'

import { SubscribeButton } from "../components/SubscriveButton"
import { stripe } from '../services/stripe';

import styles from './home.module.scss'

// 3 formas principais de fazer uma chamada API:
// Client-side - utilizado pra quando nao preciso de indexação. ou alguma informação carregada de acordo com a ação do usuário...
// Server-side - precisa de dados dinâmicos da sessão do usuário, por exemplo.. dados que variam
// Static Site Generation - casos que conseguimos gerar o HTML pra todas as que estão usando a aplicação - sem muita alteração.... ex: home de um blog

// exemplo:
// post do Blog

// Conteúdo: SSG
// Comentários: SSR ou client-side - nao da pra esperar 24 até carregar o proximo comentário

// SSR demora mais pra carregar que o Client-side pois precisa que todos os valores estejam presentes para compilar o HTML

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}


export default function Home({ product }: HomeProps) {
  return (
    <>
      {/* o next pega o head daqui e joga lá pro _document.tsx */}
      < Head >
        <title>Home | RevisApp</title>
      </Head >


      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span> 👏 Hey, welcome</span>
          <h1>News abount the <span>React</span> world.</h1>
          <p>
            Get access top all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl Coding" />
      </main>


    </>
  );
}


// todo o codigo que eu colocar dentro dessa função, vai rodar no servidor next
// vc só consegue ver o log no terminal (console.log)
export const getStaticProps: GetStaticProps = async () => {
  console.log('Rodando no server next')

  const price = await stripe.prices.retrieve('price_1IkajdGqgkvgXPT0WQQZSfOf')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100), //vem sempre em centavos
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 //24h - quanto tempo em segundos eu quero que essa pagina se mantenha sem precisar ser reconstruida
  }
}