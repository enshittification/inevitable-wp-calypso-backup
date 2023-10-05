import { createSelector } from '@automattic/state-utils';
import { map, pickBy } from 'lodash';

import 'calypso/state/reader/init';

/**
 * Returns a list of site IDs dismissed by the user
 * @param  {Object}  state  Global state tree
 * @returns {Array}        Dimissed site IDs
 */
export const getDismissedSites = createSelector(
	( state ) => map( Object.keys( pickBy( state.reader.siteDismissals.items ) ), Number ),
	( state ) => [ state.reader.siteDismissals.items ]
);
