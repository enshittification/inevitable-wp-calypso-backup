import { __experimentalNavigatorProvider as NavigatorProvider } from '@wordpress/components';
import classNames from 'classnames';
import { useTranslate } from 'i18n-calypso';
import JetpackIcons from 'calypso/components/jetpack/sidebar/menu-items/jetpack-icons';
import SiteSelector from 'calypso/components/site-selector';
import Sidebar, {
	SidebarV2Main as SidebarMain,
	SidebarV2Footer as SidebarFooter,
	SidebarNavigatorMenuItem,
} from 'calypso/layout/sidebar-v2';
import { useDispatch, useSelector } from 'calypso/state';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { hasJetpackPartnerAccess } from 'calypso/state/partner-portal/partner/selectors';
import getJetpackAdminUrl from 'calypso/state/sites/selectors/get-jetpack-admin-url';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import SidebarHeader from './header';
import JetpackManageSidebarMenu from './menu/jetpack-manage';
import ManageSelectedSiteSidebarMenu from './menu/manage-selected-site';
import PurchasesSidebarMenu from './menu/purchases';

import './style.scss';

type Props = {
	className?: string;
	isJetpackManage?: boolean;
	path: string;
	initialPath: string;
};

const JetpackCloudSidebar = ( { className, isJetpackManage, path, initialPath }: Props ) => {
	const siteId = useSelector( ( state ) => getSelectedSiteId( state ) );
	const jetpackAdminUrl = useSelector( ( state ) =>
		siteId ? getJetpackAdminUrl( state, siteId ) : null
	);

	const canAccessJetpackManage = useSelector( hasJetpackPartnerAccess );

	const translate = useTranslate();
	const dispatch = useDispatch();

	return (
		<Sidebar className={ classNames( 'jetpack-cloud-sidebar', className ) }>
			<SidebarHeader forceAllSitesView={ isJetpackManage } />

			<SidebarMain>
				<NavigatorProvider className="sidebar-v2__navigator" initialPath={ initialPath }>
					<JetpackManageSidebarMenu path={ path } />
					<ManageSelectedSiteSidebarMenu path={ path } />
					<PurchasesSidebarMenu path={ path } />
				</NavigatorProvider>
			</SidebarMain>

			<SidebarFooter className="jetpack-cloud-sidebar__footer">
				<ul>
					{ ! isJetpackManage && jetpackAdminUrl && (
						<SidebarNavigatorMenuItem
							isExternalLink
							title={ translate( 'WP Admin' ) }
							link={ jetpackAdminUrl }
							path={ jetpackAdminUrl }
							icon={ <JetpackIcons icon="wordpress" /> }
							onClickMenuItem={ () => {
								dispatch( recordTracksEvent( 'calypso_jetpack_sidebar_wp_admin_link_click' ) );
							} }
						/>
					) }
					<SidebarNavigatorMenuItem
						isExternalLink
						title={ translate( 'Get help', {
							comment: 'Jetpack Cloud sidebar navigation item',
						} ) }
						link="https://jetpack.com/support"
						path=""
						icon={ <JetpackIcons icon="help" /> }
						onClickMenuItem={ () => {
							dispatch(
								recordTracksEvent( 'calypso_jetpack_sidebar_menu_click', {
									menu_item: 'Jetpack Cloud / Support',
								} )
							);
						} }
					/>
				</ul>
			</SidebarFooter>

			<SiteSelector
				showAddNewSite
				showAllSites={ canAccessJetpackManage }
				isJetpackAgencyDashboard={ isJetpackManage }
				className="jetpack-cloud-sidebar__site-selector"
				allSitesPath="/dashboard"
				siteBasePath="/landing"
				wpcomSiteBasePath="https://wordpress.com/home"
			/>
		</Sidebar>
	);
};

export default JetpackCloudSidebar;
