
import { useState } from 'react';
import { Editor } from "@tinymce/tinymce-react";

import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import parse from 'html-react-parser'


import { RichText } from "prismic-dom"
import Head from 'next/head'

import { getPrismicCLient } from "../../services/prismic"

import styles from './styles.module.scss'


interface PostProps {
    post: {
        subject: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function Subjects({ post }: PostProps) {
    const [text, setText] = useState('')

    console.log(post)

    return (
        <>
            <button>
                save
            </button>
            <div className={styles.app}>



                <div className={styles.editor}>
                    <Editor
                        initialValue={post.content}
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                "advlist autolink lists link image",
                                "charmap print preview anchor help",
                                "searchreplace visualblocks code",
                                "insertdatetime media table paste wordcount",
                            ],
                            toolbar:
                                "undo redo | formatselect | bold italic underline | \
                            alignleft aligncenter alignright | \
                            bullist numlist outdent indent | image | \
                            subscript superscript |backcolor | help",
                        }}
                        onChange={(e) => {
                            setText(e.target.getContent());
                            console.log("Content was updated:", e.target.getContent());
                        }}
                    />
                </div>

                <div className={styles.html}>

                    <h2>HTML</h2>
                    <div>
                        <p>{parse(text)}</p>
                    </div>
                </div>
            </div>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {


    // const { slug } = params
    const { subject } = params
    console.log("subject", subject);
    const prismic = getPrismicCLient(req)
    console.log(prismic);

    const response = await prismic.getByUID('post', String(subject), {})

    console.log("response", response);

    const post = {
        subject,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }


    return {
        props: {
            post,
        }
    }
}