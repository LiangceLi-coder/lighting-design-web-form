const jsforce = require("jsforce");
require("dotenv").config();

async function run() {
  const loginUrl =
    process.env.SALESFORCE_LOGIN_URL ||
    process.env.SF_LOGIN_URL ||
    "https://login.salesforce.com";

  const conn = new jsforce.Connection({
    loginUrl,
  });

  await conn.login(
    process.env.SALESFORCE_USERNAME,
    process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
  );

  const result = await conn.sobject("Case").describe();
  console.log(result.fields.map(f => f.name));
}

run().catch(console.error);
