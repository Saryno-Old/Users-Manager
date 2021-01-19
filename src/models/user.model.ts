import { Document, Model, model, Schema } from 'mongoose';
import { SnowflakeID, SnowflakeSchemaID } from './id';

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export enum UserFlags {
  SYSTEM = 1,
  BOT = 10,
}

const UserSchema = new Schema(
  {
    _id: { type: SnowflakeSchemaID },

    username: { type: String, required: true, maxlength: 30 },
    discriminator: { type: Number, required: true, max: 9999, min: 0 },

    authentication: {
      _id: false,
      required: false,
      select: false,
      basic: {
        _id: false,
        required: false,
        email: { type: String, match: emailRegex },
        hashedPassword: { type: String },
      },
    },

    flags: [{ type: Number, required: false }],

    avatar: { type: String, required: false },

    application_id: { type: SnowflakeSchemaID, required: false },
  },
  { versionKey: false },
);

export interface IUser extends Document {
  _id: SnowflakeID;

  username: string;
  discriminator: string;

  authentication?: {
    basic?: {
      email: string;
      hashedPassword: string;
    };
  };

  flags: number[];

  avatar?: string;

  application: SnowflakeID;

  json(): JSON;
}

export interface IUserStatics extends Model<IUser> {
  findByUsername(username: string, discriminator: number): Promise<IUser>;
  findAllByUsername(username: string): Promise<IUser[]>;
}

UserSchema.methods.json = function() {
  const user = this as IUser;

  return {
    id: user._id,
    username: user.username,
    discriminator: user.discriminator,
    flags: user.flags,
    avatar: user.avatar,
  };
};

UserSchema.index(
  {
    username: 1,
    discriminator: 1,
  },
  { unique: true },
);

UserSchema.index({
  username: 1,
});

export const User = model<IUser, IUserStatics>('User', UserSchema, 'Users');

UserSchema.statics.findByUsername = (
  username: string,
  discriminator: number,
) => {
  return User.findOne({ username, discriminator: discriminator as any }).exec();
};

UserSchema.statics.findAllByUsername = (username: string) => {
  return User.find({ username }).exec();
};
