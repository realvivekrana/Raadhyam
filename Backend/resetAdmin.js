import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/users.js';

const ADMIN_EMAIL    = 'admin@raadhyam.com';
const ADMIN_PASSWORD = 'Admin@1234';

async function reset() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Connected to MongoDB');

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    {
      email:    ADMIN_EMAIL,
      username: 'raadhyam_admin',
      password: hash,
      name:     'Admin',
      role:     'admin',
      status:   'Active',
      currentToken: null,
    },
    { upsert: true, new: true }
  );

  console.log('✅ Admin ready:');
  console.log('   Email   :', ADMIN_EMAIL);
  console.log('   Password:', ADMIN_PASSWORD);
  console.log('   Role    :', admin.role);

  await mongoose.disconnect();
}

reset().catch(e => { console.error(e); process.exit(1); });
