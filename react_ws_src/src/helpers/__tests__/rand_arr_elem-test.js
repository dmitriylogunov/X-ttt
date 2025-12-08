jest.unmock('../rand_arr_elem');
jest.unmock('../rand_to_fro');
import rand_arr_elem from '../rand_arr_elem'

describe('rand_arr_elem', () => {
	it('returns null when array is null', () => {
		expect(rand_arr_elem(null)).toBeNull()
	});

	it('returns null when array is undefined', () => {
		expect(rand_arr_elem(undefined)).toBeNull()
	});

	it('returns the only element from a single-element array', () => {
		const arr = ['only']
		expect(rand_arr_elem(arr)).toBe('only')
	});

	it('returns an element that exists in the array', () => {
		const arr = ['a', 'b', 'c', 'd', 'e']
		for (let i = 0; i < 50; i++) {
			const result = rand_arr_elem(arr)
			expect(arr).toContain(result)
		}
	});

	it('works with arrays of numbers', () => {
		const arr = [1, 2, 3, 4, 5]
		for (let i = 0; i < 50; i++) {
			const result = rand_arr_elem(arr)
			expect(arr).toContain(result)
		}
	});

	it('works with arrays of objects', () => {
		const obj1 = { id: 1 }
		const obj2 = { id: 2 }
		const obj3 = { id: 3 }
		const arr = [obj1, obj2, obj3]
		for (let i = 0; i < 50; i++) {
			const result = rand_arr_elem(arr)
			expect(arr).toContain(result)
		}
	});

	it('returns undefined for empty array (accessing index -1)', () => {
		const arr = []
		// rand_to_fro(-1) will return something that results in arr[undefined index]
		const result = rand_arr_elem(arr)
		expect(result).toBeUndefined()
	});
});
