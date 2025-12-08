jest.unmock('../serialize_params'); // unmock to use the actual implementation of serialize_params
import serialize_params from '../serialize_params'

describe('serialize_params', () => {
	it('serialize_params {a} to equal a=a', () => {
		expect(serialize_params({a:'a'})).toBe('a=a');
	});

	it('serialize_params {a, b, c} to equal a=a&b=b&c=c', () => {
		expect(serialize_params({a:'a', b:'b', c:'c'})).toBe('a=a&b=b&c=c');
	});

	it('handles empty object', () => {
		expect(serialize_params({})).toBe('');
	});

	it('encodes special characters in keys', () => {
		expect(serialize_params({'key with space': 'value'})).toBe('key%20with%20space=value');
	});

	it('encodes special characters in values', () => {
		expect(serialize_params({key: 'value with space'})).toBe('key=value%20with%20space');
	});

	it('handles numeric values', () => {
		expect(serialize_params({count: 42, price: 9.99})).toBe('count=42&price=9.99');
	});

	it('encodes ampersand in values', () => {
		expect(serialize_params({query: 'a&b'})).toBe('query=a%26b');
	});

	it('encodes equals sign in values', () => {
		expect(serialize_params({equation: '1+1=2'})).toBe('equation=1%2B1%3D2');
	});

	it('handles boolean values', () => {
		expect(serialize_params({active: true, deleted: false})).toBe('active=true&deleted=false');
	});
});