import SiteTable from './site-table';

export default function SitesOverview() {
	return (
		<div className="sites-overview">
			<div className="sites-overview__heading">My Sites</div>
			<SiteTable />
		</div>
	);
}
