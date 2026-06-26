const pool = require('../backend/src/db');

async function run() {
  try {
    const usersRes = await pool.query("SELECT id, name, email FROM users ORDER BY id");
    console.log("=== USERS ===");
    usersRes.rows.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Email: ${r.email}`));

    const groupsRes = await pool.query("SELECT id, name, creator_id FROM study_groups");
    console.log("\n=== STUDY GROUPS ===");
    groupsRes.rows.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Creator ID: ${r.creator_id}`));

    const membersRes = await pool.query(`
      SELECT sgm.group_id, sg.name as group_name, sgm.user_id, u.name as user_name, u.email
      FROM study_group_members sgm
      JOIN study_groups sg ON sgm.group_id = sg.id
      JOIN users u ON sgm.user_id = u.id
    `);
    console.log("\n=== STUDY GROUP MEMBERS ===");
    membersRes.rows.forEach(r => console.log(`Group: ${r.group_name} (ID: ${r.group_id}) | User: ${r.user_name} (ID: ${r.user_id}) | Email: ${r.email}`));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

run();
