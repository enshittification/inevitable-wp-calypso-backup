import {
	getPlan,
	PLAN_BUSINESS,
	PLAN_BUSINESS_MONTHLY,
	PLAN_ECOMMERCE,
	PLAN_ECOMMERCE_MONTHLY,
	TYPE_BUSINESS,
	TYPE_ECOMMERCE,
} from '@automattic/calypso-products';
import { Button } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ActionCard from 'calypso/components/action-card';
import ActionPanelLink from 'calypso/components/action-panel/link';
import DocumentHead from 'calypso/components/data/document-head';
import FixedNavigationHeader from 'calypso/components/fixed-navigation-header';
import FormattedHeader from 'calypso/components/formatted-header';
import MainComponent from 'calypso/components/main';
import PromoSection, { Props as PromoSectionProps } from 'calypso/components/promo-section';
import { useWPCOMPlugin } from 'calypso/data/marketplace/use-wpcom-plugins-query';
import { Gridicon } from 'calypso/devdocs/design/playground-scope';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import PlansFeaturesMain from 'calypso/my-sites/plans-features-main';
import { MarketplaceFooter } from 'calypso/my-sites/plugins/education-footer';
import { MARKETPLACE_FLOW } from 'calypso/my-sites/plugins/flows';
import { appendBreadcrumb } from 'calypso/state/breadcrumb/actions';
import { getBreadcrumbs } from 'calypso/state/breadcrumb/selectors';
import { getProductsList } from 'calypso/state/products-list/selectors';
import { getSelectedSite } from 'calypso/state/ui/selectors';
import CTAButton from '../plugin-details-CTA/CTA-button';

import './style.scss';

const Plans = ( {
	intervalType,
	pluginSlug,
}: {
	intervalType: 'yearly' | 'monthly';
	pluginSlug: string;
} ) => {
	const translate = useTranslate();
	const breadcrumbs = useSelector( getBreadcrumbs );
	const selectedSite = useSelector( getSelectedSite );

	const dispatch = useDispatch();

	const currentPlanSlug = selectedSite?.plan?.product_slug;
	let currentPlanType = null;
	if ( currentPlanSlug ) {
		currentPlanType = getPlan( currentPlanSlug )?.type;
	}

	useEffect( () => {
		if ( breadcrumbs.length === 0 ) {
			dispatch(
				appendBreadcrumb( {
					label: translate( 'Plugins' ),
					href: `/plugins/${ selectedSite?.slug || '' }`,
					id: 'plugins',
					helpBubble: translate(
						'Add new functionality and integrations to your site with plugins.'
					),
				} )
			);
		}

		dispatch(
			appendBreadcrumb( {
				label: translate( 'Plan Upgrade' ),
				href: `/plugins/plans/${ intervalType }/${ selectedSite?.slug || '' }`,
				id: `plugin-plans`,
			} )
		);
	}, [ dispatch, translate, selectedSite, breadcrumbs.length, intervalType ] );

	const isMarketplaceProduct = true;

	const productsList = useSelector( getProductsList );
	const isProductListFetched = Object.values( productsList ).length > 0;
	const {
		data: plugin,
		// isFetched: isWpComPluginFetched,
		// isFetching: isWpComPluginFetching,
	} = useWPCOMPlugin( pluginSlug, { enabled: isProductListFetched && isMarketplaceProduct } );
	const promos: PromoSectionProps = {
		promos: [
			{
				title: translate( 'Flex your site with plugins' ),
				body: translate(
					'Install plugins and extend functionality for your site with access to more than 50,000 plugins.'
				),
				image: <Gridicon icon="plugins" />,
			},
			{
				title: translate( 'Money back guarantee' ),
				body: translate(
					'Try WordPress.com for 14 days and if you are not 100% satisfied, get your money back.'
				),
				image: <Gridicon icon="money" />,
			},
			{
				title: translate( 'Essential features' ),
				body: translate(
					"We guarantee site's performance and protect it from spammers detailing all activity records."
				),
				image: <Gridicon icon="plans" />,
			},
		],
	};

	return (
		<MainComponent className="plugin-plans-main" wideLayout>
			<PageViewTracker path="/plugins/plans/:interval/:site" title="Plugins > Plan Upgrade" />
			<DocumentHead title={ translate( 'Plugins > Plan Upgrade' ) } />
			<FixedNavigationHeader navigationItems={ breadcrumbs } />
			<FormattedHeader
				className="plugin-plans-header"
				headerText={ `Your current plan doesn't support plugins` }
				subHeaderText={ `Choose the plan that's right for you and reimagine what's possible with plugins` }
				brandFont
			/>

			<div className="plugins-plans">
				<PlansFeaturesMain
					basePlansPath={ '/plugins/plans/' + pluginSlug }
					showFAQ={ false }
					site={ selectedSite }
					intervalType={ intervalType }
					selectedPlan={ PLAN_BUSINESS }
					planTypes={ [ currentPlanType, TYPE_BUSINESS, TYPE_ECOMMERCE ] }
					flowName={ MARKETPLACE_FLOW }
					shouldShowPlansFeatureComparison
					isReskinned
					customRender={ {
						topButtons: [
							<td
								key="current-action"
								className="plan-features-comparison__table-item is-top-buttons"
							>
								<Button className="button plan-features__actions-button is-current" disabled>
									{ translate( 'Your current plan' ) }
								</Button>
							</td>,
							<td
								key="business-action"
								className="plan-features-comparison__table-item is-top-buttons"
							>
								{ plugin ? (
									<CTAButton
										plugin={ plugin }
										hasEligibilityMessages={ [] }
										disabled={ false }
										plansPage={ false }
										desiredPlan={
											intervalType === 'monthly' ? PLAN_BUSINESS_MONTHLY : PLAN_BUSINESS
										}
										buttonText={ translate( 'Upgrade to Business' ) }
										buttonClassName="button plan-features__actions-button is-business-plan"
									/>
								) : (
									<Button
										className="button plan-features__actions-button is-business-plan"
										primary
										href={ `/checkout/${ selectedSite?.slug }/${
											intervalType === 'monthly' ? PLAN_BUSINESS_MONTHLY : PLAN_BUSINESS
										}` }
									>
										{ translate( 'Upgrade to Business' ) }
									</Button>
								) }
							</td>,
							<td
								key="ecommerce-action"
								className="plan-features-comparison__table-item is-top-buttons"
							>
								{ plugin ? (
									<CTAButton
										plugin={ plugin }
										hasEligibilityMessages={ [] }
										disabled={ false }
										plansPage={ false }
										desiredPlan={
											intervalType === 'monthly' ? PLAN_ECOMMERCE_MONTHLY : PLAN_ECOMMERCE
										}
										buttonText={ translate( 'Upgrade to Ecommerce' ) }
										buttonClassName="button plan-features__actions-button is-ecommerce-plan"
									/>
								) : (
									<Button
										className="button plan-features__actions-button is-ecommerce-plan"
										href={ `/checkout/${ selectedSite?.slug }/${
											intervalType === 'monthly' ? PLAN_ECOMMERCE_MONTHLY : PLAN_ECOMMERCE
										}` }
									>
										{ translate( 'Upgrade to eCommerce' ) }
									</Button>
								) }
							</td>,
						],
					} }
				/>
			</div>

			<PromoSection { ...promos } />

			<ActionCard
				classNames="plugin-plans"
				headerText=""
				mainText={ translate(
					'Need some help? Let us help you find the perfect plan for your site. {{a}}Chat now{{/a}} or {{a}}contact our support{{/a}}.',
					{
						components: {
							a: <ActionPanelLink href="/help/contact" />,
						},
					}
				) }
				children={
					plugin ? (
						<CTAButton
							plugin={ plugin }
							hasEligibilityMessages={ [] }
							disabled={ false }
							plansPage={ false }
							desiredPlan={ intervalType === 'monthly' ? PLAN_BUSINESS_MONTHLY : PLAN_BUSINESS }
							buttonText={ translate( 'Upgrade to Business' ) }
						/>
					) : (
						<Button
							className="button plan-features__actions-button is-business-plan"
							primary
							href={ `/checkout/${ selectedSite?.slug }/${
								intervalType === 'monthly' ? PLAN_BUSINESS_MONTHLY : PLAN_BUSINESS
							}` }
						>
							{ translate( 'Upgrade to Business' ) }
						</Button>
					)
				}
				buttonPrimary={ true }
				buttonDisabled={ false }
			/>
			<MarketplaceFooter />
		</MainComponent>
	);
};

export default Plans;
