import { useEffect, useState } from 'react';
import { useGlobalContext } from './context';
import io from 'socket.io-client';
import ListRooms from './ListRooms';

const socket = io.connect(window.location.origin);

const Form = () => {
  const { setIsStarted, setToTimer, setIsFinished } = useGlobalContext();

  const [initialSeconds, setInitialSeconds] = useState(180);
  const [textRoom, setTextRoom] = useState('');

  const [listRooms, setListRooms] = useState([]);
  const [room, setRoom] = useState({
    name: '',
    initialSeconds: 180,
  });
  console.log(window.location.origin);

  const submitForm = (e) => {
    e.preventDefault();
    const newRoom = { name: textRoom, initialSeconds: initialSeconds };
    setRoom(newRoom);
    const listNames = listRooms.map((room) => room.name);
    if (listNames.includes(newRoom.name)) {
      alert(`${newRoom.name} already exists`);
      return;
    }
    const newListRooms = [...listRooms, newRoom];
    setListRooms(newListRooms);
    socket.emit('createRoom', { newListRooms });
  };

  useEffect(() => {
    socket.on('createRoom', (data) => {
      setListRooms(data.newListRooms);
    });
  }, [socket]);

  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'black',
        color: 'white',
      }}
      action=""
      onSubmit={(e) => {
        submitForm(e);
      }}>
      <h1>CREATE ROOM</h1>
      <label htmlFor="room">Room's name</label>
      <input
        type="text"
        value={textRoom}
        onChange={(e) => setTextRoom(e.target.value)}
      />

      <label htmlFor="initialSeconds">Initial Seconds</label>
      <input
        type="number"
        name="initialSeconds"
        value={initialSeconds}
        onChange={(e) => {
          setInitialSeconds(e.target.value);
        }}
      />
      <button type="submit">CREATE</button>

      <h1>JOIN ROOM</h1>

      <ListRooms listRooms={listRooms} setToTimer={setToTimer} />
    </form>
  );
};
export default Form;
