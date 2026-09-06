/**
 * book router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::book.book', {
	config: {
		create: { policies: ['global::is-admin'] },
		update: { policies: ['global::is-admin'] },
		delete: { policies: ['global::is-admin'] },
	},
});
