import { useMemo, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  NavLink,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Home,
  BriefcaseBusiness,
  ClipboardCheck,
  ListChecks,
  UserRound,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  MapPin,
  Clock,
  Bookmark,
  ChevronRight,
  CalendarDays,
  Video,
  Building2,
  GraduationCap,
  Upload,
  FileText,
  Code2,
  Users,
  CheckCircle2,
  ArrowLeft,
  Mail,
  Phone,
  Save,
  Filter,
} from "lucide-react";
import clsx from "clsx";
import { jobs } from "./data";
import Login from "./pages/Login";
import ProtectedRoute, { AUTH_STORAGE_KEY, CANDIDATE_STORAGE_KEY } from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const nav = [
  ["/dashboard", "Início", Home],
  ["/vagas", "Vagas", BriefcaseBusiness],
  ["/candidaturas", "Candidaturas", ClipboardCheck],
  ["/tarefas", "Tarefas", ListChecks],
  ["/perfil", "Perfil", UserRound],
];
const titles = {
  "/dashboard": "Início",
  "/vagas": "Vagas Disponíveis",
  "/candidaturas": "Minhas candidaturas",
  "/tarefas": "Tarefas",
  "/perfil": "Perfil",
};
const initials = (name = "") => name.split(" ").slice(0, 2).map((part) => part[0]).join("");
function Avatar({ small = false }) {
  const { candidate } = useAuth();
  return <span className={clsx("avatar", small && "small")}>{initials(candidate?.profile.name)}</span>;
}
function Layout() {
  const { candidate, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const loc = useLocation();
  const title = loc.pathname.startsWith("/vagas/")
    ? "Detalhes da Vaga"
    : titles[loc.pathname] || "TalentMatch";
  return (
    <div className="app-shell">
      <aside className={clsx("sidebar", open && "open")}>
        <div className="brand">TalentMatch</div>
        <button className="close-menu" onClick={() => setOpen(false)}>
          <X />
        </button>
        <nav>
          {nav.map(([to, label, Icon]) => (
            <NavLink
              end={to === "/"}
              key={to}
              to={to}
              onClick={() => setOpen(false)}
            >
              <Icon size={21} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="account">
          <div className="account-card">
            <Avatar />
            <div>
              <b>{candidate.profile.name}</b>
              <small>{candidate.profile.role}</small>
            </div>
          </div>
          <button onClick={() => { logout(); window.location.assign("/login"); }}>
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>
      {open && (
        <button
          className="scrim"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
      )}
      <header>
        <button className="menu-button" onClick={() => setOpen(true)}>
          <Menu />
        </button>
        <h2>{title}</h2>
        <div className="header-actions">
          <button
            aria-label="Notificações"
            className="notification"
            onClick={() => setNotifications(!notifications)}
          >
            <Bell size={21} />
            <i />
          </button>
          <Avatar small />
          {notifications && (
            <div className="notification-panel">
              <div>
                <b>Notificações</b>
                <button onClick={() => setNotifications(false)}>
                  <X size={17} />
                </button>
              </div>
              {candidate.notifications.map((item) => (
                <Link key={item.title} to={item.route} onClick={() => setNotifications(false)}>
                  <ListChecks /><span><b>{item.title}</b><small>{item.detail}</small></span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
      <main><Outlet /></main>
      <nav className="mobile-nav">
        {nav.map(([to, label, Icon]) => (
          <NavLink end={to === "/"} key={to} to={to}>
            <Icon size={21} />
            <small>{label}</small>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
function PageTitle({ children, sub }) {
  return (
    <div className="page-title">
      <div>
        <h1>{children}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </div>
  );
}
function Metric({ value, label, Icon, tone }) {
  return (
    <article className={clsx("metric", tone)}>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
      <Icon size={32} />
    </article>
  );
}
function JobLogo({ job }) {
  return <div className="job-logo">{job.logo}</div>;
}
function JobCard({ job, compact = false }) {
  const [saved, setSaved] = useState(false);
  return (
    <article className={clsx("job-card", compact && "compact")}>
      <div className="job-top">
        <JobLogo job={job} />
        <Link to={"/vagas/" + job.id} className="job-heading">
          <h3>{job.title}</h3>
          <b>{job.company}</b>
        </Link>
        <button
          aria-label={saved ? "Remover dos favoritos" : "Salvar vaga"}
          className={clsx("icon-button", saved && "saved")}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark size={21} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="meta">
        <span>
          <MapPin /> {job.location}
        </span>
        <span>
          <BriefcaseBusiness /> {job.type}
        </span>
        <span>
          <Clock /> {job.posted}
        </span>
      </div>
      {!compact && (
        <div className="job-footer">
          <small>{job.tag}</small>
          <Link className="button" to={"/vagas/" + job.id}>
            Ver detalhes
          </Link>
        </div>
      )}
    </article>
  );
}
function Dashboard() {
  const { candidate } = useAuth();
  const interview = candidate.interviews[0];
  return (
    <>
      <PageTitle sub="Acompanhe suas oportunidades e próximas etapas">
        Olá, {candidate.profile.name.split(" ")[0]}! 👋
      </PageTitle>
      <section className="metrics">
        <Metric
          value={candidate.dashboard.activeApplications}
          label="Candidaturas Ativas"
          Icon={ClipboardCheck}
          tone="blue"
        />
        <Metric value={candidate.dashboard.pendingTasks} label="Tarefas Pendentes" Icon={ListChecks} />
        <Metric value={candidate.dashboard.scheduledInterviews} label="Entrevista Agendada" Icon={CalendarDays} />
      </section>
      <div className="dashboard-grid">
        <section>
          <div className="section-heading">
            <h2>Próximas etapas</h2>
            <Link to="/tarefas">Ver tarefas</Link>
          </div>
          <article className="interview-card">
            <div className="date-box">
              <b>{interview.month}</b>
              <strong>{interview.date}</strong>
            </div>
            <div className="interview-info">
              <span className="badge">Entrevista</span>
              <h3>{interview.job}</h3>
              <p>{interview.company} • {interview.location}</p>
              <div className="info-row">
                <span>
                  <Clock /> <small>Horário</small>
                  <b>{interview.time}</b>
                </span>
                <span>
                  <Video /> <small>Formato</small>
                  <b>{interview.format}</b>
                </span>
              </div>
            </div>
            <button
              className="button"
              onClick={() =>
                alert("Abertura do Google Meet simulada. O link real será fornecido pela API.")
              }
            >
              Entrar na reunião
            </button>
          </article>
        </section>
        <section>
          <div className="section-heading">
            <h2>Vagas recomendadas</h2>
          </div>
          <div className="recommendations">
            {candidate.recommendedJobs.map((j) => (
              <JobCard job={j} compact key={j.id} />
            ))}
          </div>
          <Link to="/vagas" className="outline-button full">
            Ver todas as vagas
          </Link>
        </section>
      </div>
    </>
  );
}
function Jobs() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (j.title + j.company + j.location)
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (!type || j.type === type) &&
          (!location || j.location.includes(location)),
      ),
    [query, type, location],
  );
  return (
    <>
      <PageTitle sub="Encontre oportunidades que combinam com o seu perfil">
        Vagas Disponíveis
      </PageTitle>
      <section className="filters">
        <label className="search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cargo, tecnologia ou empresa..."
          />
        </label>
        <label>
          <Filter />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Tipo de vaga</option>
            <option>Efetivo</option>
            <option>Estágio</option>
            <option>CLT</option>
          </select>
        </label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Localização</option>
          <option value="Remoto">Remoto</option>
          <option value="São Paulo">São Paulo</option>
        </select>
      </section>
      <div className="chip-row">
        <span>
          Remoto <X size={14} />
        </span>
        <span>Tecnologia</span>
        <button
          onClick={() => {
            setQuery("");
            setType("");
            setLocation("");
          }}
        >
          Limpar filtros
        </button>
      </div>
      <section className="jobs-grid">
        {filtered.map((j) => (
          <JobCard job={j} key={j.id} />
        ))}
      </section>
      {!filtered.length && (
        <div className="empty">
          <Search />
          <h3>Nenhuma vaga encontrada</h3>
          <p>Tente ajustar os filtros da busca.</p>
        </div>
      )}
    </>
  );
}
function JobDetails() {
  const { candidate } = useAuth();
  const navg = useNavigate();
  const { id } = useParams();
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const job = jobs.find((item) => item.id === id) || jobs[0];
  function apply() {
    setModal(false);
    setSuccess(true);
  }
  return (
    <>
      <button className="back" onClick={() => navg(-1)}>
        <ArrowLeft /> Voltar para vagas
      </button>
      <section className="job-hero">
        <div className="job-top">
          <JobLogo job={job} />
          <div className="job-heading">
            <span className="badge">Nova vaga</span>
            <h1>{job.title}</h1>
              <b>{job.company}</b>
          </div>
        </div>
        <div className="meta">
          <span>
            <MapPin /> São Paulo (Híbrido)
          </span>
          <span>
            <BriefcaseBusiness /> Tempo integral
          </span>
          <span>
            <Clock /> Publicada há 2 dias
          </span>
        </div>
        <button className="button large" onClick={() => setModal(true)}>
          Candidatar-se
        </button>
      </section>
      <div className="detail-grid">
        <article className="content-card prose">
          <h2>Sobre a Vaga</h2>
          <p>
            Buscamos uma pessoa desenvolvedora Front-end Júnior apaixonada por
            tecnologia e por criar experiências digitais intuitivas. Você fará
            parte de um time colaborativo, participando de produtos modernos e
            de alto impacto.
          </p>
          <h3>Atividades Principais:</h3>
          <ul>
            <li>
              Desenvolver interfaces responsivas utilizando React, HTML e CSS.
            </li>
            <li>
              Colaborar com designers e desenvolvedores na evolução do produto.
            </li>
            <li>Participar de revisões de código e cerimônias ágeis.</li>
          </ul>
          <h3>Requisitos:</h3>
          <ul>
            <li>Conhecimentos em JavaScript, React e Git.</li>
            <li>Noções de acessibilidade e design responsivo.</li>
            <li>Boa comunicação e vontade de aprender.</li>
          </ul>
          <h3>Diferenciais:</h3>
          <p>
            Experiência com TypeScript, Next.js ou conhecimentos básicos em
            UX/UI Design serão considerados grandes diferenciais.
          </p>
          <h2>Benefícios</h2>
          <div className="benefits">
            <span>
              <CheckCircle2 /> <b>Plano de Saúde</b>
              <small>Cobertura nacional completa</small>
            </span>
            <span>
              <Home /> <b>Home Office</b>
              <small>Auxílio mensal de R$ 250</small>
            </span>
            <span>
              <BriefcaseBusiness /> <b>Vale Refeição</b>
              <small>R$ 800 fixos no cartão</small>
            </span>
            <span>
              <GraduationCap /> <b>Educação</b>
              <small>Bolsas para cursos de tech</small>
            </span>
          </div>
        </article>
        <aside className="detail-side">
          <article className="content-card">
            <h3>Sede da Empresa</h3>
            <p>
              <MapPin /> Av. Paulista, 1000
              <br />
              Bela Vista, São Paulo
            </p>
          </article>
          <article className="content-card recruiter">
            <Avatar />
            <div>
              <h3>Mariana Costa</h3>
              <p>Talent Acquisition Specialist</p>
              <button
                className="text-button"
                onClick={() =>
                  alert("Perfil da recrutadora disponível em breve.")
                }
              >
                Ver perfil
              </button>
            </div>
          </article>
        </aside>
      </div>
      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <button className="modal-close" onClick={() => setModal(false)}>
              <X />
            </button>
            <h2>Confirmar Candidatura</h2>
            <p>Revise seus dados antes de enviar.</p>
            <label>
              Currículo Principal
              <div className="file-row">
                <FileText />
                <span>{candidate.profile.resume}</span>
                    <label className="file-change">
                      Alterar
                      <input type="file" accept=".pdf,.doc,.docx" />
                    </label>
              </div>
            </label>
            <label>
              Portfólio
              <input defaultValue={candidate.profile.github} />
            </label>
            <button className="button full" onClick={apply}>
              Enviar candidatura
            </button>
          </div>
        </div>
      )}
      {success && (
        <div className="toast">
          <CheckCircle2 />
          <div>
            <b>Inscrição Enviada!</b>
            <p>Sua candidatura foi recebida com sucesso. Boa sorte!</p>
          </div>
          <button onClick={() => setSuccess(false)}>
            <X />
          </button>
        </div>
      )}
    </>
  );
}
function Applications() {
  const { candidate } = useAuth();
  const applications = candidate.applications;
  const [tab, setTab] = useState("active");
  return (
    <>
      <PageTitle sub="Acompanhe o progresso das suas aplicações em tempo real.">
        Minhas candidaturas
      </PageTitle>
      <div className="application-tabs">
        <button
          className={tab === "active" ? "active" : ""}
          onClick={() => setTab("active")}
        >
          Em andamento <b>{applications.length}</b>
        </button>
        <button
          className={tab === "finished" ? "active" : ""}
          onClick={() => setTab("finished")}
        >
          Finalizadas
        </button>
      </div>
      <section className="application-list">
        {tab === "active" ? applications.map((a) => (
          <article className="application-card" key={a.job.id}>
            <div className="application-head">
              <JobLogo job={a.job} />
              <div>
                <h3>{a.job.title}</h3>
                <b>{a.job.company}</b>
                <small>Candidatura em {a.date}</small>
              </div>
              <span className={clsx("status", a.step === 3 && "interview")}>
                {a.status}
              </span>
            </div>
            <div className="progress-steps">
              {a.steps.map((s, i) => (
                <div className={clsx(i < a.step && "done")} key={s}>
                  <i>{i < a.step ? <CheckCircle2 /> : i + 1}</i>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div className="application-actions">
              <span>Última atualização: há 2 dias</span>
              <Link to={"/vagas/" + a.job.id}>
                Ver detalhes <ChevronRight />
              </Link>
            </div>
          </article>
        )) : (
          <div className="empty">
            <ClipboardCheck />
            <h3>Nenhuma candidatura finalizada</h3>
            <p>Quando um processo for encerrado, ele aparecerá aqui.</p>
          </div>
        )}
      </section>
    </>
  );
}
function Tasks() {
  const { candidate } = useAuth();
  const tasks = candidate.tasks;
  const [tab, setTab] = useState("pending");
  const [done, setDone] = useState([]);
  const visible =
    tab === "pending"
      ? tasks.filter((t) => !done.includes(t.id))
      : tasks.filter((t) => done.includes(t.id));
  return (
    <>
      <section className="task-summary">
        <Metric
          value={
            tasks.length - done.length < 10
              ? "0" + (tasks.length - done.length)
              : tasks.length - done.length
          }
          label="Pendentes"
          Icon={ListChecks}
          tone="blue"
        />
        <Metric
          value={12 + done.length}
          label="Concluídas"
          Icon={CheckCircle2}
        />
        <article className="deadline">
          <small>PRÓXIMO PRAZO</small>
          <b>30/07</b>
          <span>Teste Técnico</span>
        </article>
      </section>
      <div className="tabs">
        <button
          className={tab === "pending" ? "active" : ""}
          onClick={() => setTab("pending")}
        >
          Pendentes
        </button>
        <button
          className={tab === "completed" ? "active" : ""}
          onClick={() => setTab("completed")}
        >
          Concluídas
        </button>
      </div>
      <section className="task-list">
        {visible.map((t) => (
          <article
            className={clsx("task-card", tab === "completed" && "completed")}
            key={t.id}
          >
            <div className="task-icon">
              {t.icon === "code" ? (
                <Code2 />
              ) : t.icon === "users" ? (
                <Users />
              ) : (
                <ClipboardCheck />
              )}
            </div>
            <div className="task-copy">
              <h3>{t.title}</h3>
              <span>
                <BriefcaseBusiness /> {t.company}
              </span>
              <span>
                <CalendarDays /> {t.due}
              </span>
            </div>
            <span className="duration">{t.duration}</span>
            {tab === "pending" ? (
              <button
                className="button"
                onClick={() => setDone([...done, t.id])}
              >
                Iniciar tarefa
              </button>
            ) : (
              <button className="outline-button" disabled>
                Concluída
              </button>
            )}
          </article>
        ))}
        {!visible.length && (
          <div className="empty">
            <CheckCircle2 />
            <h3>Tudo em dia!</h3>
            <p>
              Você não possui tarefas{" "}
              {tab === "pending" ? "pendentes" : "concluídas"} no momento.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
function Profile() {
  const { candidate, saveProfile, logout } = useAuth();
  const navigate = useNavigate();
  const profile = candidate.profile;
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(false);
  const [resume, setResume] = useState(profile.resume);
  function save(e) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));
    saveProfile({ ...profile, ...values, resume });
    setEditing(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }
  return (
    <>
      <section className="profile-hero">
        <div className="profile-avatar">{initials(profile.name)}</div>
        <div>
          <h1>{profile.name}</h1>
          <p>{profile.course}</p>
          <span>
            <MapPin /> {profile.city}
          </span>
        </div>
        <button className="outline-button" onClick={() => setEditing(!editing)}>
          {editing ? "Cancelar" : "Editar perfil"}
        </button>
      </section>
      <form className="profile-grid" onSubmit={save}>
        <article className="content-card">
          <h2>Informações pessoais</h2>
          <div className="form-grid">
            <label>
              Nome completo
              <input name="name" disabled={!editing} defaultValue={profile.name} />
            </label>
            <label>
              E-mail
              <input name="email" disabled={!editing} defaultValue={profile.email} />
            </label>
            <label>
              Telefone
              <input name="phone" disabled={!editing} defaultValue={profile.phone} />
            </label>
            <label>
              Cidade
              <input name="city" disabled={!editing} defaultValue={profile.city} />
            </label>
          </div>
        </article>
        <article className="content-card">
          <h2>Formação acadêmica</h2>
          <div className="form-grid">
            <label>
              Curso
              <input name="course" disabled={!editing} defaultValue={profile.course} />
            </label>
            <label>
              Instituição
              <input name="institution" disabled={!editing} defaultValue={profile.institution} />
            </label>
            <label>
              Semestre
              <input name="semester" disabled={!editing} defaultValue={profile.semester} />
            </label>
            <label>
              Status
              <input disabled value="Em curso" readOnly />
            </label>
          </div>
        </article>
        <article className="content-card profile-about">
          <h2>Sobre mim</h2>
          <label>Resumo profissional<textarea name="summary" disabled={!editing} defaultValue={profile.summary} /></label>
          <div className="skill-list">{profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          <div className="profile-links"><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></div>
        </article>
        <article className="content-card resume">
          <h2>Currículo</h2>
          <div className="upload">
            <Upload />
            <div>
              <b>{resume}</b>
              <small>PDF, DOCX até 5MB</small>
            </div>
            <label className="outline-button file-button">
              Atualizar
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setResume(file.name);
                    setToast(true);
                    setTimeout(() => setToast(false), 3000);
                  }
                }}
              />
            </label>
          </div>
        </article>
        {editing && (
          <button className="button save" type="submit">
            <Save /> Salvar alterações
          </button>
        )}
      </form>
      <button className="mobile-logout outline-button" onClick={() => { logout(); navigate("/login", { replace: true }); }}><LogOut /> Sair da conta</button>
      {toast && (
        <div className="toast">
          <CheckCircle2 />
          <b>Perfil salvo com sucesso!</b>
        </div>
      )}
    </>
  );
}
function NotFound() {
  return (
    <div className="empty">
      <h1>404</h1>
      <h3>Página não encontrada</h3>
      <Link to="/" className="button">
        Voltar ao início
      </Link>
    </div>
  );
}
export default function App() {
  const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === "true" && localStorage.getItem(CANDIDATE_STORAGE_KEY);
  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vagas" element={<Jobs />} />
        <Route path="/vagas/:id" element={<JobDetails />} />
        <Route path="/candidaturas" element={<Applications />} />
        <Route path="/tarefas" element={<Tasks />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
