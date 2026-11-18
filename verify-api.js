import "dotenv/config";
import mongoose from "mongoose";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import Post from "./src/models/post.model.js";
import User from "./src/models/user.model.js";

async function runTests() {
    console.log("==================================================");
    console.log("🚀 STARTING BACKEND API VERIFICATION SUITE");
    console.log("==================================================\n");

    try {
        await connectDB();
    } catch (err) {
        console.error("❌ Database connection failed. Aborting tests.", err.message);
        process.exit(1);
    }

    // Start server on an ephemeral free port
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;
    console.log(`📡 Test server running at ${baseUrl}\n`);

    let passedTests = 0;
    let totalTests = 0;

    const assertTest = (description, condition, details = "") => {
        totalTests++;
        if (condition) {
            console.log(`  ✅ PASS: ${description}`);
            passedTests++;
        } else {
            console.error(`  ❌ FAIL: ${description}`);
            if (details) console.error(`     Details: ${details}`);
        }
    };

    let createdPostId = null;
    const testEmail = `test_${Date.now()}@example.com`;

    try {
        // ----------------------------------------------------
        // TEST 1: Root Health Check
        // ----------------------------------------------------
        console.log("--- 1. Health Check Endpoint ---");
        const resRoot = await fetch(`${baseUrl}/`);
        const rootText = await resRoot.text();
        assertTest("GET / returns 200 OK and running message", resRoot.status === 200 && rootText.includes("Running"), `Status: ${resRoot.status}, Text: ${rootText}`);

        // ----------------------------------------------------
        // TEST 2: CREATE POST (POST /api/posts)
        // ----------------------------------------------------
        console.log("\n--- 2. Post CRUD: Create Post ---");
        const resCreate = await fetch(`${baseUrl}/api/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "College Assignment Test Post",
                content: "Testing CRUD operations with Node, Express & MongoDB Atlas."
            })
        });
        const createdPost = await resCreate.json();
        createdPostId = createdPost._id;
        assertTest("POST /api/posts returns 201 Created with valid ID", resCreate.status === 201 && !!createdPostId, `Status: ${resCreate.status}, Body: ${JSON.stringify(createdPost)}`);

        // ----------------------------------------------------
        // TEST 3: CREATE POST VALIDATION ERROR (Missing fields)
        // ----------------------------------------------------
        console.log("\n--- 3. Post Validation: Missing Fields ---");
        const resMissing = await fetch(`${baseUrl}/api/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Incomplete Post Without Content" })
        });
        assertTest("POST /api/posts without content returns 400 Bad Request", resMissing.status === 400, `Status: ${resMissing.status}`);

        // ----------------------------------------------------
        // TEST 4: GET ALL POSTS (GET /api/posts)
        // ----------------------------------------------------
        console.log("\n--- 4. Post CRUD: Read All Posts ---");
        const resGetAll = await fetch(`${baseUrl}/api/posts`);
        const allPosts = await resGetAll.json();
        assertTest("GET /api/posts returns 200 OK and array containing created post", resGetAll.status === 200 && Array.isArray(allPosts) && allPosts.some(p => p._id === createdPostId), `Status: ${resGetAll.status}, Array length: ${allPosts.length}`);

        // ----------------------------------------------------
        // TEST 5: GET SINGLE POST BY ID (GET /api/posts/:id)
        // ----------------------------------------------------
        console.log("\n--- 5. Post CRUD: Read Single Post By ID ---");
        const resGetOne = await fetch(`${baseUrl}/api/posts/${createdPostId}`);
        const singlePost = await resGetOne.json();
        assertTest("GET /api/posts/:id returns 200 OK with correct post details", resGetOne.status === 200 && singlePost._id === createdPostId, `Status: ${resGetOne.status}, Title: ${singlePost.title}`);

        // ----------------------------------------------------
        // TEST 6: GET POST WITH INVALID OBJECTID FORMAT
        // ----------------------------------------------------
        console.log("\n--- 6. Post Validation: Invalid ObjectId Format ---");
        const resInvalidId = await fetch(`${baseUrl}/api/posts/invalid-id-12345`);
        assertTest("GET /api/posts/invalid-id returns 400 Bad Request", resInvalidId.status === 400, `Status: ${resInvalidId.status}`);

        // ----------------------------------------------------
        // TEST 7: UPDATE POST (PUT /api/posts/:id)
        // ----------------------------------------------------
        console.log("\n--- 7. Post CRUD: Update Post ---");
        const resUpdate = await fetch(`${baseUrl}/api/posts/${createdPostId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Updated Assignment Post Title",
                content: "Updated content successfully verified."
            })
        });
        const updatedPost = await resUpdate.json();
        assertTest("PUT /api/posts/:id returns 200 OK with updated title", resUpdate.status === 200 && updatedPost.title === "Updated Assignment Post Title", `Status: ${resUpdate.status}, Title: ${updatedPost.title}`);

        // ----------------------------------------------------
        // TEST 8: DELETE POST (DELETE /api/posts/:id)
        // ----------------------------------------------------
        console.log("\n--- 8. Post CRUD: Delete Post ---");
        const resDelete = await fetch(`${baseUrl}/api/posts/${createdPostId}`, {
            method: "DELETE"
        });
        assertTest("DELETE /api/posts/:id returns 200 OK with success message", resDelete.status === 200, `Status: ${resDelete.status}`);

        // ----------------------------------------------------
        // TEST 9: VERIFY POST IS GONE (GET /api/posts/:id returns 404)
        // ----------------------------------------------------
        console.log("\n--- 9. Post Verification: Verify Post Is Deleted ---");
        const resGetDeleted = await fetch(`${baseUrl}/api/posts/${createdPostId}`);
        assertTest("GET /api/posts/:id for deleted post returns 404 Not Found", resGetDeleted.status === 404, `Status: ${resGetDeleted.status}`);

        // ----------------------------------------------------
        // TEST 10: USER REGISTRATION (POST /api/users/register)
        // ----------------------------------------------------
        console.log("\n--- 10. User Auth: Registration ---");
        const resRegister = await fetch(`${baseUrl}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "student_tester",
                email: testEmail,
                password: "SecurePassword123!"
            })
        });
        const regBody = await resRegister.json();
        assertTest("POST /api/users/register returns 201 Created without exposing password", resRegister.status === 201 && regBody.user && !regBody.user.password, `Status: ${resRegister.status}, Body: ${JSON.stringify(regBody)}`);

        // ----------------------------------------------------
        // TEST 11: DUPLICATE USER REGISTRATION (POST /api/users/register)
        // ----------------------------------------------------
        console.log("\n--- 11. User Auth: Duplicate Registration Prevention ---");
        const resDupRegister = await fetch(`${baseUrl}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "another_user",
                email: testEmail,
                password: "Password123!"
            })
        });
        assertTest("POST /api/users/register with duplicate email returns 400 Bad Request", resDupRegister.status === 400, `Status: ${resDupRegister.status}`);

        // ----------------------------------------------------
        // TEST 12: USER LOGIN SUCCESS (POST /api/users/login)
        // ----------------------------------------------------
        console.log("\n--- 12. User Auth: Login With Correct Credentials ---");
        const resLogin = await fetch(`${baseUrl}/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: testEmail,
                password: "SecurePassword123!"
            })
        });
        const loginBody = await resLogin.json();
        assertTest("POST /api/users/login with correct password returns 200 OK", resLogin.status === 200 && loginBody.user && loginBody.user.email === testEmail, `Status: ${resLogin.status}`);

        // ----------------------------------------------------
        // TEST 13: USER LOGIN FAILURE (POST /api/users/login with wrong password)
        // ----------------------------------------------------
        console.log("\n--- 13. User Auth: Login With Incorrect Password ---");
        const resWrongLogin = await fetch(`${baseUrl}/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: testEmail,
                password: "WrongPassword999!"
            })
        });
        assertTest("POST /api/users/login with wrong password returns 400 Bad Request", resWrongLogin.status === 400, `Status: ${resWrongLogin.status}`);

        // ----------------------------------------------------
        // TEST 14: GET ALL USERS (GET /api/users)
        // ----------------------------------------------------
        console.log("\n--- 14. User Auth: Get Users Without Passwords ---");
        const resGetUsers = await fetch(`${baseUrl}/api/users`);
        const usersList = await resGetUsers.json();
        const hasNoPassword = Array.isArray(usersList) && usersList.every(u => !u.password);
        assertTest("GET /api/users returns 200 OK and excludes password hashes", resGetUsers.status === 200 && hasNoPassword, `Status: ${resGetUsers.status}`);

        // ----------------------------------------------------
        // TEST 15: UNDEFINED ROUTE (404 Not Found)
        // ----------------------------------------------------
        console.log("\n--- 15. Routing: Undefined Route ---");
        const res404 = await fetch(`${baseUrl}/api/non-existent-route`);
        assertTest("GET /api/non-existent-route returns 404 Not Found", res404.status === 404, `Status: ${res404.status}`);

    } finally {
        // Cleanup test user
        try {
            await User.deleteOne({ email: testEmail });
            if (createdPostId) {
                await Post.findByIdAndDelete(createdPostId);
            }
        } catch (cleanupErr) {
            console.error("Cleanup note:", cleanupErr.message);
        }

        server.close();
        await mongoose.disconnect();
        console.log("\n==================================================");
        console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
        console.log("==================================================");

        if (passedTests === totalTests) {
            console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
            process.exit(0);
        } else {
            console.error("⚠️ SOME TESTS FAILED.");
            process.exit(1);
        }
    }
}

runTests();
