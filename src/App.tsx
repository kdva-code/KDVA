import { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  Circle,
  Clock3,
  Command,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Menu,
  Plus,
  Search,
  Settings2,
  Sparkles,
  X,
} from 'lucide-react'

type TaskStatus = 'In progress' | 'To do' | 'Done'
type Task = {
  id: number
  title: string
  project: string
  due: string
  status: TaskStatus
  initials: string
  color: string
}

const startingTasks: Task[] = [
  { id: 1, title: 'Review onboarding flow', project: 'Website redesign', due: 'Today', status: 'In progress', initials: 'AM', color: 'coral' },
  { id: 2, title: 'Finalize Q4 launch plan', project: 'Product launch', due: 'Today', status: 'To do', initials: 'JL', color: 'blue' },
  { id: 3, title: 'Share research findings', project: 'Mobile app', due: 'Tomorrow', status: 'In progress', initials: 'SK', color: 'green' },
  { id: 4, title: 'Update component library', project: 'Website redesign', due: 'Nov 29', status: 'To do', initials: 'AM', color: 'coral' },
  { id: 5, title: 'Send partner follow-up', project: 'Product launch', due: 'Nov 30', status: 'Done', initials: 'JL', color: 'blue' },
]

const projects = [
  { name: 'Website redesign', label: 'DESIGN', color: 'coral', progress: 72, tasks: '18 / 25', people: ['AM', 'JL', 'SK'] },
  { name: 'Product launch', label: 'GROWTH', color: 'blue', progress: 48, tasks: '12 / 25', people: ['JL', 'SK'] },
  { name: 'Mobile app', label: 'PRODUCT', color: 'green', progress: 86, tasks: '24 / 28', people: ['AM', 'SK', 'JL'] },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Projects', icon: FolderKanban },
  { label: 'My tasks', icon: ListTodo },
]

function readTasks(): Task[] {
  try {
    const saved = localStorage.getItem('kdva-tasks')
    return saved ? JSON.parse(saved) as Task[] : startingTasks
  } catch {
    return startingTasks
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(readTasks)
  const [activeView, setActiveView] = useState('Overview')
  const [query, setQuery] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newProject, setNewProject] = useState(projects[0].name)

  useEffect(() => {
    localStorage.setItem('kdva-tasks', JSON.stringify(tasks))
  }, [tasks])

  const visibleTasks = tasks.filter((task) => {
    const matchesQuery = `${task.title} ${task.project}`.toLowerCase().includes(query.toLowerCase())
    const matchesView = activeView !== 'My tasks' || task.status !== 'Done'
    return matchesQuery && matchesView
  })

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    setTasks((current) => [{
      id: Date.now(), title, project: newProject, due: 'Today', status: 'To do', initials: 'KD', color: 'lime',
    }, ...current])
    setNewTitle('')
    setShowDialog(false)
  }

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => task.id === id
      ? { ...task, status: task.status === 'Done' ? 'To do' : 'Done' }
      : task))
  }

  const completedCount = tasks.filter((task) => task.status === 'Done').length
  const dateLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

  return (
    <div className="app-shell">
      <aside className={`sidebar ${showSidebar ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#overview" onClick={() => setActiveView('Overview')} aria-label="KDVA home">
          <span className="brand-mark"><span /></span>
          <span>KDVA</span>
          <span className="brand-badge">WORKSPACE</span>
        </a>

        <div className="workspace-switcher">
          <div className="workspace-avatar">N</div>
          <div className="workspace-copy"><strong>Northstar Studio</strong><span>Free plan</span></div>
          <ChevronDown size={15} />
        </div>

        <div className="nav-caption">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activeView === label ? 'nav-active' : ''}`} onClick={() => { setActiveView(label); setShowSidebar(false) }}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
              {label === 'My tasks' && <span className="nav-count">{tasks.filter((task) => task.status !== 'Done').length}</span>}
            </button>
          ))}
        </nav>

        <div className="project-nav-heading"><span className="nav-caption">YOUR PROJECTS</span><button aria-label="Add project" title="Add project"><Plus size={15} /></button></div>
        <div className="project-nav">
          {projects.map((project) => <button key={project.name} className="project-nav-item" onClick={() => setActiveView('Projects')}><i className={`project-dot ${project.color}`} />{project.name}<span className="project-nav-more">···</span></button>)}
        </div>

        <div className="sidebar-bottom">
          <button className="nav-item"><Settings2 size={17} strokeWidth={1.8} /><span>Settings</span></button>
          <div className="profile-row"><div className="profile-avatar">KD</div><div className="profile-copy"><strong>KDVA Member</strong><span>Workspace admin</span></div><ChevronDown size={15} /></div>
        </div>
      </aside>

      {showSidebar && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setShowSidebar(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setShowSidebar(true)} aria-label="Open navigation"><Menu size={19} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activeView}</strong></div>
          <div className="topbar-actions">
            <label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anything..." /><kbd><Command size={11} /> K</kbd></label>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button>
            <div className="top-avatar">KD</div>
          </div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row">
            <div><div className="eyebrow"><span className="eyebrow-line" />{dateLabel}</div><h1>{activeView === 'Overview' ? 'Good morning, team.' : activeView}</h1><p className="welcome-subtitle">A clear view of what matters, and what’s next.</p></div>
            <button className="primary-button" onClick={() => setShowDialog(true)}><Plus size={17} strokeWidth={2.2} />New task</button>
          </section>

          {activeView !== 'Projects' && <section className="stats-grid" aria-label="Workspace summary">
            <article className="stat-panel"><div className="stat-top"><span>Active projects</span><span className="stat-icon stat-icon-lime"><FolderKanban size={16} /></span></div><div className="stat-number">03 <span className="stat-change"><ArrowUpRight size={14} /> 1 this month</span></div><div className="stat-foot">Across your workspace</div></article>
            <article className="stat-panel"><div className="stat-top"><span>Tasks in progress</span><span className="stat-icon stat-icon-coral"><Clock3 size={16} /></span></div><div className="stat-number">{String(tasks.filter((task) => task.status === 'In progress').length + 8).padStart(2, '0')} <span className="stat-change"><ArrowDownRight size={14} /> 12% this week</span></div><div className="stat-foot">Keep the momentum going</div></article>
            <article className="stat-panel"><div className="stat-top"><span>Tasks completed</span><span className="stat-icon stat-icon-blue"><CheckCheck size={16} /></span></div><div className="stat-number">{String(completedCount + 32).padStart(2, '0')} <span className="stat-change"><ArrowUpRight size={14} /> 8% this week</span></div><div className="stat-foot">You’re making great progress</div></article>
          </section>}

          {activeView !== 'My tasks' && <section className="section-block">
            <div className="section-heading"><div><div className="section-kicker">THE BIG PICTURE</div><h2>{activeView === 'Projects' ? 'All projects' : 'Projects in motion'} <span className="heading-count">03</span></h2></div><button className="text-button" onClick={() => setActiveView('Projects')}>View all projects <ArrowUpRight size={15} /></button></div>
            <div className="projects-grid">
              {projects.map((project, index) => <article className={`project-card project-${project.color}`} key={project.name}>
                <div className="project-card-top"><span className={`project-label label-${project.color}`}><i />{project.label}</span><button className="more-button" aria-label={`More options for ${project.name}`}>···</button></div>
                <h3>{project.name}</h3><div className="project-card-meta"><span>{project.tasks} tasks</span><span className="meta-divider" /><span>{project.progress}% complete</span></div>
                <div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div>
                <div className="project-card-bottom"><div className="avatar-stack">{project.people.map((person, personIndex) => <span className={`mini-avatar avatar-${personIndex}`} key={person}>{person}</span>)}</div><span className="due-hint"><CalendarDays size={13} />{index === 0 ? 'Due Nov 30' : index === 1 ? 'Due Dec 08' : 'Due Dec 14'}</span></div>
              </article>)}
            </div>
          </section>}

          <section className="section-block tasks-section">
            <div className="section-heading task-heading"><div><div className="section-kicker">YOUR NEXT MOVES</div><h2>{activeView === 'My tasks' ? 'My tasks' : 'Upcoming tasks'} <span className="heading-count">{visibleTasks.length}</span></h2></div><div className="task-filters"><button className="filter-button"><span className="filter-indicator" />All tasks<ChevronDown size={14} /></button><button className="view-toggle" aria-label="List view"><ListTodo size={16} /></button></div></div>
            <div className="task-table">
              <div className="task-table-head"><span className="task-col-name">TASK</span><span className="task-col-project">PROJECT</span><span className="task-col-due">DUE DATE</span><span className="task-col-status">STATUS</span><span className="task-col-owner">OWNER</span></div>
              {visibleTasks.length === 0 ? <div className="empty-state"><Search size={19} /><span>No tasks match your search.</span></div> : visibleTasks.map((task) => <div className={`task-row ${task.status === 'Done' ? 'task-complete' : ''}`} key={task.id}>
                <button className={`task-check ${task.status === 'Done' ? 'checked' : ''}`} onClick={() => toggleTask(task.id)} aria-label={task.status === 'Done' ? 'Mark task incomplete' : 'Complete task'}>{task.status === 'Done' ? <Check size={13} /> : <Circle size={16} />}</button>
                <span className="task-title">{task.title}</span><span className="task-project"><i className={`project-dot ${task.color}`} />{task.project}</span><span className={`task-due ${task.due === 'Today' ? 'due-today' : ''}`}>{task.due === 'Today' && <span className="due-pip" />}{task.due}</span><span className={`status-pill status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span><span className={`owner-avatar owner-${task.color}`}>{task.initials}</span>
              </div>)}
              <button className="add-task-row" onClick={() => setShowDialog(true)}><span><Plus size={15} />Add a task</span><kbd>↵</kbd></button>
            </div>
          </section>

          <footer className="page-footer"><span><Sparkles size={14} />Small steps, significant things.</span><span>KDVA WORKSPACE <b>·</b> 2026</span></footer>
        </div>
      </main>

      {showDialog && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowDialog(false) }}><form className="task-dialog" onSubmit={addTask}>
        <div className="dialog-heading"><div><span className="section-kicker">MAKE IT HAPPEN</span><h2>New task</h2></div><button type="button" className="icon-button" onClick={() => setShowDialog(false)} aria-label="Close dialog"><X size={18} /></button></div>
        <label className="field-label" htmlFor="task-title">Task name</label><input id="task-title" className="dialog-input" autoFocus placeholder="What needs to get done?" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} required />
        <label className="field-label" htmlFor="task-project">Project</label><select id="task-project" className="dialog-input" value={newProject} onChange={(event) => setNewProject(event.target.value)}>{projects.map((project) => <option key={project.name}>{project.name}</option>)}</select>
        <div className="dialog-actions"><button type="button" className="secondary-button" onClick={() => setShowDialog(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={16} />Create task</button></div>
      </form></div>}
    </div>
  )
}

export default App