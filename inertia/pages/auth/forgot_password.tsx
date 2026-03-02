import { Form } from '@adonisjs/inertia/react'
import { Field } from '@ark-ui/react/field'
import { usePage } from '@inertiajs/react'

export default function ForgotPassword() {
  const { flash } = usePage<{ flash: { error?: string } }>().props

  return (
    <div className="form-container">
      <div>
        <h1>Forgot password</h1>
        <p>Enter your email address and we'll send you a 5-digit reset code.</p>
      </div>

      {flash?.error && <div>{flash.error}</div>}

      <div>
        <Form route="passwordReset.store">
          {({ errors }) => (
            <>
              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>
                <Field.Input type="email" name="email" autoComplete="email" />
                <Field.ErrorText>{errors.email}</Field.ErrorText>
              </Field.Root>

              <div>
                <button type="submit" className="button">
                  Send reset code
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
