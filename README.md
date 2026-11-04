# Gram Panchayat Digital Management System
### ಗ್ರಾಮ ಪಂಚಾಯತ್ ಡಿಜಿಟಲ್ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ
**Government of Karnataka • Rural Development and Panchayati Raj Department (RDPR)**

An enterprise-grade, mobile-responsive e-Governance platform built for **Android and Web** to manage Gram Panchayat demographics, village profiles, elections, ration card (APL/BPL) registries, and public treasury funds with audited expenditure vouchers.

---

## 🌟 Key Features

### 1. Main Page & Government Dashboard
- **Official Blue & White Theme**: Styled to match official Government of Karnataka and Panchayati Raj portals with Ashoka Chakra and RDPR emblems.
- **Bilingual Interface**: Seamless 1-click switcher between **Kannada (ಕನ್ನಡ)** and **English**.
- **Admin Authentication**: Role-based access control for:
  - **Super Administrator** (CEO / Zilla Panchayat)
  - **Panchayat Development Officer (PDO)**
  - **Gram Panchayat President (ಅಧ್ಯಕ್ಷರು)**

### 2. Live Admin Dashboard Metrics
Displays all 11 critical Panchayat indicators in real-time:
1. **Total Villages**: 10 Registered Wards
2. **Total Population**: Aggregated across all wards
3. **Total Living Members**: Verified living citizens
4. **Total Families**: Registered households
5. **APL Card Families**: Above Poverty Line households
6. **BPL Card Families**: Below Poverty Line (NFSA / Anna Bhagya)
7. **Total Registered Voters**: Official electoral roll
8. **Total Votes Cast**: Polled ballots with turnout percentage
9. **Total Funds Received**: Central & State grants
10. **Total Expenses**: Audited vouchers & public works
11. **Remaining Balance**: Live treasury reserve

### 3. Village Management (10 Separate Profiles)
Pre-populated with 10 realistic Karnataka Gram Panchayat villages:
1. **Shivapura (ಶಿವಪುರ)** - Ward 1 (Headquarters)
2. **Doddakallahalli (ದೊಡ್ಡಕಲ್ಲಹಳ್ಳಿ)** - Ward 2
3. **Malleshwara (ಮಲ್ಲೇಶ್ವರ)** - Ward 3
4. **Ramanagara (ರಾಮನಗರ)** - Ward 4
5. **Gandhinagar (ಗಾಂಧಿನಗರ)** - Ward 5
6. **Krishnarajapura (ಕೃಷ್ಣರಾಜಪುರ)** - Ward 6
7. **Nelamangala (ನೆಲಮಂಗಲ)** - Ward 7
8. **Devanahalli (ದೇವನಹಳ್ಳಿ)** - Ward 8
9. **Someshwara (ಸೋಮೇಶ್ವರ)** - Ward 9
10. **Kempegowda Nagar (ಕೆಂಪೇಗೌಡ ನಗರ)** - Ward 10

**Features:**
- **Add Village**: Form with automatic totals and living members validation.
- **Edit Village**: Full update capability.
- **View Profile**: Deep-dive profile with demographic ratios, voter turnouts, and Sarpanch contact details.
- **Delete Record**: Safe deletion with audit confirmation dialog.
- **Card and Tabular Views**: Responsive toggle for mobile phones and desktops.

### 4. Election Management (Statutory Privacy Compliant)
- **Turnout Statistics**: Total voters, votes cast, and voting percentage.
- **Officially Declared Results**: Ward-by-ward winners, political panel affiliation, election symbol, votes secured, and victory margins.
- **Strict Privacy Mandate**: Strictly complies with **Section 128 of the Representation of the People Act, 1951** — zero secret ballot or individual voter selections are stored.
- **Gazette PDF Export**: Instant official election report generator.

### 5. Village Funds & Public Expenditure Management
- **Central & State Grants**: Tracks 15th Finance Commission Untied Grants, MGNREGA allocations, State Finance Commission (SFC) Grants, and Swachh Bharat Mission (Grameen).
- **Categorized Expenses**:
  - Road Development (CC Road & Drainage)
  - Water Supply (Jal Jeevan Mission & RO plants)
  - Sanitation & Solid Waste Management
  - Street Lighting & Solar LED maintenance
  - Healthcare & Anganwadi maintenance
- **Audited Vouchers**: Full register with voucher numbers, dates, beneficiary village, approval authority (PDO / President), and receipt scan attachment viewer.

### 6. Ration Card Distribution (APL / BPL)
- Detailed household classification into Above Poverty Line (APL) and Below Poverty Line (BPL) under National Food Security Act (NFSA).
- Ward-level Fair Price Shop (FPS) dealer mapping.

### 7. Official PDF & Excel Reports
- **1-Click Master PDF Report**: Official letterhead, Ashoka emblem, summary KPI table, village census, and PDO/President signature blocks using `jspdf`.
- **Multi-Sheet Excel Workbook**: Formatted `.xlsx` file with `Village_Demographics`, `Ration_APL_BPL`, `Election_Results`, and `Funds_and_Vouchers` sheets using `xlsx`.

### 8. Database & Firebase Firestore Connectivity
- **Collections Configured**:
  - `Admins`
  - `Villages`
  - `VillageStatistics`
  - `RationCardSummary`
  - `ElectionStatistics`
  - `Funds`
  - `Transactions`
  - `AuditLogs`
- **Security Rules**: Included in `firestore.rules`.
- **Hybrid Offline Support**: Works immediately out of the box using persistent LocalStorage with seamless Firebase synchronization when credentials are provided.

---

## 🚀 Running the Web Application

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📱 Building Android APK (Capacitor)

The project includes `capacitor.config.json` pre-configured for Android builds:

```bash
# 1. Build the production web bundle
npm run build

# 2. Add Android platform (if using Capacitor CLI)
npx cap add android

# 3. Copy web assets to Android project
npx cap copy

# 4. Open in Android Studio to build signed APK
npx cap open android
```

Alternatively, open `http://<your-ip>:5173/` in Google Chrome on your Android phone and select **"Add to Home screen"** to install it as a native Progressive Web App (PWA).

---

## 🔒 Security & Audit Trail
Every administrative update, deletion, creation, login, and export event is logged in the immutable **Audit History** tab with officer name, role, timestamp, and action parameters.
