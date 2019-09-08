import * as reducerHelpers from '../reducerHelpers';

test('readAllSuccess: should map payload to state by id', () => {

    const state = {};
    const payload = [
        { id: 1 },
        { id: 2 }
    ];

    expect(state).not.toHaveProperty(['isLoading']);
    expect(state).not.toHaveProperty(['data']);
    reducerHelpers.readAllSuccess(state, payload);

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
        reducerHelpers[reducerName](state, payload);

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
    reducerHelpers.deleteSuccess(state, payload);

    expect(state).toHaveProperty(['isLoading'], false);
    expect(state).toHaveProperty(['data'], {});
});

test(`failReducer: should set error in state`, () => {

    const state = {};
    const error = new Error();

    expect(state).not.toHaveProperty(['isLoading']);
    expect(state).not.toHaveProperty(['error']);
    reducerHelpers.failReducer(state, error);

    expect(state).toHaveProperty(['isLoading'], false);
    expect(state).toHaveProperty(['error'], error);
});

test(`failReducer: should set error in state`, () => {

    const state = {};
    const error = new Error();

    expect(state).not.toHaveProperty(['isLoading']);
    expect(state).not.toHaveProperty(['error']);
    reducerHelpers.failReducer(state, error);

    expect(state).toHaveProperty(['isLoading'], false);
    expect(state).toHaveProperty(['error'], error);
});

test(`loadingReducer: should set loading true`, () => {

    const state = {};

    expect(state).not.toHaveProperty(['isLoading']);
    reducerHelpers.loadingReducer(state);

    expect(state).toHaveProperty(['isLoading'], true);
});

test(`notLoadingReducer: should set loading false`, () => {

    const state = {};

    expect(state).not.toHaveProperty(['isLoading']);
    reducerHelpers.notLoadingReducer(state);

    expect(state).toHaveProperty(['isLoading'], false);
});

test(`setCurrent: should set passed object to current state`, () => {

    const state = {};

    expect(state).not.toHaveProperty(['current']);
    reducerHelpers.setCurrent(state, { test: true });

    expect(state).toHaveProperty(['current'], { test: true });
});

test(`setCurrent: should set item from data to current state when passed string or number`, () => {

    const state = {
        data: { '50': true }
    };

    expect(state).not.toHaveProperty(['current']);
    reducerHelpers.setCurrent(state, 50);

    expect(state).toHaveProperty(['current'], true);
});

test(`resetCurrent: should set current to null`, () => {

    const state = {
        current: true
    };

    expect(state).toHaveProperty(['current'], true);
    reducerHelpers.resetCurrent(state);

    expect(state).toHaveProperty(['current'], null);
});

test(`crudInitialState: should create an initial state object`, () => {

    const state = reducerHelpers.crudInitialState();

    expect(state).toHaveProperty(['isLoading'], false);
    expect(state).toHaveProperty(['current'], null);
    expect(state).toHaveProperty(['data'], null);
    expect(state).toHaveProperty(['error'], null);
});

test(`crudInitialState: should extend initial state`, () => {

    const state = reducerHelpers.crudInitialState({
        more: true
    });

    expect(state).toHaveProperty(['isLoading'], false);
    expect(state).toHaveProperty(['current'], null);
    expect(state).toHaveProperty(['data'], null);
    expect(state).toHaveProperty(['error'], null);
    expect(state).toHaveProperty(['more'], true);
});

test(`crudReducers: should return an object of reducers`, () => {

    const reducers = reducerHelpers.crudReducers();

    expect(reducers).toHaveProperty(['readAllSuccess'], reducerHelpers.readAllSuccess);
    expect(reducers).toHaveProperty(['readOneSuccess'], reducerHelpers.readOneSuccess);
    expect(reducers).toHaveProperty(['createSuccess'], reducerHelpers.createSuccess);
    expect(reducers).toHaveProperty(['updateSuccess'], reducerHelpers.updateSuccess);
    expect(reducers).toHaveProperty(['deleteSuccess'], reducerHelpers.deleteSuccess);
    expect(reducers).toHaveProperty(['setCurrent'], reducerHelpers.setCurrent);
    expect(reducers).toHaveProperty(['resetCurrent'], reducerHelpers.resetCurrent);

    expect(reducers).toHaveProperty(['readAll'], reducerHelpers.loadingReducer);
    expect(reducers).toHaveProperty(['readOne'], reducerHelpers.loadingReducer);
    expect(reducers).toHaveProperty(['create'], reducerHelpers.loadingReducer);
    expect(reducers).toHaveProperty(['update'], reducerHelpers.loadingReducer);
    expect(reducers).toHaveProperty(['delete'], reducerHelpers.loadingReducer);

    expect(reducers).toHaveProperty(['readAllFail'], reducerHelpers.failReducer);
    expect(reducers).toHaveProperty(['readOneFail'], reducerHelpers.failReducer);
    expect(reducers).toHaveProperty(['createFail'], reducerHelpers.failReducer);
    expect(reducers).toHaveProperty(['updateFail'], reducerHelpers.failReducer);
    expect(reducers).toHaveProperty(['deleteFail'], reducerHelpers.failReducer);

    expect(reducers).not.toHaveProperty(['readAllDone']);
    expect(reducers).not.toHaveProperty(['readOneDone']);
    expect(reducers).not.toHaveProperty(['createDone']);
    expect(reducers).not.toHaveProperty(['updateDone']);
    expect(reducers).not.toHaveProperty(['deleteDone']);
});


test(`crudReducers: should extend object of reducers`, () => {

    const reducers = reducerHelpers.crudReducers({
        test: true
    });

    expect(reducers).toHaveProperty(['test'], true);
});

test(`crudReducers: should add done reducers`, () => {

    const reducers = reducerHelpers.crudReducers({}, true);

    expect(reducers).toHaveProperty(['readAllDone'], reducerHelpers.noop);
    expect(reducers).toHaveProperty(['readOneDone'], reducerHelpers.noop);
    expect(reducers).toHaveProperty(['createDone'], reducerHelpers.noop);
    expect(reducers).toHaveProperty(['updateDone'], reducerHelpers.noop);
    expect(reducers).toHaveProperty(['deleteDone'], reducerHelpers.noop);
});

test(`lifecycleReducers: should create an api lifecycle based reducers`, () => {

    const reducers = reducerHelpers.lifecycleReducers('test');

    expect(reducers).toHaveProperty(['test'], reducerHelpers.loadingReducer);
    expect(reducers).toHaveProperty(['testSuccess'], reducerHelpers.notLoadingReducer);
    expect(reducers).toHaveProperty(['testFail'], reducerHelpers.failReducer);
    expect(reducers).not.toHaveProperty(['testDone']);
});

test(`lifecycleReducers: should accept options for done reducer`, () => {

    const reducers = reducerHelpers.lifecycleReducers('test', { done: true });

    expect(reducers).toHaveProperty(['testDone'], reducerHelpers.noop);
});

test(`lifecycleReducers: should overwrite default reducers`, () => {

    const state = {};
    const reducers = reducerHelpers.lifecycleReducers('test', {
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
