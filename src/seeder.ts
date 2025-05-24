import { DataSource } from 'typeorm';
import { seedUsers } from './users/user.seeder';
import { User } from './users/entities/user/user';
import { Goal } from './goals/entities/goal/goal';
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'goaltracker',
  entities: [User, Goal],
  synchronize: false, // assume DB is already migrated
});

dataSource
  .initialize()
  .then(async () => {
    console.log('Seeding...');
    await seedUsers(dataSource);
    console.log('Seeding complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeder failed:', err);
    process.exit(1);
  });
