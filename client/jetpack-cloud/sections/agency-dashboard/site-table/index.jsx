import { Card, Gridicon } from '@automattic/components';
import classnames from 'classnames';
import { useTranslate } from 'i18n-calypso';
import { useState } from 'react';
import TextPlaceholder from 'calypso/jetpack-cloud/sections/partner-portal/text-placeholder';
import './style.scss';

const SiteCard = ( { rows, columns } ) => {
	const tableActions = (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M9.75 9L8.25 9M14.25 9L12.75 9M5.25 9L3.75 9" stroke="#1E1E1E" strokeWidth="1.5" />
		</svg>
	);

	const [ isExpanded, setIsExpanded ] = useState( false );

	const toggleIsExpanded = () => {
		setIsExpanded( ! isExpanded );
	};

	const toggleContent = isExpanded ? (
		<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12.5 7L6.99998 2L1.5 7" stroke="#1E1E1E" strokeWidth="1.5" />
		</svg>
	) : (
		<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M1.50002 1L7.00002 6L12.5 1" stroke="#1E1E1E" strokeWidth="1.5" />
		</svg>
	);

	return (
		<Card compact>
			<div className="site-table__row">
				{ Object.keys( rows ).map( ( key, index ) => {
					if ( rows[ key ].formatter ) {
						return index === 1 ? (
							<div className="site-table__row-data site-table__first-row" key={ index }>
								<span onClick={ toggleIsExpanded } className="site-table__small-screen">
									{ toggleContent }
									{ rows[ key ].formatter( rows ) }
								</span>
								<span className="site-table__actions-large-screen">
									{ rows[ key ].formatter( rows ) }
								</span>
								<span className="site-table__actions-small-screen">{ tableActions }</span>
							</div>
						) : (
							<div
								className={ classnames(
									'site-table__row-data',
									isExpanded && 'site-table__show-row-data'
								) }
								key={ index }
							>
								<span className="site-table__columns-small-screen">{ columns[ key ] }</span>
								{ rows[ key ].formatter( rows ) }
							</div>
						);
					}
				} ) }
				<div className="site-table__actions-large-screen">{ tableActions }</div>
			</div>
		</Card>
	);
};

const SiteTable = () => {
	const translate = useTranslate();

	const getLinks = ( type, status, siteName ) => {
		let link = '';
		switch ( type ) {
			case 'backup': {
				if ( status === 'inactive' ) {
					link = '/partner-portal/issue-license';
				} else {
					link = `/backup/${ siteName }`;
				}
				break;
			}
			case 'scan': {
				if ( status === 'inactive' ) {
					link = '/partner-portal/issue-license';
				} else {
					link = `/scan/${ siteName }`;
				}
				break;
			}
			case 'monitor': {
				if ( status === 'failed' ) {
					link = `https://jptools.wordpress.com/debug/?url=${ siteName }`;
				}
				break;
			}
			case 'plugins': {
				if ( status === 'warning' ) {
					link = `https://wordpress.com/plugins/updates/${ siteName }`;
				}
				break;
			}
			default: {
				break;
			}
		}
		return link;
	};

	const statusFormatter = ( { value, status }, link ) => {
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
				content = (
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M17.3274 7.53073L10.5767 16.6097L6.66221 13.6991"
							stroke="#1E1E1E"
							strokeWidth="1.5"
						/>
					</svg>
				);
				break;
			}
			case 'active': {
				content = (
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<line x1="7" y1="12.25" x2="17" y2="12.25" stroke="#1E1E1E" strokeWidth="1.5" />
					</svg>
				);
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
						<svg
							width="10"
							height="10"
							viewBox="0 0 10 10"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M0.5 5H9.5" stroke="#787C82" strokeWidth="1.125" />
							<path d="M5 0.5L5 9.5" stroke="#787C82" strokeWidth="1.125" />
						</svg>

						<span>ADD</span>
					</span>
				);
				break;
			}
			default: {
				break;
			}
		}
		return link ? <a href={ link }>{ content }</a> : content;
	};

	const getRowMetaData = ( rows, type ) => {
		const row = rows[ type ];
		const siteName = rows.siteName.value;
		const link = getLinks( type, row.status, siteName );
		return {
			row,
			link,
		};
	};

	const siteFormatter = ( rows ) => {
		const { row } = getRowMetaData( rows, 'siteName' );
		let content;
		switch ( row.status ) {
			case 'critical': {
				content = (
					<>
						<span className="site-table__row-text">{ row.value }</span>
						<span className="site-table__status site-table__status-critical">
							<svg
								width="18"
								height="18"
								viewBox="0 0 18 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15Z"
									stroke="white"
									strokeWidth="1.125"
								/>
								<path d="M9.75 5.25H8.25V9.75H9.75V5.25Z" fill="white" />
								<path d="M9.75 11.25H8.25V12.75H9.75V11.25Z" fill="white" />
							</svg>
							<span>{ row.error }</span>
						</span>
					</>
				);
				break;
			}
			default: {
				content = <span className="site-table__row-text">{ row.value }</span>;
				break;
			}
		}
		return content;
	};

	const backupFormatter = ( rows ) => {
		const { link, row } = getRowMetaData( rows, 'backup' );
		return statusFormatter( row, link );
	};
	const scanFormatter = ( rows ) => {
		const { link, row } = getRowMetaData( rows, 'scan' );
		return statusFormatter( row, link );
	};
	const monitorFormatter = ( rows ) => {
		const { link, row } = getRowMetaData( rows, 'monitor' );
		return statusFormatter( row, link );
	};
	const pluginsFormatter = ( rows ) => {
		const { link, row } = getRowMetaData( rows, 'plugins' );
		return statusFormatter( row, link );
	};

	const sites = {
		isSuccess: true,
		isLoading: false,
		isError: false,
		data: {
			items: [
				{
					id: 'test',
					siteName: {
						value: 'selective-marlin.jurassic.ninja',
						status: 'critical',
						error: 'FIX CONNECTION',
						formatter: siteFormatter,
					},
					backup: { value: 'FAILED', status: 'failed', formatter: backupFormatter },
					scan: { value: '3 THREATS', status: 'success', formatter: scanFormatter },
					monitor: { value: 'SITE DOWN', status: 'failed', formatter: monitorFormatter },
					plugins: {
						value: '2 AVAILABLE',
						status: 'warning',
						formatter: pluginsFormatter,
					},
				},
				{
					id: 'test2',
					siteName: {
						value: 'selective-marlin.jurassic.ninja',
						status: 'critical',
						error: 'FIX CONNECTION',
						formatter: siteFormatter,
					},
					backup: { value: 'FAILED', status: 'progress', formatter: backupFormatter },
					scan: { value: '3 THREATS', status: 'inactive', formatter: scanFormatter },
					monitor: { value: 'SITE DOWN', status: 'active', formatter: monitorFormatter },
					plugins: {
						value: '2 AVAILABLE',
						status: 'success',
						formatter: pluginsFormatter,
					},
				},
			],
		},
	};

	const columns = {
		site: translate( 'Site' ),
		backup: translate( 'Backup' ),
		scan: translate( 'Scan' ),
		monitor: translate( 'Monitor' ),
		plugins: translate( 'Plugins' ),
	};

	return (
		<div className="site-table">
			<Card compact className="site-table__header">
				<div className="site-table__row">
					{ Object.values( columns ).map( ( column, index ) => (
						<div key={ index }>{ column }</div>
					) ) }
					<div />
				</div>
			</Card>

			{ sites.isSuccess &&
				sites.data.items.map( ( site ) => (
					<SiteCard key={ site.id } rows={ site } columns={ columns } />
				) ) }

			{ ! sites.isSuccess && (
				<Card compact>
					<div className="site-table__row">
						<div className="site-table__due-date">
							{ sites.isLoading && <TextPlaceholder /> }

							{ sites.isError && <Gridicon icon="minus" /> }
						</div>

						<div className="site-table__status">
							{ sites.isLoading && <TextPlaceholder /> }

							{ sites.isError && <Gridicon icon="minus" /> }
						</div>

						<div className="site-table__total">
							{ sites.isLoading && <TextPlaceholder /> }

							{ sites.isError && <Gridicon icon="minus" /> }
						</div>

						<div className="site-table__download">
							{ sites.isLoading && <TextPlaceholder /> }

							{ sites.isError && <Gridicon icon="minus" /> }
						</div>
					</div>
				</Card>
			) }
		</div>
	);
};

export default SiteTable;
