import logoImg from '../assets/images/logo.svg'
import{ Button } from '../components/Button'
import '../styles/room.scss'
import { RoomCode } from '../components/RoomCode'
import { useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { database } from '../services/firebase'
import { FormEvent } from 'react'
import { useEffect } from 'react'
import { Question } from '../components/Question'


type FirebaseQuestions = Record<string, {
author: {
    name:string;
    avatar: string;
}
content: string;
isAnswered:boolean;
isHighLighted: boolean
}>

type  Question = {
    author: {
        name:string;
        avatar: string;
    }
    id: string;
    content: string;
    isAnswered:boolean;
    isHighLighted: boolean
}


type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    const [newQuestion, setNewQuestion] = useState('');
    const params = useParams<RoomParams>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('')

    const roomId = params.id;

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions : FirebaseQuestions = databaseRoom.questions ?? {};

            const parseQuestions = Object.entries(firebaseQuestions).map(([key,value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                }
            })
            setTitle(databaseRoom.title);
            setQuestions(parseQuestions);
        })
    },[roomId])

    async function handleSendQuestion(event: FormEvent ) {
        event.preventDefault();


        if (newQuestion.trim()=== '') {
            return;
        }

        if (!user) {
            throw new Error('you must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswer: false
        }


        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');

    }

    return (
        <div id="page-room">
        <header>
            <div className="content">
                <img  src={logoImg} alt="letmeask" />
                <RoomCode  code={roomId} />
            </div>
        </header>

        <main >
            <div className="room-title">
                <h1>Sala {title}</h1>
                {questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
            </div>
            <form  onSubmit={handleSendQuestion}>
                <textarea
                placeholder="O que você quer perguntar?"
                onChange={event => setNewQuestion(event.target.value)}
                value={newQuestion}
                
                />
                <div className="form-footer">
                    { user ? (
                        <div className="user-info">
                            <img src={user.avatar} alt={user.name} />
                            <span>{user.name}</span>
                        </div>
                    ) : (
                        <span>Para enviar uma pergunta, <button>faça login</button></span>
                    )}
                    <Button type="submit" disabled={!user}>Enviar</Button>
                </div>
            </form>
                   <div className="question-lit">
                   {questions.map(question => {
                        return (
                            <Question
                            key={question.id} 
                            content={question.content}
                            author={question.author}/>
                        );
                    })}
            </div>
        </main>
        </div>
    );
}