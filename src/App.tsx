import './App.css';
import {Button} from './components/button/Button';

function App() {
  function handleOnClick() {
    console.log('On click');
  }

  return (
    <div>
      <Button onClick={handleOnClick}>Hello world</Button>
      <Button intent="secondary" onClick={handleOnClick}>
        Hello world
      </Button>
    </div>
  );
}

export default App;
