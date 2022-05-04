import SiteContent from './site-content';
import './style.scss';

export default function SitesOverview() {
	return (
		<div className="sites-overview">
			<div className="sites-overview__heading">My Sites</div>
			<SiteContent />
		</div>
	);
}
