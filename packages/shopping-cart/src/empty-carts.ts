import type { ResponseCart, ResponseCartProduct } from './types';

export function getEmptyResponseCart(): ResponseCart {
	return {
		blog_id: 0,
		cart_generated_at_timestamp: 0,
		cart_key: 'no-site',
		products: [],
		total_tax: '0',
		total_tax_integer: 0,
		total_tax_breakdown: [],
		total_cost: 0,
		total_cost_integer: 0,
		coupon_savings_total_integer: 0,
		sub_total_with_taxes_integer: 0,
		sub_total_integer: 0,
		currency: 'USD',
		credits_integer: 0,
		allowed_payment_methods: [],
		coupon: '',
		is_coupon_applied: false,
		locale: 'en-us',
		tax: { location: {}, display_taxes: false },
		is_signup: false,
		next_domain_is_free: false,
		next_domain_condition: '',
	};
}

export function getEmptyResponseCartProduct(): ResponseCartProduct {
	return {
		time_added_to_cart: Date.now(),
		product_name: 'Replace me',
		product_name_en: 'Replace me',
		product_slug: 'replace-me',
		currency: 'USD',
		extra: {},
		meta: '',
		product_id: 1,
		volume: 1,
		quantity: null,
		current_quantity: null,
		item_original_cost_integer: 0,
		item_original_cost_for_quantity_one_integer: 0,
		item_subtotal_integer: 0,
		item_subtotal_before_discounts_integer: 0,
		product_cost_integer: 0,
		item_subtotal_monthly_cost_integer: 0,
		item_original_subtotal_integer: 0,
		is_included_for_100yearplan: false,
		is_domain_registration: false,
		is_bundled: false,
		is_sale_coupon_applied: false,
		bill_period: '365',
		months_per_bill_period: null,
		uuid: 'product001',
		cost: 0,
		item_tax: 0,
		product_type: 'test',
		included_domain_purchase_amount: 0,
		product_variants: [],
	};
}
