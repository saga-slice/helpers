import Axios from 'axios';
import { CANCEL } from 'redux-saga';
import axiosWrapper from '../axiosWrapper';

const stub = {};


describe('axios wrapper', () => {

    test('should create an axios instance', () => {

        const originalCreate = Axios.create;

        Axios.create = jest.fn();
        axiosWrapper();

        expect(Axios.create.mock.calls.length).toBe(1);
        Axios.create = originalCreate;
    });

    test('should not need options', () => {

        stub.api = axiosWrapper();

        expect(Object.keys(stub.api)).toEqual(
            expect.arrayContaining([
                'get',
                'put',
                'patch',
                'post',
                'delete',
                'addAuthorization',
                'removeAuthorization',
                'addHeader',
                'removeHeader',
                'instance'
            ])
        );

        const { defaults } = stub.api.instance;
        expect(defaults.baseURL).toBe(window.location.hostname);
        expect(defaults.timeout).toBe(5000);
        expect(defaults.headers.common['Content-Type']).toBe('application/json');
    });

    test('should allow passing and overriding default options', () => {

        stub.api = axiosWrapper({
            baseURL: 'testing',
            timeout: 1000,
            headers: {
                post: {
                    Test: true
                }
            }
        });

        const { defaults } = stub.api.instance;
        expect(defaults.baseURL).toBe('testing');
        expect(defaults.timeout).toBe(1000);
        expect(defaults.headers.common['Content-Type']).toBe('application/json');
        expect(defaults.headers.post.Test).toBe(true);
    });

    test('should not override common headers option completely', () => {

        stub.api = axiosWrapper({
            headers: {
                common: {
                    Test: true
                }
            }
        });

        const { defaults } = stub.api.instance;
        expect(defaults.headers.common['Content-Type']).toBe('application/json');
        expect(defaults.headers.common.Test).toBe(true);
    });

    test('should add header', () => {

        const { defaults } = stub.api.instance;

        expect(defaults.headers.common.Tits).toBe(undefined);
        stub.api.addHeader('Tits', true);
        expect(defaults.headers.common.Tits).toBe(true);
    });

    test('should remove header', () => {

        const { defaults } = stub.api.instance;

        expect(defaults.headers.common.Tits).toBe(true);
        stub.api.removeHeader('Tits');
        expect(defaults.headers.common.Tits).toBe(undefined);
    });

    test('should add authorization header', () => {

        const { defaults } = stub.api.instance;

        expect(defaults.headers.common.Authorization).toBe(undefined);
        stub.api.addAuthorization(true);
        expect(defaults.headers.common.Authorization).toBe(true);
    });

    test('should remove authorization header', () => {

        const { defaults } = stub.api.instance;

        expect(defaults.headers.common.Authorization).toBe(true);
        stub.api.removeAuthorization();
        expect(defaults.headers.common.Authorization).toBe(undefined);
    });

    test('should create a cancellable request', () => {

        stub.api = axiosWrapper();

        const returning = () => Promise.resolve();
        stub.api.instance.get = jest.fn().mockImplementation(returning);
        stub.api.instance.post = jest.fn().mockImplementation(returning);
        stub.api.instance.put = jest.fn().mockImplementation(returning);
        stub.api.instance.patch = jest.fn().mockImplementation(returning);
        stub.api.instance.delete = jest.fn().mockImplementation(returning);

        const get = stub.api.get('/');
        const post = stub.api.post('/');
        const put = stub.api.put('/');
        const patch = stub.api.patch('/');
        const del = stub.api.delete('/');

        [get, post, put, patch, del].forEach(req => {

            expect(req[CANCEL].constructor).toBe(Function);
        });
    });

    test('should pass options to get method', () => {

        stub.api = axiosWrapper();

        const returning = () => Promise.resolve();
        stub.api.instance.get = jest.fn().mockImplementation(returning);
        stub.api.get('/', { options: true });

        const { calls } = stub.api.instance.get.mock;

        expect(calls.length).toBe(1);

        const args = calls.shift();
        expect(args.shift()).toBe('/');
        expect(args.shift()).toEqual(
            expect.objectContaining({ options: true })
        );
    });

    test('should pass payload and options to other methods', () => {

        stub.api = axiosWrapper();

        const returning = () => Promise.resolve();

        ['post', 'put', 'patch', 'delete'].forEach(method => {

            stub.api.instance[method] = jest.fn().mockImplementation(returning);

            stub.api[method]('/', { payload: true }, { options: true });

            const { calls } = stub.api.instance[method].mock;

            expect(calls.length).toBe(1);

            const args = calls.shift();
            expect(args.shift()).toBe('/');
            expect(args.shift()).toEqual(
                expect.objectContaining({ payload: true })
            );
            expect(args.shift()).toEqual(
                expect.objectContaining({ options: true })
            );
        })
    });
});