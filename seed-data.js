const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'data/task-management.db');
const db = new sqlite3.Database(dbPath);

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

async function seed() {
  return new Promise(async (resolve, reject) => {
    db.serialize(async () => {
      try {
        console.log('🌱 Starting database seeding...');
        
        // Clear existing data
        db.run('DELETE FROM tasks', (err) => {
          if (err && err.message.includes('no such table')) {
            console.log('Tables not yet created, they will be auto-created by TypeORM');
          }
        });
        db.run('DELETE FROM users');
        db.run('DELETE FROM organizations');
        
        // Create Organizations
        console.log('Creating organizations...');
        const orgs = [
          { name: 'TechCorp' },
          { name: 'Engineering Inc' },
          { name: 'Sales Corp' }
        ];
        
        let orgIds = {};
        let orgCount = 0;
        
        for (const org of orgs) {
          db.run(
            'INSERT INTO organizations (name) VALUES (?)',
            [org.name],
            function(err) {
              if (err) {
                console.log(`Note: Organization creation - ${err.message}`);
              } else {
                orgIds[org.name] = this.lastID;
              }
              orgCount++;
              
              if (orgCount === orgs.length) {
                createUsers();
              }
            }
          );
        }
        
        const createUsers = async () => {
          console.log('Creating users...');
          const hashedPassword = await hashPassword('password123');
          
          const users = [
            {
              email: 'owner@example.com',
              password: hashedPassword,
              name: 'Owner User',
              role: 'OWNER',
              organizationId: orgIds['TechCorp']
            },
            {
              email: 'admin@example.com',
              password: hashedPassword,
              name: 'Admin User',
              role: 'ADMIN',
              organizationId: orgIds['Engineering Inc']
            },
            {
              email: 'viewer@example.com',
              password: hashedPassword,
              name: 'Viewer User',
              role: 'VIEWER',
              organizationId: orgIds['Sales Corp']
            }
          ];
          
          let userCount = 0;
          for (const user of users) {
            db.run(
              'INSERT INTO users (email, password, name, role, organizationId) VALUES (?, ?, ?, ?, ?)',
              [user.email, user.password, user.name, user.role, user.organizationId],
              function(err) {
                if (err && !err.message.includes('UNIQUE constraint failed')) {
                  console.log(`User creation note: ${err.message}`);
                }
                userCount++;
                
                if (userCount === users.length) {
                  console.log('✅ Database seeding completed!');
                  console.log('\n📋 Test Credentials:');
                  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                  console.log('Owner:');
                  console.log('  Email: owner@example.com');
                  console.log('  Password: password123\n');
                  console.log('Admin:');
                  console.log('  Email: admin@example.com');
                  console.log('  Password: password123\n');
                  console.log('Viewer:');
                  console.log('  Email: viewer@example.com');
                  console.log('  Password: password123\n');
                  
                  db.close();
                  resolve();
                }
              }
            );
          }
        };
      } catch (error) {
        console.error('Error:', error);
        db.close();
        reject(error);
      }
    });
  });
}

seed().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
