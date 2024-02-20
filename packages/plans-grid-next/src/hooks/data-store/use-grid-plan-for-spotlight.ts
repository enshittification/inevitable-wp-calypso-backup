import { getPlanClass } from '@automattic/calypso-products';
import { useMemo } from '@wordpress/element';
import { GridPlan, PlansIntent } from '../../types';

const SPOTLIGHT_ENABLED_INTENTS = [ 'plans-default-wpcom' ];

interface Params {
	gridPlans: GridPlan[];
	intent?: PlansIntent;
	isSpotlightOnCurrentPlan?: boolean;
	sitePlanSlug?: string | null;
}

const useGridPlanForSpotlight = ( {
	gridPlans,
	intent,
	isSpotlightOnCurrentPlan,
	sitePlanSlug,
}: Params ): GridPlan | undefined => {
	return useMemo( () => {
		const isIntentSpotlightEnabled = intent ? SPOTLIGHT_ENABLED_INTENTS.includes( intent ) : false;

		return sitePlanSlug && isSpotlightOnCurrentPlan && isIntentSpotlightEnabled
			? gridPlans.find(
					( { planSlug } ) => getPlanClass( planSlug ) === getPlanClass( sitePlanSlug )
			  )
			: undefined;
	}, [ sitePlanSlug, isSpotlightOnCurrentPlan, intent, gridPlans ] );
};

export default useGridPlanForSpotlight;
