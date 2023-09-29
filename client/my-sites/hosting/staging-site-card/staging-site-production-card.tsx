import { isEnabled } from '@automattic/calypso-config';
import { Button, Card, Gridicon } from '@automattic/components';
import styled from '@emotion/styled';
import { useI18n } from '@wordpress/react-i18n';
import { localize } from 'i18n-calypso';
import { useState } from 'react';
import { connect } from 'react-redux';
import CardHeading from 'calypso/components/card-heading';
import InlineSupportLink from 'calypso/components/inline-support-link';
import Notice from 'calypso/components/notice';
import { urlToSlug } from 'calypso/lib/url';
import { LoadingPlaceholder } from 'calypso/my-sites/hosting/staging-site-card/loading-placeholder';
import {
	useProductionSiteDetail,
	ProductionSite,
} from 'calypso/my-sites/hosting/staging-site-card/use-production-site-detail';
import { useDispatch } from 'calypso/state';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { getCurrentUserId } from 'calypso/state/current-user/selectors';
import { IAppState } from 'calypso/state/types';
import { ConfirmationModal } from './confirmation-modal';
import { usePullFromStagingMutation, usePushToStagingMutation } from './use-staging-sync';

const ActionButtons = styled.div( {
	display: 'flex',
	gap: '1em',
} );

const SyncActionsContainer = styled( ActionButtons )( {
	marginTop: 12,
} );

type CardProps = {
	disabled: boolean;
	siteId: number;
	translate: ( text: string, args?: Record< string, unknown > ) => string;
};

function StagingSiteProductionCard( { disabled, siteId, translate }: CardProps ) {
	const { __ } = useI18n();
	const dispatch = useDispatch();
	const [ loadingError, setLoadingError ] = useState( null );
	const isStagingSitesI3Enabled = isEnabled( 'yolo/staging-sites-i3' );
	const { data: productionSite, isLoading } = useProductionSiteDetail( siteId, {
		enabled: ! disabled,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: ( error: any ) => {
			dispatch(
				recordTracksEvent( 'calypso_hosting_configuration_staging_site_load_failure', {
					code: error.code,
				} )
			);
			setLoadingError( error );
		},
	} );

	const { pushToStaging } = usePushToStagingMutation( productionSite?.id as number, siteId, {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: ( error: any ) => {
			dispatch(
				recordTracksEvent( 'calypso_hosting_configuration_staging_site_push_failure', {
					code: error.code,
				} )
			);
			setLoadingError( error );
		},
	} );

	const { pullFromStaging } = usePullFromStagingMutation( productionSite?.id as number, siteId, {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: ( error: any ) => {
			dispatch(
				recordTracksEvent( 'calypso_hosting_configuration_staging_site_pull_failure', {
					code: error.code,
				} )
			);
			setLoadingError( error );
		},
	} );

	const getLoadingErrorContent = ( message: string ) => {
		return (
			<Notice status="is-error" showDismiss={ false }>
				{ message }
			</Notice>
		);
	};

	const getManageStagingSiteContent = ( productionSite: ProductionSite ) => {
		return (
			<>
				<p>
					{ translate(
						'This staging site lets you preview and troubleshoot changes before updating the production site. {{a}}Learn more{{/a}}.',
						{
							components: {
								a: <InlineSupportLink supportContext="hosting-staging-site" showIcon={ false } />,
							},
						}
					) }
				</p>
				<ActionButtons>
					<Button
						primary
						href={ `/hosting-config/${ urlToSlug( productionSite.url ) }` }
						disabled={ disabled }
					>
						<span>{ __( 'Switch to production site' ) }</span>
					</Button>
				</ActionButtons>
				{ isStagingSitesI3Enabled && (
					<SyncActionsContainer>
						<ConfirmationModal
							onConfirm={ pushToStaging }
							modalTitle={ translate( 'Confirm pulling changes from your production site.' ) }
							modalMessage={ translate(
								'Are you sure you want to pull your changes from your production site?'
							) }
							confirmLabel={ translate( 'Pull from production' ) }
							cancelLabel={ translate( 'Cancel' ) }
						>
							<Gridicon icon="arrow-down" />
							<span>{ translate( 'Pull from production' ) }</span>
						</ConfirmationModal>
						<ConfirmationModal
							onConfirm={ pullFromStaging }
							modalTitle={ translate( 'Confirm pushing changes to your production site.' ) }
							modalMessage={ translate(
								'Are you sure you want to push your changes to your production site?'
							) }
							confirmLabel={ translate( 'Push to production' ) }
							cancelLabel={ translate( 'Cancel' ) }
						>
							<Gridicon icon="arrow-up" />
							<span>{ translate( 'Push to production' ) }</span>
						</ConfirmationModal>
					</SyncActionsContainer>
				) }
			</>
		);
	};

	let cardContent;
	if ( ! isLoading && productionSite ) {
		cardContent = getManageStagingSiteContent( productionSite );
	} else if ( isLoading ) {
		cardContent = <LoadingPlaceholder />;
	} else if ( loadingError ) {
		cardContent = getLoadingErrorContent(
			__(
				'Unable to load production site detail. Please contact support if you believe you are seeing this message in error.'
			)
		);
	}
	return (
		<Card className="staging-site-card">
			{
				// eslint-disable-next-line wpcalypso/jsx-gridicon-size
				<Gridicon icon="science" size={ 32 } />
			}
			<CardHeading id="staging-site">{ __( 'Staging site' ) }</CardHeading>
			{ cardContent }
		</Card>
	);
}

export default connect( ( state: IAppState ) => {
	const currentUserId = getCurrentUserId( state );

	return {
		currentUserId,
	};
} )( localize( StagingSiteProductionCard ) );
