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
        Support_Type_2__c:"",

        // 自定义字段
        RequestSource__c: data.role,          // Role
        Project_Name__c: data.projectName,    // 注意用前端的 projectName

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

      // ❗ 不要传 Support_Type_2__c，避免 restricted picklist 问题

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
