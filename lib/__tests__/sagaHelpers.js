import * as sagaHelpers from '../sagaHelpers';

describe('saga helpers', () => {

    test('crudSaga: should not allow bad options', () => {

        expect(() => {
            sagaHelpers.crudSaga();
        }).toThrow(/options\.singular.+required/);

        expect(() => {
            sagaHelpers.crudSaga({
                singular: true
            });
        }).toThrow(/options\.singular.+required/);

        expect(() => {
            sagaHelpers.crudSaga({
                singular: 'true'
            });
        }).toThrow(/options\.plural.+required/);

        expect(() => {
            sagaHelpers.crudSaga({
                singular: 'true',
                plural: true
            });
        }).toThrow(/options\.plural.+required/);

        expect(() => {
            sagaHelpers.crudSaga({
                singular: 'true',
                plural: 'true'
            });
        }).toThrow(/options\.sagaApi.+required/);

        expect(() => {
            sagaHelpers.crudSaga({
                singular: 'true',
                plural: 'true',
                sagaApi: true
            });
        }).toThrow(/options\.sagaApi.+required/);

        expect(() => {
            sagaHelpers.crudSaga({
                singular: 'true',
                plural: 'true',
                sagaApi: {}
            });
        }).not.toThrow();
    });
    test('crudSaga: should return a function', () => {

        const sagasFn = sagaHelpers.crudSaga({
            singular: 'true',
            plural: 'true',
            sagaApi: {}
        });

        expect(sagasFn.constructor).toBe(Function);
    });

    test('crudSaga: instantiates saga functions when returned function called', () => {

        const sagasFn = sagaHelpers.crudSaga({
            singular: 'true',
            plural: 'true',
            sagaApi: {}
        });

        const actions = {
            'readAll': 'readAll',
            'readOne': 'readOne',
            'create': 'create',
            'update': 'update',
            'delete': 'delete'
        };

        const sagas = sagasFn(actions);

        expect(Object.keys(sagas)).toEqual(expect.arrayContaining([
            'readAll',
            'readOne',
            'create',
            'update',
            'delete'
        ]));

        expect(sagas.readAll.saga instanceof Function).toBe(true);
        expect(sagas.readOne.saga instanceof Function).toBe(true);
        expect(sagas.create.saga instanceof Function).toBe(true);
        expect(sagas.update.saga instanceof Function).toBe(true);
        expect(sagas.delete.saga instanceof Function).toBe(true);
    });


    test('crudSaga: sagas execute sagaApi and pass it correct actions', () => {

        const sagaApi = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        };

        const actions = {
            'readAll': 'readAll',
            'readOne': 'readOne',
            'create': 'create',
            'update': 'update',
            'delete': 'delete',
            'readAllSuccess': 'readAllSuccess',
            'readOneSuccess': 'readOneSuccess',
            'createSuccess': 'createSuccess',
            'updateSuccess': 'updateSuccess',
            'deleteSuccess': 'deleteSuccess',
            'readAllFail': 'readAllFail',
            'readOneFail': 'readOneFail',
            'createFail': 'createFail',
            'updateFail': 'updateFail',
            'deleteFail': 'deleteFail',
            'readAllDone': 'readAllDone',
            'readOneDone': 'readOneDone',
            'createDone': 'createDone',
            'updateDone': 'updateDone',
            'deleteDone': 'deleteDone'
        };

        const sagasFn = sagaHelpers.crudSaga({
            singular: 'true',
            plural: 'trues',
            sagaApi
        });

        const sagas = sagasFn(actions);

        sagas.readAll.saga().next();
        expect(sagaApi.get.mock.calls.length).toBe(1);
        expect(sagaApi.get.mock.calls.shift()).toEqual(expect.arrayContaining([
            '/trues',
            'readAllSuccess',
            'readAllFail',
            'readAllDone'
        ]));

        sagas.readOne.saga({ payload: 'readOne payload' }).next();
        expect(sagaApi.get.mock.calls.length).toBe(1);
        expect(sagaApi.get.mock.calls.shift()).toEqual(expect.arrayContaining([
            '/true/readOne payload',
            'readOneSuccess',
            'readOneFail',
            'readOneDone'
        ]));

        sagas.create.saga({ payload: 'create payload' }).next();
        expect(sagaApi.post.mock.calls.length).toBe(1);
        expect(sagaApi.post.mock.calls.shift()).toEqual(expect.arrayContaining([
            '/true',
            'create payload',
            'createSuccess',
            'createFail',
            'createDone'
        ]));

        sagas.update.saga({ payload: { id: 5, changeset: 'update payload' } }).next();
        expect(sagaApi.put.mock.calls.length).toBe(1);
        expect(sagaApi.put.mock.calls.shift()).toEqual(expect.arrayContaining([
            '/true/5',
            'update payload',
            'updateSuccess',
            'updateFail',
            'updateDone'
        ]));

        sagas.delete.saga({ payload: 'delete payload' }).next();
        expect(sagaApi.delete.mock.calls.length).toBe(1);
        expect(sagaApi.delete.mock.calls.shift()).toEqual(expect.arrayContaining([
            '/true/delete payload',
            null,
            'deleteSuccess',
            'deleteFail',
            'deleteDone'
        ]));

    });
});