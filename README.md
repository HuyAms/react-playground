# Intersection Observer

Intersection Observer detects when an element enters or exits the viewport or intersects with another element.

Check this component

- src/components/InteractionComponent.tsx
- src/hooks/useIntersectionObserver.ts

# Toast

What I learned from this small UI:

- Shared state via hook: Used a singleton-like pattern by storing state in a shared in-memory constant. Synced it with local React state using listeners.
- Toast auto-dismiss: Implemented a toast queue where each toast is scheduled for removal using a timeout.

We can use this in any component without a Provider—the toast state remains shared across components.

```tsx
const {toast} = useToast();

const {update, dismiss} = toast({
  title: 'Failed to create note',
  description: 'Please try again later.',
});
```

# Form

- Experiment with React 19’s useActionState
- Implement form validation
