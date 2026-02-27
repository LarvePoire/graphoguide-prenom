import User from '#models/user'
import PasswordResetToken from '#models/password_reset_token'
import {
  forgotPasswordValidator,
  verifyCodeValidator,
  resetPasswordValidator,
} from '#validators/password_reset_validator'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'

export default class PasswordResetController {
  /**
   * Show the forgot password form (email input)
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/forgot_password', {})
  }

  /**
   * Send the password reset code by email
   */
  async store({ request, response, session }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)

    const user = await User.findBy('email', email)

    if (user) {
      const code = String(Math.floor(10000 + Math.random() * 90000))
      const hashedCode = await hash.make(code)

      await PasswordResetToken.query().where('email', user.email).delete()
      await PasswordResetToken.create({
        email,
        token: hashedCode,
        expiresAt: DateTime.now().plus({ minutes: 15 }),
      })

      console.log(`Password reset code for ${env.get('MAIL_FROM_ADDRESS')}: ${code}`)

      await mail.send((message) => {
        message
          .to(user.email)
          .from(env.get('MAIL_FROM_ADDRESS'))
          .subject('Your password reset code')
          .htmlView('emails/password_reset_code', { code })
      })
    }

    // Always store email and redirect — never reveal whether the account exists
    session.put('password_reset_email', email)
    return response.redirect().toRoute('passwordReset.verify')
  }

  /**
   * Show the code verification form
   */
  async verify({ inertia, session, response }: HttpContext) {
    const email = session.get('password_reset_email')
    if (!email) return response.redirect().toRoute('passwordReset.create')

    return inertia.render('auth/verify_code', { email })
  }

  /**
   * Verify the 5-digit code
   */
  async check({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(verifyCodeValidator)

    const token = await PasswordResetToken.query()
      .where('email', payload.email)
      .where('expires_at', '>', DateTime.now().toSQL()!)
      .first()

    if (!token || !(await hash.verify(token.token, payload.code))) {
      session.flash('errorsBag', { INVALID_CODE: 'Invalid or expired code. Please try again.' })
      return response.redirect().back()
    }

    session.forget('password_reset_email')
    session.put('password_reset_verified_email', payload.email)
    return response.redirect().toRoute('passwordReset.resetForm')
  }

  /**
   * Show the new password form
   */
  async resetForm({ inertia, session, response }: HttpContext) {
    const email = session.get('password_reset_verified_email')
    if (!email) return response.redirect().toRoute('passwordReset.create')

    return inertia.render('auth/reset_password', { email })
  }

  /**
   * Save the new password
   */
  async reset({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(resetPasswordValidator)

    const verifiedEmail = session.get('password_reset_verified_email')
    if (!verifiedEmail || verifiedEmail !== payload.email) {
      return response.redirect().toRoute('passwordReset.create')
    }

    const user = await User.findByOrFail('email', verifiedEmail)
    user.password = payload.password
    await user.save()

    await PasswordResetToken.query().where('email', verifiedEmail).delete()
    session.forget('password_reset_verified_email')

    return response.redirect().toRoute('session.create')
  }
}
