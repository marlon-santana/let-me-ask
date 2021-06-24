import copyImg from '../assets/images/copy.svg';
import '../styles/room-code.scss';


export function Room() {
    return (
        <button className="room-code">
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala #27368745458345815485</span>
        </button>
    );
}