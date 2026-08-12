# React-Node.js E-Commerce Website Review

## 📊 Project Overview
**Application:** Full-stack e-commerce platform (Fabornas)  
**Tech Stack:** React 19.2.5, Node.js/Express, MongoDB, JWT Authentication  
**Architecture:** Client-Server with admin panel and product management

---

## 🔴 CRITICAL ISSUES (Fix Immediately)

### 1. **Hardcoded JWT Secret Key** ⚠️ SECURITY RISK
**Files Affected:**
- `server/routes/auth.js` (line 48)
- `server/middleware/verifyToken.js` (line 10)
- `server/middleware/admin.js` (line 12)

**Issue:** Secret key `"secretkey"` is hardcoded in multiple places
```javascript
// ❌ CURRENT (INSECURE)
const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "secretkey");
```

**Risk:** Anyone can forge tokens and impersonate users/admins

**Fix:**
```javascript
// ✅ CORRECT
const token = jwt.sign(
  { id: user._id, isAdmin: user.isAdmin },
  process.env.JWT_SECRET
);
```

**Action Required:**
- Move `JWT_SECRET` to `.env` file
- Use same secret across all JWT operations
- Add `.env` to `.gitignore` if not already done

---

### 2. **No Input Validation**
**Files Affected:**
- `server/routes/auth.js` (register/login endpoints)
- `server/routes/products.js` (product creation)

**Issue:** No validation on email format, password strength, or required fields
```javascript
// ❌ CURRENT
router.post("/register", async (req, res) => {
  const { email, password } = req.body; // No validation!
```

**Risks:**
- Invalid email registrations
- Weak passwords accepted
- Missing fields cause database errors

**Recommended Solutions:**
- Use `joi` or `express-validator` for input validation
- Validate email format
- Enforce minimum password requirements (8+ chars, mixed case, numbers)

---

### 3. **Missing JWT Token Expiration**
**Issue:** JWTs are issued without expiration times

**Current Code:**
```javascript
const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "secretkey");
// No expiresIn option!
```

**Risk:** Tokens never expire, compromised tokens remain valid forever

**Fix:**
```javascript
const token = jwt.sign(
  { id: user._id, isAdmin: user.isAdmin },
  process.env.JWT_SECRET,
  { expiresIn: "7d" } // Add expiration
);
```

---

### 4. **Exposed API Endpoint with Hardcoded URL**
**Files Affected:**
- `client/src/Login.js` (line 17)
- Multiple client files likely have hardcoded URLs

**Issue:**
```javascript
// ❌ HARDCODED
const res = await fetch("http://localhost:5000/api/login", {
```

**Problem:** Won't work in production; need environment-based URLs

**Fix:**
```javascript
// ✅ USE ENV VARIABLE
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const res = await fetch(`${API_URL}/api/login`, {
```

---

## 🟡 HIGH PRIORITY ISSUES

### 5. **Duplicate Server Files**
**Issue:** Both `server/server.js` and `server/index.js` + `server/app.js` exist
- `server.js` - Sets up routes, connects to MongoDB
- `app.js` - Has duplicate setup, different middleware configuration
- `index.js` - Unknown purpose

**Risk:** Confusion about which file is actually running; inconsistent middleware

**Action:** Consolidate into single entry point (keep `server.js` as main)

---

### 6. **No Error Handling Middleware**
**Files Affected:** `server/app.js`, `server/server.js`

**Issue:** No global error handling or 404 catch-all

```javascript
// ❌ Missing error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});
```

**Impact:** Unhandled errors crash routes; poor error responses to frontend

---

### 7. **Client-Side Token Validation is Incomplete**
**File:** `client/src/ProtectedRoute.js`

**Issue:** Only checks JWT structure, doesn't verify signature
```javascript
// ❌ CURRENT - Only decodes, doesn't verify
const payload = JSON.parse(atob(parts[1]));
```

**Fix:** Verify token on backend before allowing access (already done but not double-checked on client)

---

### 8. **No Password Reset/Recovery Flow**
**Issue:** Locked out users have no recovery mechanism

**Recommendation:** Implement:
- Forgot password endpoint
- Email verification
- Secure token-based reset link

---

## 🟠 MEDIUM PRIORITY ISSUES

### 9. **SQL Injection Risk in Product Searches**
**File:** `server/routes/searchroutes.js` (not reviewed but named suspiciously)

**Recommendation:** Ensure MongoDB queries use parameterized queries only

---

### 10. **Missing Database Constraints**
**File:** `server/models/User.js`

**Current:**
```javascript
const userSchema = new mongoose.Schema({
  email: String,      // ❌ No uniqueness constraint
  password: String,   // ❌ No hashing in schema
  isAdmin: { type: Boolean, default: false }
});
```

**Issues:**
- Duplicate emails allowed
- No email format validation at schema level
- No timestamps

**Fix:**
```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide valid email"]
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });
```

---

### 11. **Missing Rate Limiting**
**Issue:** No protection against brute force attacks on login/register

**Recommendation:** Add `express-rate-limit` middleware
```javascript
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});
app.use("/api/login", limiter);
app.use("/api/register", limiter);
```

---

### 12. **Admin Role Always True on Register**
**File:** `server/routes/auth.js` (line 17)

```javascript
// ❌ PROBLEM
const user = new User({
  email,
  password: hashed,
  isAdmin: true  // Every new user is admin!
});
```

**Impact:** All registered users become admins - major security breach

**Fix:**
```javascript
const user = new User({
  email,
  password: hashed,
  isAdmin: false  // Default to user
});
```

---

### 13. **No HTTPS Configuration**
**Issue:** Production should enforce HTTPS; currently allows HTTP

**Fix:** Use `helmet` middleware
```javascript
const helmet = require("helmet");
app.use(helmet());
```

---

## 🔵 LOW PRIORITY ISSUES / IMPROVEMENTS

### 14. **Missing API Documentation**
**Recommendation:** Add Swagger/OpenAPI documentation
- Create API docs for `/api/products`, `/api/orders`, `/api/admin` endpoints
- Document request/response formats
- Include example usage

---

### 15. **Inconsistent Error Responses**
**Issue:** Error messages vary in format across endpoints

**Current patterns:**
- `{ message: "..." }`
- `{ error: "..." }`
- `{ success: false }`

**Fix:** Standardize error response format:
```javascript
{
  success: boolean,
  message: string,
  data: object | null,
  error: { code: string, details: string } | null
}
```

---

### 16. **No Logging/Monitoring**
**Recommendation:** Add logging with `winston` or `pino`
```javascript
const logger = require("winston");
logger.info("User login attempt", { email, timestamp });
```

---

### 17. **Frontend Missing API Error Handling**
**File:** `client/src/api.js`

**Issue:** No interceptors for failed requests, expired tokens
```javascript
// ✅ ADD INTERCEPTOR
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

### 18. **No Loading States in UI**
**Files:** Login, Admin, Products components

**Issue:** Users don't see feedback during API calls
**Fix:** Add loading state management with `useState`

---

### 19. **Unnecessary Comments with Emojis**
**Issue:** Code quality → reduce emoji-heavy comments in production

```javascript
// ❌ Reduce these
/* 🔥 ADMIN DASHBOARD */
const token = jwt.sign(..., "secretkey"); // 🔥 SAME SECRET
```

---

## ✅ WHAT'S WORKING WELL

1. ✅ **Proper bcrypt usage** - Passwords are hashed correctly
2. ✅ **JWT implementation structure** - Correct approach (just needs secret fix)
3. ✅ **Protected routes on frontend** - Token check implemented
4. ✅ **Admin verification middleware** - Checks isAdmin flag
5. ✅ **File upload handling** - Using multer correctly
6. ✅ **MongoDB integration** - Proper schema and model structure
7. ✅ **CORS enabled** - Allows cross-origin requests
8. ✅ **React Router setup** - Clean route organization

---

## 📋 QUICK FIX CHECKLIST (Priority Order)

- [ ] **CRITICAL:** Move JWT secret to `.env` file and update all 3 middleware files
- [ ] **CRITICAL:** Fix `isAdmin: true` to `isAdmin: false` in registration
- [ ] **CRITICAL:** Add JWT token expiration with `expiresIn`
- [ ] Add input validation (joi/express-validator) to auth routes
- [ ] Consolidate server files (keep only server.js)
- [ ] Add global error handling middleware
- [ ] Update User schema with unique email and validations
- [ ] Add rate limiting to auth endpoints
- [ ] Add helmet middleware for security headers
- [ ] Standardize error response format
- [ ] Add logging middleware
- [ ] Add API interceptor for 401 responses on frontend
- [ ] Remove hardcoded API URLs

---

## 🚀 DEPLOYMENT RECOMMENDATIONS

1. **Environment Variables Required:**
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT`
   - `NODE_ENV`
   - `REACT_APP_API_URL`

2. **Before Production:**
   - Run security audit: `npm audit`
   - Set `NODE_ENV=production`
   - Enable HTTPS only
   - Set secure cookie flags
   - Add CSRF protection if needed
   - Implement API rate limiting
   - Set up monitoring/logging

3. **Testing:**
   - Add unit tests for auth logic
   - Add integration tests for API endpoints
   - Test admin authorization flows
   - Test token expiration scenarios

---

## 📊 Security Score: 4/10
- **Strengths:** Password hashing, basic JWT, protected routes
- **Weaknesses:** Hardcoded secrets, missing validation, no expiration, all users are admins

After fixes: **Expected: 7.5/10** (with additional improvements could reach 9/10)

---

## 📞 Next Steps

1. Start with CRITICAL issues immediately
2. Test locally after each major fix
3. Update `.env.example` for team reference
4. Consider adding automated security checks (pre-commit hooks)
5. Plan for regular dependency updates

