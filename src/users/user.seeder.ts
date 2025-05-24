import { DataSource } from 'typeorm';
import { User } from './entities/user/user';
import * as bcrypt from 'bcryptjs';

export const seedUsers = async (dataSource: DataSource) => {
  const userRepo = dataSource.getRepository(User);

  const users = [
    {
      name: 'Omar Eid',
      email: 'omar@example.com',
      password: 'password123',
    },
    {
      name: 'Fatma Salem',
      email: 'fatma@example.com',
      password: 'secret456',
    },
  ];

  for (const user of users) {
    const exists = await userRepo.findOneBy({ email: user.email });
    if (!exists) {
      const hashed = await bcrypt.hash(user.password, 10);
      await userRepo.save(userRepo.create({ ...user, password: hashed }));
      console.log(`User ${user.email} created`);
    } else {
      console.log(`User ${user.email} already exists`);
    }
  }
};
