import { Gridicon } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { useSelector } from 'react-redux';
import QueryJetpackAgencyDashboardSites from 'calypso/components/data/query-jetpack-agency-dashboard-sites';
import TextPlaceholder from 'calypso/jetpack-cloud/sections/partner-portal/text-placeholder';
import './style.scss';
import {
	isFetchingSites,
	hasFetchedSites,
	getCurrentSites,
	getSitesRequestError,
} from 'calypso/state/agency-dashboard/sites/selectors';
import TableActions from '../site-actions';
import SiteCard from '../site-card';

const SiteTable = () => {
	const translate = useTranslate();

	const hasFetched = useSelector( hasFetchedSites );
	const isFetching = useSelector( isFetchingSites );
	const allSites = useSelector( getCurrentSites );
	const isFetchingFailed = useSelector( getSitesRequestError );

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
				content = <span className="site-table__status site-table__status-error">{ value }</span>;
				break;
			}
			case 'warning': {
				content = <span className="site-table__status site-table__status-warning">{ value }</span>;
				break;
			}
			case 'success': {
				content = <Gridicon icon="checkmark" size={ 18 } className="site-table__grey-icon" />;
				break;
			}
			case 'active': {
				content = <Gridicon icon="minus-small" size={ 18 } className="site-table__grey-icon" />;
				break;
			}
			case 'progress': {
				content = (
					<svg
						width="20"
						height="8"
						viewBox="0 0 20 8"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							x="0.75"
							y="0.75"
							width="18.5"
							height="6.5"
							rx="3.25"
							stroke="#A7AAAD"
							strokeWidth="1.5"
						/>
						<mask id="path-2-inside-1_2789_78" fill="white">
							<path d="M0 4C0 1.79086 1.79086 0 4 0H16.5L8.5 8H4C1.79086 8 0 6.20914 0 4Z" />
						</mask>
						<path
							d="M0 4C0 1.79086 1.79086 0 4 0H16.5L8.5 8H4C1.79086 8 0 6.20914 0 4Z"
							fill="#A7AAAD"
						/>
						<path
							d="M16.5 0L17.5607 1.06066L20.1213 -1.5H16.5V0ZM8.5 8V9.5H9.12132L9.56066 9.06066L8.5 8ZM4 1.5H16.5V-1.5H4V1.5ZM15.4393 -1.06066L7.43934 6.93934L9.56066 9.06066L17.5607 1.06066L15.4393 -1.06066ZM8.5 6.5H4V9.5H8.5V6.5ZM4 6.5C2.61929 6.5 1.5 5.38071 1.5 4H-1.5C-1.5 7.03757 0.962434 9.5 4 9.5V6.5ZM4 -1.5C0.962434 -1.5 -1.5 0.962434 -1.5 4H1.5C1.5 2.61929 2.61929 1.5 4 1.5V-1.5Z"
							fill="#A7AAAD"
							mask="url(#path-2-inside-1_2789_78)"
						/>
					</svg>
				);
				break;
			}
			case 'inactive': {
				content = (
					<span className="site-table__status site-table__status-add-new">
						<Gridicon icon="plus-small" size={ 18 } />
						<span>{ translate( 'ADD' ) }</span>
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
				<span className="site-table__disabled">{ content } </span>
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
				<span className="site-table__row-text">{ value }</span>
				{ error && (
					<a href={ `https://wordpress.com/settings/disconnect-site/${ value }?type=down` }>
						<span className="site-table__status site-table__status-critical">
							<Gridicon size={ 18 } className="site-table__icon" icon="notice-outline" />
							<span>{ error }</span>
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

	const sites =
		hasFetched &&
		allSites.map( ( site ) => {
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
					value: `${ pluginUpdates.length } ${ translate( 'AVAILABLE' ) }`,
					status: pluginUpdates.length > 0 ? 'warning' : 'active',
					formatter: pluginsFormatter,
				},
			};
		} );

	const columns = {
		site: translate( 'Site' ),
		backup: translate( 'Backup' ),
		scan: translate( 'Scan' ),
		monitor: translate( 'Monitor' ),
		plugins: translate( 'Plugins' ),
	};

	let content;

	if ( isFetching || ( hasFetched && sites.length > 0 && ! isFetchingFailed ) ) {
		content = (
			<>
				<table className="site-table__table">
					<thead>
						<tr>
							{ Object.values( columns ).map( ( column, index ) => (
								<th key={ index }>{ column }</th>
							) ) }
							<th></th>
						</tr>
					</thead>
					<tbody>
						{ isFetching ? (
							<tr>
								{ Object.keys( columns ).map( ( key, index ) => (
									<td key={ index }>
										<TextPlaceholder />
									</td>
								) ) }
								<td>
									<TextPlaceholder />
								</td>
							</tr>
						) : (
							sites.map( ( rows, i ) => {
								const site = rows.site;
								return (
									<tr key={ i }>
										{ Object.keys( rows ).map( ( key, index ) => {
											if ( rows[ key ].formatter ) {
												return index === 1 ? (
													<td key={ index }>
														<span className="site-table__inline-flex">
															{ rows[ key ].formatter( rows ) }
														</span>
													</td>
												) : (
													<td key={ index }>{ rows[ key ].formatter( rows ) }</td>
												);
											}
										} ) }
										<td className="site-table__actions">
											<TableActions isLargeScreen site={ site } />
										</td>
									</tr>
								);
							} )
						) }
					</tbody>
				</table>
				<div className="site-table__mobile-view">
					{ sites.length > 0 &&
						sites.map( ( rows, index ) => (
							<SiteCard key={ index } columns={ columns } rows={ rows } />
						) ) }
				</div>
			</>
		);
	} else if ( isFetchingFailed ) {
		content = <div>Failed to fetch sites</div>;
	} else {
		content = <div>No sites</div>;
	}

	return (
		<>
			<QueryJetpackAgencyDashboardSites />
			{ content }
		</>
	);
};

export default SiteTable;
