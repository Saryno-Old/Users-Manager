import { UserFlags } from '../models/user.model';

export const UserFlagsObject = Object.keys(UserFlags)
  .filter(key => isNaN(Number(key)) === false)
  .map(key => ({ value: Number(key), type: UserFlags[key] }));
