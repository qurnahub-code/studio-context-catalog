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

async function checkDatabase() {
  console.log("Pinging Supabase Database at:", env.NEXT_PUBLIC_SUPABASE_URL);
  
  const { data, error } = await supabase
    .from('commits')
    .select('id, project_id, category, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("❌ ERROR Fetching from Supabase:", error.message);
  } else {
    console.log(`✅ SUCCESS! Found ${data.length} commits saved in the database.`);
    if (data.length > 0) {
      console.log("-----------------------------------------");
      console.log("Most recent saved commits:");
      data.forEach(commit => {
        console.log(`- [${commit.project_id}/${commit.category}.md] ID: ${commit.id}`);
      });
      console.log("-----------------------------------------");
    } else {
      console.log("The connection works perfectly, but the 'commits' table is currently empty. Try dropping a file into the workspace!");
    }
  }
}

checkDatabase();
