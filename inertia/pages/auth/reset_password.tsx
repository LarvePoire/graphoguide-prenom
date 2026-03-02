import { Form } from '@adonisjs/inertia/react'
import { Field } from '@ark-ui/react/field'
import { PasswordInput } from '@ark-ui/react/password-input'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function ResetPassword({ email }: { email: string }) {
  return (
    <div className="form-container">
      <div>
        <h1>Reset your password</h1>
        <p>Choose a new password for your account.</p>
      </div>

      <div>
        <Form route="passwordReset.reset">
          {({ errors }) => (
            <>
              <input type="hidden" name="email" value={email} />

              <Field.Root invalid={!!errors.password}>
                <PasswordInput.Root>
                  <PasswordInput.Label>New password</PasswordInput.Label>
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
                  Reset password
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
