import * as Joi from 'joi';
import {
  AvatarValidator,
  DiscriminatorValidator,
  FlagsValidator,
  IDValidator,
  UsernameValidator,
} from './user.validator';

export const UpdateUserValidator = Joi.object({
  username: UsernameValidator.optional(),
  discriminator: DiscriminatorValidator.optional(),

  authentication: Joi.object({
    basic: Joi.object({
      email: Joi.string()
        .email()
        .optional(),
      password: Joi.string().optional(),
    }).optional(),
  }).optional(),

  avatar: AvatarValidator.optional(),
  flags: FlagsValidator.optional(),
}).optional();

export const UpdateUserQueryValidator = Joi.object({
  id: IDValidator.required(),
});
