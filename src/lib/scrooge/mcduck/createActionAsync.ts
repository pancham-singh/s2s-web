import createAction from './createAction';
import { McAction } from './createAction';

export interface McAsyncAction {
  start: <T>(payload?: T) => McAction<T>;
  success: <T>(payload?: T) => McAction<T>;
  fail: <T>(payload?: T) => McAction<T>;
}

export default (type: string): McAsyncAction => ({
  start: createAction(`START_${type}`),
  success: createAction(`SUCCESS_${type}`),
  fail: createAction(`FAIL_${type}`)
});
