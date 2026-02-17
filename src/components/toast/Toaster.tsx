import {Stack} from '@mui/material';
import {useToast} from './useToast';

export function Toaster() {
  const {toasts} = useToast();

  return (
    <Stack direction="column" spacing={2}>
      {toasts?.map(toast => (
        <div className="bg-blue-300 p-4 rounded-lg shadow-lg">
          <h2>{toast.title}</h2>
          <p>{toast.description}</p>
        </div>
      ))}
    </Stack>
  );
}
