import { GetStaticProps } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from 'faunadb'
import parse from 'html-react-parser'
import styles from './styles.module.scss'

type question = {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface exercises {
    title: string;
    questions: question[];
}

export default function Exercicios({ exercises }) {
    console.log("exercises", exercises)

    return (
        <div className={styles.main}>
            {exercises.map(exercise => {

                return (
                    <>
                        {printExercise(exercise)}
                    </>
                )
            }
            )}
        </div>
    )
}

export function printExercise(exercise) {

    return (
        <div key={exercise.id}>
            <p>#############################################</p>
            <p>{exercise.id}</p>
            <p>#############################################</p>
            <p>{parse(exercise.text)}</p>
            <p>-----------------------------</p>
            <p>{exercise.options.map(option => {
                return (
                    <>
                        <button className={styles.options}>
                            {parse(option)}
                        </button>
                        
                    </>
                )
            })}</p>
            <p>-----------------------------</p>
            <p>{parse(exercise.correctAnswer)}</p>
            <p>-----------------------------</p>
            <p>{parse(exercise.explanation)}</p>
            <p>#############################################</p>

        </div>
    )

}

export const getStaticProps: GetStaticProps = async () => { // getStaticProps precisa ser async
    console.log("rodando do lado do server do next")


    const exercises_value = JSON.stringify(await fauna.query(
        q.Get(
            q.Match(
                q.Index('questions_by_type'), "subjectEnum.MATHEMATICS"
            )
        )
    ))
    //console.log("JSON.parse", JSON.parse(exercises_value).data.questions)
    const exercises = JSON.parse(exercises_value).data.questions

    return {
        props: {
            exercises,
        },
        revalidate: 60 * 60 * 24 //24h - quanto tempo em segundos eu quero que essa pagina se mantenha sem precisar ser reconstruida
    }
}