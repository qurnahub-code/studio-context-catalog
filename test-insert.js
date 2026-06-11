const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, ...val] = line.split('=');
    env[key.trim()] = val.join('=').trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testInsert() {
  console.log("Attempting to insert a test commit...");
  
  const testCommit = {
    id: "test_" + Date.now().toString().slice(-6),
    project_id: "testproject",
    category: "context",
    content: "This is a test commit to see if inserts are blocked.",
    is_new_project: true
  };

  const { data, error } = await supabase.from('commits').insert([testCommit]);

  if (error) {
    console.error("❌ INSERT FAILED! Here is the exact database error:");
    console.error(error);
  } else {
    console.log("✅ INSERT SUCCESSFUL! The table accepted the data.");
  }
}

testInsert();
