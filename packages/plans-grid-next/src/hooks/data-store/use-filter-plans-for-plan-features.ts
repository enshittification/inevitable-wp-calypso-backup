import {
	isBusinessPlan,
	isEcommercePlan,
	isFreePlan,
	isPersonalPlan,
	isPremiumPlan,
} from '@automattic/calypso-products';
import { useMemo } from '@wordpress/element';
import type { GridPlan, HiddenPlans } from '../../types';

interface Props {
	plans: Omit< GridPlan, 'features' >[];
	isDisplayingPlansNeededForFeature: boolean;
	selectedPlan?: string;
	hiddenPlans: HiddenPlans;
}

const useFilterPlansForPlanFeatures = ( {
	plans,
	isDisplayingPlansNeededForFeature,
	selectedPlan,
	hiddenPlans,
}: Props ) => {
	const { hideFreePlan, hidePersonalPlan, hidePremiumPlan, hideBusinessPlan, hideEcommercePlan } =
		hiddenPlans;

	const filteredPlans = useMemo( () => {
		return isDisplayingPlansNeededForFeature
			? plans.map( ( gridPlan ) => {
					if ( selectedPlan && isEcommercePlan( selectedPlan ) ) {
						return isEcommercePlan( gridPlan.planSlug )
							? gridPlan
							: { ...gridPlan, isVisible: false };
					}

					if ( selectedPlan && isBusinessPlan( selectedPlan ) ) {
						return isBusinessPlan( gridPlan.planSlug ) || isEcommercePlan( gridPlan.planSlug )
							? gridPlan
							: { ...gridPlan, isVisible: false };
					}

					if ( selectedPlan && isPremiumPlan( selectedPlan ) ) {
						return isPremiumPlan( gridPlan.planSlug ) ||
							isBusinessPlan( gridPlan.planSlug ) ||
							isEcommercePlan( gridPlan.planSlug )
							? gridPlan
							: { ...gridPlan, isVisible: false };
					}

					return gridPlan;
			  } )
			: plans;
	}, [ isDisplayingPlansNeededForFeature, plans, selectedPlan ] );

	return useMemo( () => {
		return filteredPlans.map( ( gridPlan ) => {
			if (
				( hideFreePlan && isFreePlan( gridPlan.planSlug ) ) ||
				( hidePersonalPlan && isPersonalPlan( gridPlan.planSlug ) ) ||
				( hidePremiumPlan && isPremiumPlan( gridPlan.planSlug ) ) ||
				( hideBusinessPlan && isBusinessPlan( gridPlan.planSlug ) ) ||
				( hideEcommercePlan && isEcommercePlan( gridPlan.planSlug ) )
			) {
				return { ...gridPlan, isVisible: false };
			}

			return gridPlan;
		} );
	}, [
		filteredPlans,
		hideFreePlan,
		hidePersonalPlan,
		hidePremiumPlan,
		hideBusinessPlan,
		hideEcommercePlan,
	] );
};

export default useFilterPlansForPlanFeatures;
