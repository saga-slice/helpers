import ApiIndex from '../';

describe('api index', () => {

    test('should create an axios instance and a saga API', () => {

        const sagaApiKeys = [
            'get',
            'put',
            'patch',
            'post',
            'delete'
        ];

        const apiKeys = [
            ...sagaApiKeys,
            'addAuthorization',
            'removeAuthorization',
            'addHeader',
            'removeHeader',
            'instance'
        ]

        const apis = ApiIndex({
            baseURL: 'testing',
            timeout: 1000,
            headers: {
                common: {
                    Test: 'truth'
                }
            }
        });

        expect(Object.keys(apis.api)).toEqual(
            expect.arrayContaining(apiKeys)
        );

        expect(Object.keys(apis.sagaApi)).toEqual(
            expect.arrayContaining(sagaApiKeys)
        );

        const { defaults } = apis.api.instance;
        expect(defaults.baseURL).toBe('testing');
        expect(defaults.headers.common.Test).toBe('truth');
    });
});