import { IUser } from '@src/model-types';

export default (user: IUser) => (...role: string[]): boolean =>
  Boolean(user && user.roles && user.roles.find((r) => role.includes(r.name)));
