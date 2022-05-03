import { Card, Gridicon } from '@automattic/components';
import { useState } from 'react';
import './style.scss';
import TableActions from '../site-actions';

const SiteCard = ( { rows, columns } ) => {
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
				<TableActions site={ site } />
			</div>

			{ isExpanded && (
				<div className="site-card__expanded-content">
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
