import React, {useState} from 'react';

type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

type Action =
  | {
      type: 'ADD_TOAST';
      toast: ToasterToast;
    }
  | {
      type: 'UPDATE_TOAST';
      toast: ToasterToast;
    }
  | {
      type: 'DISMISS_TOAST';
      toastId?: string;
    }
  | {
      type: 'REMOVE_TOAST';
      id: string;
    };

interface State {
  toasts: Array<ToasterToast>;
}

// global state store that persists across component renders
// any changes in the global state will be synced into local state
let memoryState: State = {toasts: []};

const listeners: Array<(state: State) => void> = [];

const TOAST_REMOVE_DELAY = 5000;

const timeoutsMap = new Map<string, ReturnType<typeof setTimeout>>();
function addToRemoveQueue(toastId: string) {
  if (timeoutsMap.has(toastId)) {
    return;
  }

  const timeoutId = setTimeout(() => {
    timeoutsMap.delete(toastId);

    dispatch({
      type: 'REMOVE_TOAST',
      id: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  timeoutsMap.set(toastId, timeoutId);
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'ADD_TOAST':
      return {...state, toasts: [...state.toasts, action.toast]};
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(t => (t.id === action.toast.id ? {...t, ...action.toast} : t)),
      };
    case 'DISMISS_TOAST': {
      // auto dismiss
      const {toastId} = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach(toast => {
          addToRemoveQueue(toast.id);
        });
      }

      return {...state};
    }

    case 'REMOVE_TOAST':
      return {...state, toasts: state.toasts.filter(t => t.id !== action.id)};
  }
}

// whenever an action is performed, it will update the global state
// and notify all listeners about the change
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach(localSetState => localSetState(memoryState));
}

type Toast = Omit<ToasterToast, 'id'>;

function toast(toast: Toast) {
  const id = crypto.randomUUID();
  const newToast = {
    id,
    ...toast,
  };

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: {...props, id},
    });
  const dismiss = () => dispatch({type: 'DISMISS_TOAST', toastId: id});

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...toast,
      id,
    },
  });

  // automatically dismiss
  dismiss();

  return {
    id: newToast.id,
    dismiss,
    update,
  };
}

export function useToast() {
  const [state, setState] = useState<State>(memoryState);

  // subscribe to changes in the global state
  React.useEffect(() => {
    listeners.push(setState);

    // unsubscribe from changes in the global state
    return () => {
      const index = listeners.indexOf(setState);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({type: 'DISMISS_TOAST', toastId}),
  };
}
