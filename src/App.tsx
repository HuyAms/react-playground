import './App.css';
import {Button} from './components/button/Button';

function App() {
  function handleOnClick() {
    console.log('On click');
    throw new Error('Sentry Test Error');
  }

  return (
    <div>
      <Button onClick={handleOnClick}>Hello world</Button>
    </div>
  );
}

export default App;
