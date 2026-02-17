import {Button} from '@mui/material';
import {Toaster} from '../components/toast/Toaster';
import {useToast} from '../components/toast/useToast';

export function ToastPage() {
  const {toast} = useToast();

  function handleToast() {
    toast({title: 'Hello', description: 'World'});
  }

  return (
    <div>
      <div className="mb-3">
        <h1>Toast</h1>
        <Button onClick={handleToast}>Toast</Button>
      </div>
      <Toaster />
    </div>
  );
}
