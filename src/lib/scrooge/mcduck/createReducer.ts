import { Reducer } from 'redux';

import { McAction } from './createAction';
import { Duck } from './createDuck';

export interface ReducerMap<S> {
  [type: string]: Reducer<S>;
}

export interface ReducerOptions<S> {
  initialState?: S;
  ducks?: { [stateKey: string]: Duck<any, S> };
}

export default <S>(reducers: ReducerMap<S>, options: ReducerOptions<S>): Reducer<S> => (
  state: S,
  action: McAction<any>
): S => {
  const initialState = options.initialState === undefined ? {} : options.initialState;
  let finalReducers = { ...reducers };

  Object.entries(options.ducks || {}).forEach(([name, duck]) => {
    initialState[name] = duck.initialState;
    const duckReducers = duck.reducerMap(name);
    // Combined reducers when duck has same key as reducers
    const aggregatedReducers: ReducerMap<S> = {};

    // duck can have a reducer with same key
    if (!aggregatedReducers[action.type] && duckReducers[action.type] && reducers[action.type]) {
      aggregatedReducers[action.type] = (s, a) => {
        const duckState = duckReducers[action.type](s, a);
        const actionMapState = reducers[a.type](duckState, a);

        return Object.assign({}, duckState, actionMapState);
      };
    }

    finalReducers = { ...finalReducers, ...duckReducers, ...aggregatedReducers };
  });

  const reducer = finalReducers[action.type] || ((s = initialState as S) => s);

  return reducer(state, action);
};
