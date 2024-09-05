import { Card } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { useSelector } from 'calypso/state';
import isSiteWpcom from 'calypso/state/selectors/is-site-wpcom';
import isVipSite from 'calypso/state/selectors/is-vip-site';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import AllowList from './allow-list';
import AutomaticRules from './automatic-rules';
import BlockList from './block-list';
import BruteForce from './brute-force';

import './style.scss';

/**
 * Jetpack Web Application Firewall (WAF) Settings Card
 */
export default function FirewallSettings() {
	const translate = useTranslate();

	const siteId = useSelector( getSelectedSiteId );
	const wafSupported = useSelector(
		( state ) => ! siteId || ( ! isSiteWpcom( state, siteId ) && ! isVipSite( state, siteId ) )
	);

	return (
		<div className="firewall">
			<Card compact className="setting-title">
				{ translate( 'Web Application Firewall (WAF)' ) }
			</Card>
			<Card>
				{ wafSupported && <AutomaticRules /> }
				<BruteForce />
				{ wafSupported && <BlockList /> }
			</Card>
			<Card>
				<AllowList />
			</Card>
		</div>
	);
}
