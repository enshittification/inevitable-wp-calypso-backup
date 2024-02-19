import { FeatureList, PlanSlug, TERMS_LIST } from '@automattic/calypso-products';
import { AddOnMeta } from '@automattic/data-stores';
import { UseCheckPlanAvailabilityForPurchase } from '@automattic/data-stores/src/plans';
import { useMemo } from '@wordpress/element';
import { GridPlan, HiddenPlans, PlansIntent } from '../../types';
import useGridPlans, { UseFreeTrialPlanSlugs } from './use-grid-plans';
import usePlanFeaturesForGridPlans from './use-plan-features-for-grid-plans';

interface Params {
	allFeaturesList: FeatureList;
	intent?: PlansIntent;
	isInSignup?: boolean;
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

const useGridPlansForFeaturesGrid = ( {
	allFeaturesList,
	intent,
	isInSignup,
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

	const planFeaturesForFeaturesGrid = usePlanFeaturesForGridPlans( {
		gridPlans: gridPlans || [],
		allFeaturesList,
		intent,
		isInSignup,
		selectedFeature,
		showLegacyStorageFeature,
	} );

	return useMemo( () => {
		if ( ! gridPlans ) {
			return [];
		}

		return gridPlans.reduce( ( acc, gridPlan ) => {
			if ( gridPlan.isVisible ) {
				return [
					...acc,
					{
						...gridPlan,
						features: planFeaturesForFeaturesGrid[ gridPlan.planSlug ],
					},
				];
			}
			return acc;
		}, [] as GridPlan[] );
	}, [ gridPlans, planFeaturesForFeaturesGrid ] );
};

export default useGridPlansForFeaturesGrid;
