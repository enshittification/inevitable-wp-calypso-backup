import { getTheme } from 'calypso/state/themes/selectors/get-theme';

import 'calypso/state/themes/init';

type ThemeTypes = 'hosted-internal' | 'managed-internal' | 'managed-external';

type GetThemeFunction = (
	state: any,
	siteId: any,
	themeId: string
) => {
	theme_type?: ThemeTypes;
};

/**
 * Check if a theme is externally managed. If true, this means that the theme is not
 * managed by Automattic, but by a third party.
 * @param {Object} state Global state tree
 * @param {string} themeId Theme ID
 * @returns {boolean} True if the theme is externally managed.
 */
export function isExternallyManagedTheme( state = {}, themeId: string ): boolean {
	const theme =
		/**
		 * TODO: Remove this once we have a Third-Party theme to test!
		 */
		( getTheme as GetThemeFunction )( state, 'wpcom', `marketplace|${ themeId }` ) ||
		( getTheme as GetThemeFunction )( state, 'wpcom', themeId ) ||
		{};
	if ( ! theme.theme_type ) {
		return false;
	}

	const themeType: ThemeTypes = theme.theme_type;
	return themeType === 'managed-external';
}

/**
 * Check if any of a list of themes is externally managed.
 * @param {Object} state Global state tree
 * @param {string} themeIds list of theme ids
 * @returns {boolean} True if the theme is externally managed.
 */
export function hasExternallyManagedThemes( state = {}, themeIds: string[] ): boolean {
	return themeIds.some( ( themeId ) => isExternallyManagedTheme( state, themeId ) );
}
