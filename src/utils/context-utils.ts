import { Context } from 'koa';

export const GetUser = (ctx: Context): {
    id: string;
} => ctx['user']