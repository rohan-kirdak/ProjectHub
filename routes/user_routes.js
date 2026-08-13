var express = require("express");
var router = express.Router();
const {
    Category,
    ReadyProject,
    MiniProject,
    BundleProject,
    CustomizedProject,
    EcommerceProject,
    WebDevelopmentProject,
    FullstackProject,
    MobileProject,
    AiProject,
    DsProject,
    GamingProject,
    CyberProject,
    BlockchainProject,
    CloudProject,
    ElearningProject,
    Roadmap,
    Comment,
    Order
} = require("./../models");

router.use("/uploads", express.static("public/uploads"));
router.use(express.urlencoded({ extended: true }));

// Map of category key -> Mongoose Model
const projectModelMap = {
    "ready": ReadyProject,
    "mini": MiniProject,
    "bundle": BundleProject,
    "ecommerce": EcommerceProject,
    "web": WebDevelopmentProject,
    "fullstack": FullstackProject,
    "mobile": MobileProject,
    "ai": AiProject,
    "ds": DsProject,
    "gaming": GamingProject,
    "cyber": CyberProject,
    "blockchain": BlockchainProject,
    "cloud": CloudProject,
    "elearning": ElearningProject
};

// Route for home page (index.ejs)
router.get("/", async function (req, res) {
    try {
        var categories = await Category.find();
        res.render("user/index.ejs", { categories });
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.render("user/index.ejs", { categories: [] });
    }
});

router.get("/about", async function (req, res) {
    res.render("user/about.ejs");
});

router.get("/contact", async function (req, res) {
    res.render("user/contact.ejs");
});

router.get("/cart", async function (req, res) {
    res.render("user/cart.ejs");
});

router.get("/checkout", async function (req, res) {
    res.render("user/checkout.ejs", {
        razorpay_key: process.env.RAZORPAY_KEY_ID || ""
    });
});

router.get("/project_details", async function (req, res) {
    res.render("user/project_details.ejs");
});

router.get("/blogs", async function (req, res) {
    res.render("user/blogs.ejs");
});

router.get("/blog-details", async function (req, res) {
    res.render("user/blog-details.ejs");
});

router.get("/ready-project-details", async function (req, res) {
    var search = req.query.search || "";
    var query = {};
    if (search) {
        query = {
            $or: [
                { ProjectTitle: { $regex: search, $options: "i" } },
                { ProjectDescription: { $regex: search, $options: "i" } },
                { ProjectCategory: { $regex: search, $options: "i" } }
            ]
        };
    }
    var ready_projects = await ReadyProject.find(query);
    res.render("user/ready-project-details.ejs", { ready_projects, search });
});

router.get("/single-project-details/:id", async function (req, res) {
    try {
        var result = await ReadyProject.findById(req.params.id);
        res.render("user/single-project-details.ejs", { single_ready_projects: result });
    } catch (err) {
        res.render("user/single-project-details.ejs", { single_ready_projects: null });
    }
});

router.get("/mini-project-details", async function (req, res) {
    var mini_projects = await MiniProject.find();
    res.render("user/mini-project-details.ejs", { mini_projects });
});

router.get("/mini-singlepage-project-details/:id", async function (req, res) {
    try {
        var result = await MiniProject.findById(req.params.id);
        res.render("user/mini-singlepage-project-details.ejs", { single_mini_project: result });
    } catch (err) {
        res.render("user/mini-singlepage-project-details.ejs", { single_mini_project: null });
    }
});

router.get("/bundle-project-details", async function (req, res) {
    var bundle_projects = await BundleProject.find();
    res.render("user/bundle-project-details.ejs", { bundle_projects });
});

router.get("/bundle-singlepage-project-details/:id", async function (req, res) {
    try {
        var result = await BundleProject.findById(req.params.id);
        res.render("user/bundle-singlepage-project-details.ejs", { single_bundle_project: result });
    } catch (err) {
        res.render("user/bundle-singlepage-project-details.ejs", { single_bundle_project: null });
    }
});

router.get("/customized-project-details", async function (req, res) {
    res.render("user/customized-project-details.ejs");
});

router.get("/customized-singlepage-project-details", async function (req, res) {
    res.render("user/customized-singlepage-project-details.ejs");
});

router.get("/languages", async function (req, res) {
    res.render("user/languages.ejs");
});

// Handle Form Submission - Customized Project
router.post("/submit_project", async function (req, res) {
    try {
        var d = req.body;
        await CustomizedProject.create({
            name: d.name,
            email: d.email,
            phone: d.phone,
            technology: d.technology,
            description: d.description
        });
        res.redirect("/customized-project-details");
    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Database error");
    }
});

// Contact form submission
router.post("/submit-comment", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address" });
        }

        await Comment.create({ name, email, message });

        res.json({ success: true, message: "Thank you for contacting us! Our representative will contact you soon." });
    } catch (err) {
        console.error("Error inserting comment:", err);
        res.status(500).json({ success: false, message: "An error occurred while processing your request" });
    }
});

router.get('/roadmaps', async (req, res) => {
    try {
        const results = await Roadmap.find();
        res.render('user/roadmaps', { roadmaps: results });
    } catch (err) {
        console.error('Error fetching roadmaps:', err);
        res.status(500).send('Database error');
    }
});

router.get("/roadmaps-indetail", async function (req, res) {
    res.render("user/roadmaps-indetail.ejs");
});

// =============================================
// RAZORPAY PAYMENT INTEGRATION
// =============================================

const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
router.post("/create-order", async (req, res) => {
    try {
        const { amount, currency, projectTitle, projectId, projectType } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        const options = {
            amount: Math.round(parseFloat(amount) * 100), // Convert to paise
            currency: currency || "INR",
            receipt: `order_${Date.now()}`,
            notes: {
                projectTitle: projectTitle || "",
                projectId: projectId || "",
                projectType: projectType || ""
            }
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.error("Error creating Razorpay order:", err);
        res.status(500).json({ success: false, message: "Payment initiation failed: " + err.message });
    }
});

// Verify Razorpay Payment & Save Order
router.post("/verify-payment", async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            projectId,
            projectType,
            projectTitle,
            amount,
            buyerName,
            buyerEmail,
            buyerPhone
        } = req.body;

        // Verify payment signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed! Invalid signature." });
        }

        // Save order to database
        await Order.create({
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            project_id: projectId,
            project_type: projectType,
            project_title: projectTitle,
            amount: amount,
            buyer_name: buyerName,
            buyer_email: buyerEmail,
            buyer_phone: buyerPhone,
            status: "PAID"
        });

        res.json({
            success: true,
            message: "Payment verified successfully!",
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id
        });
    } catch (err) {
        console.error("Error verifying payment:", err);
        res.status(500).json({ success: false, message: "Error processing payment verification: " + err.message });
    }
});

// Download project after successful payment
router.get("/download/:paymentId/:projectType/:projectId", async (req, res) => {
    try {
        const { paymentId, projectType, projectId } = req.params;

        // Verify the payment exists and is valid
        const orderCheck = await Order.findOne({
            payment_id: paymentId,
            project_id: projectId,
            project_type: projectType,
            status: "PAID"
        });

        if (!orderCheck) {
            return res.status(403).send("Access denied. Valid payment required to download this project.");
        }

        const Model = projectModelMap[projectType];
        if (!Model) return res.status(400).send("Invalid project type.");

        const projectData = await Model.findById(projectId);

        if (!projectData || !projectData.ProjectZIPFile) {
            return res.status(404).send("Project file not found.");
        }

        const path = require("path");
        const fs = require("fs");
        const zipFileName = projectData.ProjectZIPFile;
        const zipPath = path.join(__dirname, "../public/uploads", zipFileName);

        if (!fs.existsSync(zipPath)) {
            return res.status(404).send("Project file not found on server. Please contact support.");
        }

        res.download(zipPath, zipFileName);
    } catch (err) {
        console.error("Error during download:", err);
        res.status(500).send("Download failed. Please contact support.");
    }
});

// View payment history (by email)
router.get("/my-orders", async (req, res) => {
    const { email } = req.query;
    if (!email) return res.render("user/my-orders.ejs", { orders: [], email: "" });

    try {
        const orders = await Order.find({ buyer_email: email }).sort({ created_at: -1 });
        res.render("user/my-orders.ejs", { orders, email });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.render("user/my-orders.ejs", { orders: [], email });
    }
});

// Category/Project detail routes
router.get("/elearning-projects", async function (req, res) {
    var elearning_projects = await ElearningProject.find();
    res.render("user/elearning-projects.ejs", { elearning_projects });
});

router.get("/single-elearning-project/:id", async function (req, res) {
    try {
        var result = await ElearningProject.findById(req.params.id);
        res.render("user/single-elearning-project.ejs", { single_elearning_project: result });
    } catch (err) {
        res.render("user/single-elearning-project.ejs", { single_elearning_project: null });
    }
});

router.get("/cloud-projects", async function (req, res) {
    var cloud_projects = await CloudProject.find();
    res.render("user/cloud-projects.ejs", { cloud_projects });
});

router.get("/single-cloud-project/:id", async function (req, res) {
    try {
        var result = await CloudProject.findById(req.params.id);
        res.render("user/single-cloud-project.ejs", { single_cloud_project: result });
    } catch (err) {
        res.render("user/single-cloud-project.ejs", { single_cloud_project: null });
    }
});

router.get("/ecommerce-project-list", async function (req, res) {
    var ecommerce_projects = await EcommerceProject.find();
    res.render("user/ecommerce-project-list.ejs", { ecommerce_projects });
});

router.get("/single-ecommerce-project/:id", async function (req, res) {
    try {
        var result = await EcommerceProject.findById(req.params.id);
        res.render("user/single-project-details.ejs", { single_ready_projects: result });
    } catch (err) {
        res.render("user/single-project-details.ejs", { single_ready_projects: null });
    }
});

router.get("/fullstack-project-list", async function (req, res) {
    var fullstack_projects = await FullstackProject.find();
    res.render("user/fullstack-project-list.ejs", { fullstack_projects });
});

router.get("/single-fullstack-project/:id", async function (req, res) {
    try {
        var result = await FullstackProject.findById(req.params.id);
        res.render("user/single-project-details.ejs", { single_ready_projects: result });
    } catch (err) {
        res.render("user/single-project-details.ejs", { single_ready_projects: null });
    }
});

router.get("/mobile-project-list", async function (req, res) {
    var mobile_projects = await MobileProject.find();
    res.render("user/mobile-project-list.ejs", { mobile_projects });
});

router.get("/single-mobile-project/:id", async function (req, res) {
    try {
        var result = await MobileProject.findById(req.params.id);
        res.render("user/single-project-details.ejs", { single_ready_projects: result });
    } catch (err) {
        res.render("user/single-project-details.ejs", { single_ready_projects: null });
    }
});

router.get("/ai-project-list", async function (req, res) {
    var ai_projects = await AiProject.find();
    res.render("user/ai-project-list.ejs", { ai_projects });
});

router.get("/single-ai-project/:id", async function (req, res) {
    try {
        var result = await AiProject.findById(req.params.id);
        res.render("user/single-project-details.ejs", { single_ready_projects: result });
    } catch (err) {
        res.render("user/single-project-details.ejs", { single_ready_projects: null });
    }
});

router.get("/ds-project-list", async function (req, res) {
    var ds_projects = await DsProject.find();
    res.render("user/ds-project-list.ejs", { ds_projects });
});

router.get("/single-ds-project/:id", async function (req, res) {
    try {
        var result = await DsProject.findById(req.params.id);
        res.render("user/single-project-details.ejs", { single_ready_projects: result });
    } catch (err) {
        res.render("user/single-project-details.ejs", { single_ready_projects: null });
    }
});

router.get("/gaming-project-list", async function (req, res) {
    var gaming_projects = await GamingProject.find();
    res.render("user/gaming-project-list.ejs", { gaming_projects });
});

router.get("/single-gaming-project/:id", async function (req, res) {
    try {
        var result = await GamingProject.findById(req.params.id);
        res.render("user/single-project-details.ejs", { single_ready_projects: result });
    } catch (err) {
        res.render("user/single-project-details.ejs", { single_ready_projects: null });
    }
});

router.get("/cyber-project-list", async function (req, res) {
    var cyber_projects = await CyberProject.find();
    res.render("user/cyber-project-list.ejs", { cyber_projects });
});

router.get("/single-cyber-project/:id", async function (req, res) {
    try {
        var result = await CyberProject.findById(req.params.id);
        res.render("user/single-project-details.ejs", { single_ready_projects: result });
    } catch (err) {
        res.render("user/single-project-details.ejs", { single_ready_projects: null });
    }
});

router.get("/blockchain-project-list", async function (req, res) {
    var blockchain_projects = await BlockchainProject.find();
    res.render("user/blockchain-project-list.ejs", { blockchain_projects });
});

router.get("/single-blockchain-project/:id", async function (req, res) {
    try {
        var result = await BlockchainProject.findById(req.params.id);
        res.render("user/single-project-details.ejs", { single_ready_projects: result });
    } catch (err) {
        res.render("user/single-project-details.ejs", { single_ready_projects: null });
    }
});

module.exports = router;
