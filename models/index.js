const mongoose = require("mongoose");

// Helper to attach virtual id / ProjectID to schemas
function applyVirtuals(schema) {
    schema.virtual("id").get(function () {
        return this._id.toString();
    });
    schema.virtual("ProjectID").get(function () {
        return this._id.toString();
    });
    schema.set("toJSON", { virtuals: true });
    schema.set("toObject", { virtuals: true });
}

// 1. Category Schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, default: 0 },
    description: { type: String, default: "" },
    link: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(categorySchema);

// 2. ReadyProject Schema
const readyProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectCategory: { type: String, default: "" },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(readyProjectSchema);

// 3. MiniProject Schema
const miniProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectCategory: { type: String, default: "" },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(miniProjectSchema);

// 4. BundleProject Schema
const bundleProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectCategory: { type: String, default: "" },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Documentation: { type: String, default: "" },
    PPT: { type: String, default: "" },
    Report: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(bundleProjectSchema);

// 5. CustomizedProject Schema
const customizedProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    technology: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, default: "NEW" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(customizedProjectSchema);

// 6. EcommerceProject Schema
const ecommerceProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectCategory: { type: String, default: "" },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(ecommerceProjectSchema);

// 7. WebDevelopmentProject Schema
const webDevelopmentProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectCategory: { type: String, default: "" },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Technologies: { type: String, default: "" },
    Compatibility: { type: String, default: "" },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(webDevelopmentProjectSchema);

// 8. FullstackProject Schema
const fullstackProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectCategory: { type: String, default: "" },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(fullstackProjectSchema);

// 9. MobileProject Schema
const mobileProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectCategory: { type: String, default: "" },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(mobileProjectSchema);

// 10. AiProject Schema
const aiProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectType: { type: String, default: "" },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(aiProjectSchema);

// 11. DsProject Schema
const dsProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(dsProjectSchema);

// 12. GamingProject Schema
const gamingProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(gamingProjectSchema);

// 13. CyberProject Schema
const cyberProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(cyberProjectSchema);

// 14. BlockchainProject Schema
const blockchainProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(blockchainProjectSchema);

// 15. CloudProject Schema
const cloudProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectType: { type: String, default: "" },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(cloudProjectSchema);

// 16. ElearningProject Schema
const elearningProjectSchema = new mongoose.Schema({
    ProjectTitle: { type: String, required: true },
    ProjectDescription: { type: String, default: "" },
    ProjectImage: { type: String, default: "" },
    ProjectZIPFile: { type: String, default: "" },
    Price: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Author: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(elearningProjectSchema);

// 17. Roadmap Schema
const roadmapSchema = new mongoose.Schema({
    title: { type: String, required: true },
    short_description: { type: String, default: "" },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    duration: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(roadmapSchema);

// 18. Comment Schema
const commentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(commentSchema);

// 19. Order Schema
const orderSchema = new mongoose.Schema({
    order_id: { type: String, required: true, unique: true },
    payment_id: { type: String, required: true },
    project_id: { type: String, required: true },
    project_type: { type: String, required: true },
    project_title: { type: String, required: true },
    amount: { type: Number, required: true },
    buyer_name: { type: String, required: true },
    buyer_email: { type: String, required: true },
    buyer_phone: { type: String, default: "" },
    status: { type: String, default: "PAID" },
    created_at: { type: Date, default: Date.now }
});
applyVirtuals(orderSchema);

module.exports = {
    Category: mongoose.model("Category", categorySchema),
    ReadyProject: mongoose.model("ReadyProject", readyProjectSchema),
    MiniProject: mongoose.model("MiniProject", miniProjectSchema),
    BundleProject: mongoose.model("BundleProject", bundleProjectSchema),
    CustomizedProject: mongoose.model("CustomizedProject", customizedProjectSchema),
    EcommerceProject: mongoose.model("EcommerceProject", ecommerceProjectSchema),
    WebDevelopmentProject: mongoose.model("WebDevelopmentProject", webDevelopmentProjectSchema),
    FullstackProject: mongoose.model("FullstackProject", fullstackProjectSchema),
    MobileProject: mongoose.model("MobileProject", mobileProjectSchema),
    AiProject: mongoose.model("AiProject", aiProjectSchema),
    DsProject: mongoose.model("DsProject", dsProjectSchema),
    GamingProject: mongoose.model("GamingProject", gamingProjectSchema),
    CyberProject: mongoose.model("CyberProject", cyberProjectSchema),
    BlockchainProject: mongoose.model("BlockchainProject", blockchainProjectSchema),
    CloudProject: mongoose.model("CloudProject", cloudProjectSchema),
    ElearningProject: mongoose.model("ElearningProject", elearningProjectSchema),
    Roadmap: mongoose.model("Roadmap", roadmapSchema),
    Comment: mongoose.model("Comment", commentSchema),
    Order: mongoose.model("Order", orderSchema)
};
