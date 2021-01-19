import * as Joi from 'joi';

import {
  AvatarValidator,
  DiscriminatorValidator,
  IDValidator,
  UsernameValidator,
} from './user.validator';

export const FindUserByIdValidator = Joi.object({
  id: Joi.number().required(),
}).required();

export const QueryUsersValidator = Joi.object({
  before: IDValidator.optional()
    .default(() => Date.now())
    .optional(),
  after: IDValidator.default(0).optional(),

  limit: Joi.number()
    .max(250)
    .min(1)
    .default(50)
    .optional(),
  skip: Joi.number()
    .min(0)
    .default(0)
    .optional(),

  usernames: Joi.array()
    .items(UsernameValidator.required())
    .optional(),
  discriminators: Joi.array()
    .items(DiscriminatorValidator.required())
    .optional(),

  avatar: AvatarValidator.optional(),
}).required();
