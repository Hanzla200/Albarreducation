import { factories } from '@strapi/strapi';

const isAdmin = (user: any) =>
  user?.email === process.env.ADMIN_EMAIL || user?.username === 'admin';

export default factories.createCoreController('api::order.order', () => ({
  async find(ctx: any) {
    if (!ctx.state.user) return ctx.unauthorized('Login required.');
    if (!isAdmin(ctx.state.user)) {
      ctx.query = {
        ...ctx.query,
        filters: {
          ...(ctx.query?.filters || {}),
          user: { id: { $eq: ctx.state.user.id } },
        },
      };
    }
    return super.find(ctx);
  },

  async findOne(ctx: any) {
    if (!ctx.state.user) return ctx.unauthorized('Login required.');
    const result = await super.findOne(ctx);
    if (!result?.data || isAdmin(ctx.state.user)) return result;
    const ownerId = result.data.attributes?.user?.data?.id ?? result.data.user?.id;
    if (String(ownerId) !== String(ctx.state.user.id)) return ctx.forbidden('Access denied.');
    return result;
  },

  async create(ctx: any) {
    if (!ctx.state.user) return ctx.unauthorized('Login required.');
    ctx.request.body = ctx.request.body || {};
    ctx.request.body.data = {
      ...(ctx.request.body.data || {}),
      user: ctx.state.user.id,
      email: ctx.state.user.email,
    };
    return super.create(ctx);
  },

  async update(ctx: any) {
    if (!ctx.state.user) return ctx.unauthorized('Login required.');
    if (!isAdmin(ctx.state.user)) return ctx.forbidden('Only an admin can update orders.');
    return super.update(ctx);
  },

  async delete(ctx: any) {
    if (!ctx.state.user) return ctx.unauthorized('Login required.');
    if (!isAdmin(ctx.state.user)) return ctx.forbidden('Only an admin can delete orders.');
    return super.delete(ctx);
  },
}));
