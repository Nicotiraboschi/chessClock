import { useGlobalContext } from './context';

const ListRooms = ({ listRooms, setToTimer }) => {
  const { setJoinedRoom } = useGlobalContext();
  return (
    <div>
      {listRooms.map((room) => (
        <button
          key={room.name}
          onClick={() => {
            setToTimer(true);
            setJoinedRoom(room);
          }}>
          {room.name}
        </button>
      ))}
    </div>
  );
};
export default ListRooms;
