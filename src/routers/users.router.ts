import * as Router from 'koa-router';
import { CreateUserValidator } from '../validators/create-user.validator';
import { IUser, User } from '../models/user.model';
import { Snowflakes } from '../utils/snowflakes';
import * as bcrypt from 'bcrypt';
import {
  FindUserByIdValidator,
  QueryUsersValidator,
} from '../validators/query-users.validator';
import {
  UpdateUserQueryValidator,
  UpdateUserValidator,
} from '../validators/update-user.validator';
// import { Logger } from 'utils/logger';

const UsersRouter = new Router({
  prefix: '/users',
});

UsersRouter.get('get_me', '/@me', ctx => {
  ctx.redirect(UsersRouter.url('get_user', { user: ctx['user'].id }));
});

UsersRouter.get('get_user', '/:id', async ctx => {
  const userId = ctx.params.id;

  const user: IUser = await User.findById(userId).exec();

  ctx.body = {
    id: user._id,
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar,
  };
});

UsersRouter.post('create_user', '/', async ctx => {
  const userObject = await CreateUserValidator.validateAsync(
    ctx['request']['body'],
  );

  if (userObject?.discriminator === -1)
    userObject.discriminator = Math.round(Math.random() * 9999 + 1);

  if (userObject?.authentication?.basic?.password) {
    userObject.authentication.basic.hashedPassword = bcrypt.hashSync(
      userObject.authentication.basic.password,
      10,
    );
    delete userObject.authentication.basic.password;
  }

  const user = await new User({
    _id: Snowflakes.next(),
    ...userObject,
  });

  await user.save();

  ctx.body = user.json();
});

UsersRouter.get('get_user', '/:id', async ctx => {
  const query = await FindUserByIdValidator.validateAsync(ctx.request.query);
  const user: IUser = await User.findById(query.id);

  if (!user) {
    ctx.throw(404);
  }

  ctx.body = user.json();
});

UsersRouter.get('query_users', '/', async ctx => {
  const userQuery = await QueryUsersValidator.validateAsync(ctx.request.query);

  const query = {
    _id: {
      $lte: Snowflakes.encode(userQuery.before),
      $gte: Snowflakes.encode(userQuery.after),
    },
  };

  if (userQuery.usernames) query['username'] = { $in: userQuery.usernames };
  if (userQuery.discriminator)
    query['discriminator'] = { $in: userQuery.discriminators };

  const users: IUser[] = await User.find(query)
    .sort('_id')
    .skip(userQuery.skip)
    .limit(userQuery.limit)
    .exec();

  ctx.body = users.map(user => user.json());
});

UsersRouter.patch('update_user', '/:id', async ctx => {
  const [userQuery, patch] = await Promise.all([
    UpdateUserQueryValidator.validateAsync(ctx.params),
    UpdateUserValidator.validateAsync(ctx['request']['body']),
  ]);

  const update = await User.updateOne(
    {
      _id: userQuery.id,
    },
    patch,
  ).exec();

  if (!update) {
    return ctx.throw(404);
  }

  if (update.n == 1 && update.nModified == 0) {
    return (ctx.response.status = 302);
  }

  ctx.response.status = 202;
});

export { UsersRouter };
