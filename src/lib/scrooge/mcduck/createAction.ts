import { Action } from 'redux';

export interface McAction<T> {
  type: string;
  payload?: T;
}

export type McActionCreator<T> = (payload?: T) => McAction<T>;

export default <T>(type: string): McActionCreator<T> => (payload?: T) => ({
  type,
  payload
});
