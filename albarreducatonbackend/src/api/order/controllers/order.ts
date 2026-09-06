import { factories } from '@strapi/strapi';

const isAdmin = (user: any) =>
  user?.email === process.env.ADMIN_EMAIL || user?.username === 'admin';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
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
    const payload = { ...(ctx.request.body.data || {}) };

    delete payload.user;
    delete payload.users_permissions_user;

    ctx.request.body.data = {
      ...payload,
      email: ctx.state.user.email,
    };
    const result = await super.create(ctx);
    const documentId = result?.data?.documentId;
    const userDocumentId = ctx.state.user.documentId || ctx.state.user.id;

    if (documentId && userDocumentId) {
      await strapi.documents('api::order.order').update({
        documentId,
        data: {
          user: { connect: [userDocumentId] },
        } as any,
      });
    }

    return result;
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
