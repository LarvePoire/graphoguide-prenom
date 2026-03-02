import { Form } from '@adonisjs/inertia/react'
import { Field } from '@ark-ui/react/field'
import { PasswordInput } from '@ark-ui/react/password-input'
import { Link } from '@inertiajs/react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function Login() {
  return (
    <div className="form-container">
      <div>
        <h1> Login </h1>
        <p>Enter your details below to login to your account</p>
      </div>

      <div>
        <Form route="session.store">
          {({ errors }) => (
            <>
              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>
                <Field.Input type="email" name="email" autoComplete="username" />
                <Field.ErrorText>{errors.email}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.password}>
                <PasswordInput.Root>
                  <PasswordInput.Label>Password</PasswordInput.Label>
                  <PasswordInput.Control>
                    <PasswordInput.Input name="password" autoComplete="current-password" />
                    <PasswordInput.VisibilityTrigger>
                      <PasswordInput.Indicator fallback={<EyeOffIcon />}>
                        <EyeIcon />
                      </PasswordInput.Indicator>
                    </PasswordInput.VisibilityTrigger>
                  </PasswordInput.Control>
                </PasswordInput.Root>
                <Field.ErrorText>{errors.password}</Field.ErrorText>
              </Field.Root>

              <div>
                <button type="submit" className="button">
                  Login
                </button>
              </div>

              <div>
                <Link href="/forgot-password">Forgot password?</Link>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
