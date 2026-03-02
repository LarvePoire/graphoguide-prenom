import { Form } from '@adonisjs/inertia/react'
import { Field } from '@ark-ui/react/field'
import { PinInput } from '@ark-ui/react/pin-input'

export default function VerifyCode({ email }: { email: string }) {
  return (
    <div className="form-container">
      <div>
        <h1>Enter your code</h1>
        <p>
          We sent a 5-digit code to <strong>{email}</strong>. It expires in 15 minutes.
        </p>
      </div>

      <div>
        <Form route="passwordReset.check">
          {({ errors }) => (
            <>
              <input type="hidden" name="email" value={email} />

              <Field.Root invalid={!!errors.code}>
                <PinInput.Root name="code" count={5} otp type="numeric" invalid={!!errors.code}>
                  <PinInput.Label>Code</PinInput.Label>
                  <PinInput.Control>
                    {[0, 1, 2, 3, 4].map((_, index) => (
                      <PinInput.Input key={index} index={index} />
                    ))}
                  </PinInput.Control>
                  <PinInput.HiddenInput />
                </PinInput.Root>
                <Field.ErrorText>{errors.code}</Field.ErrorText>
              </Field.Root>

              <div>
                <button type="submit" className="button">
                  Verify code
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
