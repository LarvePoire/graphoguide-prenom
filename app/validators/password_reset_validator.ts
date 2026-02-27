import vine from '@vinejs/vine'

export const forgotPasswordValidator = vine.create({
  email: vine.string().email(),
})

export const verifyCodeValidator = vine.create({
  email: vine.string().email(),
  code: vine.string().regex(/^\d{5}$/),
})

export const resetPasswordValidator = vine.create({
  email: vine.string().email(),
  password: vine.string().minLength(8).maxLength(32).confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})
