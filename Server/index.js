// Server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { getSFConnection } = require("./sfClient");

const app = express();

// 允许前端访问
app.use(cors({ origin: "http://localhost:5173" }));

// 解析 JSON（如果以后有别的纯 JSON 接口也能用）
app.use(express.json());

// ---------- 工具函数：根据 products 更新 Case.Selected_Products__c ----------
// 方案 B：把多条产品信息拼成多行长文本，写入 Case 上的 Long Text 字段 Selected_Products__c
async function updateCaseSelectedProducts(conn, caseId, productsRaw) {
  const products = Array.isArray(productsRaw) ? productsRaw : [];
  const itemNos = products
    .map((p) => p && p.itemNo)
    .filter(Boolean);

  if (!itemNos.length) {
    console.log("[API] 没有选中的 product，跳过更新 Selected_Products__c");
    return;
  }

  // 构造 IN 子句（注意转义单引号）
  const inClause = itemNos
    .map((no) => `'${String(no).replace(/'/g, "\\'")}'`)
    .join(",");

  // 从 Product_ATP__c 里把需要展示的字段查出来
  // 这里用的是你上面确认过的字段：Item_No4__c, Name, Status2__c
  const result = await conn.query(`
    SELECT Item_No4__c, Name, Status2__c
    FROM Product_ATP__c
    WHERE Item_No4__c IN (${inClause})
  `);

  const atpMap = new Map(
    result.records.map((r) => [r.Item_No4__c, r])
  );

  // 按前端 products 的顺序拼接多行文本
  const lines = products
    .map((p, idx) => {
      const row = atpMap.get(p.itemNo);
      if (!row) return null;

      // 想显示哪些字段就改这里（目前：SAP Item | Name | Status）
      return `${idx + 1}. ${row.Item_No4__c} | ${row.Name || ""} | ${row.Status2__c || ""}`;
    })
    .filter(Boolean);

  if (!lines.length) {
    console.log("[API] 未找到匹配的 Product_ATP__c 记录，跳过更新 Selected_Products__c");
    return;
  }

  const summary = lines.join("\n");

  // 更新 Case 上的 Long Text 字段 Selected_Products__c
  await conn.sobject("Case").update({
    Id: caseId,
    Selected_Products__c: summary, // ⚠️ 确认你的 API Name 就是这个
  });

  console.log("[API] 已更新 Case.Selected_Products__c");
}

// ---------- 获取 Product ATP 列表给前端用 ----------
app.get("/api/products", async (req, res) => {
  try {
    const conn = await getSFConnection();

    const result = await conn.query(`
      SELECT Item_No4__c, Name, Status2__c
      FROM Product_ATP__c
      WHERE Item_No4__c != null
    `);

    const products = result.records.map((record) => ({
      itemNo: record.Item_No4__c,
      name: record.Name,
      status: record.Status2__c,
    }));

    res.json(products);
  } catch (error) {
    console.error("[API /api/products] Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// multer：用内存存储文件
const upload = multer();

// 接口：创建 Case + 把文件挂在 Case 上
app.post(
  "/api/lighting-design",
  upload.array("drawingFiles"), // 字段名要和前端 FormData.append("drawingFiles", file) 一致
  async (req, res) => {
    try {
      console.log("[API] 原始 req.body:", req.body);
      console.log("[API] 收到文件数量:", (req.files || []).length);

      // 1. 解析 jsonData（必需）
      const rawJson = req.body.jsonData;
      if (!rawJson) {
        return res.status(400).json({
          success: false,
          message: "jsonData is required",
        });
      }

      let data;
      try {
        data = JSON.parse(rawJson);
      } catch (e) {
        console.error("[API] 解析 jsonData 失败:", e);
        return res.status(400).json({
          success: false,
          message: "Invalid jsonData",
        });
      }

      console.log("[API] 解析后的前端数据:", data);
      const files = req.files || [];

      // 2. 连接 Salesforce
      const conn = await getSFConnection();
      console.log("[SF] Logged in, instance:", conn.instanceUrl);

      // 3. 组装 Case 字段（按你之前的 mapping 来）
      const caseBody = {
        RecordTypeId: "012Oa000005Rn6bIAC", // Lighting Design Case

        Description: data.description || "Lighting Design Test Description",
        Priority: data.priority || "Medium",
        Status: data.status || "Open",

        SuppliedEmail: data.email,
        SuppliedName: data.contactName,
        SuppliedPhone: data.phone,

        Case_Type__c: "Lighting Design (Web Form)",

        // 地址 Address
        Address_Line_1__c: data.address?.line1,
        Address_Line_2__c: data.address?.line2,
        City__c: data.address?.city,
        State_Province__c: data.address?.state,
        Postal_Code__c: data.address?.postalCode,
        Country__c: data.address?.country,

        // Step 2 fields
        Active_Tender__c: data.activeTender,
        Contractor__c: data.contractor,
        Probability__c: data.probability,
        // 这里前端传 YYYY-MM-DD 就行
        Estimated_Supply_Date__c: data.estimatedSupplyDate,

        Sales_Territory__c: data.salesTerritory,
        Estimated_Value__c: data.estimatedValue,
        LDRCategory__c: data.dropdown,
        Support_Type_2__c: "",

        // 自定义字段
        RequestSource__c: data.role, // Role
        Project_Name__c: data.projectName, // 注意用前端的 projectName

        // Step 3 尺寸 Size
        Length__c: data.size?.length || "",
        Width__c: data.size?.width || "",
        Height__c: data.size?.height || "",

        // 反射率 Reflectances
        Ceiling__c: data.reflectance?.ceiling || "",
        Wall__c: data.reflectance?.wall || "",
        Floor__c: data.reflectance?.floor || "",

        // Workplane Height
        WorkPlaneHeight__c: data.workplaneHeight || "",

        // Illuminance
        Illuminance_Level__c: data.illuminance || "",

        // Emergency Lighting
        Emergency_Lighting__c: data.emergency || "",

        // Luminaire Type
        Preferred_Luminaire__c: data.luminaireType || "",

        // Standards Required
        Lighting_Standards__c: data.standardRequired || "",

        // Control
        Control__c: data.control || "",

        // Other Info
        Other_Information__c: data.otherInfo || "",
      };

      console.log("[API] 即将创建 Case，body:", caseBody);

      // 4. 创建 Case
      const createdCase = await conn.sobject("Case").create(caseBody);

      if (!createdCase.success) {
        console.error("[API] 创建 Case 失败:", createdCase);
        return res.status(500).json({
          success: false,
          message: "Failed to create Case",
          details: createdCase,
        });
      }

      const caseId = createdCase.id;
      console.log("[API] Case 创建成功:", caseId);

      // ⭐ 新增：用选中的 products 更新 Case.Selected_Products__c
      try {
        await updateCaseSelectedProducts(conn, caseId, data.products);
      } catch (e) {
        console.error("[API] 更新 Selected_Products__c 失败:", e);
      }

      // 5. 把文件挂在 Case 上（中间那列 Attachments / Files 会显示）
      for (const file of files) {
        console.log("[API] 正在上传文件:", file.originalname);

        await conn.sobject("ContentVersion").create({
          Title: file.originalname,
          PathOnClient: file.originalname,
          VersionData: file.buffer.toString("base64"),
          FirstPublishLocationId: caseId, // ⭐ 挂载目标 = 这个 Case
        });
      }

      // 6. 返回
      return res.json({
        success: true,
        caseId,
        message: files.length
          ? "Case created and files uploaded."
          : "Case created.",
      });
    } catch (error) {
      console.error("[API] 处理请求出错:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
