import { Card, Gridicon } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { useState } from 'react';
import './style.scss';
import SiteActions from '../site-actions';

const SiteCard = ( { rows, columns } ) => {
	const translate = useTranslate();

	const [ isExpanded, setIsExpanded ] = useState( false );

	const toggleIsExpanded = () => {
		setIsExpanded( ! isExpanded );
	};

	const toggleContent = isExpanded ? (
		<Gridicon icon="chevron-up" className="site-card__vertical-align-middle" size={ 18 } />
	) : (
		<Gridicon icon="chevron-down" className="site-card__vertical-align-middle" size={ 18 } />
	);

	const rowKeys = Object.keys( rows );

	const headerItem = rowKeys[ 0 ];
	const expandedContentItems = rowKeys.filter( ( row, index ) => index > 0 );

	const site = rows.site;
	const siteError = site.error;
	const siteUrl = site.value.url;

	return (
		<Card className="site-card__card" compact>
			<div className="site-card__position-relative">
				<span
					onClick={ toggleIsExpanded }
					onKeyPress={ toggleIsExpanded }
					role="button"
					tabIndex="0"
				>
					{ toggleContent }
					{ rows[ headerItem ].formatter( rows ) }
				</span>
				<SiteActions site={ site } />
			</div>

			{ isExpanded && (
				<div className="site-card__expanded-content">
					{ siteError && (
						<div className="site-card__error-container">
							<span className="site-card__error-message">
								{ translate( 'Jetpack could not connect to your site.' ) }
							</span>
							<a
								className="site-card__error-message-link"
								href={ `https://wordpress.com/settings/disconnect-site/${ siteUrl }?type=down` }
							>
								{ translate( 'fix now' ) }
							</a>
						</div>
					) }
					{ expandedContentItems.map( ( key, index ) => {
						if ( rows[ key ].formatter ) {
							return (
								<div className="site-card__expanded-content-list" key={ index }>
									<span className="site-card__expanded-content-key">{ columns[ key ] }</span>
									<span className="site-card__expanded-content-value">
										{ rows[ key ].formatter( rows ) }
									</span>
								</div>
							);
						}
					} ) }
				</div>
			) }
		</Card>
	);
};

export default SiteCard;
