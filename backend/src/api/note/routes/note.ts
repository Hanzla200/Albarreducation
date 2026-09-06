/**
 * note router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::note.note', {
	config: {
		create: { policies: ['global::is-admin'] },
		update: { policies: ['global::is-admin'] },
		delete: { policies: ['global::is-admin'] },
	},
});
