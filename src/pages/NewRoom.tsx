
import { Link } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useContext } from 'react';
import { AuthContext } from '../App';



export function NewRoom() {
    const { user, signInWithGoogle } = useContext(AuthContext)

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração "/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main >
                <div className="main-content">
                    <img src={logoImg} alt="letmeask" />
                    <h1>{user?.name}</h1>
    
                    <h2>Criar uma nova sala</h2>
                    <form>
                        <input
                        type="text"
                        placeholder="Nome da sala"
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}