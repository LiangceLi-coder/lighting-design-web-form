const jsforce = require("jsforce");
require("dotenv").config();

async function run() {
  const conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL,
  });

  await conn.login(
    process.env.SALESFORCE_USERNAME,
    process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
  );

  const result = await conn.sobject("Case").describe();
  console.log(result.fields.map(f => f.name));
}

run().catch(console.error);
