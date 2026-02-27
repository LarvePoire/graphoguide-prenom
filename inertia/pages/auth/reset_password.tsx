import { Form } from '@adonisjs/inertia/react'

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

              <div>
                <label htmlFor="password">New password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  data-invalid={errors.password ? 'true' : undefined}
                />
                {errors.password && <div>{errors.password}</div>}
              </div>

              <div>
                <label htmlFor="passwordConfirmation">Confirm password</label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  data-invalid={errors.passwordConfirmation ? 'true' : undefined}
                />
                {errors.passwordConfirmation && <div>{errors.passwordConfirmation}</div>}
              </div>

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
