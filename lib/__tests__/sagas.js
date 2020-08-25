import * as Sagas from '../sagas';

const stub = {};

describe('saga helpers', () => {

    test('crudSaga: should not allow bad options', () => {

        expect(() => {
            Sagas.crudSaga();
        }).toThrow(/options\.name.+required/);

        expect(() => {
            Sagas.crudSaga({
                name: true
            });
        }).toThrow(/options\.name.+required/);

        expect(() => {
            Sagas.crudSaga({
                name: 'true',
            });
        }).toThrow(/options\.sagaApi.+required/);

        expect(() => {
            Sagas.crudSaga({
                name: 'true',
                sagaApi: true
            });
        }).toThrow(/options\.sagaApi.+required/);

        expect(() => {
            Sagas.crudSaga({
                name: 'true',
                sagaApi: {}
            });
        }).not.toThrow();
    });

    test('crudSaga: should return a function', () => {

        const sagasFn = Sagas.crudSaga({
            name: 'true',
            sagaApi: {}
        });

        expect(sagasFn.constructor).toBe(Function);
    });

    test('crudSaga: instantiates saga functions when returned function called', () => {

        const sagasFn = Sagas.crudSaga({
            name: 'true',
            sagaApi: {}
        });

        const actions = {
            'readAll': 'readAll',
            'readOne': 'readOne',
            'create': 'create',
            'update': 'update',
            'patch': 'patch',
            'delete': 'delete'
        };

        const sagas = sagasFn(actions);

        expect(Object.keys(sagas)).toEqual(expect.arrayContaining([
            'readAll',
            'readOne',
            'create',
            'update',
            'patch',
            'delete'
        ]));
    });


    test('crudSaga: sagas execute sagaApi and pass it correct actions', () => {

        stub.sagaApi = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn()
        };

        stub.actions = {
            'readAll': 'readAll',
            'readOne': 'readOne',
            'create': 'create',
            'update': 'update',
            'patch': 'patch',
            'delete': 'delete',
            'readAllSuccess': 'readAllSuccess',
            'readOneSuccess': 'readOneSuccess',
            'createSuccess': 'createSuccess',
            'updateSuccess': 'updateSuccess',
            'patchSuccess': 'patchSuccess',
            'deleteSuccess': 'deleteSuccess',
            'readAllFail': 'readAllFail',
            'readOneFail': 'readOneFail',
            'createFail': 'createFail',
            'updateFail': 'updateFail',
            'patchFail': 'patchFail',
            'deleteFail': 'deleteFail',
            'readAllDone': 'readAllDone',
            'readOneDone': 'readOneDone',
            'createDone': 'createDone',
            'updateDone': 'updateDone',
            'patchDone': 'patchDone',
            'deleteDone': 'deleteDone'
        };

        const sagasFn = Sagas.crudSaga({
            name: 'todos',
            sagaApi: stub.sagaApi
        });

        const sagas = sagasFn(stub.actions);

        sagas.readAll().next();
        expect(stub.sagaApi.get.mock.calls.length).toBe(1);
        expect(stub.sagaApi.get.mock.calls.shift()).toEqual(expect.arrayContaining([
            '/todos',
            'readAllSuccess',
            'readAllFail',
            'readAllDone'
        ]));

        sagas.readOne({ payload: 'readOne payload' }).next();
        expect(stub.sagaApi.get.mock.calls.length).toBe(1);
        expect(stub.sagaApi.get.mock.calls.shift()).toEqual(expect.arrayContaining([
            '/todos/readOne payload',
            'readOneSuccess',
            'readOneFail',
            'readOneDone'
        ]));

        sagas.create({ payload: 'create payload' }).next();
        expect(stub.sagaApi.post.mock.calls.length).toBe(1);
        expect(stub.sagaApi.post.mock.calls.shift()).toEqual(expect.arrayContaining([
            '/todos',
            'create payload',
            'createSuccess',
            'createFail',
            'createDone'
        ]));

        sagas.update({ payload: { id: 5, changeset: 'update payload' } }).next();
        expect(stub.sagaApi.put.mock.calls.length).toBe(1);
        expect(stub.sagaApi.put.mock.calls.shift()).toEqual(expect.arrayContaining([
            '/todos/5',
            'update payload',
            'updateSuccess',
            'updateFail',
            'updateDone'
        ]));


        sagas.patch({ payload: { id: 5, changeset: 'patch payload' } }).next();
        expect(stub.sagaApi.patch.mock.calls.length).toBe(1);
        expect(stub.sagaApi.patch.mock.calls.shift()).toEqual(expect.arrayContaining([
            '/todos/5',
            'patch payload',
            'patchSuccess',
            'patchFail',
            'patchDone'
        ]));

        sagas.delete({ payload: 'delete payload' }).next();
        expect(stub.sagaApi.delete.mock.calls.length).toBe(1);
        expect(stub.sagaApi.delete.mock.calls.shift()).toEqual(expect.arrayContaining([
            '/todos/delete payload',
            null,
            'deleteSuccess',
            'deleteFail',
            'deleteDone'
        ]));
    });
});