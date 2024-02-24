import styled from '@emotion/styled';
import { CheckboxControl } from '@wordpress/components';
import { useTranslate } from 'i18n-calypso';
import InlineSupportLink from 'calypso/components/inline-support-link';
import { useDispatch } from 'calypso/state';
import { recordTracksEvent } from 'calypso/state/analytics/actions';

const CheckboxWrapper = styled.div`
	margin-top: 16px;

	& .components-checkbox-control__input[type='checkbox']:focus {
		border-color: ${ ( props ) => props.theme.colors.primary };

		&:focus {
			border-color: ${ ( props ) => props.theme.colors.primaryBorder };
			box-shadow:
				0 0 0 var( --wp-admin-border-width-focus ) #fff,
				0 0 0 calc( 2 * var( --wp-admin-border-width-focus ) )
					${ ( props ) => props.theme.colors.primaryBorder };
		}
	}
	& .checkout__checkbox-control .components-checkbox-control__input[type='checkbox']:checked {
		background: ${ ( props ) => props.theme.colors.primary };
		border-color: ${ ( props ) => props.theme.colors.primary };

		&:focus {
			border-color: ${ ( props ) => props.theme.colors.primaryBorder };
			box-shadow:
				0 0 0 var( --wp-admin-border-width-focus ) #fff,
				0 0 0 calc( 2 * var( --wp-admin-border-width-focus ) )
					${ ( props ) => props.theme.colors.primaryBorder };
		}
	}
`;

export default function AssignToAllPaymentMethods( {
	isChecked,
	isDisabled,
	onChange,
}: {
	isChecked: boolean;
	isDisabled?: boolean;
	onChange: ( isChecked: boolean ) => void;
} ) {
	const translate = useTranslate();
	const reduxDispatch = useDispatch();

	const handleChangeEvent = ( newIsChecked: boolean ): void => {
		reduxDispatch(
			recordTracksEvent( 'calypso_add_credit_card_form_assign_to_all_methods_toggle', {
				old_value: isChecked,
				new_value: newIsChecked,
			} )
		);
		onChange( newIsChecked );
	};

	return (
		<CheckboxWrapper>
			<CheckboxControl
				className="checkout__checkbox-control"
				disabled={ isDisabled }
				checked={ isChecked }
				onChange={ handleChangeEvent }
				label={
					translate(
						'Use this payment method for all subscriptions on my account. {{link}}Learn more.{{/link}}',
						{
							components: {
								link: (
									<InlineSupportLink
										supportContext="payment_method_all_subscriptions"
										showIcon={ false }
									/>
								),
							},
						}
						// As far as I can tell, label will correctly render the
						// component, so we cast to string to make the types work.
					) as string
				}
			/>
		</CheckboxWrapper>
	);
}
