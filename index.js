import { createModule } from 'saga-slice';
import { crudSaga } from './lib/sagaHelpers';
import { crudReducers, crudInitialState } from './lib/reducerHelpers';


export const crudSlice = (opts) => {

    const {
        name,
        initialState,
        singular,
        plural,
        reducers,
        sagas
    } = opts;

    return createModule({
        name,
        initialState: crudInitialState(initialState || {}),
        reducers: crudReducers(reducers || {}),
        sagas: crudSaga(singular, plural, sagas)
    });
}

export * from './lib/api/index';
export * from './lib/reducerHelpers';
export * from './lib/sagaHelpers';
