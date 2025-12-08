import pool from './db.js';

async function runMigration() {
  const connection = await pool.getConnection();
  try {
    console.log('Running migration: Adding discharge and is_end_date columns...');
    
    // Check if discharge column exists, if not add it
    try {
      await connection.execute(`
        ALTER TABLE cycle_records
        ADD COLUMN discharge ENUM('light', 'moderate', 'heavy') DEFAULT NULL
      `);
      console.log('✅ discharge column added');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ discharge column already exists');
      } else {
        throw error;
      }
    }

    // Check if is_end_date column exists, if not add it
    try {
      await connection.execute(`
        ALTER TABLE cycle_records
        ADD COLUMN is_end_date TINYINT(1) DEFAULT 0
      `);
      console.log('✅ is_end_date column added');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ is_end_date column already exists');
      } else {
        throw error;
      }
    }

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    connection.release();
  }
}

runMigration();
