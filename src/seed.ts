import 'dotenv/config';
import bcrypt from 'bcryptjs';
import dataSource from './data-source.js';
import { Admin } from './admin/entities/admin.entity.js';

/** Creates the default admin account if it does not exist yet (idempotent). */
async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Administrator';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  await dataSource.initialize();
  try {
    const repo = dataSource.getRepository(Admin);
    const existing = await repo.findOne({ where: { email } });
    if (existing) {
      console.log(`Admin "${email}" already exists, skipping.`);
      return;
    }
    await repo.save(
      repo.create({
        email,
        name,
        passwordHash: await bcrypt.hash(password, 10),
      }),
    );
    console.log(`Admin "${email}" created.`);
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
