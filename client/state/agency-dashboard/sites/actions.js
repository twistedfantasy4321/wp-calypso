import { wpcomJetpackLicensing as wpcomJpl } from 'calypso/lib/wp';
import {
	JETPACK_DASHBOARD_SITES_FETCH,
	JETPACK_DASHBOARD_SITES_FETCH_SUCCESS,
	JETPACK_DASHBOARD_SITES_FETCH_FAILURE,
} from 'calypso/state/action-types';

/**
 * Returns an action thunk that fetches all preferences
 *
 * @returns { Function }                      Action thunk
 */
export function fetchSites() {
	return ( dispatch ) => {
		dispatch( { type: JETPACK_DASHBOARD_SITES_FETCH } );

		return wpcomJpl.req
			.get( {
				path: '/jetpack-partner/dashboard/sites-mock',
				apiNamespace: 'wpcom/v2',
			} )
			.then( ( data ) => {
				dispatch( { type: JETPACK_DASHBOARD_SITES_FETCH_SUCCESS, payload: data } );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: JETPACK_DASHBOARD_SITES_FETCH_FAILURE,
					error,
				} );
			} );
	};
}
