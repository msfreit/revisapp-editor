import Link, { LinkProps } from "next/link"
import { useRouter } from "next/router"
import { ReactElement, cloneElement } from "react"



interface ActiveLinkProps extends LinkProps {
    children: ReactElement;
    activeClassName: string
}

// eu pego todas as propriedades que eu passo pro ActiveLink (exceto children e activeClassName) 
// e passo pra dentro do Link atrávés do ...rest
export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
    const { asPath } = useRouter() // retorna qual a rota que estou usando no momento. se eu tiver nos posts, vai retornar "/posts"

    const className = asPath === rest.href
        ? activeClassName
        : ''
    return (
        <Link {...rest}>
            {/* CloneElement é utilizado principalmente qunado vc precisa alterar o comportamento de 
            algum componente que a gente recebe como propriedade ou children */}
            {cloneElement(children, {
                className,
            })}
        </Link>
    )
}