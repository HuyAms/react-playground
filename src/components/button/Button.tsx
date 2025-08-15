import {ComponentProps} from 'react';
import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import {cn} from '../../lib/utils';

const buttonVariants = cva(['font-semibold', 'border', 'rounded'], {
  variants: {
    intent: {
      primary: ['bg-blue-500', 'text-white', 'border-transparent'],
      secondary: ['bg-white', 'text-gray-800', 'border-gray-400'],
    },
    size: {
      small: ['text-sm', 'py-1', 'px-2'],
      medium: ['text-base', 'py-2', 'px-4'],
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'medium',
  },
});

export type ButtonProps = VariantProps<typeof buttonVariants>;

export function Button({
  intent = 'primary',
  size = 'medium',
  ...props
}: ComponentProps<'button'> & ButtonProps) {
  return <button className={cn(buttonVariants({intent, size}))} {...props} />;
}

// Usage
{
  /* <Button onClick={handleOnClick}>Hello world</Button>
<Button intent="secondary" onClick={handleOnClick}>
  Hello world
</Button> */
}
