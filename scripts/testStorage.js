// scripts/testStorage.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Gunakan service_role key alih-alih anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Ganti ke service role key
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const BUCKET_NAMES = [
    'events-banner',
    'profile-images',
    'documents'
];

async function testStorage() {
    try {
        console.log('Testing Supabase Storage connection...');
        
        // List existing buckets
        const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
        if (listError) throw listError;
        
        console.log('\nExisting buckets:', existingBuckets);

        // Create buckets if they don't exist
        for (const bucketName of BUCKET_NAMES) {
            const bucketExists = existingBuckets.some(b => b.name === bucketName);
            
            if (!bucketExists) {
                console.log(`\nCreating bucket: ${bucketName}`);
                const { data, error } = await supabase.storage.createBucket(bucketName, {
                    public: false,
                    fileSizeLimit: 1024 * 1024 * 50 // 50MB
                });
                
                if (error) {
                    console.error(`Error creating bucket ${bucketName}:`, error.message);
                } else {
                    console.log(`Successfully created bucket: ${bucketName}`);
                }
            } else {
                console.log(`\nBucket already exists: ${bucketName}`);
            }
        }

        // List buckets again to confirm
        const { data: finalBuckets, error: finalError } = await supabase.storage.listBuckets();
        if (finalError) throw finalError;
        
        console.log('\nFinal buckets list:', finalBuckets);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run test
testStorage();