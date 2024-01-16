/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import './App.css';
import { useGlobalContext } from './context';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000');

function Timer() {
  const { setIsStarted, joinedRoom, setToTimer } = useGlobalContext();

  const initialSeconds = joinedRoom.initialSeconds;
  const [actualSeconds, setActualSeconds] = useState(initialSeconds);
  const [player, setPlayer] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [message, setMessage] = useState('');

  const start = () => {
    setIsButtonPressed(true);
    const isPlayer = player ? 'black' : 'white';

    setActualSeconds(initialSeconds);
    console.log('start');

    const intervalId = setInterval(() => {
      setActualSeconds((prevSeconds) => {
        if (prevSeconds == 0) {
          socket.emit('finished', { player: isPlayer });
          socket.on('finished', (data) => {
            setMessage(data.msg);
            setIsStarted(false);
          });
          setIsFinished(true);
          clearInterval(intervalId);
          setActualSeconds(initialSeconds);
          return 0;
        }
        return (prevSeconds - 0.1).toFixed(1);
      });
    }, 100);

    setIntervalId(intervalId);
  };

  function formatTime(paramSeconds) {
    const minutes = Math.floor(paramSeconds / 60);
    const remainingSeconds = paramSeconds % 60;

    const formattedSeconds =
      remainingSeconds > 30 || minutes > 0
        ? Math.round(remainingSeconds)
        : remainingSeconds.toFixed(1);

    const formattedTime =
      minutes > 0
        ? `${minutes} min ${formattedSeconds} sec`
        : `${formattedSeconds} sec`;

    return formattedTime;
  }

  const sendOnClick = () => {
    const roomName = joinedRoom.name;
    socket.emit('click', { player, roomName });
    if (!isButtonPressed) {
      socket.emit('start', { room: roomName });
      setIsButtonPressed(true);
    }
  };

  useEffect(() => {
    socket.on('click', (data) => {
      console.log(data);
      setPlayer(data);
      setActualSeconds(initialSeconds);
    });

    socket.on('start', () => {
      if (!isButtonPressed) {
        start();
        setIsButtonPressed(true);
      }
    });

    socket.on('finished', (data) => {
      setMessage(data.msg);
      setIsStarted(false);
    });
  }, [socket]);

  useEffect(() => {
    const roomName = joinedRoom.name;
    socket.emit('joinRoom', roomName);
  }, []);

  return (
    <main>
      {!isFinished ? (
        <button
          onClick={sendOnClick}
          style={{
            backgroundColor: player ? 'black' : 'white',
            color: 'blue',
            height: '100vh',
            width: '100vw',
            fontSize: '10rem',
          }}>
          <p> {formatTime(actualSeconds)}</p>
        </button>
      ) : (
        <div>
          <h1>{message}</h1>
          <button
            onClick={() => {
              setIsFinished(false);
              setToTimer(false);
            }}>
            Go back to the lobby
          </button>
          <button
            onClick={() => {
              setIsButtonPressed(false);
              setIsStarted(false);
              setIsFinished(false);
              setActualSeconds(initialSeconds);
              setPlayer(true);
              clearInterval(intervalId);
            }}>
            Restart the clock
          </button>
        </div>
      )}
    </main>
  );
}

export default Timer;
