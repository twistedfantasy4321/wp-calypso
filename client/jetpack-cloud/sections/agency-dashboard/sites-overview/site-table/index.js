import TextPlaceholder from 'calypso/jetpack-cloud/sections/partner-portal/text-placeholder';
import SiteActions from '../site-actions';
import './style.scss';

const SiteTable = ( { isFetching, columns, sites } ) => {
	return (
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
									<SiteActions isLargeScreen site={ site } />
								</td>
							</tr>
						);
					} )
				) }
			</tbody>
		</table>
	);
};

export default SiteTable;
