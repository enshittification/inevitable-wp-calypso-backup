import { withStorageKey } from '@automattic/state-utils';
import { Reducer, AnyAction } from 'redux';
import { combineReducers } from 'calypso/state/utils';
import { AppState } from 'calypso/types';
import {
	JETPACK_AGENCY_DASHBOARD_PURCHASED_LICENSE_CHANGE,
	JETPACK_AGENCY_DASHBOARD_SELECT_LICENSE,
	JETPACK_AGENCY_DASHBOARD_UNSELECT_LICENSE,
	JETPACK_AGENCY_DASHBOARD_RESET_SITE,
	JETPACK_AGENCY_DASHBOARD_SITE_MONITOR_STATUS_CHANGE,
	JETPACK_AGENCY_DASHBOARD_SELECT_SITE_LICENSE,
	JETPACK_AGENCY_DASHBOARD_UNSELECT_SITE_LICENSE,
	JETPACK_AGENCY_DASHBOARD_RESET_SITE_LICENSES,
} from './action-types';
import type {
	PurchasedProductsInfo,
	SiteMonitorStatus,
} from 'calypso/jetpack-cloud/sections/agency-dashboard/sites-overview/types';

const purchasedLicense: Reducer<
	{ purchasedLicenseInfo: PurchasedProductsInfo | null },
	AnyAction
> = ( state = { purchasedLicenseInfo: null }, action: AnyAction ): AppState => {
	switch ( action?.type ) {
		case JETPACK_AGENCY_DASHBOARD_PURCHASED_LICENSE_CHANGE:
			return { ...state, purchasedLicenseInfo: action.payload };
	}
	return state;
};

const siteMonitorStatus: Reducer< { statuses: SiteMonitorStatus }, AnyAction > = (
	state = { statuses: {} },
	action: AnyAction
): AppState => {
	switch ( action?.type ) {
		case JETPACK_AGENCY_DASHBOARD_SITE_MONITOR_STATUS_CHANGE:
			return { ...state, statuses: { ...state.statuses, [ action.siteId ]: action.status } };
	}
	return state;
};

const selectedLicenses: Reducer<
	{ siteId: null | number; licenses: Array< string > },
	AnyAction
> = ( state = { siteId: null, licenses: [] }, action: AnyAction ): AppState => {
	switch ( action?.type ) {
		case JETPACK_AGENCY_DASHBOARD_SELECT_LICENSE:
			return {
				...state,
				siteId: action.siteId,
				licenses:
					action.siteId !== state.siteId
						? // If the site is different, reset existing licenses.
						  [ action.license ]
						: // Otherwise, append the license to the list.
						  [ ...state.licenses, action.license ],
			};
		case JETPACK_AGENCY_DASHBOARD_UNSELECT_LICENSE: {
			const filtered = state.licenses.filter( ( license ) => license !== action.license );

			return {
				...state,
				// Reset the selected site in case there are no selected licenses.
				siteId: filtered.length === 0 ? null : action.siteId,
				licenses: filtered,
			};
		}
		case JETPACK_AGENCY_DASHBOARD_RESET_SITE:
			return {
				...state,
				siteId: null,
				licenses: [],
			};
	}
	return state;
};

const selectedSiteLicenses: Reducer<
	{ licenses: Array< { siteId: number; products: Array< string > } > },
	AnyAction
> = ( state = { licenses: [] }, action: AnyAction ): AppState => {
	switch ( action?.type ) {
		case JETPACK_AGENCY_DASHBOARD_SELECT_SITE_LICENSE: {
			const { siteId, license } = action;
			const foundSite = state.licenses.find( ( lic ) => lic.siteId === siteId );
			if ( ! foundSite ) {
				return {
					...state,
					licenses: [ ...state.licenses, { siteId, products: [ license ] } ],
				};
			}
			return {
				...state,
				licenses: state.licenses.map( ( lic ) => {
					if ( lic.siteId === siteId ) {
						return {
							...lic,
							products: [ ...lic.products, license ].filter(
								( product, index, self ) => self.indexOf( product ) === index
							),
						};
					}
					return lic;
				} ),
			};
		}
		case JETPACK_AGENCY_DASHBOARD_UNSELECT_SITE_LICENSE: {
			const { siteId, license } = action;
			return {
				...state,
				licenses: state.licenses.map( ( site ) => {
					if ( site.siteId === siteId ) {
						return {
							...site,
							products: site.products.filter( ( product ) => product !== license ),
						};
					}
					return site;
				} ),
			};
		}
		case JETPACK_AGENCY_DASHBOARD_RESET_SITE_LICENSES:
			return {
				...state,
				licenses: [],
			};
	}
	return state;
};

const combinedReducer = combineReducers( {
	purchasedLicense,
	selectedLicenses,
	selectedSiteLicenses,
	siteMonitorStatus,
} );

export default withStorageKey( 'agencyDashboard', combinedReducer );
