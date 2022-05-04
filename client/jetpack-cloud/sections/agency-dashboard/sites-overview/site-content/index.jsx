import { useTranslate } from 'i18n-calypso';
import { useSelector } from 'react-redux';
import QueryJetpackAgencyDashboardSites from 'calypso/components/data/query-jetpack-agency-dashboard-sites';
import './style.scss';
import {
	isFetchingSites,
	hasFetchedSites,
	getCurrentSites,
	getSitesRequestError,
} from 'calypso/state/agency-dashboard/sites/selectors';
import SiteCard from '../site-card';
import SiteTable from '../site-table';
import { getFormattedSites } from '../utils';

const SiteContent = () => {
	const translate = useTranslate();

	const hasFetched = useSelector( hasFetchedSites );
	const isFetching = useSelector( isFetchingSites );
	const allSites = useSelector( getCurrentSites );
	const isFetchingFailed = useSelector( getSitesRequestError );

	const sites = hasFetched && getFormattedSites( allSites );

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
				<SiteTable isFetching={ isFetching } columns={ columns } sites={ sites } />
				<div className="site-content__mobile-view">
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

export default SiteContent;
