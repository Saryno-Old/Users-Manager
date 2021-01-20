import * as Joi from 'joi';
import { UserFlagsObject } from './utils';

export const IDValidator = Joi.string().custom((value, helpers) =>
  isNaN(Number(value)) ? helpers.error('Not Numeric') : value,
);

export const UsernameValidator = Joi.string()
  .min(1)
  .max(30);

export const DiscriminatorValidator = Joi.number()
  .min(0)
  .max(9999);

export const AvatarValidator = Joi.string().token();

export const FlagsValidator = Joi.array().items(
  Joi.number()
    .valid(
      ...UserFlagsObject.map(({ value }) => value),
    )
    .required(),
);
