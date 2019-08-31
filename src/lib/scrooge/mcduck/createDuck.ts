import { Reducer } from 'redux';
import createActionAsync from './createActionAsync';
import { McAsyncAction } from './createActionAsync';
import { ReducerMap } from './createReducer';

export interface DuckOptions {}

export interface DuckStateNode<T> {
  isBusy: boolean;
  error: string;
  data: T | any[];
}

export interface Duck<T, S = {}> {
  reducerMap: (type: string) => ReducerMap<S>;
  actions: McAsyncAction;
  initialState: DuckStateNode<T>;
}

export default <T, S>(name: string, initialData?: T, options?: DuckOptions): Duck<T, S> => {
  const data = initialData;
  options = options || {};
  const initialState: DuckStateNode<T> = {
    isBusy: false,
    data,
    error: ''
  };
  const actions = createActionAsync(name.toUpperCase());

  const reducerMap = (stateKey: string): ReducerMap<S> => ({
    [actions.start().type]: (state, { payload }) =>
      Object.assign({}, state, {
        [stateKey]: {
          isBusy: true,
          error: '',
          data: payload
        }
      }),
    [actions.fail().type]: (state, { payload }) =>
      Object.assign({}, state, {
        [stateKey]: {
          isBusy: false,
          error: payload,
          data: state[stateKey].data
        }
      }),
    [actions.success().type]: (state, { payload }) =>
      Object.assign({}, state, {
        [stateKey]: {
          error: '',
          isBusy: false,
          data: initialData
        }
      })
  });

  return {
    actions,
    initialState,
    reducerMap
  };
};
