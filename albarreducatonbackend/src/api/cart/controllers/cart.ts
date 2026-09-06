import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cart.cart', ({ strapi }) => ({
	async create(ctx: any) {
		if (!ctx.state.user) return ctx.unauthorized('Login required.');

		const payload = { ...(ctx.request.body?.data || {}) };
		delete payload.users_permissions_user;

		ctx.request.body = {
			...(ctx.request.body || {}),
			data: payload,
		};

		const result = await super.create(ctx);
		const cartId = result?.data?.id;

		if (cartId) {
			await strapi.db.query('api::cart.cart').update({
				where: { id: cartId },
				data: {
					users_permissions_user: ctx.state.user.id,
				},
			});
		}

		return result;
	},
}));
