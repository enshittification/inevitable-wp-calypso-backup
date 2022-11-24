/* eslint-disable no-console */
import { useEffect } from 'react';
import { useSite } from 'calypso/landing/stepper/hooks/use-site';
import type { Step } from '../../types';

const CheckPlan: Step = function CheckPlan( { navigation } ) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { submit } = navigation;
	const site = useSite();

	alert( '1 ' + JSON.stringify( site?.plan ) );

	useEffect( () => {
		if ( ! site ) {
			return;
		}

		alert( '2 ' + JSON.stringify( site?.plan ) );

		console.log( { site } );
		// submit?.( { currentPlan: site.plan } );

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ site ] );

	return <pre>{ JSON.stringify( site ) }</pre>;
};

export default CheckPlan;
