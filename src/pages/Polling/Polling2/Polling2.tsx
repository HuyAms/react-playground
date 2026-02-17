import {Button, Input} from '@mui/material';
import {useEffect, useState} from 'react';
import {addPollingId, getPollingIds, updatePollingId} from './localUtils';
import {Link} from 'react-router-dom';
import {usePolling} from './usePolling';

export default function Polling2Page() {
  const [count, setCount] = useState(0);
  const [pollingIds, setPollingIds] = useState<string[]>(() =>
    getPollingIds().map(item => item.id)
  );
  const [newPollingId, setNewPollingId] = useState<string>('');

  const {startPolling, stopPolling, progressData, activePollingIds} = usePolling();

  useEffect(() => {
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
  }, [startPolling, pollingIds, stopPolling]);

  function renderProgressData() {
    return progressData.map(data => {
      return (
        <p key={data.id}>
          {data.id}: {data.progress}
        </p>
      );
    });
  }

  function refreshPollingIds() {
    const ids = getPollingIds();
    setPollingIds(ids.map(id => id.id));
  }

  function handleAddPollingId() {
    addPollingId(newPollingId);

    console.log(`TOAST new polling id: ${newPollingId}`);

    if (!pollingIds.includes(newPollingId)) {
      refreshPollingIds();
      startPolling(newPollingId);
    }
  }

  useEffect(() => {
    progressData.forEach(data => {
      if (data.progress === 1) {
        // update local storage
        updatePollingId(data.id, true);

        //toast
        console.log(`TOAST DONE polling id: ${data.id}`);
        stopPolling(data.id);

        // clean up
        stopPolling(data.id);
        refreshPollingIds();
      }
    });
  }, [progressData, stopPolling]);

  return (
    <div>
      <h1>Polling</h1>
      <p>Polling IDs: {JSON.stringify(pollingIds)}</p>
      <p>Active Interval IDs: {JSON.stringify(activePollingIds)}</p>
      <Button onClick={() => setCount(count + 1)}>{count}</Button>
      <Input type="text" value={newPollingId} onChange={e => setNewPollingId(e.target.value)} />
      <Button onClick={() => handleAddPollingId()}>Add to poll2</Button>
      <Button onClick={() => stopPolling(newPollingId)}>Stop polling</Button>
      <Link to="/polling">Navigate</Link>
      {renderProgressData()}
    </div>
  );
}
