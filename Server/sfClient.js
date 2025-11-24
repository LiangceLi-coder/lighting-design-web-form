const jsforce = require("jsforce");
require("dotenv").config();

async function getSFConnection() {
  const conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL,
  });

  // 登录
  await conn.login(
    process.env.SALESFORCE_USERNAME,
    process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
  );

  // 等待 identity 结果
  const identity = await conn.identity();
  console.log("Logged in as:", identity.username);
  console.log("Org ID:", identity.organization_id);
  console.log("Instance URL:", conn.instanceUrl);

  return conn;
}

module.exports = {
  getSFConnection,
};
