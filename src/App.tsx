import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight, BarChart3, Bell, BookOpen, Check, ChevronRight, CircleHelp,
  Clock3, Coffee, Coins, Flame, Headphones, LayoutDashboard, Leaf, ListChecks,
  Menu, Moon, MoreHorizontal, Play, Plus, Search, Settings, ShieldCheck,
  Sparkles, Sun, Target, Trophy, UserRound, Video, WalletCards, X, Zap
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'

type View = 'overview' | 'planner' | 'focus' | 'analytics' | 'rewards' | 'pledge'
type Task = { id: number; title: string; subject: string; time: string; priority: 'High' | 'Medium' | 'Low'; done: boolean }

const weeklyData = [
  { day: 'Mon', minutes: 62 }, { day: 'Tue', minutes: 48 }, { day: 'Wed', minutes: 83 },
  { day: 'Thu', minutes: 56 }, { day: 'Fri', minutes: 92 }, { day: 'Sat', minutes: 71 }, { day: 'Sun', minutes: 38 },
]
const subjectData = [
  { name: 'Design', value: 42, color: '#7658d6' }, { name: 'Computer science', value: 32, color: '#b59ef4' },
  { name: 'Mathematics', value: 18, color: '#e9bd73' }, { name: 'Other', value: 8, color: '#d8d2ea' },
]
const initialTasks: Task[] = [
  { id: 1, title: 'Review interaction design notes', subject: 'Product design', time: '45 min', priority: 'High', done: false },
  { id: 2, title: 'Finish probability problem set', subject: 'Mathematics', time: '30 min', priority: 'Medium', done: false },
  { id: 3, title: 'Read chapter 4: neural networks', subject: 'Computer science', time: '25 min', priority: 'Low', done: true },
]

function App() {
  const [view, setView] = useState<View>('overview')
  const [dark, setDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [camera, setCamera] = useState(false)
  const [sound, setSound] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!running) return
    const interval = window.setInterval(() => setSecondsLeft((seconds) => {
      if (seconds <= 1) { setRunning(false); setToast('Session complete — +25 XP added!'); return 0 }
      return seconds - 1
    }), 1000)
    return () => window.clearInterval(interval)
  }, [running])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 3500)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const completed = tasks.filter((task) => task.done).length
  const timerLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`
  const navigate = (next: View) => { setView(next); setMobileOpen(false) }
  const setTimer = (minutes: number) => { setTimerMinutes(minutes); setSecondsLeft(minutes * 60); setRunning(false) }
  const toggleTask = (id: number) => setTasks((items) => items.map((task) => task.id === id ? { ...task, done: !task.done } : task))
  const addTask = () => {
    if (!newTask.trim()) return
    setTasks((items) => [...items, { id: Date.now(), title: newTask.trim(), subject: 'Personal', time: '25 min', priority: 'Medium', done: false }])
    setNewTask('')
    setToast('Task added to your plan')
  }

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <aside className={mobileOpen ? 'sidebar open' : 'sidebar'}>
        <div className="brand"><div className="brand-mark"><Leaf size={17} fill="currentColor" /></div><span>Focus<span>Flow</span></span></div>
        <div className="profile-card">
          <div className="avatar">JD</div><div><strong>Jamie Davis</strong><small>Product design student</small></div><ChevronRight size={15} className="muted" />
        </div>
        <p className="nav-label">Workspace</p>
        <nav>
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active={view === 'overview'} onClick={() => navigate('overview')} />
          <NavItem icon={<ListChecks size={18} />} label="Study planner" active={view === 'planner'} onClick={() => navigate('planner')} badge={tasks.filter((t) => !t.done).length.toString()} />
          <NavItem icon={<Target size={18} />} label="Focus room" active={view === 'focus'} onClick={() => navigate('focus')} />
          <NavItem icon={<BarChart3 size={18} />} label="Analytics" active={view === 'analytics'} onClick={() => navigate('analytics')} />
        </nav>
        <p className="nav-label">Motivation</p>
        <nav>
          <NavItem icon={<Trophy size={18} />} label="Rewards" active={view === 'rewards'} onClick={() => navigate('rewards')} />
          <NavItem icon={<WalletCards size={18} />} label="Focus pledge" active={view === 'pledge'} onClick={() => navigate('pledge')} />
        </nav>
        <div className="sidebar-bottom">
          <div className="pledge-mini"><div className="mini-icon"><ShieldCheck size={17} /></div><div><small>Focus pledge</small><strong>₹1,250 saved</strong></div><ArrowUpRight size={15} /></div>
          <NavItem icon={<Settings size={18} />} label="Settings" onClick={() => setToast('Settings are ready for your preferences')} />
          <NavItem icon={<CircleHelp size={18} />} label="Help center" onClick={() => setToast('Help center coming soon')} />
        </div>
      </aside>
      <main className="main">
        <header className="topbar"><button className="icon-btn menu-btn" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{view === 'overview' ? 'Overview' : view[0].toUpperCase() + view.slice(1)}</strong></div><div className="top-actions"><button className="icon-btn"><Search size={18} /></button><button className="icon-btn notification"><Bell size={18} /><i /></button><button className="theme-toggle" onClick={() => setDark(!dark)}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button><div className="top-avatar">JD</div></div></header>
        <div className="content">
          {view === 'overview' && <Overview navigate={navigate} timerLabel={timerLabel} running={running} setRunning={setRunning} completed={completed} setToast={setToast} />}
          {view === 'planner' && <Planner tasks={tasks} toggleTask={toggleTask} newTask={newTask} setNewTask={setNewTask} addTask={addTask} navigate={navigate} />}
          {view === 'focus' && <FocusRoom timerLabel={timerLabel} timerMinutes={timerMinutes} running={running} setRunning={setRunning} setTimer={setTimer} camera={camera} setCamera={setCamera} sound={sound} setSound={setSound} setToast={setToast} />}
          {view === 'analytics' && <Analytics />}
          {view === 'rewards' && <Rewards setToast={setToast} />}
          {view === 'pledge' && <Pledge setToast={setToast} />}
        </div>
      </main>
      {showWelcome && <div className="modal-backdrop"><div className="welcome-modal"><button className="close-modal" onClick={() => setShowWelcome(false)}><X size={18} /></button><div className="welcome-glow" /><div className="modal-logo"><Leaf size={20} fill="currentColor" /></div><p className="eyebrow">YOUR FOCUS, IN FLOW</p><h2>Good morning, Jamie.</h2><p className="modal-copy">You’re 12 minutes away from your daily goal. Ready to make today count?</p><button className="primary wide" onClick={() => { setShowWelcome(false); navigate('focus') }}>Start a focus session <ArrowUpRight size={16} /></button><button className="text-button" onClick={() => setShowWelcome(false)}>Maybe later</button></div></div>}
      {toast && <div className="toast"><Check size={17} />{toast}</div>}
    </div>
  )
}

function NavItem({ icon, label, active, onClick, badge }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; badge?: string }) {
  return <button className={active ? 'nav-item active' : 'nav-item'} onClick={onClick}>{icon}<span>{label}</span>{badge && <em>{badge}</em>}</button>
}

function Overview({ navigate, timerLabel, running, setRunning, completed, setToast }: { navigate: (v: View) => void; timerLabel: string; running: boolean; setRunning: (v: boolean) => void; completed: number; setToast: (v: string) => void }) {
  return <><div className="page-heading"><div><p className="eyebrow">THURSDAY, OCTOBER 24, 2024</p><h1>Make space for <i>deep work.</i></h1><p className="subheading">A little focus today goes a long way. You’ve got this.</p></div><button className="primary" onClick={() => navigate('focus')}><Play size={16} fill="currentColor" /> Start focusing</button></div>
    <div className="stats-row"><Stat icon={<Clock3 />} label="Today's focus" value="1h 42m" detail="+18% vs yesterday" good /><Stat icon={<Flame />} label="Current streak" value="6 days" detail="Your best is 12 days" /><Stat icon={<Trophy />} label="Focus level" value="Level 7" detail="280 XP to level 8" /><Stat icon={<Coins />} label="Pledge balance" value="₹1,250" detail="This month's savings" /></div>
    <div className="dashboard-grid"><section className="panel timer-card"><div className="panel-head"><div><p className="eyebrow">QUICK SESSION</p><h3>Ready when you are</h3></div><button className="more-btn"><MoreHorizontal size={19} /></button></div><div className="quick-timer"><div className="timer-ring small-ring"><div><strong>{timerLabel}</strong><span>{running ? 'In progress' : 'Focus session'}</span></div></div><div className="timer-side"><div className="session-context"><div className="subject-dot design" /><div><strong>Product design</strong><small>Review interaction notes</small></div></div><button className="primary" onClick={() => setRunning(!running)}>{running ? 'Pause session' : 'Start session'} <ChevronRight size={16} /></button><button className="secondary" onClick={() => navigate('focus')}>Open focus room</button></div></div></section>
      <section className="panel chart-card"><div className="panel-head"><div><p className="eyebrow">THIS WEEK</p><h3>Focus minutes</h3></div><button className="filter-btn">Last 7 days <ChevronRight size={14} /></button></div><div className="chart-legend"><span><i className="legend-dot purple" /> Focus time</span><strong>6h 30m <small>+14.2%</small></strong></div><ResponsiveContainer width="100%" height={160}><AreaChart data={weeklyData} margin={{ top: 15, right: 4, left: -20, bottom: 0 }}><defs><linearGradient id="focusFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8466df" stopOpacity={0.28} /><stop offset="100%" stopColor="#8466df" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#eeeaf7" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9a96aa', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9a96aa', fontSize: 11 }} /><Tooltip contentStyle={{ border: 0, borderRadius: 10, boxShadow: '0 8px 24px #30255718' }} /><Area type="monotone" dataKey="minutes" stroke="#7558d4" strokeWidth={2.5} fill="url(#focusFill)" /></AreaChart></ResponsiveContainer></section></div>
    <div className="lower-grid"><section className="panel tasks-card"><div className="panel-head"><div><p className="eyebrow">YOUR PLAN</p><h3>Today's tasks</h3></div><button className="link-btn" onClick={() => navigate('planner')}>View planner <ArrowUpRight size={14} /></button></div><div className="task-list"><TaskRow title="Review interaction design notes" subject="Product design" time="45 min" priority="High" done={false} onClick={() => setToast('Task marked as complete')} /><TaskRow title="Finish probability problem set" subject="Mathematics" time="30 min" priority="Medium" done={false} onClick={() => setToast('Task started')} /><TaskRow title="Read chapter 4: neural networks" subject="Computer science" time="25 min" priority="Low" done onClick={() => setToast('Task reopened')} /></div></section><section className="panel progress-card"><div className="panel-head"><div><p className="eyebrow">DAILY GOAL</p><h3>Keep your momentum</h3></div><Target size={20} className="accent-icon" /></div><div className="goal-progress"><div className="progress-circle"><strong>68<span>%</span></strong></div><div><strong>1h 42m <small>of 2h 30m</small></strong><p>48 minutes left to hit today's goal.</p><button className="link-btn" onClick={() => navigate('analytics')}>See your insights <ArrowUpRight size={14} /></button></div></div><div className="streak-note"><Flame size={16} fill="#e9a84e" color="#e9a84e" /><span><b>6 day streak</b> — keep it going!</span></div></section></div>
  </>
}

function TaskRow({ title, subject, time, priority, done, onClick }: { title: string; subject: string; time: string; priority: string; done: boolean; onClick: () => void }) {
  return <button className="task-row" onClick={onClick}><span className={done ? 'check-circle checked' : 'check-circle'}>{done && <Check size={13} />}</span><span className={done ? 'task-title done' : 'task-title'}><strong>{title}</strong><small>{subject} · {time}</small></span><span className={`priority ${priority.toLowerCase()}`}>{priority}</span><ChevronRight size={16} className="muted" /></button>
}

function Planner({ tasks, toggleTask, newTask, setNewTask, addTask, navigate }: { tasks: Task[]; toggleTask: (id: number) => void; newTask: string; setNewTask: (v: string) => void; addTask: () => void; navigate: (v: View) => void }) {
  return <><div className="page-heading"><div><p className="eyebrow">STUDY PLANNER</p><h1>Plan with <i>intention.</i></h1><p className="subheading">Small, clear steps make deep work feel lighter.</p></div><button className="primary" onClick={addTask}><Plus size={17} /> Add task</button></div><section className="panel planner-panel"><div className="planner-toolbar"><div className="week-tabs"><button className="active">Today <span>3</span></button><button>This week</button></div><div className="add-task"><input value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} placeholder="Quick add a task..." /><button onClick={addTask}><Plus size={17} /></button></div></div><div className="planner-date"><div><strong>Thursday, Oct 24</strong><span> · 3 tasks planned</span></div><span className="goal-pill"><Target size={14} /> 1h 40m planned</span></div><div className="planner-list">{tasks.map((task) => <div className="planner-row" key={task.id}><button className={task.done ? 'check-circle checked' : 'check-circle'} onClick={() => toggleTask(task.id)}>{task.done && <Check size={13} />}</button><div className={task.done ? 'task-title done' : 'task-title'}><strong>{task.title}</strong><small><span className={`subject-tag ${task.subject === 'Mathematics' ? 'math' : task.subject === 'Computer science' ? 'cs' : 'design'}`} />{task.subject} · {task.time}</small></div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><button className="start-task" onClick={() => navigate('focus')}><Play size={13} fill="currentColor" /> Focus</button><MoreHorizontal size={18} className="muted" /></div>)}</div></section></>
}

function FocusRoom({ timerLabel, timerMinutes, running, setRunning, setTimer, camera, setCamera, sound, setSound, setToast }: { timerLabel: string; timerMinutes: number; running: boolean; setRunning: (v: boolean) => void; setTimer: (v: number) => void; camera: boolean; setCamera: (v: boolean) => void; sound: boolean; setSound: (v: boolean) => void; setToast: (v: string) => void }) {
  const streamRef = useRef<MediaStream | null>(null)
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), [])
  const toggleCamera = async () => {
    if (camera) {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setCamera(false)
      setToast('Camera tracking paused')
      return
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setToast('Camera is unavailable — manual focus mode is still active')
      return
    }
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      setCamera(true)
      setToast('Camera tracking enabled — video stays on this device')
    } catch {
      setToast('Camera permission was not granted — manual focus mode is still active')
    }
  }
  return <><div className="page-heading focus-heading"><div><p className="eyebrow">SMART FOCUS ROOM</p><h1>One thing at a time.</h1><p className="subheading">Your space for calm, uninterrupted work.</p></div><div className="room-status"><span className="live-dot" /> {running ? 'Session in progress' : 'Ready to focus'}</div></div><div className="focus-layout"><section className="focus-main panel"><div className="focus-context"><div className="subject-dot design" /><div><strong>Product design</strong><span>Review interaction design notes</span></div><button className="more-btn" onClick={() => setToast('Session options opened')}><MoreHorizontal size={19} /></button></div><div className="big-timer"><div className={running ? 'timer-ring running' : 'timer-ring'}><div><strong>{timerLabel}</strong><span>{running ? 'Deep work' : 'Ready when you are'}</span></div></div></div><div className="timer-controls"><div className="duration-buttons">{[25, 50, 90].map((m) => <button className={timerMinutes === m ? 'selected' : ''} key={m} onClick={() => setTimer(m)}>{m} min</button>)}</div><button className="primary timer-action" onClick={() => setRunning(!running)}>{running ? 'Pause session' : 'Start session'} <Play size={15} fill="currentColor" /></button></div><div className="focus-footer"><button className={camera ? 'feature-toggle on' : 'feature-toggle'} onClick={toggleCamera}><Video size={16} /><span><strong>{camera ? 'Camera tracking on' : 'Enable camera tracking'}</strong><small>{camera ? 'Attention estimate is active' : 'Optional · processed on device'}</small></span><i /></button><button className={sound ? 'feature-toggle on' : 'feature-toggle'} onClick={() => { setSound(!sound); setToast(sound ? 'Ambient sound paused' : 'Ambient sound enabled') }}><Headphones size={16} /><span><strong>{sound ? 'Ambient sound on' : 'Add ambient sound'}</strong><small>{sound ? 'Rainy coffee shop' : 'Lo-fi, rain & more'}</small></span><i /></button></div></section><aside className="focus-side"><div className="panel side-panel"><div className="panel-head"><div><p className="eyebrow">SESSION NOTES</p><h3>Stay in the flow</h3></div><Sparkles size={18} className="gold-icon" /></div><div className="insight"><div className="insight-icon purple-bg"><Zap size={17} /></div><div><strong>Set a clear intention</strong><p>What would make this session a win?</p></div></div><textarea placeholder="I want to finish..." /><button className="secondary wide" onClick={() => setToast('Session intention saved')}>Save intention</button></div><div className="panel privacy-card"><ShieldCheck size={19} /><div><strong>Your privacy matters</strong><p>Camera estimates are processed locally. No video is stored or uploaded.</p><button className="link-btn" onClick={() => setToast('Privacy controls opened')}>Learn about privacy <ArrowUpRight size={13} /></button></div></div></aside></div></>
}

function Analytics() {
  return <><div className="page-heading"><div><p className="eyebrow">YOUR INSIGHTS</p><h1>See your focus <i>compound.</i></h1><p className="subheading">Patterns that help you build a more intentional study practice.</p></div><button className="filter-btn">This week <ChevronRight size={14} /></button></div><div className="stats-row analytics-stats"><Stat icon={<Clock3 />} label="Total focus time" value="6h 30m" detail="+14% from last week" good /><Stat icon={<Zap />} label="Avg. focus score" value="84 / 100" detail="+6 points this week" good /><Stat icon={<Target />} label="Sessions completed" value="18" detail="3 more than last week" good /><Stat icon={<Flame />} label="Longest streak" value="12 days" detail="Personal best" /></div><div className="dashboard-grid"><section className="panel chart-card"><div className="panel-head"><div><p className="eyebrow">WEEKLY TREND</p><h3>Focus minutes by day</h3></div></div><ResponsiveContainer width="100%" height={250}><BarChart data={weeklyData} margin={{ top: 15, right: 4, left: -20, bottom: 0 }}><CartesianGrid vertical={false} stroke="#eeeaf7" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9a96aa', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9a96aa', fontSize: 11 }} /><Tooltip cursor={{ fill: '#f7f5fc' }} contentStyle={{ border: 0, borderRadius: 10 }} /><Bar dataKey="minutes" radius={[5, 5, 0, 0]} fill="#8061d8" /></BarChart></ResponsiveContainer></section><section className="panel chart-card subject-chart"><div className="panel-head"><div><p className="eyebrow">BREAKDOWN</p><h3>Time by subject</h3></div></div><div className="donut-wrap"><ResponsiveContainer width={190} height={190}><PieChart><Pie data={subjectData} dataKey="value" innerRadius={57} outerRadius={80} paddingAngle={4}>{subjectData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer><div className="donut-center"><strong>6h 30m</strong><span>total</span></div></div><div className="subject-legend">{subjectData.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}<b>{item.value}%</b></span>)}</div></section></div><div className="privacy-disclaimer"><ShieldCheck size={16} /><span>Focus score combines session completion, self-reported ratings, and optional on-device attention estimates. It is a helpful reflection tool, not a scientifically validated measurement.</span></div></>
}

function Rewards({ setToast }: { setToast: (v: string) => void }) {
  const rewards = [{ title: 'First deep work session', desc: 'Complete your first focused session', icon: '✦', unlocked: true }, { title: 'Three-day streak', desc: 'Focus for three days in a row', icon: '🔥', unlocked: true }, { title: '10 hours deep work', desc: 'Log 10 hours of focused time', icon: '◈', unlocked: false }, { title: 'Consistency master', desc: 'Complete 20 planned sessions', icon: '✺', unlocked: false }]
  return <><div className="page-heading"><div><p className="eyebrow">REWARDS & MILESTONES</p><h1>Progress worth <i>celebrating.</i></h1><p className="subheading">Consistency is its own reward. These are just a little extra.</p></div><div className="level-chip"><Trophy size={17} /> Level 7 <span>2,720 XP</span></div></div><div className="reward-banner"><div className="banner-sparkle"><Sparkles size={24} /></div><div><p className="eyebrow">NEXT MILESTONE</p><h3>Seven-day focus champion</h3><p>One more day to unlock your next badge and earn <b>+150 XP</b>.</p></div><div className="banner-progress"><span>6 / 7 days</span><div><i /></div></div></div><h3 className="section-title">Your achievements</h3><div className="reward-grid">{rewards.map((reward) => <div className={reward.unlocked ? 'reward-card unlocked' : 'reward-card'} key={reward.title}><div className="reward-icon">{reward.icon}</div><div><strong>{reward.title}</strong><p>{reward.desc}</p></div>{reward.unlocked ? <span className="unlocked-label"><Check size={13} /> Unlocked</span> : <span className="locked-label">In progress</span>}</div>)}</div><h3 className="section-title">Student perks <span>Sample offers · demo mode</span></h3><div className="coupon-grid"><Coupon title="20% off Notion Plus" desc="For students building better systems" color="lavender" setToast={setToast} /><Coupon title="Free month of Headspace" desc="A calmer mind, better focus" color="peach" setToast={setToast} /><Coupon title="₹200 on Bookshop" desc="For your next deep dive" color="mint" setToast={setToast} /></div></>
}
function Coupon({ title, desc, color, setToast }: { title: string; desc: string; color: string; setToast: (v: string) => void }) { return <div className={`coupon-card ${color}`}><div className="coupon-logo">{title[0]}</div><div><strong>{title}</strong><p>{desc}</p><button className="link-btn" onClick={() => setToast('Sample reward saved — no real redemption in demo mode')}>View offer <ArrowUpRight size={13} /></button></div></div> }

function Pledge({ setToast }: { setToast: (v: string) => void }) {
  return <><div className="page-heading"><div><p className="eyebrow">FOCUS PLEDGE <span className="sandbox-label">SANDBOX</span></p><h1>Make focus <i>meaningful.</i></h1><p className="subheading">A gentle commitment to the goals you care about.</p></div><button className="primary" onClick={() => setToast('Pledge creation is available in sandbox mode')}><Plus size={17} /> New pledge</button></div><div className="pledge-balance panel"><div className="balance-icon"><ShieldCheck size={21} /></div><div><p className="eyebrow">VIRTUAL BALANCE</p><h2>₹1,250.00</h2><p>Demo funds only · No real money is held or transferred</p></div><div className="balance-actions"><button className="secondary" onClick={() => setToast('Deposit flow is simulated in this demo')}>Add virtual funds</button><button className="icon-btn"><MoreHorizontal size={18} /></button></div></div><div className="pledge-columns"><section className="panel active-pledge"><div className="panel-head"><div><p className="eyebrow">ACTIVE CHALLENGE</p><h3>Design sprint consistency</h3></div><span className="active-pill"><i /> Active</span></div><p className="pledge-description">Complete 5 focused sessions this week to protect your ₹250 virtual pledge.</p><div className="pledge-progress"><div><span>Progress</span><strong>3 of 5 sessions</strong></div><div className="progress-line"><i /></div><small>2 sessions left · Ends Sunday</small></div><div className="pledge-details"><span><Clock3 size={15} /> 25 min minimum</span><span><Flame size={15} /> 5 day streak</span><span><Coins size={15} /> ₹250 pledged</span></div><button className="secondary wide" onClick={() => setToast('Challenge details opened')}>View challenge details <ChevronRight size={15} /></button></section><section className="panel pledge-history"><div className="panel-head"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>Virtual transactions</h3></div></div><div className="transaction"><span className="transaction-icon in"><ArrowUpRight size={15} /></span><div><strong>Pledge returned</strong><small>Design sprint challenge · Oct 18</small></div><b>+₹150</b></div><div className="transaction"><span className="transaction-icon out"><ArrowUpRight size={15} /></span><div><strong>Challenge pledged</strong><small>Consistency challenge · Oct 12</small></div><b className="negative">−₹250</b></div><button className="link-btn" onClick={() => setToast('Showing all sandbox transactions')}>View all activity <ArrowUpRight size={13} /></button></section></div><div className="safety-note"><ShieldCheck size={18} /><div><strong>Built with safety in mind</strong><p>Focus estimates never trigger payments. Every pledge is reviewable and requires explicit confirmation. Production payments are not connected in this demo.</p></div></div></>
}

function Stat({ icon, label, value, detail, good }: { icon: React.ReactNode; label: string; value: string; detail: string; good?: boolean }) { return <div className="stat"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small className={good ? 'good' : ''}>{good && <ArrowUpRight size={12} />}{detail}</small></div></div> }

export default App
