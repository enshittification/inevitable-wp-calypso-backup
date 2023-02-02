import config from '@automattic/calypso-config';
import {
	Field,
	tryToGuessPostalCodeFormat,
	getCountryPostalCodeSupport,
	getCountryTaxRequirements,
} from '@automattic/wpcom-checkout';
import styled from '@emotion/styled';
import { useTranslate } from 'i18n-calypso';
import { isValid } from '../types/wpcom-store-state';
import CountrySelectMenu from './country-select-menu';
import { LeftColumn, RightColumn } from './ie-fallback';
import { VatForm } from './vat-form';
import type {
	CountryListItem,
	ManagedContactDetails,
	ManagedValue,
} from '@automattic/wpcom-checkout';
import type { ChangeEvent } from 'react';
import { Input, StateSelect } from 'calypso/my-sites/domains/components/form';
import {
	getStateLabelText,
	STATE_SELECT_TEXT,
} from 'calypso/components/domains/contact-details-form-fields/custom-form-fieldsets/utils';

const GridRow = styled.div`
	display: -ms-grid;
	display: grid;
	width: 100%;
	-ms-grid-columns: 48% 4% 48%;
	grid-template-columns: 48% 48%;
	grid-column-gap: 4%;
	justify-items: stretch;
`;

const FieldRow = styled( GridRow )`
	margin-top: 16px;

	:first-of-type {
		margin-top: 0;
	}
`;

export default function TaxFields( {
	section,
	taxInfo,
	countriesList,
	onChange,
	allowVat,
	isDisabled,
}: {
	section: string;
	taxInfo: ManagedContactDetails;
	countriesList: CountryListItem[];
	onChange: ( taxInfo: ManagedContactDetails ) => void;
	allowVat?: boolean;
	isDisabled?: boolean;
} ) {
	const translate = useTranslate();
	const { postalCode, countryCode, city, state } = taxInfo;
	const arePostalCodesSupported =
		countriesList.length && countryCode?.value
			? getCountryPostalCodeSupport( countriesList, countryCode.value )
			: false;
	const taxRequirements =
		countriesList.length && countryCode?.value
			? getCountryTaxRequirements( countriesList, countryCode.value )
			: {};
	const isVatSupported = config.isEnabled( 'checkout/vat-form' ) && allowVat;

	return (
		<>
			<FieldRow>
				<LeftColumn>
					<CountrySelectMenu
						translate={ translate }
						onChange={ ( event: ChangeEvent< HTMLSelectElement > ) => {
							onChange( {
								countryCode: { value: event.target.value, errors: [], isTouched: true },
								postalCode: updatePostalCodeForCountry( postalCode, countryCode, countriesList ),
								city,
								state,
							} );
						} }
						isError={ countryCode?.isTouched && ! isValid( countryCode ) }
						isDisabled={ isDisabled }
						errorMessage={ countryCode?.errors[ 0 ] ?? translate( 'This field is required.' ) }
						currentValue={ countryCode?.value }
						countriesList={ countriesList }
					/>
				</LeftColumn>

				{ arePostalCodesSupported && (
					<RightColumn>
						<Field
							id={ section + '-postal-code' }
							type="text"
							label={ String( translate( 'Postal code' ) ) }
							value={ postalCode?.value ?? '' }
							disabled={ isDisabled }
							onChange={ ( newValue: string ) => {
								onChange( {
									countryCode,
									postalCode: updatePostalCodeForCountry(
										{ value: newValue.toUpperCase(), errors: [], isTouched: true },
										countryCode,
										countriesList
									),
									city,
									state,
								} );
							} }
							autoComplete={ section + ' postal-code' }
							isError={ postalCode?.isTouched && ! isValid( postalCode ) }
							errorMessage={
								postalCode?.errors[ 0 ] ?? String( translate( 'This field is required.' ) )
							}
						/>
					</RightColumn>
				) }
			</FieldRow>
			{ ( taxRequirements.city || taxRequirements.state ) && (
				<FieldRow>
					{ taxRequirements.city && (
						<LeftColumn>
							<Field
								id={ section + '-city' }
								type="text"
								label={ String( translate( 'City' ) ) }
								value={ city?.value ?? '' }
								disabled={ isDisabled }
								onChange={ ( newValue: string ) => {
									onChange( {
										countryCode,
										postalCode,
										city: { value: newValue, errors: [], isTouched: true },
										state,
									} );
								} }
								autoComplete={ section + ' city' }
								isError={ city?.isTouched && ! isValid( city ) }
								errorMessage={
									city?.errors[ 0 ] ?? String( translate( 'This field is required.' ) )
								}
							/>
						</LeftColumn>
					) }
					{ taxRequirements.state && countryCode?.value && (
						<RightColumn>
							<StateSelect
								label={ getStateLabelText( countryCode.value ) }
								countryCode={ countryCode.value }
								selectText={ STATE_SELECT_TEXT[ countryCode.value ] }
								value={ state?.value }
								onChange={ ( event: ChangeEvent< HTMLSelectElement > ) => {
									onChange( {
										countryCode,
										postalCode,
										city,
										state: { value: event.target.value, errors: [], isTouched: true },
									} );
								} }
							/>
						</RightColumn>
					) }
				</FieldRow>
			) }
			{ isVatSupported && (
				<VatForm section={ section } isDisabled={ isDisabled } countryCode={ countryCode?.value } />
			) }
		</>
	);
}

function updatePostalCodeForCountry(
	postalCode: ManagedValue | undefined,
	countryCode: ManagedValue | undefined,
	countriesList: CountryListItem[]
): ManagedValue | undefined {
	const arePostalCodesSupported =
		countriesList.length && countryCode?.value
			? getCountryPostalCodeSupport( countriesList, countryCode.value )
			: false;
	if ( ! arePostalCodesSupported ) {
		return { value: '', errors: [], isTouched: true };
	}
	// Reformat the postal code if the country changes
	if ( postalCode?.value ) {
		const formattedPostalCodeValue = tryToGuessPostalCodeFormat(
			postalCode.value,
			countryCode?.value
		);
		return { value: formattedPostalCodeValue, errors: [], isTouched: true };
	}
	return postalCode;
}
