var express = require("express");
var router = express.Router();
const prefix = "project-rabbit-";
router.use("/uploads", express.static("public/uploads"));
const path = require('path');
const fs = require('fs');

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

// =============================================
// ADMIN AUTHENTICATION MIDDLEWARE
// =============================================

function isAdminLoggedIn(req, res, next) {
    if (req.session && req.session.adminLoggedIn) {
        return next();
    }
    res.redirect("/admin/login");
}

// Admin Login Page (GET)
router.get("/login", function (req, res) {
    if (req.session && req.session.adminLoggedIn) {
        return res.redirect("/admin");
    }
    res.render("admin/login.ejs", { error: null });
});

// Admin Login (POST)
router.post("/login", function (req, res) {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "Admin@1234";

    if (username === adminUser && password === adminPass) {
        req.session.adminLoggedIn = true;
        req.session.adminUsername = username;
        return res.redirect("/admin");
    }
    res.render("admin/login.ejs", { error: "Invalid username or password!" });
});

// Admin Logout
router.get("/logout", function (req, res) {
    req.session.destroy((err) => {
        if (err) console.error("Session destroy error:", err);
        res.redirect("/admin/login");
    });
});

// Protected Admin Dashboard
router.get("/", isAdminLoggedIn, async function(req, res) {
    try {
        const paidOrders = await Order.find({ status: "PAID" });
        const totalOrders = paidOrders.length;
        const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

        const readyCount = await ReadyProject.countDocuments();
        const miniCount = await MiniProject.countDocuments();
        const bundleCount = await BundleProject.countDocuments();
        const totalProjects = readyCount + miniCount + bundleCount;

        const totalComments = await Comment.countDocuments();

        res.render("admin/index.ejs", {
            totalOrders,
            totalRevenue,
            totalProjects,
            totalComments
        });
    } catch (err) {
        console.error("Dashboard error:", err);
        res.render("admin/index.ejs", { totalOrders: 0, totalRevenue: 0, totalProjects: 0, totalComments: 0 });
    }
});

// Helper function to process uploaded files
function processUploadedFiles(req) {
    let image = "";
    let zipFile = "";

    if (req.files) {
        if (req.files.image) {
            image = prefix + req.files.image.name;
            req.files.image.mv("public/uploads/" + image);
        }
        if (req.files.zipFile) {
            zipFile = prefix + req.files.zipFile.name;
            req.files.zipFile.mv("public/uploads/" + zipFile);
        }
    }
    return { image, zipFile };
}

// -------------------------------------------------------------
// READY PROJECTS
// -------------------------------------------------------------
router.get("/add-ready-projects", isAdminLoggedIn, async function(req, res) {
    res.render("admin/add-ready-projects.ejs");
});

router.post("/save-ready-projects", isAdminLoggedIn, async function(req, res) {
    const { image, zipFile } = processUploadedFiles(req);
    const d = req.body;
    await ReadyProject.create({
        ProjectTitle: d.title,
        ProjectCategory: d.category,
        ProjectDescription: d.description,
        ProjectImage: image,
        ProjectZIPFile: zipFile,
        Price: d.price || 0,
        Rating: d.rating || 0
    });
    res.redirect("/admin/add-ready-projects");
});

router.get("/ready-project-list", isAdminLoggedIn, async (req, res) => {
    try {
        const projects = await ReadyProject.find();
        res.render("admin/ready-project-list", { projects });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

router.get("/edit-ready-project/:id", isAdminLoggedIn, async (req, res) => {
    try {
        const project = await ReadyProject.findById(req.params.id);
        if (!project) return res.status(404).send("Project not found");
        res.render("admin/edit-ready-project", { project });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

router.post("/edit-ready-project/:id", isAdminLoggedIn, async function (req, res) {
    var d = req.body;
    var image = d.oldImage || "";
    if (req.files && req.files.ProjectImage) {
        image = req.files.ProjectImage.name;
        req.files.ProjectImage.mv("public/" + image);
    }
    await ReadyProject.findByIdAndUpdate(req.params.id, {
        ProjectTitle: d.ProjectTitle,
        ProjectCategory: d.ProjectCategory,
        ProjectDescription: d.ProjectDescription,
        Price: d.Price,
        ProjectImage: image
    });
    res.redirect("/admin/ready-project-list");
});

router.get("/delete-ready-project/:id", isAdminLoggedIn, async function(req, res) {
    await ReadyProject.findByIdAndDelete(req.params.id);
    res.redirect("/admin/ready-project-list");
});

// -------------------------------------------------------------
// MINI PROJECTS
// -------------------------------------------------------------
router.get("/add-mini-project", isAdminLoggedIn, async function(req, res) {
    res.render("admin/add-mini-project.ejs");
});

router.post("/save-mini-project", isAdminLoggedIn, async function(req, res) {
    const { image, zipFile } = processUploadedFiles(req);
    const d = req.body;
    await MiniProject.create({
        ProjectTitle: d.title,
        ProjectCategory: d.category,
        ProjectDescription: d.description,
        ProjectImage: image,
        ProjectZIPFile: zipFile,
        Price: d.price || 0,
        Rating: d.rating || 0,
        Author: d.author || ""
    });
    res.redirect("/admin/add-mini-project");
});

router.get("/mini-project-list", isAdminLoggedIn, async (req, res) => {
    try {
        const projects = await MiniProject.find();
        res.render("admin/mini-project-list", { projects });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

router.get("/edit-mini-project/:id", isAdminLoggedIn, async (req, res) => {
    try {
        const project = await MiniProject.findById(req.params.id);
        if (!project) return res.status(404).send("Project not found");
        res.render("admin/edit-mini-project", { project });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

router.post("/edit-mini-project/:id", isAdminLoggedIn, async function (req, res) {
    var d = req.body;
    var image = d.oldImage || "";
    if (req.files && req.files.ProjectImage) {
        image = req.files.ProjectImage.name;
        req.files.ProjectImage.mv("public/" + image);
    }
    await MiniProject.findByIdAndUpdate(req.params.id, {
        ProjectTitle: d.ProjectTitle,
        ProjectCategory: d.ProjectCategory,
        ProjectDescription: d.ProjectDescription,
        Price: d.Price,
        Author: d.Author,
        ProjectImage: image
    });
    res.redirect("/admin/mini-project-list");
});

router.get("/delete-mini-project/:id", isAdminLoggedIn, async function (req, res) {
    await MiniProject.findByIdAndDelete(req.params.id);
    res.redirect("/admin/mini-project-list");
});

// -------------------------------------------------------------
// BUNDLE PROJECTS
// -------------------------------------------------------------
router.get("/add-bundle-project", isAdminLoggedIn, async function (req, res) {
    res.render("admin/add-bundle-project.ejs");
});

router.post("/save-bundle-project", isAdminLoggedIn, async function (req, res) {
    const { image, zipFile } = processUploadedFiles(req);
    let docFile = "";
    let pptFile = "";
    let reportFile = "";
    if (req.files) {
        if (req.files.docFile) { docFile = prefix + req.files.docFile.name; req.files.docFile.mv("public/uploads/" + docFile); }
        if (req.files.pptFile) { pptFile = prefix + req.files.pptFile.name; req.files.pptFile.mv("public/uploads/" + pptFile); }
        if (req.files.reportFile) { reportFile = prefix + req.files.reportFile.name; req.files.reportFile.mv("public/uploads/" + reportFile); }
    }
    const d = req.body;
    await BundleProject.create({
        ProjectTitle: d.title,
        ProjectCategory: d.category,
        ProjectDescription: d.description,
        ProjectImage: image,
        ProjectZIPFile: zipFile,
        Documentation: docFile,
        PPT: pptFile,
        Report: reportFile,
        Price: d.price || 0,
        Rating: d.rating || 0,
        Author: d.author || ""
    });
    res.redirect("/admin/add-bundle-project");
});

router.get("/bundle-project-list", isAdminLoggedIn, async (req, res) => {
    try {
        const projects = await BundleProject.find();
        res.render("admin/bundle-project-list", { projects });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

router.get("/edit-bundle-project/:id", isAdminLoggedIn, async (req, res) => {
    try {
        const project = await BundleProject.findById(req.params.id);
        if (!project) return res.status(404).send("Project not found");
        res.render("admin/edit-bundle-project", { project });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

router.post("/edit-bundle-project/:id", isAdminLoggedIn, async function (req, res) {
    var d = req.body;
    var image = d.oldImage || "";
    if (req.files && req.files.ProjectImage) {
        image = req.files.ProjectImage.name;
        req.files.ProjectImage.mv("public/" + image);
    }
    await BundleProject.findByIdAndUpdate(req.params.id, {
        ProjectTitle: d.ProjectTitle,
        ProjectCategory: d.ProjectCategory,
        ProjectDescription: d.ProjectDescription,
        Price: d.Price,
        Author: d.Author,
        ProjectImage: image
    });
    res.redirect("/admin/bundle-project-list");
});

router.get("/delete-bundle-project/:id", isAdminLoggedIn, async function (req, res) {
    await BundleProject.findByIdAndDelete(req.params.id);
    res.redirect("/admin/bundle-project-list");
});

// -------------------------------------------------------------
// CUSTOMIZED PROJECTS
// -------------------------------------------------------------
router.get("/customized-project-list", isAdminLoggedIn, async (req, res) => {
    try {
        const projects = await CustomizedProject.find();
        res.render("admin/customized-project-list", { projects });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

router.get("/delete-customized-project/:id", isAdminLoggedIn, async (req, res) => {
    await CustomizedProject.findByIdAndDelete(req.params.id);
    res.redirect("/admin/customized-project-list");
});

router.get("/edit-customized-project/:id", isAdminLoggedIn, async (req, res) => {
    const project = await CustomizedProject.findById(req.params.id);
    res.render("admin/edit-customized-project", { project });
});

router.post("/update-customized-project/:id", isAdminLoggedIn, async (req, res) => {
    const { name, email, phone, technology, description, status } = req.body;
    await CustomizedProject.findByIdAndUpdate(req.params.id, {
        name, email, phone, technology, description, status
    });
    res.redirect("/admin/customized-project-list");
});

// -------------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------------
router.get("/add-category", isAdminLoggedIn, function (req, res) {
    res.render("admin/add-category.ejs");
});

router.post("/save-category", isAdminLoggedIn, async function (req, res) {
    var image = "";
    if (req.files && req.files.image) {
        image = prefix + req.files.image.name;
        req.files.image.mv("public/uploads/" + image);
    }
    const d = req.body;
    await Category.create({
        name: d.name,
        image,
        price: d.price || 0,
        description: d.description || "",
        link: d.link || ""
    });
    res.redirect("/admin/view-categories");
});

router.get("/view-categories", isAdminLoggedIn, async function (req, res) {
    var categories = await Category.find();
    res.render("admin/view-categories.ejs", { categories });
});

router.get("/delete-category/:id", isAdminLoggedIn, async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect("/admin/view-categories");
});

router.get("/edit-category/:id", isAdminLoggedIn, async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.render("admin/edit-category", { category });
});

router.post("/update-category/:id", isAdminLoggedIn, async (req, res) => {
    const d = req.body;
    let image = d.oldImage || "";
    if (req.files && req.files.image) {
        image = prefix + req.files.image.name;
        req.files.image.mv("public/uploads/" + image);
    }
    await Category.findByIdAndUpdate(req.params.id, {
        name: d.name,
        price: d.price,
        description: d.description,
        link: d.link,
        image
    });
    res.redirect("/admin/view-categories");
});

// -------------------------------------------------------------
// CONTACT REQUESTS (COMMENTS)
// -------------------------------------------------------------
router.get("/contact-request-list", isAdminLoggedIn, async (req, res) => {
    try {
        const comments = await Comment.find();
        res.render("admin/contact-request-list", { comments });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

router.get("/delete-contact/:id", isAdminLoggedIn, async (req, res) => {
    await Comment.findByIdAndDelete(req.params.id);
    res.redirect("/admin/contact-request-list");
});

// -------------------------------------------------------------
// ROADMAPS
// -------------------------------------------------------------
router.get("/add-roadmap", isAdminLoggedIn, function (req, res) {
    res.render("admin/add-roadmap.ejs");
});

router.post("/save-roadmap", isAdminLoggedIn, async function (req, res) {
    let image = "";
    if (req.files && req.files.image) {
        image = prefix + req.files.image.name;
        req.files.image.mv("public/uploads/" + image);
    }
    const d = req.body;
    await Roadmap.create({
        title: d.title,
        short_description: d.short_description,
        category: d.category,
        duration: d.duration,
        image
    });
    res.redirect("/admin/view-roadmaps");
});

router.get("/view-roadmaps", isAdminLoggedIn, async function (req, res) {
    var roadmaps = await Roadmap.find();
    res.render("admin/view-roadmaps.ejs", { roadmaps });
});

router.get("/delete-roadmap/:id", isAdminLoggedIn, async (req, res) => {
    await Roadmap.findByIdAndDelete(req.params.id);
    res.redirect("/admin/view-roadmaps");
});

router.get("/edit-roadmap/:id", isAdminLoggedIn, async (req, res) => {
    const roadmap = await Roadmap.findById(req.params.id);
    res.render("admin/edit-roadmap", { roadmap });
});

router.post("/update-roadmap/:id", isAdminLoggedIn, async (req, res) => {
    const d = req.body;
    let image = d.oldImage || "";
    if (req.files && req.files.image) {
        image = prefix + req.files.image.name;
        req.files.image.mv("public/uploads/" + image);
    }
    await Roadmap.findByIdAndUpdate(req.params.id, {
        title: d.title,
        short_description: d.short_description,
        category: d.category,
        duration: d.duration,
        image
    });
    res.redirect("/admin/view-roadmaps");
});

// Helper generator for generic standard project CRUD routes
function registerGenericProjectAdminRoutes(config) {
    const { routeSlug, Model, hasType, hasTech } = config;

    router.get(`/add-${routeSlug}-projects`, isAdminLoggedIn, async function(req, res) {
        res.render(`admin/add-${routeSlug}-projects.ejs`);
    });

    router.post(`/save-${routeSlug}-projects`, isAdminLoggedIn, async function(req, res) {
        const { image, zipFile } = processUploadedFiles(req);
        const d = req.body;
        const payload = {
            ProjectTitle: d.title,
            ProjectCategory: d.category || "",
            ProjectDescription: d.description || "",
            ProjectImage: image,
            ProjectZIPFile: zipFile,
            Price: d.price || 0,
            Rating: d.rating || 0,
            Author: d.author || ""
        };
        if (hasType) payload.ProjectType = d.projectType || "";
        if (hasTech) {
            payload.Technologies = d.technologies || "";
            payload.Compatibility = d.compatibility || "";
        }
        await Model.create(payload);
        res.redirect(`/admin/add-${routeSlug}-projects`);
    });

    router.get(`/${routeSlug}-project-list`, isAdminLoggedIn, async (req, res) => {
        try {
            const projects = await Model.find();
            res.render(`admin/${routeSlug}-project-list`, { projects });
        } catch (error) {
            res.status(500).send("Server Error");
        }
    });

    router.get(`/edit-${routeSlug}-project/:id`, isAdminLoggedIn, async (req, res) => {
        try {
            const project = await Model.findById(req.params.id);
            if (!project) return res.status(404).send("Not found");
            res.render(`admin/edit-${routeSlug}-project`, { project });
        } catch (error) {
            res.status(500).send("Server Error");
        }
    });

    router.post(`/edit-${routeSlug}-project/:id`, isAdminLoggedIn, async function (req, res) {
        const d = req.body;
        let image = d.oldImage || "";
        if (req.files && req.files.ProjectImage) {
            image = req.files.ProjectImage.name;
            req.files.ProjectImage.mv("public/" + image);
        }
        const payload = {
            ProjectTitle: d.ProjectTitle,
            ProjectCategory: d.ProjectCategory || "",
            ProjectDescription: d.ProjectDescription || "",
            Price: d.Price || 0,
            Author: d.Author || "",
            ProjectImage: image
        };
        if (hasType) payload.ProjectType = d.ProjectType || "";
        if (hasTech) {
            payload.Technologies = d.Technologies || "";
            payload.Compatibility = d.Compatibility || "";
        }
        await Model.findByIdAndUpdate(req.params.id, payload);
        res.redirect(`/admin/${routeSlug}-project-list`);
    });

    router.get(`/delete-${routeSlug}-project/:id`, isAdminLoggedIn, async function(req, res) {
        await Model.findByIdAndDelete(req.params.id);
        res.redirect(`/admin/${routeSlug}-project-list`);
    });
}

// Register generic CRUD routes for all remaining category projects
const categoryConfigs = [
    { routeSlug: "ecommerce", Model: EcommerceProject },
    { routeSlug: "web-development", Model: WebDevelopmentProject, hasTech: true },
    { routeSlug: "fullstack", Model: FullstackProject },
    { routeSlug: "mobile", Model: MobileProject },
    { routeSlug: "ai", Model: AiProject, hasType: true },
    { routeSlug: "ds", Model: DsProject },
    { routeSlug: "gaming", Model: GamingProject },
    { routeSlug: "cyber", Model: CyberProject },
    { routeSlug: "blockchain", Model: BlockchainProject },
    { routeSlug: "cloud", Model: CloudProject, hasType: true },
    { routeSlug: "elearning", Model: ElearningProject }
];

categoryConfigs.forEach(config => registerGenericProjectAdminRoutes(config));

module.exports = router;
