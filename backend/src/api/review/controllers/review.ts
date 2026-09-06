import { factories } from '@strapi/strapi';

const isAdmin = (user: any) =>
  user?.email === process.env.ADMIN_EMAIL || user?.username === 'admin';

export default factories.createCoreController('api::review.review', () => ({
  async find(ctx: any) {
    if (!ctx.state.user) return ctx.unauthorized('Login required.');
    return super.find(ctx);
  },

  async create(ctx: any) {
    if (!ctx.state.user) return ctx.unauthorized('Login required.');
    ctx.request.body = ctx.request.body || {};
    ctx.request.body.data = {
      ...(ctx.request.body.data || {}),
      users_permissions_user: ctx.state.user.id,
    };
    return super.create(ctx);
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
