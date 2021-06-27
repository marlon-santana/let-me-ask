import logoImg from '../assets/images/logo.svg'
import{ Button } from '../components/Button'
import '../styles/room.scss'
import { RoomCode } from '../components/RoomCode'
import { useHistory, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { database } from '../services/firebase'
import { FormEvent } from 'react'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'







type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory()
    const { user } = useAuth();
    const [newQuestion, setNewQuestion] = useState('');
    const params = useParams<RoomParams>();
    const roomId = params.id;

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/')
    }

    
    const {title, questions} = useRoom(roomId)

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }

    async function handleHighLightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }
    

    

    

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
                <div>
                    <RoomCode  code={roomId} />
                    <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
                </div>
            </div>
        </header>

        <main >
            <div className="room-title">
                <h1>Sala {title}</h1>
                {questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
            </div>
           
                   <div className="question-lit">
                   {questions.map(question => {
                        return (
                            <Question
                            key={question.id} 
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighLighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                    <button
                                    type="button"
                                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                    >
                                        <img src={checkImg} alt="Marcar pergunta á respondida" />
                                    </button>
    
                                    <button
                                    type="button"
                                    onClick={() => handleHighLightQuestion(question.id)}
                                    >
                                        <img src={answerImg} alt="Dar destaque á pergunta" />
                                    </button>
                                    </>
                                )}
                                
                                
                                <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        );
                    })}
            </div>
        </main>
        </div>
    );
}