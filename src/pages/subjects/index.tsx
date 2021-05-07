import { GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { getPrismicCLient } from '../../services/prismic'
import styles from './styles.module.scss'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import Link from 'next/link'

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}
interface PostsProps {
    posts: Post[] // sempre que é um array, é melhor separar e fazer uma type e declarar com array desse type
}

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | RevisApp</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>

                    {posts.map(post => (
                        <Link href={`/subjects/${post.slug}`}>
                            <a key={post.slug}>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>

        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicCLient()

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'post')
    ], {
        fetch: ['post.title', 'post.content'],
        pageSize: 100,
    })

    // é melhor fazer a formatação na hora que puxa os dados, e não no front-end. assim a formatação é feita apenas 1x
    // e não sempre que o site é aberto.
    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',//procura um paragrafo, se for encontrado, traz o texto... se não, traz vazio.
            updatedAt: new Date(post.last_publication_date).toLocaleString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'

            })
        }
    })
    //console.log(JSON.stringify(response, null, 2))

    return {
        props: { posts }
    }
}