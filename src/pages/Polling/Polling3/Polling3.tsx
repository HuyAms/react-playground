import {Button, Input} from '@mui/material';
import {useEffect, useState} from 'react';
import {addPollingId, getPollingIds, updatePollingId} from './localUtils';
import {Link} from 'react-router-dom';
import {usePolling} from './usePolling';

export default function Polling3Page() {
  const [count, setCount] = useState(0);
  const [newPollingId, setNewPollingId] = useState<string>('');

  const {startPolling, stopPolling, activePollingIds, progressData} = usePolling();

  useEffect(() => {
    const pollingIds = getPollingIds().map(item => item.id);

    if (pollingIds.length === 0) {
      return;
    }

    console.log('Initial effect run...');
    pollingIds.forEach(id => {
      startPolling(id);
    });

    // MUST: cleanup
    // return () => {
    //     console.log("cleanup...")
    //     cleanupPolling();
    // }
  }, [startPolling, stopPolling]);

  // function renderProgressData() {
  //     return progressData.map(data => {
  //         return <p key={data.id}>{data.id}: {data.progress}</p>
  //     });
  // }

  function handleAddPollingId() {
    addPollingId(newPollingId);

    console.log(`TOAST new polling id: ${newPollingId}`);

    startPolling(newPollingId);
  }

  useEffect(() => {
    progressData.forEach(data => {
      if (data.progress === 1) {
        stopPolling(data.id);

        // update local storage
        updatePollingId(data.id, true);

        //toast
        console.log(`TOAST DONE polling id: ${data.id}`);
      }
    });
  }, [progressData, stopPolling]);

  return (
    <div>
      <h1>Polling</h1>
      <p>Active Interval IDs: {JSON.stringify(activePollingIds)}</p>
      <Button onClick={() => setCount(count + 1)}>{count}</Button>
      <Input type="text" value={newPollingId} onChange={e => setNewPollingId(e.target.value)} />
      <Button onClick={() => handleAddPollingId()}>Add to poll2</Button>
      <Button onClick={() => stopPolling(newPollingId)}>Stop polling</Button>
      <Link to="/">Navigate</Link>
    </div>
  );
}
