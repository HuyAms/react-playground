import {Box} from '@mui/material';
import {InteractionComponent} from '../components/InteractionComponent';

export function InteractionObserver() {
  return (
    <Box sx={{height: '2000px', position: 'relative', backgroundColor: 'red'}}>
      <h1>Intersection and Mutation observers</h1>
      <InteractionComponent>
        <Box
          sx={{
            height: '100px',
            width: '100px',
            position: 'absolute',
            top: '1000px',
            backgroundColor: 'yellow',
          }}
        >
          Yellow box
        </Box>
      </InteractionComponent>
    </Box>
  );
}
