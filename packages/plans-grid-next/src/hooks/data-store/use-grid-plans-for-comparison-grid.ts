import {
	FeatureList,
	PLAN_ENTERPRISE_GRID_WPCOM,
	PLAN_HOSTING_TRIAL_MONTHLY,
	PlanSlug,
	TERMS_LIST,
} from '@automattic/calypso-products';
import { AddOnMeta } from '@automattic/data-stores';
import { UseCheckPlanAvailabilityForPurchase } from '@automattic/data-stores/src/plans';
import { useMemo } from '@wordpress/element';
import { GridPlan, HiddenPlans, PlansIntent } from '../../types';
import useGridPlans, { UseFreeTrialPlanSlugs } from './use-grid-plans';
import useRestructuredPlanFeaturesForComparisonGrid from './use-restructured-plan-features-for-comparison-grid';

const HIDDEN_PLANS = [ PLAN_HOSTING_TRIAL_MONTHLY, PLAN_ENTERPRISE_GRID_WPCOM ];

interface Params {
	allFeaturesList: FeatureList;
	coupon?: string;
	eligibleForFreeHostingTrial: boolean;
	hiddenPlans?: HiddenPlans;
	intent?: PlansIntent;
	isDisplayingPlansNeededForFeature: boolean;
	isSubdomainNotGenerated: boolean;
	selectedFeature?: string | null;
	selectedPlan?: PlanSlug;
	showLegacyStorageFeature?: boolean;
	siteId?: number | null;
	storageAddOns: ( AddOnMeta | null )[];
	term?: ( typeof TERMS_LIST )[ number ];
	useCheckPlanAvailabilityForPurchase: UseCheckPlanAvailabilityForPurchase;
	useFreeTrialPlanSlugs: UseFreeTrialPlanSlugs;
}

const useGridPlansForComparisonGrid = ( {
	allFeaturesList,
	coupon,
	eligibleForFreeHostingTrial,
	hiddenPlans,
	intent,
	isDisplayingPlansNeededForFeature,
	isSubdomainNotGenerated,
	selectedFeature,
	selectedPlan,
	showLegacyStorageFeature,
	siteId,
	storageAddOns,
	term,
	useCheckPlanAvailabilityForPurchase,
	useFreeTrialPlanSlugs,
}: Params ): GridPlan[] | null => {
	const gridPlans = useGridPlans( {
		allFeaturesList,
		coupon,
		eligibleForFreeHostingTrial,
		hiddenPlans,
		intent,
		isDisplayingPlansNeededForFeature,
		isSubdomainNotGenerated,
		selectedFeature,
		selectedPlan,
		selectedSiteId: siteId,
		showLegacyStorageFeature,
		storageAddOns,
		term,
		useCheckPlanAvailabilityForPurchase,
		useFreeTrialPlanSlugs,
	} );

	const planFeaturesForComparisonGrid = useRestructuredPlanFeaturesForComparisonGrid( {
		gridPlans: gridPlans || [],
		allFeaturesList,
		intent,
		selectedFeature,
		showLegacyStorageFeature,
	} );

	return useMemo( () => {
		if ( ! gridPlans ) {
			return null;
		}

		return gridPlans.reduce( ( acc, gridPlan ) => {
			if ( gridPlan.isVisible && ! HIDDEN_PLANS.includes( gridPlan.planSlug ) ) {
				return [
					...acc,
					{
						...gridPlan,
						features: planFeaturesForComparisonGrid[ gridPlan.planSlug ],
					},
				];
			}

			return acc;
		}, [] as GridPlan[] );
	}, [ gridPlans, planFeaturesForComparisonGrid ] );
};

export default useGridPlansForComparisonGrid;
