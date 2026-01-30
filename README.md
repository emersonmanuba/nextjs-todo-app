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