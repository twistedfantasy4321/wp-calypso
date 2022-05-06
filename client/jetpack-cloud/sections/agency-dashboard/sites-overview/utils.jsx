import { Gridicon } from '@automattic/components';
import { translate } from 'i18n-calypso';
import Badge from 'calypso/components/badge';

const getLinks = ( type, status, siteUrl, siteId ) => {
	let link = '';
	switch ( type ) {
		case 'backup': {
			if ( status === 'inactive' ) {
				link = `/partner-portal/issue-license/?site_id=${ siteId }`;
			} else {
				link = `/backup/${ siteUrl }`;
			}
			break;
		}
		case 'scan': {
			if ( status === 'inactive' ) {
				link = `/partner-portal/issue-license/?site_id=${ siteId }`;
			} else {
				link = `/scan/${ siteUrl }`;
			}
			break;
		}
		case 'monitor': {
			if ( status === 'failed' ) {
				link = `https://jptools.wordpress.com/debug/?url=${ siteUrl }`;
			}
			break;
		}
		case 'plugins': {
			if ( status === 'warning' ) {
				link = `https://wordpress.com/plugins/updates/${ siteUrl }`;
			}
			break;
		}
		default: {
			break;
		}
	}
	return link;
};

const statusFormatter = ( { value, status }, link, siteError ) => {
	let content;
	switch ( status ) {
		case 'failed': {
			content = (
				<Badge className="sites-overview__font-size-12px" type="error">
					{ value }
				</Badge>
			);
			break;
		}
		case 'warning': {
			content = (
				<Badge className="sites-overview__font-size-12px" type="warning">
					{ value }
				</Badge>
			);
			break;
		}
		case 'success': {
			content = <Gridicon icon="checkmark" size={ 18 } className="sites-overview__grey-icon" />;
			break;
		}
		case 'active': {
			content = <Gridicon icon="minus-small" size={ 18 } className="sites-overview__icon-active" />;
			break;
		}
		case 'progress': {
			content = (
				<svg
					className="sites-overview__vertical-align-middle"
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle cx="8" cy="8" r="7.25" stroke="black" strokeWidth="1.5" />
					<rect x="7" y="4" width="1.5" height="5" fill="#1E1E1E" />
					<rect
						x="10.8901"
						y="10.77"
						width="1.5"
						height="4"
						transform="rotate(135 10.8901 10.77)"
						fill="#1E1E1E"
					/>
				</svg>
			);
			break;
		}
		case 'inactive': {
			content = (
				<span className="sites-overview__status sites-overview__status-add-new">
					<Gridicon icon="plus-small" size={ 16 } />
					<span>{ translate( 'Add' ) }</span>
				</span>
			);
			break;
		}
		default: {
			break;
		}
	}
	if ( link ) {
		return siteError ? (
			<span className="sites-overview__disabled">{ content } </span>
		) : (
			<a href={ link }>{ content }</a>
		);
	}
	return content;
};

const getRowMetaData = ( rows, type ) => {
	const row = rows[ type ];
	const siteUrl = rows.site?.value?.url;
	const siteError = rows.site?.error;
	const siteId = rows.site?.value?.blog_id;
	const link = getLinks( type, row.status, siteUrl, siteId );
	return {
		row,
		link,
		siteError,
	};
};

const siteFormatter = ( rows ) => {
	const { row } = getRowMetaData( rows, 'site' );
	const site = row.value;
	const value = site.url;
	const error = row.error;
	return (
		<>
			<span className="sites-overview__row-text">{ value }</span>
			{ error && (
				<a href={ `https://wordpress.com/settings/disconnect-site/${ value }?type=down` }>
					<span className="sites-overview__status-critical">
						<Gridicon size={ 24 } icon="notice-outline" />
					</span>
				</a>
			) }
		</>
	);
};

const backupFormatter = ( rows ) => {
	const { link, row, siteError } = getRowMetaData( rows, 'backup' );
	return statusFormatter( row, link, siteError );
};
const scanFormatter = ( rows ) => {
	const { link, row, siteError } = getRowMetaData( rows, 'scan' );
	return statusFormatter( row, link, siteError );
};
const monitorFormatter = ( rows ) => {
	const { link, row, siteError } = getRowMetaData( rows, 'monitor' );
	return statusFormatter( row, link, siteError );
};
const pluginsFormatter = ( rows ) => {
	const { link, row, siteError } = getRowMetaData( rows, 'plugins' );
	return statusFormatter( row, link, siteError );
};

export const getFormattedSites = ( sites ) => {
	return (
		Array.isArray( sites ) &&
		sites.length > 0 &&
		sites.map( ( site ) => {
			const pluginUpdates = site.awaiting_plugin_updates;
			let scanValue = '';
			if ( site.latest_scan_status === 'failed' ) {
				scanValue = translate( 'FAILED' );
				if ( site.latest_scan_threats_found.length > 0 ) {
					scanValue = translate( '%(threats) THREATS', {
						args: {
							threats: site.latest_scan_threats_found.length,
						},
					} );
				}
			}
			let error = '';
			if (
				! site.is_connection_healthy ||
				! site.access_xmlrpc ||
				! site.valid_xmlrpc ||
				! site.authenticated_xmlrpc ||
				! site.has_credentials
			) {
				error = translate( 'FIX CONNECTION' );
			}
			return {
				site: {
					value: site,
					formatter: siteFormatter,
					error,
				},
				backup: {
					value: site.latest_backup_status === 'failed' ? translate( 'FAILED' ) : '',
					status: site.backup_enabled ? site.latest_backup_status : 'inactive',
					formatter: backupFormatter,
				},
				scan: {
					value: scanValue,
					status: site.scan_enabled ? site.latest_scan_status : 'inactive',
					formatter: scanFormatter,
				},
				monitor: {
					value: '',
					status: site.monitor_status === 'accessible' ? 'success' : '',
					formatter: monitorFormatter,
				},
				plugins: {
					value: `${ pluginUpdates.length } ${ translate( 'Available' ) }`,
					status: pluginUpdates.length > 0 ? 'warning' : 'active',
					formatter: pluginsFormatter,
				},
			};
		} )
	);
};

export const errorContent = ( siteUrl ) => {
	return (
		<div className="sites-overview__error-container">
			<span className="sites-overview__error-icon">
				<Gridicon size={ 18 } icon="notice-outline" />
			</span>
			<span className="sites-overview__error-message sites-overview__error-message-large-screen">
				{ translate( 'Jetpack is unable to connect to %(siteUrl)s', {
					args: {
						siteUrl,
					},
				} ) }
			</span>
			<span className="sites-overview__error-message sites-overview__error-message-small-screen">
				{ translate( 'Jetpack is unable to connect' ) }
			</span>
			<a
				className="sites-overview__error-message-link"
				href={ `https://wordpress.com/settings/disconnect-site/${ siteUrl }?type=down` }
			>
				{ translate( 'Fix now' ) }
			</a>
		</div>
	);
};
