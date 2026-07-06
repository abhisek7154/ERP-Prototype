# School ERP MVP Architecture

This document describes the current target architecture of the School ERP after removing unnecessary frontend modules and choosing a full-stack Next.js architecture.

The application uses:

- Next.js App Router
- React
- TypeScript
- Prisma ORM
- PostgreSQL
- TanStack Query
- Tailwind CSS
- shadcn/ui-style reusable UI components
- Zod for validation
- ExcelJS for Excel file processing

---

# 1. System Architecture

```text
Browser
   │
   ▼
Next.js Application
   │
   ├── Server Components
   │       │
   │       ▼
   │     Prisma
   │       │
   │       ▼
   │   PostgreSQL
   │
   ├── Client Components
   │       │
   │       ▼
   │   Server Actions
   │   Route Handlers
   │       │
   │       ▼
   │     Prisma
   │       │
   │       ▼
   │   PostgreSQL
   │
   └── Excel Import
           │
           ▼
       Route Handler
           │
           ▼
       Excel Parser
           │
           ▼
         Mapper
           │
           ▼
        Validator
           │
           ▼
      Import Service
           │
           ▼
         Prisma
           │
           ▼
       PostgreSQL
```

Client Components must never access Prisma directly.

---

# 2. Project Structure

```text
school-erp/
│
├── frontend/
│
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── src/
│   │
│   │   ├── app/
│   │   │
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── globals.css
│   │   │
│   │   │   ├── (auth)/
│   │   │   │
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   │
│   │   │   │   └── signup/
│   │   │   │       └── page.tsx
│   │   │
│   │   │   ├── (dashboard)/
│   │   │   │
│   │   │   │   ├── layout.tsx
│   │   │   │
│   │   │   │   ├── _components/
│   │   │   │   │   ├── app-sidebar.tsx
│   │   │   │   │   ├── nav-main.tsx
│   │   │   │   │   ├── nav-secondary.tsx
│   │   │   │   │   ├── sidebar-nav.tsx
│   │   │   │   │   ├── user-button.tsx
│   │   │   │   │   └── theme-segment-control.tsx
│   │   │   │
│   │   │   │   └── dashboard/
│   │   │   │       │
│   │   │   │       ├── page.tsx
│   │   │   │       │
│   │   │   │       ├── overview/
│   │   │   │       │   └── page.tsx
│   │   │   │       │
│   │   │   │       ├── reports/
│   │   │   │       │   └── page.tsx
│   │   │   │       │
│   │   │   │       ├── academics/
│   │   │   │       │   │
│   │   │   │       │   ├── classes/
│   │   │   │       │   │   └── page.tsx
│   │   │   │       │   │
│   │   │   │       │   └── attendance/
│   │   │   │       │       └── page.tsx
│   │   │   │       │
│   │   │   │       ├── people/
│   │   │   │       │   │
│   │   │   │       │   └── students/
│   │   │   │       │       └── page.tsx
│   │   │   │       │
│   │   │   │       ├── operations/
│   │   │   │       │   │
│   │   │   │       │   └── finance/
│   │   │   │       │       └── page.tsx
│   │   │   │       │
│   │   │   │       ├── admin/
│   │   │   │       │   │
│   │   │   │       │   └── users-access/
│   │   │   │       │       │
│   │   │   │       │       └── users/
│   │   │   │       │           └── page.tsx
│   │   │   │       │
│   │   │   │       ├── imports/
│   │   │   │       │   │
│   │   │   │       │   └── students/
│   │   │   │       │       │
│   │   │   │       │       ├── page.tsx
│   │   │   │       │       │
│   │   │   │       │       └── _components/
│   │   │   │       │           ├── ExcelUpload.tsx
│   │   │   │       │           ├── ImportPreview.tsx
│   │   │   │       │           ├── ImportSummary.tsx
│   │   │   │       │           └── ImportErrorTable.tsx
│   │   │   │       │
│   │   │   │       └── settings/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   └── api/
│   │   │       │
│   │   │       └── imports/
│   │   │           │
│   │   │           └── students/
│   │   │               │
│   │   │               ├── preview/
│   │   │               │   └── route.ts
│   │   │               │
│   │   │               └── execute/
│   │   │                   └── route.ts
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   └── ui/
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── table.tsx
│   │   │       ├── input.tsx
│   │   │       ├── select.tsx
│   │   │       ├── avatar.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── sidebar.tsx
│   │   │       └── ...
│   │   │
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── modules/
│   │   │   │
│   │   │   ├── auth/
│   │   │   ├── student/
│   │   │   ├── class/
│   │   │   ├── attendance/
│   │   │   ├── fee/
│   │   │   ├── report/
│   │   │   ├── user/
│   │   │   │
│   │   │   └── import/
│   │   │       │
│   │   │       ├── shared/
│   │   │       │   ├── excel.parser.ts
│   │   │       │   ├── excel-date.parser.ts
│   │   │       │   ├── excel-value.parser.ts
│   │   │       │   ├── import.types.ts
│   │   │       │   └── import-error.ts
│   │   │       │
│   │   │       └── students/
│   │   │           ├── student-import.schema.ts
│   │   │           ├── student-import.mapper.ts
│   │   │           ├── student-import.validator.ts
│   │   │           ├── student-import.service.ts
│   │   │           └── student-import.types.ts
│   │   │
│   │   ├── providers/
│   │   ├── hooks/
│   │   ├── config/
│   │   ├── stores/
│   │   └── types/
│   │
│   ├── public/
│   ├── .env
│   ├── prisma.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── doc/
    └── mvp-architecture.md
```

---

# 3. Dashboard Menu

The authoritative sidebar configuration is:

```text
frontend/src/app/(dashboard)/_components/sidebar-nav.tsx
```

Current MVP navigation:

```text
Dashboard
├── Overview
└── Reports

Academics
├── Classes / Sections
└── Attendance

People
└── Students

Operations
└── Finance

Administration
└── Users & Access

Secondary Navigation
├── Profile
└── Settings
```

---

# 4. Navigation Mapping

| Sidebar Item | URL | Next.js Route |
|---|---|---|
| Dashboard | `/dashboard` | `dashboard/page.tsx` |
| Overview | `/dashboard/overview` | `dashboard/overview/page.tsx` |
| Reports | `/dashboard/reports` | `dashboard/reports/page.tsx` |
| Classes / Sections | `/dashboard/academics/classes` | `dashboard/academics/classes/page.tsx` |
| Attendance | `/dashboard/academics/attendance` | `dashboard/academics/attendance/page.tsx` |
| Students | `/dashboard/people/students` | `dashboard/people/students/page.tsx` |
| Finance | `/dashboard/operations/finance` | `dashboard/operations/finance/page.tsx` |
| Users & Access | `/dashboard/admin/users-access/users` | `dashboard/admin/users-access/users/page.tsx` |
| Student Import | `/dashboard/imports/students` | `dashboard/imports/students/page.tsx` |
| Settings | `/dashboard/settings` | `dashboard/settings/page.tsx` |

The `[...slug]` catch-all placeholder route has been removed.

Every active sidebar URL must now have a real `page.tsx`.

---

# 5. Layer Responsibilities

## 5.1 App Layer

Location:

```text
src/app/
```

Responsible for:

- Routing
- Layouts
- Pages
- Server Components
- Route Handlers
- Server Actions
- Page composition

Pages should remain thin.

Pages should delegate business logic to feature modules.

```text
page.tsx
    │
    ▼
Feature Component
    │
    ▼
Feature Module
```

---

## 5.2 UI Component Layer

Location:

```text
src/components/ui/
```

Contains reusable presentation primitives.

Examples:

```text
Button
Card
Dialog
Table
Input
Select
Avatar
DropdownMenu
Sidebar
```

UI primitives must not contain School ERP business logic.

UI primitives must not access Prisma.

UI primitives must not access PostgreSQL.

---

## 5.3 Feature Module Layer

Location:

```text
src/modules/
```

Contains application features and business logic.

```text
modules/

├── auth/
├── student/
├── class/
├── attendance/
├── fee/
├── report/
├── user/
└── import/
```

A feature module may contain:

```text
student/

├── components/
├── schemas/
├── services/
├── queries/
├── actions/
├── types/
└── utils/
```

Not every module needs every folder.

Folders should only be created when required.

---

# 6. Database Architecture

```text
Next.js Server Code
        │
        ▼
      Prisma
        │
        ▼
   PostgreSQL
```

Prisma schema location:

```text
prisma/schema.prisma
```

Prisma singleton location:

```text
src/lib/prisma.ts
```

Only server-side code may import Prisma.

Allowed:

```text
Server Components
Server Actions
Route Handlers
Server-only Services
Import Services
```

Not allowed:

```text
Client Components → Prisma

Browser → Prisma

React Hooks → Prisma
```

---

# 7. Student Feature Architecture

```text
/dashboard/people/students
            │
            ▼
         page.tsx
            │
            ▼
       Student Module
            │
      ┌─────┼─────┐
      │     │     │
      ▼     ▼     ▼

   Queries Actions Schemas

      │     │     │
      └─────┼─────┘
            │
            ▼
          Prisma
            │
            ▼
       PostgreSQL
```

Student feature responsibilities:

```text
List Students

Create Student

View Student

Update Student

Archive Student
```

Students should be archived instead of physically deleted when historical records must be preserved.

Example:

```text
Student
   │
   ├── ACTIVE
   │
   └── ARCHIVED
```

Archived students remain in PostgreSQL.

---

# 8. Classes / Sections Architecture

```text
/dashboard/academics/classes
              │
              ▼
           page.tsx
              │
              ▼
          Class Module
              │
        ┌─────┼─────┐
        │     │     │
        ▼     ▼     ▼

     Queries Actions Schemas

        │     │     │
        └─────┼─────┘
              │
              ▼
            Prisma
              │
              ▼
         PostgreSQL
```

Classes and sections provide academic structure for students.

Example:

```text
Academic Year
      │
      ▼
    Class
      │
      ▼
   Section
      │
      ▼
   Students
```

---

# 9. Excel Import Architecture

```text
/dashboard/imports/students
              │
              ▼
        Excel Upload UI
              │
              ▼
POST /api/imports/students/preview
              │
              ▼
         Excel Parser
              │
              ▼
      Student Row Mapper
              │
              ▼
        Zod Validation
              │
       ┌──────┴──────┐
       │             │
       ▼             ▼

 Invalid Rows     Valid Rows

       │             │
       ▼             ▼

 Error Preview    Data Preview

                         │
                         ▼
                  Confirm Import
                         │
                         ▼
POST /api/imports/students/execute
                         │
                         ▼
                StudentImportService
                         │
                         ▼
                 Prisma Transaction
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼

           Student    Receipt    ImportJob

              │          │          │
              └──────────┼──────────┘
                         │
                         ▼
                     PostgreSQL
```

Import module:

```text
modules/import/

├── shared/
│   ├── excel.parser.ts
│   ├── excel-date.parser.ts
│   ├── excel-value.parser.ts
│   ├── import.types.ts
│   └── import-error.ts
│
└── students/
    ├── student-import.schema.ts
    ├── student-import.mapper.ts
    ├── student-import.validator.ts
    ├── student-import.service.ts
    └── student-import.types.ts
```

---

# 10. Excel Import Responsibilities

## Excel Parser

Responsible only for reading the Excel file.

```text
Excel File
    │
    ▼
ExcelJS
    │
    ▼
Raw JavaScript Objects
```

The Excel parser must not access Prisma.

The Excel parser must not access PostgreSQL.

---

## Student Import Mapper

Responsible for converting Excel columns into application fields.

```text
Reg.No
    │
    ▼
regNo

Name of Students
    │
    ▼
name

Father's Name
    │
    ▼
fatherName

Course
    │
    ▼
course

D.O.B
    │
    ▼
dob

D.O.A
    │
    ▼
doa

MR No
    │
    ▼
mrNo

Date
    │
    ▼
receiptDate

Amt. / Amt
    │
    ▼
amount
```

The mapper must not access Prisma.

---

## Student Import Validator

Responsible for validating imported rows.

Checks include:

```text
Missing Registration Number

Missing Student Name

Invalid DOB

Invalid Admission Date

Invalid Amount

Duplicate Registration Number

Duplicate MR Number

Unknown Course

Malformed Excel Row
```

The validator must not access Prisma directly.

Database-dependent duplicate validation should be performed by the import service.

---

## Student Import Service

Responsible for database operations.

```text
Validated Rows
      │
      ▼
StudentImportService
      │
      ▼
Prisma Transaction
      │
      ├── Student Upsert
      │
      ├── Receipt Upsert
      │
      ├── ImportJob Creation
      │
      └── ImportError Creation
      │
      ▼
PostgreSQL
```

---

# 11. Data Fetching Strategy

Use Server Components for initial database reads when practical.

```text
Server Component
       │
       ▼
     Prisma
       │
       ▼
  PostgreSQL
```

Use Server Actions for simple application mutations.

```text
Client Form
      │
      ▼
Server Action
      │
      ▼
Business Service
      │
      ▼
    Prisma
      │
      ▼
 PostgreSQL
```

Use Route Handlers when an HTTP endpoint is genuinely useful.

Examples:

```text
Excel Uploads

Webhooks

External Integrations

Mobile Applications

Public APIs
```

Use TanStack Query only where client-side behavior requires:

```text
Client-side caching

Interactive refetching

Polling

Optimistic updates

Infinite scrolling
```

Do not use TanStack Query automatically for every database query.

---

# 12. Current Development Order

```text
1. PostgreSQL
      ↓

2. Prisma Connection
      ↓

3. Prisma Schema
      ↓

4. First Migration
      ↓

5. Test Database Query
      ↓

6. Student CRUD
      ↓

7. Classes / Sections
      ↓

8. Student Excel Import
      ↓

9. Attendance
      ↓

10. Fees / Payments
      ↓

11. Basic Reports
      ↓

12. Authentication + Authorization Hardening
```

---

# 13. Development Phase Details

## Phase 1 — Database Foundation

```text
PostgreSQL

     ↓

Prisma Installation

     ↓

DATABASE_URL Configuration

     ↓

Prisma Schema

     ↓

First Migration

     ↓

Prisma Client

     ↓

Test Database Query
```

Goal:

The Next.js application can successfully read and write PostgreSQL data using Prisma.

---

## Phase 2 — Student Module

Build:

```text
Student Prisma Model

Student Validation Schema

Create Student

List Students

View Student

Update Student

Archive Student
```

Goal:

A complete Student CRUD feature works end-to-end.

---

## Phase 3 — Classes / Sections

Build:

```text
Academic Year

Class

Section

Student Enrollment / Assignment
```

Goal:

Students can be associated with an academic structure.

---

## Phase 4 — Student Excel Import

Build:

```text
Excel Upload

Excel Parser

Column Mapping

Validation

Preview

Import Confirmation

Batch Database Import

Import Report

Row-Level Errors
```

Goal:

Existing institute Excel data can be safely migrated into PostgreSQL.

---

## Phase 5 — Attendance

Build:

```text
Select Class

Select Section

Select Date

Load Students

Mark Present / Absent / Leave

Save Attendance

View Attendance History
```

Goal:

Daily student attendance works end-to-end.

---

## Phase 6 — Fees / Payments

Build:

```text
Fee Structure

Student Fee Assignment

Payment Entry

Receipt

Due Calculation

Payment History
```

Goal:

Basic institute fee management works end-to-end.

---

## Phase 7 — Reports

Build:

```text
Student Reports

Attendance Reports

Fee Collection Reports

Outstanding Due Reports

Excel / CSV Export
```

Goal:

Administrators can view and export essential operational information.

---

## Phase 8 — Authentication and Authorization Hardening

Build:

```text
Login

Logout

Session Management

Password Hashing

Route Protection

Role-Based Access Control

Permission Checks

Audit Logging
```

Goal:

The ERP can safely support real users and multiple permission levels.

---

# 14. Removed / Deferred Features

The following features are not part of the current MVP:

```text
Analytics

Admissions

Subjects

Curriculum

Lesson Plans

Timetable

Homework

Online Classes

Study Materials

Examinations

Assignments

Parents

Staff / HR

Payroll

Events

Transport

Library

Hostel

Inventory

Cafeteria

Security

Communication

CRM

Notifications

Integrations

Workflow Automation

Billing

Support
```

These features may be implemented later as separate modules.

Do not create empty folders for deferred features.

Do not create database models for deferred features until they are required.

Do not add deferred features back to the sidebar until real routes exist.

---

# 15. Core Dependency Rule

The application follows this dependency direction:

```text
Page / Route
     │
     ▼
Feature Module
     │
     ▼
Business Logic + Validation
     │
     ▼
Prisma
     │
     ▼
PostgreSQL
```

Dependencies should flow downward.

Lower layers must not depend on higher layers.

---

# 16. Core Architecture Rules

UI primitives do not access Prisma.

Client Components do not access Prisma.

Browser code does not contain database credentials.

Pages should not contain large amounts of business logic.

Pages should compose feature modules.

Feature modules contain domain-specific application logic.

The Excel parser does not access Prisma.

The Excel mapper does not access Prisma.

The Excel validator does not access Prisma.

Only server-side code may access Prisma.

Database writes should be validated before execution.

Critical multi-record database operations should use Prisma transactions.

Students with historical records should be archived instead of physically deleted.

Every active sidebar URL must have a real Next.js route.

Do not use catch-all routes to hide unfinished features.

Do not create generic abstractions before at least one concrete feature works end-to-end.

Build the Student importer first before extracting a generic import engine.

---

# 17. Current Project Status

The project is currently in:

```text
PHASE 1

PostgreSQL
     ↓
Prisma Connection    ← CURRENT WORK
     ↓
Prisma Schema
     ↓
First Migration
     ↓
Test Database Query
```

The immediate development task is:

```text
Configure PostgreSQL

        ↓

Configure DATABASE_URL

        ↓

Validate Prisma Configuration

        ↓

Design Minimum Prisma Schema

        ↓

Run First Migration

        ↓

Test One Database Query
```

Do not start Student CRUD, Excel Import, Attendance, Fees, Reports, or Authentication until the Prisma connection and initial schema are working correctly.

---

# 18. Important Note About the Project Tree

This document describes the target structure the application is being built toward.

Not every folder shown in this document necessarily exists on disk yet.

Generated directories must not be treated as source architecture.

Examples:

```text
.next/

node_modules/
```

The `.next` directory may contain generated build output referencing routes that were previously deleted.

The presence of old route names inside `.next` does not mean those routes still exist in the current source code.

Only the following directories should be used when evaluating the application's source architecture:

```text
src/

prisma/

public/

doc/
```

Generated build output and installed dependencies should not be used to determine the current application structure.

---

# 19. Final Architecture Summary

```text
Browser
   │
   ▼
Next.js App Router
   │
   ├── Pages / Layouts
   │
   ├── Server Components
   │
   ├── Client Components
   │
   ├── Server Actions
   │
   └── Route Handlers
   │
   ▼
Feature Modules
   │
   ├── Student
   ├── Class
   ├── Attendance
   ├── Fee
   ├── Report
   ├── User
   └── Import
   │
   ▼
Business Logic
   │
   ├── Validation
   ├── Mapping
   ├── Services
   ├── Queries
   └── Actions
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```

The development strategy is:

```text
Build Small

     ↓

Complete One Feature End-to-End

     ↓

Test It

     ↓

Stabilize It

     ↓

Extract Reusable Patterns

     ↓

Add the Next Feature

     ↓

Grow the ERP Incrementally
```

The first complete business feature should be:

```text
Student CRUD
```

The first bulk data migration feature should be:

```text
Student Excel Import
```

The current task is:

```text
PostgreSQL + Prisma Connection
```
````
