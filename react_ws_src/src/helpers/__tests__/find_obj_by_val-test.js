jest.unmock('../find_obj_by_val');
import find_obj_by_val from '../find_obj_by_val'

const exm_obj = [
	{name:'Employee Discount', perc_val:'30', user_code:'emp'},
	{name:'Affiliate Discount', perc_val:'10', user_code:'aff'},
	{name:'Long Term Customer Discount', perc_val:'5', user_code:'c2y'}
]

describe('find_obj_by_val', () => {
	it('find_obj_by_val to find obj', () => {
		expect(find_obj_by_val(exm_obj, 'user_code', 'aff')).toBe(exm_obj[1]);
	});

	it('find_obj_by_val to find obj val', () => {
		expect(find_obj_by_val(exm_obj, 'user_code', 'c2y').perc_val*1).toBe(5);
	});

	it('returns undefined when array is null', () => {
		expect(find_obj_by_val(null, 'user_code', 'aff')).toBeUndefined();
	});

	it('returns undefined when array is undefined', () => {
		expect(find_obj_by_val(undefined, 'user_code', 'aff')).toBeUndefined();
	});

	it('returns undefined when array is empty', () => {
		expect(find_obj_by_val([], 'user_code', 'aff')).toBeUndefined();
	});

	it('returns undefined when key does not exist in any object', () => {
		expect(find_obj_by_val(exm_obj, 'nonexistent_key', 'aff')).toBeUndefined();
	});

	it('returns undefined when value is not found', () => {
		expect(find_obj_by_val(exm_obj, 'user_code', 'nonexistent')).toBeUndefined();
	});

	it('finds the first object by name', () => {
		expect(find_obj_by_val(exm_obj, 'name', 'Employee Discount')).toBe(exm_obj[0]);
	});

	it('returns the first matching object when duplicates exist', () => {
		const arrWithDupes = [
			{id: 1, type: 'a'},
			{id: 2, type: 'a'},
			{id: 3, type: 'b'}
		];
		expect(find_obj_by_val(arrWithDupes, 'type', 'a').id).toBe(1);
	});
});





