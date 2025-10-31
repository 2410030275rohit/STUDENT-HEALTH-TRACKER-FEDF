const mongoose = require('mongoose');
require('dotenv').config();

const checkDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const db = mongoose.connection.db;
    
    // Database information
    console.log('\n📊 DATABASE INFORMATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Database Name: ${db.databaseName}`);
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Port: ${mongoose.connection.port}`);
    console.log(`Connection String: ${process.env.MONGODB_URI}`);
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📁 COLLECTIONS (Tables):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (collections.length === 0) {
      console.log('⚠️  No collections found yet. Database is empty.');
    } else {
      for (const collection of collections) {
        const collectionName = collection.name;
        const count = await db.collection(collectionName).countDocuments();
        console.log(`\n📦 ${collectionName}`);
        console.log(`   Documents: ${count}`);
        
        // Show sample document if exists
        if (count > 0) {
          const sample = await db.collection(collectionName).findOne();
          console.log(`   Sample fields: ${Object.keys(sample).join(', ')}`);
        }
      }
    }
    
    // Database stats
    const stats = await db.stats();
    console.log('\n📈 DATABASE STATISTICS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Collections: ${stats.collections}`);
    console.log(`Total Documents: ${stats.objects}`);
    console.log(`Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);
    console.log(`Indexes: ${stats.indexes}`);
    console.log(`Index Size: ${(stats.indexSize / 1024).toFixed(2)} KB`);
    
    // Data storage location
    console.log('\n💾 DATA STORAGE LOCATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Local MongoDB Installation:');
    console.log('  • Default Windows: C:\\Program Files\\MongoDB\\Server\\<version>\\data\\');
    console.log('  • Default Linux: /var/lib/mongodb/');
    console.log('  • Default Mac: /usr/local/var/mongodb/');
    console.log('\nYour database files are stored in MongoDB\'s data directory.');
    console.log('Database name: medical-storage');
    
    console.log('\n✨ Done!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

checkDatabase();
