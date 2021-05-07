import React from 'react'
import styles from './styles.module.scss'
import SignInButton from '../SignInButton'
import { ActiveLink } from '../ActiveLink'

export default function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.png" alt="RevisApp" width="180" height="90"/>
                <nav>
                    {/* o "/" manda pra home page

                    sempre que a pagina é carregada, todos os componentes são carregados.
                    com o Link, isso é corrigido, ou seja, tudo é carregado apenas 1x, depois somente os componentes essenciais, 
                    como componentes de banco, interface com API, etc. 
                    Assim, o carregamento de pagina fica muito mais rapido*/}
                    <ActiveLink activeClassName={styles.active} href="/" >
                        <a>Home</a>
                    </ActiveLink>
                    {/* essa funcionalidade do prefetch (<Link href="/posts" prefetch>), ja deixa tudo carregado. assim, o tempo do usuário clicar e a pagina carregar vai a zero. */}
                    <ActiveLink activeClassName={styles.active} href="/posts">
                        <a>Posts</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="/subjects">
                        <a>Subjects</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="/exercicios">
                        <a>Exercícios</a>
                    </ActiveLink>
                </nav>

                <SignInButton />
            </div>
        </header>
    );
}