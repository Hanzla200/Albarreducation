import type { Core } from '@strapi/strapi';

const SEED_DATA = {
  subjects: [
    // Class 9
    { subjectname: 'Mathematics', classlevel: 'Class 9' },
    { subjectname: 'Physics', classlevel: 'Class 9' },
    { subjectname: 'Chemistry', classlevel: 'Class 9' },
    { subjectname: 'Biology', classlevel: 'Class 9' },
    { subjectname: 'Computer Science', classlevel: 'Class 9' },
    { subjectname: 'English', classlevel: 'Class 9' },
    { subjectname: 'Urdu', classlevel: 'Class 9' },
    { subjectname: 'Islamiat', classlevel: 'Class 9' },

    // Class 10
    { subjectname: 'Mathematics', classlevel: 'Class 10' },
    { subjectname: 'Physics', classlevel: 'Class 10' },
    { subjectname: 'Chemistry', classlevel: 'Class 10' },
    { subjectname: 'Biology', classlevel: 'Class 10' },
    { subjectname: 'Computer Science', classlevel: 'Class 10' },
    { subjectname: 'English', classlevel: 'Class 10' },
    { subjectname: 'Pakistan Studies', classlevel: 'Class 10' },

    // Class 11
    { subjectname: 'Mathematics', classlevel: 'Class 11' },
    { subjectname: 'Physics', classlevel: 'Class 11' },
    { subjectname: 'Chemistry', classlevel: 'Class 11' },
    { subjectname: 'Biology', classlevel: 'Class 11' },
    { subjectname: 'Computer Science', classlevel: 'Class 11' },
    { subjectname: 'English', classlevel: 'Class 11' },

    // Class 12
    { subjectname: 'Mathematics', classlevel: 'Class 12' },
    { subjectname: 'Physics', classlevel: 'Class 12' },
    { subjectname: 'Chemistry', classlevel: 'Class 12' },
    { subjectname: 'Biology', classlevel: 'Class 12' },
    { subjectname: 'Computer Science', classlevel: 'Class 12' },
    { subjectname: 'Pakistan Studies', classlevel: 'Class 12' },
  ],

  lectures: [
    {
      title: 'Class 9 Math - Chapter 1: Matrices & Determinants (Full Concept)',
      vediourls: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      classlevel: 'Class 9',
      subjectName: 'Mathematics',
    },
    {
      title: 'Class 9 Physics - Chapter 2: Kinematics & Equations of Motion',
      vediourls: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      classlevel: 'Class 9',
      subjectName: 'Physics',
    },
    {
      title: 'Class 9 Computer Science - Chapter 1: Fundamentals of Computer',
      vediourls: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      classlevel: 'Class 9',
      subjectName: 'Computer Science',
    },
    {
      title: 'Class 10 Math - Chapter 1: Quadratic Equations & Solution Methods',
      vediourls: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      classlevel: 'Class 10',
      subjectName: 'Mathematics',
    },
    {
      title: 'Class 10 Physics - Chapter 10: Simple Harmonic Motion & Waves',
      vediourls: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      classlevel: 'Class 10',
      subjectName: 'Physics',
    },
    {
      title: 'Class 10 Chemistry - Chapter 9: Chemical Equilibrium & Dynamic State',
      vediourls: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      classlevel: 'Class 10',
      subjectName: 'Chemistry',
    },
    {
      title: 'Class 11 Math - Chapter 3: Matrices and Determinants in Depth',
      vediourls: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      classlevel: 'Class 11',
      subjectName: 'Mathematics',
    },
    {
      title: 'Class 11 Physics - Chapter 2: Vectors and Equilibrium Analysis',
      vediourls: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      classlevel: 'Class 11',
      subjectName: 'Physics',
    },
    {
      title: 'Class 12 Math - Chapter 1: Functions and Limits',
      vediourls: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      classlevel: 'Class 12',
      subjectName: 'Mathematics',
    },
    {
      title: 'Class 12 Physics - Chapter 12: Electrostatics & Coulomb Law',
      vediourls: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      classlevel: 'Class 12',
      subjectName: 'Physics',
    },
  ],

  books: [
    { title: 'Class 9 Mathematics Textbook (Punjab Curriculum)', price: '450', classlevel: 'Class 9', subjectName: 'Mathematics' },
    { title: 'Class 9 Physics Comprehensive Guide', price: '480', classlevel: 'Class 9', subjectName: 'Physics' },
    { title: 'Class 9 Computer Science Practical Manual', price: '420', classlevel: 'Class 9', subjectName: 'Computer Science' },
    { title: 'Class 10 Mathematics Solved Keybook', price: '500', classlevel: 'Class 10', subjectName: 'Mathematics' },
    { title: 'Class 10 Chemistry Textbook & MCQs Bank', price: '520', classlevel: 'Class 10', subjectName: 'Chemistry' },
    { title: 'Class 11 Mathematics (FSc Part 1) Text & Solution', price: '650', classlevel: 'Class 11', subjectName: 'Mathematics' },
    { title: 'Class 11 Physics Scholar Series Guide', price: '680', classlevel: 'Class 11', subjectName: 'Physics' },
    { title: 'Class 12 Mathematics (FSc Part 2) Calculus & Vectors', price: '700', classlevel: 'Class 12', subjectName: 'Mathematics' },
    { title: 'Class 12 Physics Theoretical and Numerical Solver', price: '720', classlevel: 'Class 12', subjectName: 'Physics' },
  ],

  notes: [
    { title: 'Class 9 Math - Chapter 1 & 2 Complete Handwritten Notes', classlevel: 'Class 9', subjectName: 'Mathematics' },
    { title: 'Class 9 Physics - Formula Sheet & Important Short Questions', classlevel: 'Class 9', subjectName: 'Physics' },
    { title: 'Class 10 Math - Quadratic Equations & Variations Solved Examples', classlevel: 'Class 10', subjectName: 'Mathematics' },
    { title: 'Class 10 Chemistry - Organic Chemistry Summary Notes', classlevel: 'Class 10', subjectName: 'Chemistry' },
    { title: 'Class 11 Math - Trigonometric Identities Quick Reference', classlevel: 'Class 11', subjectName: 'Mathematics' },
    { title: 'Class 11 Physics - Chapter 3 Motion and Force Derivations', classlevel: 'Class 11', subjectName: 'Physics' },
    { title: 'Class 12 Math - Differentiation & Integration Summary Table', classlevel: 'Class 12', subjectName: 'Mathematics' },
    { title: 'Class 12 Physics - Current Electricity Solved Numericals', classlevel: 'Class 12', subjectName: 'Physics' },
  ],

  pastPapers: [
    { title: 'Class 9 Mathematics Past Paper 2024 Group 1', boards: 'BISE Lahore', classlevel: 'Class 9', year: 2024, subjectName: 'Mathematics' },
    { title: 'Class 9 Physics Past Paper 2023 Group 2', boards: 'BISE Rawalpindi', classlevel: 'Class 9', year: 2023, subjectName: 'Physics' },
    { title: 'Class 10 Mathematics Past Paper 2024 Group 1', boards: 'BISE Lahore', classlevel: 'Class 10', year: 2024, subjectName: 'Mathematics' },
    { title: 'Class 10 Physics Past Paper 2024 Group 2', boards: 'BISE Faisalabad', classlevel: 'Class 10', year: 2024, subjectName: 'Physics' },
    { title: 'Class 10 Chemistry Past Paper 2023 Group 1', boards: 'BISE Gujranwala', classlevel: 'Class 10', year: 2023, subjectName: 'Chemistry' },
    { title: 'Class 11 Mathematics Past Paper 2024 Group 1', boards: 'BISE Lahore', classlevel: 'Class 11', year: 2024, subjectName: 'Mathematics' },
    { title: 'Class 11 Physics Past Paper 2023 Group 1', boards: 'BISE Multan', classlevel: 'Class 11', year: 2023, subjectName: 'Physics' },
    { title: 'Class 12 Mathematics Past Paper 2024 Group 2', boards: 'BISE Lahore', classlevel: 'Class 12', year: 2024, subjectName: 'Mathematics' },
    { title: 'Class 12 Physics Past Paper 2024 Group 1', boards: 'BISE Rawalpindi', classlevel: 'Class 12', year: 2024, subjectName: 'Physics' },
  ],

  announcements: [
    { news: '📢 Welcome to Albar Education! Complete study materials for Matric (Class 9-10) and FSC (Class 11-12) are now available.' },
    { news: '📚 New Punjab Board 2024 Past Papers and Model Papers have been uploaded for all major subjects.' },
    { news: '🎓 Video lecture series for Class 9 & 10 Mathematics and Physics has been updated with step-by-step solutions.' },
    { news: '💡 Need quick help with difficult concepts? Try our built-in AI Study Assistant in the Chat section!' },
  ],

  reviews: [
    { text: 'Extremely clear explanation of matrices and determinants. Helped me prepare for my board exams!', review: 5 },
    { text: 'Great conceptual clarity and very well structured lectures.', review: 5 },
    { text: 'The notes and past papers matched the exact Punjab board exam pattern. Highly recommended!', review: 5 },
  ],
};

async function setupPermissions(strapi: Core.Strapi) {
  try {
    const roles = await strapi.db.query('plugin::users-permissions.role').findMany({
      populate: ['permissions'],
    });

    const publicRole = roles.find((r: any) => r.type === 'public');
    const authenticatedRole = roles.find((r: any) => r.type === 'authenticated');

    const educationalTypes = [
      'api::subject.subject',
      'api::lecture.lecture',
      'api::book.book',
      'api::note.note',
      'api::past-paper.past-paper',
      'api::announcement.announcement',
    ];

    const setRolePermissions = async (
      role: any,
      permissions: Array<{ uid: string; actions: string[] }>,
      authActions: string[]
    ) => {
      if (!role) return;
      await strapi.db.query('plugin::users-permissions.permission').deleteMany({
        where: { role: role.id },
      });

      const actionNames = permissions.flatMap(({ uid, actions }) =>
        actions.map((action) => `${uid}.${action}`)
      );
      for (const actionName of [...actionNames, ...authActions]) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action: actionName, role: role.id },
        });
      }
    };

    const readEducational = educationalTypes.map((uid) => ({
      uid,
      actions: ['find', 'findOne'],
    }));

    if (publicRole) {
      await setRolePermissions(publicRole, readEducational, [
        'plugin::users-permissions.auth.callback',
        'plugin::users-permissions.auth.register',
        'plugin::users-permissions.auth.forgotPassword',
        'plugin::users-permissions.auth.resetPassword',
      ]);
    }

    if (authenticatedRole) {
      await setRolePermissions(authenticatedRole, [
        ...educationalTypes.map((uid) => ({
          uid,
          actions: ['find', 'findOne', 'create', 'update', 'delete'],
        })),
        { uid: 'api::review.review', actions: ['find', 'findOne', 'create', 'update', 'delete'] },
        { uid: 'api::order.order', actions: ['find', 'findOne', 'create', 'update', 'delete'] },
        { uid: 'api::cart.cart', actions: ['find', 'findOne', 'create', 'update', 'delete'] },
        { uid: 'api::cartitem.cartitem', actions: ['find', 'findOne', 'create', 'update', 'delete'] },
      ], [
        'plugin::users-permissions.user.me',
      ]);
    }

    strapi.log.info('✅ Strapi permissions configured for Public and Authenticated roles.');
  } catch (error) {
    strapi.log.warn('⚠️ Could not automatically configure permissions:', error);
  }
}

async function ensureAdminUser(strapi: Core.Strapi) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      strapi.log.warn('ADMIN_EMAIL and ADMIN_PASSWORD are required to provision the admin user.');
      return;
    }

    const existing = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: {
        $or: [
          { email: adminEmail },
          { username: 'admin' },
        ],
      },
    });

    if (!existing) {
      const authRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      await strapi.plugin('users-permissions').service('user').add({
        username: 'admin',
        email: adminEmail,
        password: adminPassword,
        confirmed: true,
        blocked: false,
        role: authRole?.id,
      });

      strapi.log.info(`✅ Admin user created for ${adminEmail}.`);
    }
  } catch (error) {
    strapi.log.warn('⚠️ Could not check/create default admin user:', error);
  }
}

async function createEntry(strapi: Core.Strapi, uid: string, data: any) {
  try {
    if (strapi.documents) {
      return await strapi.documents(uid as any).create({
        data,
        status: 'published',
      });
    }
  } catch {
    // Fallback to db query
  }

  try {
    return await strapi.db.query(uid).create({
      data: {
        ...data,
        publishedAt: new Date(),
      },
    });
  } catch (err) {
    strapi.log.warn(`Could not create entry for ${uid}:`, err);
    return null;
  }
}

async function seedDataIfEmpty(strapi: Core.Strapi) {
  try {
    const subjectCount = await strapi.db.query('api::subject.subject').count();
    if (subjectCount > 0) {
      strapi.log.info(`ℹ️ Strapi database already contains ${subjectCount} subjects. Skipping seed.`);
      return;
    }

    strapi.log.info('🌱 Strapi database is empty. Seeding initial educational data...');

    // 1. Seed Subjects
    const createdSubjects: Record<string, any> = {};
    for (const sub of SEED_DATA.subjects) {
      const entry = await createEntry(strapi, 'api::subject.subject', sub);
      if (entry) {
        const key = `${sub.classlevel}_${sub.subjectname}`;
        createdSubjects[key] = entry;
      }
    }

    // 2. Seed Lectures
    const createdLectures: any[] = [];
    for (const lec of SEED_DATA.lectures) {
      const subKey = `${lec.classlevel}_${lec.subjectName}`;
      const subject = createdSubjects[subKey];
      const entry = await createEntry(strapi, 'api::lecture.lecture', {
        description: lec.title,
        vediourls: lec.vediourls,
        classlevel: lec.classlevel,
        subject: subject ? (subject.documentId || subject.id) : null,
      });
      if (entry) createdLectures.push(entry);
    }

    // 3. Seed Books
    for (const bk of SEED_DATA.books) {
      const subKey = `${bk.classlevel}_${bk.subjectName}`;
      const subject = createdSubjects[subKey];
      await createEntry(strapi, 'api::book.book', {
        title: bk.title,
        price: bk.price,
        classlevel: bk.classlevel,
        subject: subject ? (subject.documentId || subject.id) : null,
      });
    }

    // 4. Seed Notes
    for (const nt of SEED_DATA.notes) {
      const subKey = `${nt.classlevel}_${nt.subjectName}`;
      const subject = createdSubjects[subKey];
      await createEntry(strapi, 'api::note.note', {
        title: nt.title,
        classlevel: nt.classlevel,
        subject: subject ? (subject.documentId || subject.id) : null,
      });
    }

    // 5. Seed Past Papers
    for (const pp of SEED_DATA.pastPapers) {
      const subKey = `${pp.classlevel}_${pp.subjectName}`;
      const subject = createdSubjects[subKey];
      await createEntry(strapi, 'api::past-paper.past-paper', {
        title: pp.title,
        boards: pp.boards,
        classlevel: pp.classlevel,
        year: pp.year,
        subject: subject ? (subject.documentId || subject.id) : null,
      });
    }

    // 6. Seed Announcements
    for (const ann of SEED_DATA.announcements) {
      await createEntry(strapi, 'api::announcement.announcement', ann);
    }

    // 7. Seed Reviews
    for (let i = 0; i < SEED_DATA.reviews.length; i++) {
      const rev = SEED_DATA.reviews[i];
      const lecture = createdLectures[i % createdLectures.length];
      await createEntry(strapi, 'api::review.review', {
        text: rev.text,
        review: rev.review,
        lecture: lecture ? (lecture.documentId || lecture.id) : null,
      });
    }

    strapi.log.info('✅ Initial educational data successfully seeded into Strapi!');
  } catch (error) {
    strapi.log.error('❌ Error while seeding Strapi data:', error);
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setupPermissions(strapi);
    await ensureAdminUser(strapi);
    await seedDataIfEmpty(strapi);
  },
};
