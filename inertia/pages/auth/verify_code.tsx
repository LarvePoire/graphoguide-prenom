import { Form } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'

export default function VerifyCode({ email }: { email: string }) {
  const { flash } = usePage<{ flash: { error?: string } }>().props

  return (
    <div className="form-container">
      <div>
        <h1>Enter your code</h1>
        <p>
          We sent a 5-digit code to <strong>{email}</strong>. It expires in 15 minutes.
        </p>
      </div>

      {flash?.error && <div>{flash.error}</div>}

      <div>
        <Form route="passwordReset.check">
          {({ errors }) => (
            <>
              <input type="hidden" name="email" value={email} />

              <div>
                <label htmlFor="code">Code</label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  inputMode="numeric"
                  maxLength={5}
                  autoComplete="one-time-code"
                  data-invalid={errors.code ? 'true' : undefined}
                />
                {errors.code && <div>{errors.code}</div>}
              </div>

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
