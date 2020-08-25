import * as Reducers from '../reducers';

describe('reducer helpers', () => {

    test('readAllSuccess: should map payload to state by id', () => {

        const state = {};
        const payload = [
            { id: 1 },
            { id: 2 }
        ];

        expect(state).not.toHaveProperty(['isLoading']);
        expect(state).not.toHaveProperty(['data']);
        Reducers.readAllSuccess(state, payload);

        expect(state).toHaveProperty(['isLoading'], false);
        expect(state).toHaveProperty(['data']);

        expect(state.data['1']).toMatchObject(payload[0]);
    });

    [
        'readOneSuccess',
        'createSuccess',
        'updateSuccess'
    ].forEach(reducerName => {


        test(`${reducerName}: should map payload to state by id`, () => {

            const state = {
                data: {}
            };
            const payload = { id: 50 };

            expect(state).not.toHaveProperty(['isLoading']);
            expect(state).toHaveProperty(['data']);
            Reducers[reducerName](state, payload);

            expect(state).toHaveProperty(['isLoading'], false);
            expect(state).toHaveProperty(['data']);

            expect(state.data['50']).toMatchObject(payload);
        });
    });

    test(`deleteSuccess: should delete item from state data`, () => {

        const state = {
            data: { '50': true }
        };
        const payload = { id: 50 };

        expect(state).not.toHaveProperty(['isLoading']);
        expect(state).toHaveProperty(['data'], { '50': true });
        Reducers.deleteSuccess(state, payload);

        expect(state).toHaveProperty(['isLoading'], false);
        expect(state).toHaveProperty(['data'], {});
    });

    test(`failReducer: should set error in state`, () => {

        const state = {};
        const error = new Error();

        expect(state).not.toHaveProperty(['isLoading']);
        expect(state).not.toHaveProperty(['error']);
        Reducers.failReducer(state, error);

        expect(state).toHaveProperty(['isLoading'], false);
        expect(state).toHaveProperty(['error'], error);
    });

    test(`failReducer: should set error in state`, () => {

        const state = {};
        const error = new Error();

        expect(state).not.toHaveProperty(['isLoading']);
        expect(state).not.toHaveProperty(['error']);
        Reducers.failReducer(state, error);

        expect(state).toHaveProperty(['isLoading'], false);
        expect(state).toHaveProperty(['error'], error);
    });

    test(`loadingReducer: should set loading true`, () => {

        const state = {};

        expect(state).not.toHaveProperty(['isLoading']);
        Reducers.loadingReducer(state);

        expect(state).toHaveProperty(['isLoading'], true);
    });

    test(`notLoadingReducer: should set loading false`, () => {

        const state = {};

        expect(state).not.toHaveProperty(['isLoading']);
        Reducers.notLoadingReducer(state);

        expect(state).toHaveProperty(['isLoading'], false);
    });

    test(`setCurrent: should set passed object to current state`, () => {

        const state = {};

        expect(state).not.toHaveProperty(['current']);
        Reducers.setCurrent(state, { test: true });

        expect(state).toHaveProperty(['current'], { test: true });
    });

    test(`setCurrent: should set item from data to current state when passed string or number`, () => {

        const state = {
            data: { '50': true }
        };

        expect(state).not.toHaveProperty(['current']);
        Reducers.setCurrent(state, 50);

        expect(state).toHaveProperty(['current'], true);
    });

    test(`resetCurrent: should set current to null`, () => {

        const state = {
            current: true
        };

        expect(state).toHaveProperty(['current'], true);
        Reducers.resetCurrent(state);

        expect(state).toHaveProperty(['current'], null);
    });

    test(`crudInitialState: should create an initial state object`, () => {

        const state = Reducers.crudInitialState();

        expect(state).toHaveProperty(['isLoading'], false);
        expect(state).toHaveProperty(['current'], null);
        expect(state).toHaveProperty(['data'], {});
        expect(state).toHaveProperty(['error'], null);
    });

    test(`crudInitialState: should extend initial state`, () => {

        const state = Reducers.crudInitialState({
            more: true
        });

        expect(state).toHaveProperty(['isLoading'], false);
        expect(state).toHaveProperty(['current'], null);
        expect(state).toHaveProperty(['data'], {});
        expect(state).toHaveProperty(['error'], null);
        expect(state).toHaveProperty(['more'], true);
    });

    test(`crudReducers: should return an object of reducers`, () => {

        const reducers = Reducers.crudReducers();

        expect(reducers).toHaveProperty(['readAllSuccess'], Reducers.readAllSuccess);
        expect(reducers).toHaveProperty(['readOneSuccess'], Reducers.readOneSuccess);
        expect(reducers).toHaveProperty(['createSuccess'], Reducers.createSuccess);
        expect(reducers).toHaveProperty(['updateSuccess'], Reducers.updateSuccess);
        expect(reducers).toHaveProperty(['patchSuccess'], Reducers.updateSuccess);
        expect(reducers).toHaveProperty(['deleteSuccess'], Reducers.deleteSuccess);
        expect(reducers).toHaveProperty(['setCurrent'], Reducers.setCurrent);
        expect(reducers).toHaveProperty(['resetCurrent'], Reducers.resetCurrent);

        expect(reducers).toHaveProperty(['readAll'], Reducers.loadingReducer);
        expect(reducers).toHaveProperty(['readOne'], Reducers.loadingReducer);
        expect(reducers).toHaveProperty(['create'], Reducers.loadingReducer);
        expect(reducers).toHaveProperty(['update'], Reducers.loadingReducer);
        expect(reducers).toHaveProperty(['patch'], Reducers.loadingReducer);
        expect(reducers).toHaveProperty(['delete'], Reducers.loadingReducer);

        expect(reducers).toHaveProperty(['readAllFail'], Reducers.failReducer);
        expect(reducers).toHaveProperty(['readOneFail'], Reducers.failReducer);
        expect(reducers).toHaveProperty(['createFail'], Reducers.failReducer);
        expect(reducers).toHaveProperty(['updateFail'], Reducers.failReducer);
        expect(reducers).toHaveProperty(['patchFail'], Reducers.failReducer);
        expect(reducers).toHaveProperty(['deleteFail'], Reducers.failReducer);

        expect(reducers).not.toHaveProperty(['readAllDone']);
        expect(reducers).not.toHaveProperty(['readOneDone']);
        expect(reducers).not.toHaveProperty(['createDone']);
        expect(reducers).not.toHaveProperty(['updateDone']);
        expect(reducers).not.toHaveProperty(['patchDone']);
        expect(reducers).not.toHaveProperty(['deleteDone']);
    });


    test(`crudReducers: should extend object of reducers`, () => {

        const reducers = Reducers.crudReducers({
            test: true
        });

        expect(reducers).toHaveProperty(['readAllFail']);
        expect(reducers).toHaveProperty(['test'], true);
    });

    test(`crudReducers: should add done reducers`, () => {

        const reducers = Reducers.crudReducers({}, true);

        expect(reducers).toHaveProperty(['readAllDone'], Reducers.noop);
        expect(reducers).toHaveProperty(['readOneDone'], Reducers.noop);
        expect(reducers).toHaveProperty(['createDone'], Reducers.noop);
        expect(reducers).toHaveProperty(['updateDone'], Reducers.noop);
        expect(reducers).toHaveProperty(['patchDone'], Reducers.noop);
        expect(reducers).toHaveProperty(['deleteDone'], Reducers.noop);
    });

    test(`lifecycleReducers: should create an api lifecycle based reducers`, () => {

        const reducers = Reducers.lifecycleReducers('test');

        expect(reducers).toHaveProperty(['test'], Reducers.loadingReducer);
        expect(reducers).toHaveProperty(['testSuccess'], Reducers.notLoadingReducer);
        expect(reducers).toHaveProperty(['testFail'], Reducers.failReducer);
        expect(reducers).not.toHaveProperty(['testDone']);
    });

    test(`lifecycleReducers: should accept options for done reducer`, () => {

        const reducers = Reducers.lifecycleReducers('test', { done: true });

        expect(reducers).toHaveProperty(['testDone'], Reducers.noop);
    });

    test(`lifecycleReducers: should overwrite default reducers`, () => {

        const state = {};
        const reducers = Reducers.lifecycleReducers('test', {
            main: (state) => state.main = true,
            success: (state) => state.success = true,
            fail: (state) => state.fail = true,
            done: (state) => state.done = true
        });

        expect(state).not.toHaveProperty(['main']);
        expect(state).not.toHaveProperty(['success']);
        expect(state).not.toHaveProperty(['fail']);
        expect(state).not.toHaveProperty(['done']);

        reducers.test(state);
        reducers.testSuccess(state);
        reducers.testFail(state);
        reducers.testDone(state);

        expect(state).toHaveProperty(['main'], true);
        expect(state).toHaveProperty(['success'], true);
        expect(state).toHaveProperty(['fail'], true);
        expect(state).toHaveProperty(['done'], true);
    });
});
