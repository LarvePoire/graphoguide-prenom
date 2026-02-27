import { Form } from '@adonisjs/inertia/react'
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
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  data-invalid={errors.email ? 'true' : undefined}
                />
                {errors.email && <div>{errors.email}</div>}
              </div>

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
