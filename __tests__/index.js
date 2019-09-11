import { createModule } from 'saga-slice';
import * as SagaSliceHelpers from '..';

const { crudSlice } = SagaSliceHelpers;

const SagaSlice = createModule({ name: 'test', reducers: {}, initialState: {} }).constructor;

describe('saga slice helpers', () => {

    test('it should export all helpers', () => {

        expect(Object.keys(SagaSliceHelpers)).toEqual(
            expect.arrayContaining([
                'crudSlice',
                'refetch',
                'crudSaga',
                'readAllSuccess',
                'readOneSuccess',
                'createSuccess',
                'updateSuccess',
                'deleteSuccess',
                'failReducer',
                'loadingReducer',
                'notLoadingReducer',
                'setCurrent',
                'resetCurrent',
                'noop',
                'crudInitialState',
                'crudReducers',
                'lifecycleReducers',
                'createApis'
            ])
        );
    });

    test('should not allow bad options in saga slice', () => {

        // validate string options strings
        const badRequiredStringValues = [
            undefined, null,
            false, true,
            0, 1, NaN,
            "",
            [], () => {}, {}
        ];

        badRequiredStringValues.forEach(name => {

            expect(() => crudSlice({ name })).toThrow('must provide a valid name');
        });

        badRequiredStringValues.forEach(singular => {

            expect(() => crudSlice({ name: 'yes', singular })).toThrow('must provide a valid singular CRUD route');
        });

        badRequiredStringValues.forEach(plural => {

            expect(() => crudSlice({ name: 'yes', singular: 'yes', plural })).toThrow('must provide a valid plural CRUD route');
        });

        // remove object
        badRequiredStringValues.pop();
        const badRequiredObjectValues = badRequiredStringValues;

        badRequiredObjectValues.forEach(sagaApi => {

            expect(() => crudSlice({
                name: 'yes',
                singular: 'yes',
                plural: 'yesses',
                sagaApi
            })).toThrow('must provide a valid sagaApi');
        });

        const badOptionalObjectValues = badRequiredObjectValues.filter(v => !!v);

        badOptionalObjectValues.forEach(reducers => {

            expect(() => crudSlice({
                name: 'yes',
                singular: 'yes',
                plural: 'yesses',
                sagaApi: {},
                reducers
            })).toThrow('reducers must be an object');
        });

        badOptionalObjectValues.forEach(initialState => {

            expect(() => crudSlice({
                name: 'yes',
                singular: 'yes',
                plural: 'yesses',
                sagaApi: {},
                initialState
            })).toThrow('initialState must be an object');
        });

        const badOptionalFunctionValues = badRequiredStringValues.filter(v => !!v && typeof v !== 'function');
        badOptionalFunctionValues.push({});

        badOptionalFunctionValues.forEach(sagas => {

            expect(() => crudSlice({
                name: 'yes',
                singular: 'yes',
                plural: 'yesses',
                sagaApi: {},
                sagas
            })).toThrow('sagas must be a function');
        });
    });

    test('should create a saga slice with minimum requirements', () => {

        const slice = crudSlice({
            name: 'test',
            singular: 'test',
            plural: 'test',
            sagaApi: {}
        });

        expect(slice instanceof SagaSlice).toBe(true);

        expect(Object.keys(slice.actions)).toEqual(
            expect.arrayContaining([
                'readAllSuccess',
                'readOneSuccess',
                'createSuccess',
                'updateSuccess',
                'deleteSuccess',
                'setCurrent',
                'resetCurrent',
                'readAll',
                'readOne',
                'create',
                'update',
                'delete',
                'readAllFail',
                'readOneFail',
                'createFail',
                'updateFail',
                'deleteFail'
            ])
        );
    });

    test('should create a saga slice with extra reducers', () => {

        const slice = crudSlice({
            name: 'test',
            singular: 'test',
            plural: 'test',
            sagaApi: {},
            reducers: {
                test: () => {},
                test2: () => {}
            }
        });

        expect(Object.keys(slice.actions)).toEqual(
            expect.arrayContaining(['test', 'test2'])
        );
    });

    test('should not throw when passed initialState', () => {

        expect(() => crudSlice({
            name: 'test',
            singular: 'test',
            plural: 'test',
            sagaApi: {},
            initialState: { test: true }
        })).not.toThrow();
    });

    test('should not throw when passed extra sagas', () => {

        expect(() => crudSlice({
            name: 'test',
            singular: 'test',
            plural: 'test',
            sagaApi: {},
            sagas: () => ({ test: () => {} })
        })).not.toThrow();
    });
});
