import * as Joi from 'joi';
import {
  DiscriminatorValidator,
  UsernameValidator,
  FlagsValidator,
  AvatarValidator,
  IDValidator,
} from './user.validator';

export const CreateUserValidator = Joi.object({
  username: UsernameValidator.required(),
  discriminator: DiscriminatorValidator.required(),

  authentication: Joi.object({
    basic: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
    }).optional(),
  }).optional(),

  avatar: AvatarValidator.optional(),

  flags: FlagsValidator.optional(),

  application_id: IDValidator.optional(),
});
