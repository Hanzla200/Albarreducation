import { factories } from '@strapi/strapi';

const isAdmin = (user: any) =>
  user?.email === process.env.ADMIN_EMAIL || user?.username === 'admin';

export default factories.createCoreController('api::review.review', ({ strapi }) => ({
  async find(ctx: any) {
    if (!ctx.state.user) return ctx.unauthorized('Login required.');
    return super.find(ctx);
  },

  async create(ctx: any) {
    if (!ctx.state.user) return ctx.unauthorized('Login required.');
    const result = await super.create(ctx);
    const reviewId = result?.data?.id;

    if (reviewId) {
      await strapi.db.query('api::review.review').update({
        where: { id: reviewId },
        data: {
          users_permissions_user: ctx.state.user.id,
        },
      });
    }

    return result;
  },

  async update(ctx: any) {
    if (!ctx.state.user) return ctx.unauthorized('Login required.');
    if (!isAdmin(ctx.state.user)) return ctx.forbidden('Only an admin can update comments.');
    return super.update(ctx);
  },

  async delete(ctx: any) {
    if (!ctx.state.user) return ctx.unauthorized('Login required.');
    if (!isAdmin(ctx.state.user)) return ctx.forbidden('Only an admin can delete comments.');
    return super.delete(ctx);
  },
}));
