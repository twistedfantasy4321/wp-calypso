import { Gridicon } from '@automattic/components';
import { useState, createRef, useEffect, useCallback } from 'react';
import './style.scss';

const SiteActions = ( { isLargeScreen, site } ) => {
	const [ isOpen, setIsOpen ] = useState( false );

	const ref = createRef();

	const showActions = () => {
		setIsOpen( true );
	};

	const closeDropdown = () => {
		setIsOpen( false );
	};

	const handleOutsideClick = useCallback(
		( event ) => {
			if ( ! ref?.current?.contains( event.target ) ) {
				closeDropdown();
			}
		},
		[ ref ]
	);

	useEffect( () => {
		return () => window.removeEventListener( 'click', handleOutsideClick );
	}, [ handleOutsideClick ] );

	useEffect( () => {
		if ( isOpen ) {
			window.addEventListener( 'click', handleOutsideClick );
		} else {
			window.removeEventListener( 'click', handleOutsideClick );
		}
	}, [ handleOutsideClick, isOpen ] );

	const siteUrl = site?.value?.url;
	const siteError = site?.error;
	const siteId = site?.value?.blog_id;

	const tableActions = (
		<>
			<Gridicon icon="ellipsis" size={ 18 } className="site-actions__all-actions" />
			{ isOpen && (
				<div className="site-actions__action-menu">
					<ul className="site-actions__action-menu-list">
						{ ! siteError && (
							<>
								<a href={ `/partner-portal/issue-license/?site_id=${ siteId }` }>
									<li>
										Issue new license
										<Gridicon
											icon="chevron-right"
											className="site-actions__table-action-icon"
											size={ 18 }
										/>
									</li>
								</a>
								<a href={ `/activity-log/${ siteUrl }` }>
									<li>
										View activity
										<Gridicon
											icon="chevron-right"
											className="site-actions__table-action-icon"
											size={ 18 }
										/>
									</li>
								</a>
							</>
						) }
						<a href={ `https://${ siteUrl }/` }>
							<li>
								View site
								<Gridicon icon="external" className="site-actions__table-action-icon" size={ 18 } />
							</li>
						</a>
						<a href={ `https://${ siteUrl }/wp-admin/admin.php?page=jetpack#/dashboard` }>
							<li>
								Visit WP Admin
								<Gridicon icon="external" className="site-actions__table-action-icon" size={ 18 } />
							</li>
						</a>
					</ul>
				</div>
			) }
		</>
	);

	return isLargeScreen ? (
		<div
			onClick={ showActions }
			onKeyPress={ showActions }
			role="button"
			tabIndex="0"
			ref={ ref }
			className="site-actions__actions-large-screen"
		>
			{ tableActions }
		</div>
	) : (
		<span
			onClick={ showActions }
			onKeyPress={ showActions }
			role="button"
			tabIndex="0"
			ref={ ref }
			className="site-actions__actions-small-screen"
		>
			{ tableActions }
		</span>
	);
};

export default SiteActions;
