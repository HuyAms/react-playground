import {createMachine, setup} from 'xstate';

export const lightBulbMachine = createMachine({
  id: 'lightBulb',
  initial: 'unlit',
  states: {
    lit: {
      on: {
        TOGGLE: 'unlit',
        BREAK: {
          target: 'broken',
        },
      },
    },
    unlit: {
      on: {
        TOGGLE: 'lit',
        BREAK: 'broken',
      },
    },
    broken: {
      type: 'final',
    },
  },
});
