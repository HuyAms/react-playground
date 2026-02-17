import {Button} from '@mui/material';
import {useEffect, useState} from 'react';

const POLLING_INTERVAL = 2000;

export default function PollingPage() {
  const [count, setCount] = useState(0);
  const [pollingEabled, setPollingEabled] = useState(false);

  useEffect(() => {
    console.log('useEffect polling...');

    if (!pollingEabled) {
      return;
    }

    function polling() {
      console.log('polling...');
    }

    // initial polling
    polling();

    const interval = setInterval(polling, POLLING_INTERVAL);

    return () => {
      console.log('cleanup...');
      clearInterval(interval);
    };
  }, [pollingEabled]);

  return (
    <div>
      <h1>Polling</h1>
      <Button onClick={() => setCount(count + 1)}>{count}</Button>
      <Button onClick={() => setPollingEabled(true)}>Start polling</Button>
      <Button onClick={() => setPollingEabled(false)}>Stop polling</Button>
    </div>
  );
}
