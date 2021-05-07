import { query as q } from 'faunadb'

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { fauna } from "../../../services/fauna"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'// quais informações eu quero do usuário - https://docs.github.com/pt/developers/apps/scopes-for-oauth-apps
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn(user, account, profile) {
      // assim que receber o callback do next auth, insere no banco
      const { email } = user
      // fauna query language - FQL
      console.log("Criando Usuário", email)
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),

            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true

      } catch {
        return false;
      }


    },
  }
})