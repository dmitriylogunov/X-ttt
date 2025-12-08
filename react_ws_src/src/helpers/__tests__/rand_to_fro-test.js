jest.unmock('../rand_to_fro');
import rand_to_fro from '../rand_to_fro'

describe('rand_to_fro', () => {
	it('returns a number within the range [0, max] when min is not provided', () => {
		const max = 10
		for (let i = 0; i < 100; i++) {
			const result = rand_to_fro(max)
			expect(result).toBeGreaterThanOrEqual(0)
			expect(result).toBeLessThanOrEqual(max)
		}
	});

	it('returns a number within the range [min, max] when both are provided', () => {
		const min = 5
		const max = 15
		for (let i = 0; i < 100; i++) {
			const result = rand_to_fro(max, min)
			expect(result).toBeGreaterThanOrEqual(min)
			expect(result).toBeLessThanOrEqual(max)
		}
	});

	it('returns the same value when min equals max', () => {
		const value = 7
		const result = rand_to_fro(value, value)
		expect(result).toBe(value)
	});

	it('returns 0 when max is 0 and min defaults to 0', () => {
		const result = rand_to_fro(0)
		expect(result).toBe(0)
	});

	it('returns an integer', () => {
		const result = rand_to_fro(100)
		expect(Number.isInteger(result)).toBe(true)
	});

	it('handles negative min values', () => {
		const min = -10
		const max = 10
		for (let i = 0; i < 100; i++) {
			const result = rand_to_fro(max, min)
			expect(result).toBeGreaterThanOrEqual(min)
			expect(result).toBeLessThanOrEqual(max)
		}
	});
});
