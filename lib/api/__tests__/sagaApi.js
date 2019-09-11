import { runSaga, stdChannel } from 'redux-saga';
import axiosWrapper from '../axiosWrapper';
import sagaApi from '../sagaApi';

const fakeAction = (type) => ({ type, payload: true });

const mocks = {
    success: jest.fn(() => fakeAction('success')),
    fail: jest.fn(() => fakeAction('fail')),
    done: jest.fn(() => fakeAction('done')),
};

const stub = {
    instance: axiosWrapper(),
    returning: () => Promise.resolve({ data: true }),
    success: (...args) => mocks.success(...args),
    fail: (...args) => mocks.fail(...args),
    done: (...args) => mocks.done(...args),
    get: jest.fn(() => stub.returning()),
    post: jest.fn(() => stub.returning()),
    put: jest.fn(() => stub.returning()),
    delete: jest.fn(() => stub.returning()),
};

Object.assign(stub.instance, {
    get: stub.get,
    post: stub.post,
    put: stub.put,
    delete: stub.delete
});

// https://dev.to/phil/the-best-way-to-test-redux-sagas-4hib
const recordSaga = async (saga, ...args) => {

    const channel = stdChannel();

    await runSaga(
        {
            channel,
            dispatch: (action) => {

                channel.put(action)
            }
        },
        saga,
        ...args
    ).done;

    return true;
};

beforeEach(() => {

    jest.clearAllMocks();
});

// Runs series of tests for 1 method
const describeMethod = (method) => {

    describe(method, () => {

        // Get does not receive payloads
        const isGet = method === 'get';

        // Common when testing actions
        const prepareArgs = (done = false) => {

            const args = ['/'];

            if (!isGet) {
                args.push('payload');
            }

            args.push(stub.success, stub.fail, done ? stub.done : undefined);

            return args;
        }

        test('should not allow bad path', () => {

            [
                undefined,
                null,
                1,
                [],
                {},
                NaN,
                () => {}
            ].forEach(path => {


                expect(
                    () => stub.api[method](path).next().value
                ).toThrow('valid path required');
            })
        });

        test('should not allow bad success function ', () => {

            [
                undefined,
                null,
                1,
                [],
                {},
                NaN,
                ""
            ].forEach(success => {

                const args = ['/'];

                if (!isGet) {
                    args.push('payload');
                }

                args.push(success);

                expect(
                    () => stub.api[method](...args).next().value
                ).toThrow('success must be a function');
            })
        });

        test('should not allow bad fail function', () => {

            [
                undefined,
                null,
                1,
                [],
                {},
                NaN,
                ""
            ].forEach(fail => {

                const args = ['/'];

                if (!isGet) {
                    args.push('payload');
                }

                args.push(() => {}, fail);

                expect(
                    () => stub.api[method](...args).next().value
                ).toThrow('fail must be a function');
            });
        });

        test('should not allow bad done function', () => {

            [
                1,
                [],
                {},
                "string"
            ].forEach(done => {

                const args = ['/'];

                if (!isGet) {
                    args.push('payload');
                }

                args.push(() => {}, () => {}, done);

                expect(
                    () => stub.api[method](...args).next().value
                ).toThrow('done must be a function');
            });
        });

        test('should call axios method', async () => {

            const args = prepareArgs();

            // stub.api[method](...args).next();
            await recordSaga(
                stub.api[method],
                ...args
            );

            expect(stub[method].mock.calls.length).toBe(1);
            expect(stub[method].mock.calls.shift()).toEqual(
                expect.arrayContaining(isGet ? ['/'] : ['/', 'payload'])
            );
        });

        test('should call success method', async () => {

            const args = prepareArgs();

            stub.returning = () => Promise.resolve({ data: true });

            await recordSaga(
                stub.api[method],
                ...args
            );

            expect(mocks.success.mock.calls.length).toBe(1);

            const successCalledWith = mocks.success.mock.calls.shift();
            expect(successCalledWith).toEqual(
                expect.arrayContaining([ true ])
            );
        });

        test('should call fail method', async () => {

            const args = prepareArgs();

            const error = Error('fail');
            stub.returning = () => Promise.reject(error);

            await recordSaga(
                stub.api[method],
                ...args
            );

            expect(mocks.success.mock.calls.length).toBe(0);
            expect(mocks.fail.mock.calls.length).toBe(1);

            const failCalledWith = mocks.fail.mock.calls.shift();
            expect(failCalledWith).toEqual(
                expect.arrayContaining([ error ])
            );

            stub.returning = () => Promise.resolve({ data: true });
        });

        test('should always call done method when passed', async () => {

            const args = prepareArgs(true);

            const data = { success: true };
            const error = Error('fail');

            stub.returning = () => Promise.resolve({ data });

            await recordSaga(
                stub.api[method],
                ...args
            );

            stub.returning = () => Promise.reject(error);

            await recordSaga(
                stub.api[method],
                ...args
            );

            expect(mocks.done.mock.calls.length).toBe(2);
            const { calls } = mocks.done.mock;

            expect(calls[0][0]).toEqual(
                expect.objectContaining({ data })
            )

            expect(calls[1][0]).toEqual(
                expect.objectContaining({ error })
            )

            stub.returning = () => Promise.resolve({ data: true });
        });
    })
}

describe('saga API', () => {

    test('should create a saga api instance', () => {

        stub.api = sagaApi(stub.instance);

        expect(Object.keys(stub.api)).toEqual(
            expect.arrayContaining(['get', 'post', 'put', 'delete'])
        );
    });

    // Run test suite for each method
    ['get', 'post', 'put', 'delete'].forEach(describeMethod);


    // test('should ', () => {});
    // test('should ', () => {});
    // test('should ', () => {});

});