# Next.js Todo Application

A modern, feature-rich todo application built with Next.js, TypeScript, and Framer Motion. This project was created as a learning exercise to master Next.js fundamentals and React state management.

## 🚀 Features

### Core Functionality
- ✅ **Create Tasks** - Add new tasks with automatic date tracking
- ✏️ **Edit Tasks** - Double-click or use the Edit button to modify tasks
- 🗑️ **Delete Tasks** - Remove tasks you no longer need
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
- 💾 **Local Storage** - Tasks persist across browser sessions
- 🎨 **Smooth Animations** - Powered by Framer Motion

## 🛠️ Technologies Used

- **Framework**: [Next.js 14+](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Storage**: Browser localStorage

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

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Use

1. **Add a Task**: Type in the input field and click "Add Task" or press Enter
2. **Start a Task**: Click the "Start" button on a pending task to mark it as in-progress
3. **Complete a Task**: Click the "Complete" button on an in-progress task to mark it as done
4. **Edit a Task**: Double-click the task text or click the "Edit" button
5. **Delete a Task**: Click the "Delete" button to remove a task
6. **Reorder Tasks**: Click and drag any task to reorder your list
7. **Filter Tasks**: Use the filter buttons to view specific task categories

## 📊 Project Structure

```
todo-app/
├── src/
│   └── app/
│       ├── page.tsx          # Main todo component
│       ├── layout.tsx         # Root layout
│       └── globals.css        # Global styles
├── public/                    # Static assets
├── package.json
└── README.md
```

## 🎓 Learning Outcomes

Through building this project, I learned:
- React Hooks (useState, useEffect)
- TypeScript interfaces and type safety
- State management and immutability
- localStorage API for data persistence
- Framer Motion for animations
- Tailwind CSS for styling
- Next.js project structure and conventions
- Git version control and GitHub workflow

## 🚧 Upcoming Features

- [ ] Backend integration with Supabase
- [ ] User authentication
- [ ] Replace buttons with icons
- [ ] Confirmation dialogs for actions
- [ ] Real-time sync across devices
- [ ] Task categories/tags
- [ ] Priority levels
- [ ] Due dates and reminders

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome! Feel free to open an issue or submit a pull request.

## 👤 Author

**Emerson Manuba**
- GitHub: [@emersonmanuba](https://github.com/emersonmanuba)

## 🙏 Acknowledgments

- Built while learning Next.js and React
- Inspired by modern todo applications
- Special thanks to the Next.js and React communities

---

**Happy Task Managing! 📝✨**