import nodemailer from 'nodemailer';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact.contact', ({ strapi }) => ({
	async create(ctx: any) {
		const response = await super.create(ctx);
		const contact = response?.data?.attributes ?? response?.data ?? {};
		const smtpHost = process.env.SMTP_HOST;
		const smtpUser = process.env.SMTP_USER;
		const smtpPassword = process.env.SMTP_PASSWORD;
		const receiver = process.env.CONTACT_RECEIVER_EMAIL || 'albarreducation92@gmail.com';

		if (!smtpHost || !smtpUser || !smtpPassword) {
			strapi.log.warn('Contact saved, but email notification is disabled. Configure SMTP_HOST, SMTP_USER, and SMTP_PASSWORD.');
			return response;
		}

		try {
			const transporter = nodemailer.createTransport({
				host: smtpHost,
				port: Number(process.env.SMTP_PORT || 587),
				secure: process.env.SMTP_SECURE === 'true',
				auth: {
					user: smtpUser,
					pass: smtpPassword,
				},
			});

			await transporter.sendMail({
				from: process.env.SMTP_FROM || smtpUser,
				to: receiver,
				replyTo: contact.email,
				subject: `New contact message from ${contact.name}`,
				text: `Name: ${contact.name}\nEmail: ${contact.email}\n\n${contact.message}`,
			});
		} catch (error) {
			strapi.log.error(`Contact ${contact.id || 'message'} was saved, but email notification failed.`, error);
		}

		return response;
	},
}));
