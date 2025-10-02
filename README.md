# School Admin Dashboard for iDEAL School Management System

A comprehensive school administration dashboard built with React, TypeScript, and Tailwind CSS. This application provides a modern, responsive interface for managing school operations including staff, students, and academic data. Powered by iDEAL Smart Solution Limited.

## Features

### ✅ Authentication System
- **Secure Login**: UIN and password-based authentication
- **Session Management**: Persistent login state
- **Demo Credentials**: Pre-configured test account
- **Logout Functionality**: Secure session termination

### ✅ Navigation System
- **Sidebar Navigation**: Clean, organized sidebar with module navigation
- **Direct Module Access**: No dashboard - users go directly to modules after login
- **Active State Management**: Visual indication of current module
- **Responsive Design**: Sidebar adapts to different screen sizes
- **Company Branding**: Integrated logo and company information in sidebar

### ✅ Staff Management Module

The Staff Management module provides comprehensive functionality for managing school staff members:

### ✅ Student Management Module

The Student Management module provides comprehensive functionality for managing school students:

### ✅ Academic Data Module

The Academic Data module provides comprehensive functionality for managing academic sessions and school branding:

#### **Core Features**
- **Staff Creation**: Add new staff members with complete profile information
- **Staff Updates**: Edit existing staff member details
- **Staff Profile View**: Detailed view of individual staff members
- **Staff Listing**: Browse and search through all staff members
- **Advanced Filtering**: Filter by gender, search by name/email/UIN/username
- **Sorting Options**: Sort by name, date added, or UIN

#### **Staff Information Fields**
- Personal Details: First Name, Last Name, Gender, Address
- Contact Information: Email, Phone Number
- Professional Details: Username, UIN (Unique Staff Identifier)
- Profile Picture: File upload with preview
- Subject Assignments: List of assigned subject codes
- System Information: Creation date, last updated

#### **Core Features**
- **Student Creation**: Add new students with complete profile information
- **Student Updates**: Edit existing student details
- **Student Profile View**: Detailed view of individual students
- **Student Listing**: Browse and search through all students
- **Advanced Filtering**: Filter by gender, class, search by name/email/UIN/class
- **Sorting Options**: Sort by name, class, enrollment date, or UIN
- **Class Distribution**: Visual overview of students across different classes

#### **Student Information Fields**
- Personal Details: First Name, Last Name, Middle Name (optional), Gender, Date of Birth, Address
- Contact Information: Email, Phone Number
- Academic Details: Class Assignment, UIN (Unique Student Identifier)
- Profile Picture: File upload with preview
- Age Calculation: Automatic age calculation from date of birth
- System Information: Enrollment date, last updated

#### **Core Features**
- **Single Academic Session**: One active academic session at a time (e.g., 2025/2026)
- **Term Management**: Change current term (First, Second, Third) within the session
- **School Branding**: Update school name and logo for the current session
- **Session Information**: View and update current academic session details
- **Term Selection**: Easy term switching with visual indicators
- **Session Creation**: Create new academic session (replaces current one)

#### **Academic Data Fields**
- Session Information: Academic Session (YYYY/YYYY format), Current Term
- School Branding: School Name, School Logo (file upload)
- Term Management: First Term, Second Term, Third Term (enum values)
- System Information: Creation date, last updated
- Single Session: Only one academic session active at a time

#### **User Interface**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface using Tailwind CSS
- **Interactive Elements**: Hover effects, loading states, error handling
- **Form Validation**: Real-time validation with helpful error messages
- **Search & Filter**: Advanced filtering and search capabilities
- **Statistics Dashboard**: Overview cards showing staff statistics

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Development**: Hot Module Replacement (HMR)

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx          # Login form component
│   ├── layout/
│   │   ├── Sidebar.tsx            # Sidebar navigation component
│   │   └── Layout.tsx             # Main layout with sidebar and content
│   ├── staff/
│   │   ├── StaffForm.tsx          # Reusable form for create/update
│   │   ├── StaffCard.tsx          # Staff member card component
│   │   └── StaffProfile.tsx       # Detailed staff profile view
│   ├── student/
│   │   ├── StudentForm.tsx        # Reusable form for create/update
│   │   ├── StudentCard.tsx        # Student card component
│   │   └── StudentProfile.tsx     # Detailed student profile view
│   └── academic/
│       ├── AcademicSessionForm.tsx # Reusable form for session create/update
│       ├── BrandingForm.tsx       # School branding form
│       └── AcademicSessionCard.tsx # Academic session card component
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx          # Login page with company branding
│   ├── staff/
│   │   ├── StaffManagement.tsx    # Main staff management router
│   │   ├── StaffList.tsx          # Staff listing page
│   │   ├── AddStaff.tsx           # Add new staff page
│   │   └── UpdateStaff.tsx        # Update staff page
│   ├── student/
│   │   ├── StudentManagement.tsx  # Main student management router
│   │   ├── StudentList.tsx        # Student listing page
│   │   ├── AddStudent.tsx         # Add new student page
│   │   └── UpdateStudent.tsx      # Update student page
│   └── academic/
│       ├── AcademicDataManagement.tsx # Main academic data router
│       ├── AcademicDataList.tsx   # Academic data listing page
│       ├── AddAcademicSession.tsx # Add new academic session page
│       ├── UpdateAcademicSession.tsx # Update academic session page
│       └── UpdateBranding.tsx     # Update school branding page
├── stores/
│   ├── auth-store.ts              # Zustand store for authentication
│   ├── staff-store.ts             # Zustand store for staff data
│   ├── student-store.ts           # Zustand store for student data
│   └── academic-store.ts          # Zustand store for academic data
├── types/
│   ├── auth.ts                    # TypeScript interfaces for authentication
│   ├── staff.ts                   # TypeScript interfaces for staff
│   ├── student.ts                 # TypeScript interfaces for students
│   └── academic.ts                # TypeScript interfaces for academic data
├── assets/
│   └── logo.jpg                   # Company logo
└── App.tsx                        # Main application component
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Login Credentials
The application includes demo credentials for testing:
- **UIN**: `DEV/iDL/0001`
- **Password**: `passer`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Portal_SAdmin_Dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3001`

### Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication Usage

### Logging In
1. Start the development server with `npm run dev`
2. Navigate to `http://localhost:3001` in your browser
3. You'll see the login page with company branding
4. Enter the demo credentials:
   - **UIN**: `DEV/iDL/0001`
   - **Password**: `passer`
5. Click "Sign In" to access the application
6. After login, you'll be taken directly to the Staff Management module
7. Use the sidebar navigation to switch between modules
8. Use the "Logout" button in the sidebar footer to sign out

## Staff Management Usage

### Adding New Staff
1. Click on "Manage Staff" from the dashboard
2. Click "Add New Staff" button
3. Fill in the required information:
   - Personal details (name, gender, address)
   - Contact information (email, phone)
   - Professional details (username, password)
   - Optional profile picture
4. Click "Create Staff" to save

### Viewing Staff Profiles
1. From the staff list, click "View Profile" on any staff card
2. View comprehensive staff information including:
   - Personal and professional details
   - Contact information
   - Subject assignments
   - System timestamps

### Editing Staff Information
1. From staff list or profile view, click "Edit"
2. Modify the required fields
3. Click "Update Staff" to save changes

### Searching and Filtering
- **Search**: Use the search bar to find staff by name, email, UIN, or username
- **Gender Filter**: Filter staff by gender (Male, Female, Other, All)
- **Sorting**: Sort by Name, Date Added, or UIN
- **Clear Filters**: Reset all filters to default view

## Student Management Usage

### Adding New Students
1. Click on "Manage Students" from the dashboard
2. Click "Add New Student" button
3. Fill in the required information:
   - Personal details (name, middle name, gender, date of birth, address)
   - Contact information (email, phone)
   - Academic details (class assignment, password)
   - Optional profile picture
4. Click "Create Student" to save

### Viewing Student Profiles
1. From the student list, click "View Profile" on any student card
2. View comprehensive student information including:
   - Personal and academic details
   - Contact information
   - Class assignment and age
   - System timestamps

### Editing Student Information
1. From student list or profile view, click "Edit"
2. Modify the required fields
3. Click "Update Student" to save changes

### Searching and Filtering
- **Search**: Use the search bar to find students by name, email, UIN, or class
- **Gender Filter**: Filter students by gender (Male, Female, Other, All)
- **Class Filter**: Filter students by class (Grade 9A, 10B, etc.)
- **Sorting**: Sort by Name, Class, Enrollment Date, or UIN
- **Class Distribution**: View student count across different classes
- **Clear Filters**: Reset all filters to default view

## Academic Data Management Usage

### Managing Academic Sessions
1. Click on "Academic Data" from the sidebar
2. View your current academic session with:
   - Academic session and current term
   - School branding information
   - Creation and update dates
3. Use actions: Update Session, Update Branding

### Changing Academic Terms
1. From the academic data page, use the Term Selector
2. Click on the desired term (First, Second, or Third)
3. The current term will be updated immediately
4. Only one term can be active at a time

### Creating New Academic Sessions
1. Click "Create New Session" button
2. Fill in the required information:
   - Academic Session (e.g., 2025/2026)
   - Current Term (First, Second, or Third)
3. Click "Create Session" to save
4. This will replace the current session

### Updating School Branding
1. From the current session card, click "Update Branding"
2. Update school information:
   - School Name (required)
   - School Logo (optional file upload)
3. Changes apply to the current academic session
4. Click "Update Branding" to save

### Session Management
- **Single Session**: Only one academic session exists at a time
- **Term Changes**: Switch between First, Second, and Third terms
- **Session Updates**: Modify academic session information
- **Branding**: Update school name and logo

## Data Structure

### Staff Types
```typescript
interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  schoolId: string;
  address: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  userName: string;
  profilePicture?: File | string;
}

interface GetSingleStaffResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: 'male' | 'female' | 'other';
  UIN: string;
  profilePicture?: string;
  subjectCodes: string[];
  schoolId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}
```

### Student Types
```typescript
interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  classId: string;
  address: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  profilePicture?: File | string;
}

interface GetSingleStudentResponse {
  id: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  className: string;
  address: string;
  gender: 'male' | 'female' | 'other';
  UIN: string;
  profilePicture?: string;
  classId: string;
  middleName?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Academic Data Types
```typescript
enum Term {
  First = 'First',
  Second = 'Second',
  Third = 'Third'
}

interface CreateAcademicSessionRequest {
  Current_Session: string; // e.g., "2025/2026"
  Current_Term: Term;
}

interface GetAcademicSessionResponse {
  Id: string;
  Current_Session: string;
  Current_Term: Term;
  SchoolName?: string;
  SchoolLogoFilePath?: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}
```

## Mock Data

The application includes comprehensive mock data for development and testing:
- **Authentication**: Demo login credentials (UIN: DEV/iDL/0001, Password: passer)
- **Staff**: 5 sample staff members with realistic information
- **Students**: 8 sample students with complete profiles
- **Academic Session**: Single current session (2024/2025) with First Term active
- **School Branding**: iDEAL School Management System branding with company logo
- Profile pictures from Unsplash
- Various subject assignments for staff
- Different classes and academic years for students
- Different genders and realistic data
- Company branding: iDEAL Smart Solution Limited

## Future Enhancements

### Planned Features
- **Manage Schools Module**: Multi-school management
- **Manage Users Module**: System user administration
- **API Integration**: Connect to backend services
- **Authentication**: User login and role-based access
- **Data Export**: Export staff data to CSV/Excel
- **Bulk Operations**: Bulk import/export of staff data
- **Advanced Reporting**: Staff analytics and reports

### Technical Improvements
- **Routing**: React Router for better navigation
- **Testing**: Unit and integration tests
- **Accessibility**: WCAG compliance improvements
- **Performance**: Code splitting and lazy loading
- **PWA**: Progressive Web App features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
