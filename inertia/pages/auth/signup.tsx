import { Form } from '@adonisjs/inertia/react'
import { Field } from '@ark-ui/react/field'
import { PasswordInput } from '@ark-ui/react/password-input'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function Signup() {
  return (
    <div className="form-container">
      <div>
        <h1> Signup </h1>
        <p>Enter your details below to create your account</p>
      </div>

      <div>
        <Form route="new_account.store">
          {({ errors }) => (
            <>
              <Field.Root invalid={!!errors.fullName}>
                <Field.Label>Full name</Field.Label>
                <Field.Input type="text" name="fullName" />
                <Field.ErrorText>{errors.fullName}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>
                <Field.Input type="email" name="email" autoComplete="email" />
                <Field.ErrorText>{errors.email}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.password}>
                <PasswordInput.Root>
                  <PasswordInput.Label>Password</PasswordInput.Label>
                  <PasswordInput.Control>
                    <PasswordInput.Input name="password" autoComplete="new-password" />
                    <PasswordInput.VisibilityTrigger>
                      <PasswordInput.Indicator fallback={<EyeOffIcon />}>
                        <EyeIcon />
                      </PasswordInput.Indicator>
                    </PasswordInput.VisibilityTrigger>
                  </PasswordInput.Control>
                </PasswordInput.Root>
                <Field.ErrorText>{errors.password}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.passwordConfirmation}>
                <PasswordInput.Root>
                  <PasswordInput.Label>Confirm password</PasswordInput.Label>
                  <PasswordInput.Control>
                    <PasswordInput.Input
                      name="passwordConfirmation"
                      autoComplete="new-password"
                    />
                    <PasswordInput.VisibilityTrigger>
                      <PasswordInput.Indicator fallback={<EyeOffIcon />}>
                        <EyeIcon />
                      </PasswordInput.Indicator>
                    </PasswordInput.VisibilityTrigger>
                  </PasswordInput.Control>
                </PasswordInput.Root>
                <Field.ErrorText>{errors.passwordConfirmation}</Field.ErrorText>
              </Field.Root>

              <div>
                <button type="submit" className="button">
                  Sign up
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
