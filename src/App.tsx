import './App.css';
import {Button} from './components/button/Button';
import * as Sentry from '@sentry/react';

function App() {
  async function processPayment(success: boolean) {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve('done');
        } else {
          reject(new Error('Payment failed. Please contact admin'));
        }
      }, 2000);
    });
  }

  async function handleOnClick(success: boolean) {
    console.log('handleOnClick: ', success);
    Sentry.setTag('checkout_version', 'v3');

    Sentry.addBreadcrumb({
      message: 'User Huy clicked checkout button',
      category: 'checkout',
      level: 'info',
    });

    try {
      await Sentry.startSpan(
        {
          name: 'Checkout',
          op: 'function',
        },
        async () => {
          return processPayment(success);
        }
      );

      Sentry.captureMessage('User purchased an item successfully', 'info');

      window.alert('Checkout successful!');
    } catch (error) {
      Sentry.captureException(error);

      window.alert('Checkout error!');
    }
  }

  return (
    <div>
      <Button onClick={() => handleOnClick(true)}>Checkout success</Button>
      <Button onClick={() => handleOnClick(false)}>Checkout failed</Button>
    </div>
  );
}

export default App;
