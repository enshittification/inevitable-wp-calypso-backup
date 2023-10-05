import { ThemeProvider } from '@emotion/react';
import { useI18n } from '@wordpress/react-i18n';
import debugFactory from 'debug';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CheckoutContext from '../lib/checkout-context';
import { LineItemsProvider } from '../lib/line-items';
import defaultTheme from '../lib/theme';
import {
	validateArg,
	validateLineItems,
	validatePaymentMethods,
	validateTotal,
} from '../lib/validation';
import { LineItem, CheckoutProviderProps } from '../types';
import CheckoutErrorBoundary from './checkout-error-boundary';
import { FormAndTransactionProvider } from './form-and-transaction-provider';
import type { CheckoutContextInterface } from '../types';

const debug = debugFactory( 'composite-checkout:checkout-provider' );

const emptyTotal: LineItem = {
	id: 'total',
	type: 'total',
	amount: { value: 0, displayValue: '0', currency: 'USD' },
	label: 'Total',
};

export function CheckoutProvider( {
	total = emptyTotal,
	items = [],
	onPaymentComplete,
	onPaymentRedirect,
	onPaymentError,
	onPageLoadError,
	onPaymentMethodChanged,
	redirectToUrl,
	theme,
	paymentMethods,
	paymentProcessors,
	isLoading,
	isValidating,
	selectFirstAvailablePaymentMethod,
	initiallySelectedPaymentMethodId = null,
	children,
}: CheckoutProviderProps ) {
	const propsToValidate = {
		total,
		items,
		redirectToUrl,
		theme,
		paymentMethods,
		paymentProcessors,
		isLoading,
		isValidating,
		children,
		initiallySelectedPaymentMethodId,
	};

	// Keep track of enabled/disabled payment methods.
	const [ disabledPaymentMethodIds, setDisabledPaymentMethodIds ] = useState< string[] >( [] );
	const availablePaymentMethodIds = paymentMethods
		.filter( ( method ) => ! disabledPaymentMethodIds.includes( method.id ) )
		.map( ( method ) => method.id );

	// Automatically select first payment method unless explicitly set or disabled.
	if (
		selectFirstAvailablePaymentMethod &&
		! initiallySelectedPaymentMethodId &&
		availablePaymentMethodIds.length > 0
	) {
		initiallySelectedPaymentMethodId = availablePaymentMethodIds[ 0 ];
	}

	// Keep track of selected payment method.
	const [ paymentMethodId, setPaymentMethodId ] = useState< string | null >(
		initiallySelectedPaymentMethodId
	);

	// Reset the selected payment method if the list of payment methods changes.
	useResetSelectedPaymentMethodWhenListChanges(
		availablePaymentMethodIds,
		initiallySelectedPaymentMethodId,
		setPaymentMethodId
	);

	// Create a big blob of state to store in React Context for use by all this Provider's children.
	const value: CheckoutContextInterface = useMemo(
		() => ( {
			allPaymentMethods: paymentMethods,
			disabledPaymentMethodIds,
			setDisabledPaymentMethodIds,
			paymentMethodId,
			setPaymentMethodId,
			paymentProcessors,
			onPageLoadError,
			onPaymentMethodChanged,
		} ),
		[
			paymentMethodId,
			paymentMethods,
			disabledPaymentMethodIds,
			paymentProcessors,
			onPageLoadError,
			onPaymentMethodChanged,
		]
	);

	const { __ } = useI18n();
	const errorMessage = __( 'Sorry, there was an error loading this page.' );
	const onLoadError = useCallback(
		( error: Error ) => {
			onPageLoadError?.( 'page_load', error );
		},
		[ onPageLoadError ]
	);
	return (
		<CheckoutErrorBoundary errorMessage={ errorMessage } onError={ onLoadError }>
			<CheckoutProviderPropValidator propsToValidate={ propsToValidate } />
			<ThemeProvider theme={ theme || defaultTheme }>
				<LineItemsProvider items={ items } total={ total }>
					<FormAndTransactionProvider
						onPaymentComplete={ onPaymentComplete }
						onPaymentRedirect={ onPaymentRedirect }
						onPaymentError={ onPaymentError }
						isLoading={ isLoading }
						isValidating={ isValidating }
						redirectToUrl={ redirectToUrl }
					>
						<CheckoutContext.Provider value={ value }>{ children }</CheckoutContext.Provider>
					</FormAndTransactionProvider>
				</LineItemsProvider>
			</ThemeProvider>
		</CheckoutErrorBoundary>
	);
}

/**
 * Even though CheckoutProvider is TypeScript, it's possible for consumers to
 * misuse it in ways that are not easy to debug. This helper component throws
 * errors if the props are not what they should be.
 */
function CheckoutProviderPropValidator( {
	propsToValidate,
}: {
	propsToValidate: CheckoutProviderProps;
} ) {
	const { total, items, paymentMethods, paymentProcessors } = propsToValidate;
	useEffect( () => {
		debug( 'propsToValidate', propsToValidate );

		validateArg( total, 'CheckoutProvider missing required prop: total' );
		validateTotal( total );
		validateArg( items, 'CheckoutProvider missing required prop: items' );
		validateLineItems( items );
		validateArg( paymentProcessors, 'CheckoutProvider missing required prop: paymentProcessors' );
		validateArg( paymentMethods, 'CheckoutProvider missing required prop: paymentMethods' );
		validatePaymentMethods( paymentMethods );
	}, [ items, paymentMethods, paymentProcessors, propsToValidate, total ] );
	return null;
}

// Reset the selected payment method if the list of payment methods changes.
function useResetSelectedPaymentMethodWhenListChanges(
	availablePaymentMethodIds: string[],
	initiallySelectedPaymentMethodId: string | null,
	setPaymentMethodId: ( id: string | null ) => void
) {
	const hashKey = availablePaymentMethodIds.join( '-_-' );
	const previousKey = useRef< string >();

	useEffect( () => {
		if ( previousKey.current !== hashKey ) {
			debug(
				'paymentMethods changed; setting payment method to initial selection ',
				initiallySelectedPaymentMethodId
			);

			previousKey.current = hashKey;
			setPaymentMethodId( initiallySelectedPaymentMethodId );
		}
	}, [ hashKey, setPaymentMethodId, initiallySelectedPaymentMethodId ] );
}
