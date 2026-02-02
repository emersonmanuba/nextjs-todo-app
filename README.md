# Next.js Todo Application

A modern, feature-rich, multi-user todo application built with Next.js, TypeScript, Framer Motion, and Supabase. This project demonstrates full-stack development with user authentication, real-time database integration, and smooth user interactions.

## 🚀 Features

### Core Functionality
- ✅ **Create Tasks** - Add new tasks with automatic date tracking
- ✏️ **Edit Tasks** - Use the Edit icon to modify tasks
- 🗑️ **Delete Tasks** - Remove tasks with confirmation dialog
- 🔄 **Drag & Drop Reordering** - Reorder tasks with smooth animations

### Task Status Management
- 📋 **Pending** - Tasks that haven't been started yet
- 🚀 **In Progress** - Tasks you're actively working on
- ✅ **Completed** - Finished tasks

### Advanced Features
- 🔍 **Smart Filters** - View tasks by status (All, Pending, Active, Completed)
- 📅 **Date Tracking**
  - Date Created - Automatically recorded when task is added
  - Date Started - Recorded when task is marked as "In Progress"
  - Date Finished - Recorded when task is marked as "Completed"
- 💾 **Database Persistence** - All data stored in Supabase PostgreSQL database
- 🔐 **User Authentication** - Secure signup/login with email and password
- 👤 **Multi-User Support** - Each user has their own private task list
- 🔒 **Row Level Security** - Database-enforced user isolation
- 🎨 **Smooth Animations** - Powered by Framer Motion
- 🎯 **Icon-Based UI** - Clean interface using React Feather icons
- ⚠️ **Delete Confirmation** - Prevents accidental task deletion
- 🌓 **Dark/Light Mode** - Animated theme toggle with persistent preference

## 🛠️ Technologies Used

- **Framework**: [Next.js 14+](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Feather](https://github.com/feathericons/react-feather)

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- A Supabase account

### Setup Steps

1. **Clone the repository:**
```bash
git clone https://github.com/emersonmanuba/nextjs-todo-app.git
cd nextjs-todo-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up Supabase:**

   a. Create a [Supabase account](https://supabase.com) and new project
   
   b. Create a `tasks` table with the following schema:

```sql
create table tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  status text default 'pending'::text not null,
  date_created timestamp with time zone default timezone('utc'::text, now()),
  date_started timestamp with time zone,
  date_finished timestamp with time zone,
  "order" bigint default 0,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Create index for faster queries
create index idx_tasks_user_id on tasks(user_id);
```

   c. Enable Row Level Security and create policies:

```sql
-- Enable RLS
alter table tasks enable row level security;

-- Create policies
create policy "Users can view their own tasks"
on tasks for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
on tasks for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
on tasks for update
to authenticated
using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
on tasks for delete
to authenticated
using (auth.uid() = user_id);
```

4. **Configure environment variables:**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these values from: Supabase Dashboard → Project Settings → API

5. **Run the development server:**
```bash
npm run dev
```

6. Open (http://localhost:3000) in your browser.

## 🎯 How to Use

### Getting Started
1. **Sign Up**: Create a new account at `/signup`
2. **Log In**: Access your account at `/login`

### Managing Tasks
1. **Add a Task**: Type in the input field and click the add icon or press Enter
2. **Start a Task**: Click the play icon on a pending task to mark it as in-progress
3. **Complete a Task**: Click the check icon on an in-progress task to mark it as done
4. **Edit a Task**: Click the edit icon
5. **Delete a Task**: Click the delete icon and confirm the action
6. **Reorder Tasks**: Click and drag the handle (⋮⋮) to reorder your list
7. **Filter Tasks**: Use the filter buttons to view specific task categories
8. **Toggle Theme**: Click the sun/moon toggle to switch between light and dark mode

## 📊 Project Structure

```
todo-app/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main todo page (protected)
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   ├── signup/
│   │   │   └── page.tsx       # Signup page
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── ThemeToggle.tsx    # Animated theme toggle button
│   ├── context/
│   │   ├── AuthContext.tsx    # Authentication state management
│   │   └── ThemeContext.tsx   # Theme state management
│   └── lib/
│       └── supabase.ts        # Supabase client configuration
├── public/                     # Static assets
├── .env.local                  # Environment variables (not in repo)
├── tailwind.config.ts          # Tailwind configuration
├── package.json
└── README.md
```

## 🗄️ Database Schema

The application uses a PostgreSQL database (via Supabase) with the following structure:

**tasks table:**
| Column        | Type        | Description                                      |
|---------------|-------------|--------------------------------------------------|
| id            | uuid        | Primary key, auto-generated                      |
| created_at    | timestamptz | Auto-generated timestamp                         |
| title         | text        | Task description                                 |
| status        | text        | 'pending', 'in-progress', or 'completed'         |
| date_created  | timestamptz | When task was created                            |
| date_started  | timestamptz | When task was started (nullable)                 |
| date_finished | timestamptz | When task was completed (nullable)               |
| order         | bigint      | For drag-drop ordering                           |
| user_id       | uuid        | Foreign key to auth.users, identifies task owner |

## 🔐 Authentication & Security

### Features
- Email/password authentication via Supabase Auth
- Secure session management
- Protected routes (automatic redirect to login)
- Password validation (minimum 6 characters)

### Security Measures
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- API keys secured via environment variables
- SQL injection prevention through Supabase client
- XSS protection via React's built-in escaping

### Best Practices Implemented
- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Implement proper authentication checks on protected routes
- Database policies enforce user isolation at the database level

## 🎓 Learning Outcomes

Through building this project, I learned:
- React Hooks (useState, useEffect, useContext)
- TypeScript interfaces and type safety
- State management with Context API
- **User authentication and authorization**
- **Row Level Security in PostgreSQL**
- **Protected routes in Next.js**
- Supabase integration and CRUD operations
- PostgreSQL database design and foreign keys
- Environment variables and API security
- Framer Motion for animations
- Tailwind CSS for styling and dark mode
- Next.js 14+ App Router
- Git version control and GitHub workflow

## 🚧 Current Phase: Phase 2 Complete! ✅

### ✅ Completed Features:
- [x] Core todo functionality (CRUD)
- [x] Task status management
- [x] Filters and date tracking
- [x] Supabase database integration
- [x] User authentication (signup/login/logout)
- [x] Row Level Security
- [x] Multi-user support
- [x] Dark/Light mode with animated toggle
- [x] Icon-based UI
- [x] Delete confirmation dialog

### 🚧 Next Phase: Phase 3
- [ ] User profile page
- [ ] Display user statistics (total tasks, completed, etc.)
- [ ] Edit profile information
- [ ] Password change functionality
- [ ] Account settings

### 🎯 Future Enhancements (Phase 4+)
- [ ] Password reset via email
- [ ] Task categories/tags
- [ ] Priority levels
- [ ] Due dates and reminders
- [ ] Task search functionality
- [ ] Export tasks (CSV/PDF)
- [ ] Collaborative tasks (share with other users)
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Deploy to Vercel

## 🐛 Known Issues

- Drag-and-drop may not work smoothly when filters are active
- Manual page refresh required to see changes made from other devices/tabs (real-time sync requires Supabase Pro)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome! Feel free to open an issue or submit a pull request.

## 👤 Author

**Emerson Manuba**
- GitHub: [@emersonmanuba](https://github.com/emersonmanuba)

## 🙏 Acknowledgments

- Built while learning Next.js, React, Supabase, and authentication patterns
- Inspired by modern todo applications and task management tools
- Special thanks to the Next.js, React, and Supabase communities

---

**Happy Task Managing! 📝✨**

*Last Updated: December 2024 - Phase 2 Complete*

# Next.js Todo Application

A modern, feature-rich, multi-user todo application built with Next.js, TypeScript, Framer Motion, and Supabase. This full-stack application demonstrates authentication, database integration, real-time updates, and polished user experience.

## 🌐 Live Demo

**Deployed on Vercel:** (https://esam-todo-app-one.vercel.app/)

## ✨ Features

### Core Task Management
- ✅ **Create Tasks** - Add new tasks with automatic date tracking
- ✏️ **Edit Tasks** - Use the Edit icon to modify tasks
- 🗑️ **Delete Tasks** - Remove tasks with confirmation dialog
- 🔄 **Drag & Drop Reordering** - Intuitive task reordering with smooth animations
- 📊 **Task Status Management** - Three distinct states: Pending, In Progress, Completed

### Advanced Features
- 🔍 **Smart Filters** - View tasks by status (All, Pending, Active, Completed)
- 📅 **Comprehensive Date Tracking**
  - Date Created - Automatically recorded when task is added
  - Date Started - Recorded when task is marked as "In Progress"
  - Date Finished - Recorded when task is marked as "Completed"
- 👤 **User Profiles** - Custom user profiles with editable names and avatars
- 📈 **Task Statistics** - Real-time stats showing total, pending, in-progress, and completed tasks
- 🔐 **Secure Authentication** - Email/password authentication with Supabase Auth
- 🔒 **Multi-User Support** - Each user has their own private, isolated task list
- 🔑 **Password Management** - Secure password change functionality
- 🌓 **Dark/Light Mode** - Animated theme toggle with persistent preference
- 🎨 **Smooth Animations** - Powered by Framer Motion for delightful UX
- 🎯 **Icon-Based UI** - Clean, modern interface using React Feather icons
- 💬 **Toast Notifications** - Real-time feedback for all user actions
- 💾 **Persistent Storage** - All data stored securely in Supabase PostgreSQL

## 🛠️ Technologies Used

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Feather](https://github.com/feathericons/react-feather)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Database

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- A Supabase account ([Sign up here](https://supabase.com))
- Git installed

### Local Development Setup

**1. Clone the repository:**
```bash
git clone https://github.com/emersonmanuba/nextjs-todo-app.git
cd nextjs-todo-app
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up Supabase:**

#### a. Create a new Supabase project
- Go to [supabase.com](https://supabase.com)
- Click "New Project"
- Fill in project details
- Wait for project to be created

#### b. Create the database schema

Go to **SQL Editor** in Supabase and run:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tasks table
CREATE TABLE tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  status text default 'pending'::text not null,
  date_created timestamp with time zone default timezone('utc'::text, now()),
  date_started timestamp with time zone,
  date_finished timestamp with time zone,
  "order" bigint default 0,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Create indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_profiles_id ON profiles(id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

**4. Configure environment variables:**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Get these values from:**
- Supabase Dashboard → Project Settings → API
- Copy the `Project URL` and `anon/public` key

**5. Run the development server:**
```bash
npm run dev
```

**6. Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment on Vercel

### Quick Deploy

1. **Push your code to GitHub** (if not already done)

2. **Go to [Vercel](https://vercel.com)** and sign up/login

3. **Import your repository:**
   - Click "Add New..." → "Project"
   - Select your repository
   - Click "Import"

4. **Configure environment variables:**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (Use the same values from `.env.local`)

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

### Automatic Deployments

Vercel automatically deploys your app when you push to GitHub:
```
Push to GitHub → Vercel builds → Auto-deploys → Live in minutes
```

## 🎯 How to Use

### Getting Started
1. **Sign Up**: Create a new account at `/signup` with your name, email, and password
2. **Log In**: Access your account at `/login`

### Managing Tasks
1. **Add a Task**: Type in the input field and press Enter or click the add button
2. **Start a Task**: Click the "Start" button on a pending task to mark it as in-progress
3. **Complete a Task**: Click the "Complete" button on an in-progress task to mark it as done
4. **Edit a Task**: Double-click the task text or click the edit icon
5. **Delete a Task**: Click the delete icon and confirm the action
6. **Reorder Tasks**: Click and drag the handle (⋮⋮) to reorder your list
7. **Filter Tasks**: Use the filter buttons to view specific task categories

### Profile Management
1. **View Profile**: Click the profile icon in the header
2. **Edit Name**: Click "Edit Name" on your profile page
3. **Change Password**: Use the "Change Password" section in your profile
4. **View Statistics**: See your task completion stats on the profile page

### Customization
- **Toggle Theme**: Click the sun/moon icon to switch between light and dark mode
- **Preferences Persist**: Your theme choice is saved automatically

## 📊 Project Structure

```
nextjs-todo-app/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main todo page (protected)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── signup/
│   │   │   └── page.tsx          # Signup page
│   │   ├── profile/
│   │   │   └── page.tsx          # User profile page
│   │   ├── layout.tsx            # Root layout with providers
│   │   └── globals.css           # Global styles & theme variables
│   ├── components/
│   │   └── ThemeToggle.tsx       # Animated theme toggle button
│   ├── context/
│   │   ├── AuthContext.tsx       # Authentication state management
│   │   └── ThemeContext.tsx      # Theme state management
│   └── lib/
│       ├── supabase.ts           # Supabase client configuration
│       ├── profileService.ts     # Profile CRUD operations
│       └── toast.ts              # Toast notification helpers
├── public/                        # Static assets
├── .env.local                     # Environment variables (not in repo)
├── tailwind.config.ts             # Tailwind configuration
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## 🗄️ Database Schema

### **profiles** table
| Column     | Type        | Description                          |
|------------|-------------|--------------------------------------|
| id         | uuid        | Primary key, references auth.users   |
| email      | text        | User's email address                 |
| full_name  | text        | User's display name                  |
| avatar_url | text        | Profile picture URL (future feature) |
| created_at | timestamptz | Account creation timestamp           |
| updated_at | timestamptz | Last profile update timestamp        |

**tasks table:**
| Column        | Type        | Description                                      |
|---------------|-------------|--------------------------------------------------|
| id            | uuid        | Primary key, auto-generated                      |
| created_at    | timestamptz | Auto-generated timestamp                         |
| title         | text        | Task description                                 |
| status        | text        | 'pending', 'in-progress', or 'completed'         |
| date_created  | timestamptz | When task was created                            |
| date_started  | timestamptz | When task was started (nullable)                 |
| date_finished | timestamptz | When task was completed (nullable)               |
| order         | bigint      | For drag-drop ordering                           |
| user_id       | uuid        | Foreign key to auth.users, identifies task owner |

## 🔐 Security Features

### Authentication & Authorization
- ✅ Email/password authentication via Supabase Auth
- ✅ Secure session management with HTTP-only cookies
- ✅ Protected routes with automatic redirect
- ✅ Password validation (minimum 6 characters)
- ✅ Password change with current password verification

### Database Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Foreign key constraints for data integrity
- ✅ API keys secured via environment variables

### Application Security
- ✅ Input sanitization and validation
- ✅ XSS protection via React's built-in escaping
- ✅ CSRF protection via Supabase
- ✅ SQL injection prevention through Supabase client

## 🎓 What I Learned

Building this project taught me:

### Technical Skills
- ✅ Next.js 14+ App Router architecture
- ✅ TypeScript for type-safe development
- ✅ React Hooks (useState, useEffect, useContext)
- ✅ Context API for global state management
- ✅ User authentication and authorization flows
- ✅ Row Level Security in PostgreSQL
- ✅ RESTful API integration with Supabase
- ✅ Database design and relationships
- ✅ Environment variables and secrets management
- ✅ Responsive design with Tailwind CSS
- ✅ Dark mode implementation
- ✅ Animation with Framer Motion
- ✅ Form validation and error handling
- ✅ Toast notifications for UX feedback

### Best Practices
- ✅ Git version control and commit conventions
- ✅ Component-based architecture
- ✅ Separation of concerns (services, contexts, components)
- ✅ Error handling and loading states
- ✅ Accessibility considerations
- ✅ Performance optimization
- ✅ Production deployment on Vercel

### Project Management
- ✅ Breaking down features into phases
- ✅ Prioritizing tasks
- ✅ Iterative development
- ✅ Testing and debugging
- ✅ Documentation

## 🚧 Known Issues / Technical Debt

- **RLS Policies**: Currently simplified for easier development; should be reviewed for production security
- **Email Verification**: Not yet implemented; users can sign up without email confirmation
- **Password Reset**: Users cannot reset forgotten passwords via email (planned for Phase 4)

## 🎯 Future Enhancements (Phase 4+)

### High Priority
- [ ] Email verification on signup
- [ ] Password reset via email
- [ ] Task categories/tags for better organization
- [ ] Task priority levels (High, Medium, Low)
- [ ] Due dates and deadline reminders

### Medium Priority
- [ ] Search functionality for tasks
- [ ] Task notes/descriptions
- [ ] Subtasks/checklists
- [ ] Export tasks to CSV/PDF
- [ ] Task sharing/collaboration
- [ ] Recurring tasks

### Nice to Have
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Task templates
- [ ] Productivity analytics
- [ ] Team workspaces
- [ ] File attachments

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working
- Ensure `.env.local` exists in root directory
- Restart dev server after adding variables
- Check for typos in variable names
- Verify Supabase credentials are correct

### Authentication Issues
- Check Supabase project is active
- Verify API keys in environment variables
- Check browser console for errors
- Clear browser cache and cookies

### Database Connection Issues
- Verify Supabase project URL is correct
- Check Supabase project is not paused
- Verify RLS policies are set correctly
- Check network connectivity

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

While this is a personal learning project, suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

- **Emerson Manuba**
- GitHub: [@emersonmanuba](https://github.com/emersonmanuba)

## 🙏 Acknowledgments

- Built while learning Next.js, React, TypeScript, and full-stack development
- Inspired by modern productivity applications
- Special thanks to the Next.js, React, Supabase, and open-source communities
- Tutorial and guidance from Claude AI

## 📊 Project Status

**Current Version:** 1.0.0 (Phase 3 Complete)
**Status:** ✅ Production Ready
**Last Updated:** January 2026

---

**⭐ If you found this project helpful, please consider giving it a star on GitHub!**

**Happy Task Managing! 📝✨**

*Built with ❤️ using Next.js, TypeScript, and Supabase*