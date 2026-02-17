import {useActionState} from 'react';

type ActionErrors = {
  formErrors: Array<string>;
  fieldErrors: {
    email: Array<string>;
    password: Array<string>;
    confirmPassword: Array<string>;
  };
};

type FormState =
  | {
      status: 'success';
    }
  | {
      status: 'error';
      formErrors: Array<string>;
      fieldErrors: {
        email: Array<string>;
        password: Array<string>;
        confirmPassword: Array<string>;
      };
    };

const initialFormState: FormState = {
  status: 'error',
  formErrors: [],
  fieldErrors: {email: [], password: [], confirmPassword: []},
};

// TODO: submit form and handle errors

export default function RegisterPage() {
  const [state, formAction] = useActionState<FormState, FormData>(async (_, formData) => {
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    const errors: ActionErrors = {
      formErrors: [],
      fieldErrors: {email: [], password: [], confirmPassword: []},
    };

    // validation
    if (!email) {
      errors.fieldErrors.email.push('Email is required');
    }

    if (!password) {
      errors.fieldErrors.password.push('Password is required');
    }

    if (!confirmPassword) {
      errors.fieldErrors.confirmPassword.push('Confirm password is required');
    }

    if (password !== confirmPassword) {
      errors.formErrors.push('Passwords do not match');
    }

    const hasErrors =
      errors.formErrors.length ||
      Object.values(errors.fieldErrors).some(fieldErrors => fieldErrors.length);

    if (hasErrors) {
      return {
        status: 'error',
        ...errors,
      };
    }

    return {
      status: 'success',
    };
  }, initialFormState);

  // TODO: render errors based on the state
  console.log('Form state:', state);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input
          name="email"
          className="border border-gray-300 rounded-md p-2"
          type="email"
          id="email"
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          className="border border-gray-300 rounded-md p-2"
          type="password"
          id="password"
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          name="confirmPassword"
          className="border border-gray-300 rounded-md p-2"
          type="password"
          id="confirmPassword"
        />
        <button className="bg-blue-500 text-white p-2 rounded-md" type="submit">
          Register
        </button>
      </div>
    </form>
  );
}
