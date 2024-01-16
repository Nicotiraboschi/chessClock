import Timer from './Timer';
import Form from './Form';
import { useGlobalContext } from './context';

const App = () => {
  const { toTimer } = useGlobalContext();
  return <>{toTimer ? <Timer /> : <Form />}</>;
};
export default App;
