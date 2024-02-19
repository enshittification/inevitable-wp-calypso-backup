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
	intent?: PlansIntent;
	selectedFeature?: string | null;
	showLegacyStorageFeature?: boolean;
	hiddenPlans: HiddenPlans;
	eligibleForFreeHostingTrial: boolean;
	useFreeTrialPlanSlugs: UseFreeTrialPlanSlugs;
	term?: ( typeof TERMS_LIST )[ number ];
	selectedPlan?: PlanSlug;
	sitePlanSlug?: PlanSlug | null;
	useCheckPlanAvailabilityForPurchase: UseCheckPlanAvailabilityForPurchase;
	storageAddOns: ( AddOnMeta | null )[];
	coupon?: string;
	isSubdomainNotGenerated: boolean;
	siteId?: number | null;
	isDisplayingPlansNeededForFeature: boolean;
}

const useGridPlansForComparisonGrid = ( {
	allFeaturesList,
	intent,
	selectedFeature,
	showLegacyStorageFeature,
	hiddenPlans,
	eligibleForFreeHostingTrial,
	useFreeTrialPlanSlugs,
	term,
	selectedPlan,
	sitePlanSlug,
	useCheckPlanAvailabilityForPurchase,
	storageAddOns,
	coupon,
	isSubdomainNotGenerated,
	siteId,
	isDisplayingPlansNeededForFeature,
}: Params ): GridPlan[] => {
	const gridPlans = useGridPlans( {
		allFeaturesList,
		useFreeTrialPlanSlugs,
		selectedFeature,
		intent,
		term,
		selectedPlan,
		sitePlanSlug,
		useCheckPlanAvailabilityForPurchase,
		storageAddOns,
		coupon,
		hiddenPlans,
		eligibleForFreeHostingTrial,
		showLegacyStorageFeature,
		isSubdomainNotGenerated,
		selectedSiteId: siteId,
		isDisplayingPlansNeededForFeature,
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
			return [];
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
