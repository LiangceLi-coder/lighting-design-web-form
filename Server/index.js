// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const { getSFConnection } = require("./sfClient");

// // 使用内存存储，文件放在内存 buffer 中，方便直接上传到 Salesforce
// const upload = multer();

// // const app = express();

// // 开启 CORS，允许前端访问
// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN, // 本地开发时是 http://localhost:5173
//   })
// );

// app.use(express.json());

// // 这个路由接收 React 表单提交的数据
// // - 文本数据放在 jsonData 字段中（一个 JSON 字符串）
// // - 文件数据通过 drawingFiles 字段提交（可以多个）
// app.post("/api/lighting-design", async (req, res) => {
//   try {
//     // 1. 解析前端传来的 jsonData
//     const data = req.body;
//     // const data = rawJson ? JSON.parse(rawJson) : {};
//     // const files = req.files || [];

//     console.log("[API] 收到前端数据:", data);
//     // console.log("[API] 收到文件数量:", files.length);

//     // 2. 连接 Salesforce
//     const conn = await getSFConnection();

//     // 3. 可选：先尝试根据 projectName 找到对应 Opportunity
//     // let opportunityId = null;
//     // if (data.projectName) {
//     //   // 这里用 Name 做示例，你也可以改成自定义字段例如 Project_Code__c
//     //   const oppRecords = await conn
//     //     .sobject("Opportunity")
//     //     .find({ Name: data.projectName }, { Id: 1 }, { limit: 1 });

//     //   if (oppRecords.length > 0) {
//     //     opportunityId = oppRecords[0].Id;
//     //     console.log("[API] 找到匹配的 Opportunity:", opportunityId);
//     //   } else {
//     //     console.log("[API] 没有找到匹配的 Opportunity");
//     //   }
//     // }

//     // 4. 创建 Case —— 把你原来 sfData.append 的字段搬到这里
//     const caseBody = {
//             RecordTypeId: "012Oa000005RfCHIA0",                       // 你的 Lighting Design RecordTypeId
//             Subject: data.subject || "Lighting Design Request",
//             Description: data.description || "Lighting Design Test Description",
//             Priority: data.priority || "Medium",
//             Status: data.status || "Open",

//             SuppliedEmail: data.email,
//             SuppliedName: data.contactName,
//             SuppliedPhone: data.phone,
//     };

//     // 如果找到 Opportunity，则写入 Case 的 lookup 字段
//     // if (opportunityId) {
//     //   caseBody.Opportunity__c = opportunityId; // ⚠️ 这里用你的真实字段 API Name
//     // }

//     // 创建 Case
//     const createdCase = await conn.sobject("Case").create(caseBody);

//     if (!createdCase.success) {
//       console.error("[API] 创建 Case 失败:", createdCase);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to create Case",
//         details: createdCase,
//       });
//     }

//     const caseId = createdCase.id;
//     console.log("[API] Case 创建成功:", caseId);

//     // 5. 上传图纸文件 —— files 数组中的每个文件都挂到这个 Case 上
//     // 如果暂时还没有前端文件上传，可以先跳过这部分
//     // for (const file of files) {
//     //   console.log("[API] 正在上传文件:", file.originalname);

//     //   await conn.sobject("ContentVersion").create({
//     //     Title: file.originalname,
//     //     PathOnClient: file.originalname,
//     //     // buffer -> base64
//     //     VersionData: file.buffer.toString("base64"),
//     //     // 关键字段：第一次发布位置，直接关联到 Case
//     //     FirstPublishLocationId: caseId,
//     //   });
//     // }

//     // 6. Product List —— 从 data.products 里创建关联记录
//     // 这里假设前端传过来的结构是：
//     // data.products = [{ productCode: 'ASTRAL', qty: 10, notes: '' }, ...]
//     // if (Array.isArray(data.products) && data.products.length > 0) {
//     //   const productRecords = data.products.map((p) => ({
//     //     Case__c: caseId,              // 你的 Case lookup 字段
//     //     Product_Code__c: p.productCode, // 产品 code 或者 Product2 关联
//     //     Quantity__c: p.qty,
//     //     Notes__c: p.notes || "",
//     //   }));

//     //   const productResult = await conn
//     //     .sobject("Case_Product__c") // 替换为真实对象 API 名
//     //     .insert(productRecords);

//     //   console.log("[API] Product List 创建结果:", productResult);
//     // }

//     // 7. 返回成功响应给前端
//     return res.json({
//       success: true,
//       caseId,
//       message: "Case created and related records processed.",
//     });
//   } catch (error) {
//     console.error("[API] 处理请求出错:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// });

// // 启动服务
// const port = process.env.PORT || 4000;
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


// Server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getSFConnection } = require("./sfClient");

const app = express();

// ✅ 允许前端访问
app.use(cors({ origin: "http://localhost:5173" }));

// ✅ 解析 JSON 一定要在路由前面
app.use(express.json());

// 只做一件事：收到前端 JSON -> 创建 Case
app.post("/api/lighting-design", async (req, res) => {
  try {
    console.log("[API] 原始 req.body:", req.body, "typeof:", typeof req.body);

    const data = req.body || {}; // 防止为空
    console.log("[API] 解析后的前端数据:", data);

    const conn = await getSFConnection();
    console.log("[SF] LOgged in, instance:", conn.instanceUrl);
    console.log("[SF] User Info:", await conn.identity);
    
    

    const caseBody = {
      RecordTypeId: "012Oa000005Rn6bIAC",           // 你的 Lighting Design RecordTypeId

      Description: data.description || "Lighting Design Test Description",
      Priority: data.priority || "Medium",
      Status: data.status || "Open",
      Support_Type_2__c: null,
      SuppliedEmail: data.email,
      SuppliedName: data.contactName,
      SuppliedPhone: data.phone,
      Case_Type__c: "Lighting Design (Web Form)",

        // 地址 Address
        "Address_Line_1__c": data.address.line1,
        "Address_Line_2__c": data.address.line2,
        "City__c": data.address.city,
        "State_Province__c": data.address.state,
        "Postal_Code__c": data.address.postalCode,
        "Country__c": data.address.country,

        // Step 2 fields
        "Active_Tender__c": data.activeTender,
        "Contractor__c": data.contractor,
        "Probability__c": data.probability,

        // Estimated Supply Date 有错误
        "Estimated_Supply_Date__c": data.estimatedSupplyDate,

        "Sales_Territory__c": data.salesTerritory,
        "Estimated_Value__c": data.estimatedValue,
        "LDRCategory__c": data.dropdown,

        // 自定义字段
        "RequestSource__c": data.role,          // Role
        "Project_Name__c": data.Project_Name__c,   // Project Name
        // "00N6F00000HjgSL": data.wholesaler, // Wholesaler（你注释掉了我也保持原样）

        // Step 3
        // 尺寸 Size
        "Length__c": data.size?.length || "",
        "Width__c": data.size?.width || "",
        "Height__c": data.size?.height || "",

        // 反射率 Reflectances
        "Ceiling__c": data.reflectance?.ceiling || "",
        "Wall__c": data.reflectance?.wall || "",
        "Floor__c": data.reflectance?.floor || "",

        // Workplane Height
        "WorkPlaneHeight__c": data.workplaneHeight || "",

        // Illuminance
        "Illuminance_Level__c": data.illuminance || "",

        // Emergency Lighting
        "Emergency_Lighting__c": data.emergency || "",

        // Luminaire Type
        "Preferred_Luminaire__c": data.luminaireType || "",

        // Standards Required
        "Lighting_Standards__c": data.standardRequired || "",

        // Control
        "Control__c": data.control || "",

        // Other Info
        "Other_Information__c": data.otherInfo || "",

    };

    const createdCase = await conn.sobject("Case").create(caseBody);

    if (!createdCase.success) {
      console.error("[API] 创建 Case 失败:", createdCase);
      return res.status(500).json({
        success: false,
        message: "Failed to create Case",
        details: createdCase,
      });
    }

    console.log("[API] Case 创建成功:", createdCase.id);

    return res.json({
      success: true,
      caseId: createdCase.id,
      message: "Case created.",
    });
  } catch (error) {
    console.error("[API] 处理请求出错:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
