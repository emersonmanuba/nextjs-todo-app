# Next.js Todo Application

A modern, feature-rich todo application built with Next.js, TypeScript, Framer Motion, and Supabase. This project demonstrates full-stack development with real-time database integration and smooth user interactions.

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
- 🎨 **Smooth Animations** - Powered by Framer Motion
- 🎯 **Icon-Based UI** - Clean interface using React Feather icons
- ⚠️ **Delete Confirmation** - Prevents accidental task deletion

## 🛠️ Technologies Used

- **Framework**: [Next.js 14+](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Feather](https://github.com/feathericons/react-feather)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/emersonmanuba/nextjs-todo-app.git
cd nextjs-todo-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up Supabase:
   - Create a [Supabase account](https://supabase.com)
   - Create a new project
   - Create a `tasks` table with the following schema:

```sql
create table tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  status text default 'pending'::text not null,
  date_created timestamp with time zone default timezone('utc'::text, now()),
  date_started timestamp with time zone,
  date_finished timestamp with time zone,
  "order" bigint default 0
);
```

4. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Use

1. **Add a Task**: Type in the input field and click the add icon or press Enter
2. **Start a Task**: Click the play icon on a pending task to mark it as in-progress
3. **Complete a Task**: Click the check icon on an in-progress task to mark it as done
4. **Edit a Task**: Double-click the task text or click the edit icon
5. **Delete a Task**: Click the delete icon and confirm the action
6. **Reorder Tasks**: Click and drag the handle (⋮⋮) to reorder your list
7. **Filter Tasks**: Use the filter buttons to view specific task categories

## 📊 Project Structure

```
todo-app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main todo component
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   └── lib/
│       └── supabase.ts        # Supabase client configuration
├── public/                    # Static assets
├── .env.local                 # Environment variables (not in repo)
├── package.json
└── README.md
```

## 🗄️ Database Schema

The application uses a PostgreSQL database (via Supabase) with the following structure:

**tasks table:**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, auto-generated |
| created_at | timestamptz | Auto-generated timestamp |
| title | text | Task description |
| status | text | 'pending', 'in-progress', or 'completed' |
| date_created | timestamptz | When task was created |
| date_started | timestamptz | When task was started (nullable) |
| date_finished | timestamptz | When task was completed (nullable) |
| order | bigint | For drag-drop ordering |

## 🎓 Learning Outcomes

Through building this project, I learned:
- React Hooks (useState, useEffect)
- TypeScript interfaces and type safety
- State management and immutability
- **Supabase integration and CRUD operations**
- **PostgreSQL database design**
- **Environment variables and API security**
- Framer Motion for animations
- Tailwind CSS for styling
- Next.js project structure and conventions
- Git version control and GitHub workflow
- Icon implementation with React Feather

## 🔒 Security Notes

- Row Level Security (RLS) is currently disabled for development
- In production, implement proper authentication and RLS policies
- Never commit `.env.local` to version control
- Use environment variables for all sensitive data

## 🚧 Future Enhancements

- [ ] User authentication (Supabase Auth)
- [ ] Row Level Security policies
- [ ] Real-time sync across devices (requires Supabase Pro)
- [ ] Task categories/tags
- [ ] Priority levels
- [ ] Due dates and reminders
- [ ] Dark mode toggle
- [ ] Export tasks to CSV/PDF
- [ ] Task search functionality
- [ ] Recurring tasks

## 🐛 Known Issues

- Drag-and-drop may not work smoothly when filters are active
- Manual page refresh required to see changes made from other devices/tabs
- Consider implementing optimistic updates for better UX

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome! Feel free to open an issue or submit a pull request.

## 👤 Author

**Your Name**
- GitHub: [@emersonmanuba](https://github.com/emersonmanuba)

## 🙏 Acknowledgments

- Built while learning Next.js, React, and Supabase
- Inspired by modern todo applications
- Special thanks to the Next.js, React, and Supabase communities

---

**Happy Task Managing! 📝✨**