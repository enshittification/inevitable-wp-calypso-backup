import { localizeUrl } from '@automattic/i18n-utils';

export const links = {
	activity_log: 'https://jetpack.com/features/security/activity-log/',
	ad_network: 'https://jetpack.com/features/traffic/ads/',
	akismet_antispam: localizeUrl( 'https://jetpack.com/upgrade/anti-spam/' ),
	auto_plugin_updates: 'https://jetpack.com/features/security/automatic-plugin-updates/',
	backup: localizeUrl( 'https://jetpack.com/upgrade/backup/' ),
	boost: localizeUrl( 'https://jetpack.com/boost/' ),
	brute_force_attack_protection:
		'https://jetpack.com/features/security/brute-force-attack-protection/',
	cdn: 'https://jetpack.com/features/traffic/content-delivery-network/',
	connect_free: 'https://wordpress.com/jetpack/connect/',
	contact_forms: 'https://jetpack.com/features/discussion/contact-forms/',
	crm: 'https://jetpackcrm.com/',
	downtime_monitoring: 'https://jetpack.com/features/security/downtime-monitoring/',
	features: 'https://jetpack.com/support/features',
	galleries_and_slideshows: 'https://jetpack.com/features/design/galleries-and-slideshows/',
	google_analytics: 'https://jetpack.com/features/growth/google-analytics/',
	lazy_image_loading: 'https://jetpack.com/lazy-loading-images-for-wordpress/',
	mobile_app: localizeUrl(
		'https://apps.wordpress.com/get?utm_source=jetpack-com-comparison-tables&amp;utm_medium=direct&amp;utm_campaign=get-apps-promo'
	),
	payments_block: 'https://jetpack.com/support/jetpack-blocks/payments-block/',
	priority_support: 'https://jetpack.com/features/security/expert-priority-support/',
	related_posts: 'https://jetpack.com/features/traffic/related-posts/',
	scan: localizeUrl( 'https://jetpack.com/upgrade/scan/' ),
	search: localizeUrl( 'https://jetpack.com/upgrade/search/' ),
	secure_authentication: 'https://jetpack.com/features/security/secure-authentication/',
	seo: 'https://jetpack.com/features/traffic/search-engine-optimization/',
	social: localizeUrl( 'https://jetpack.com/social/' ),
	stats: localizeUrl( 'https://jetpack.com/stats/' ),
	subscriptions: 'https://jetpack.com/features/discussion/subscriptions/',
	themes: 'https://jetpack.com/features/design/themes/',
	videopress: 'https://jetpack.com/features/writing/video-hosting/',
} as const;
