import { jobs } from "../data";

const byId = (id) => jobs.find((job) => job.id === id);

export const candidates = [
  {
    id: "candidate-1",
    email: "candidato@talentmatch.com",
    password: "123456",
    profile: {
      name: "Lucas Almeida", role: "Candidato", course: "Engenharia da Computação",
      institution: "Universidade de Tecnologia", semester: "7º semestre",
      email: "candidato@talentmatch.com", phone: "(11) 98765-4321", city: "São Paulo — SP",
      interest: "Desenvolvimento Front-end", summary: "Estudante de Engenharia da Computação com foco em interfaces web modernas e acessíveis.",
      skills: ["JavaScript", "React", "HTML", "CSS", "Git"], linkedin: "https://linkedin.com/in/lucasalmeida",
      github: "https://github.com/lucasalmeida", resume: "Curriculo_Lucas_Almeida.pdf"
    },
    dashboard: { activeApplications: 3, pendingTasks: 3, scheduledInterviews: 1 },
    recommendedJobs: ["frontend-junior", "estagio-dev", "analista-dados"],
    applications: [
      { jobId: "frontend-junior", status: "Entrevista", date: "12 Jul 2026", step: 3 },
      { jobId: "estagio-dev", status: "Em análise", date: "10 Jul 2026", step: 2 },
      { jobId: "analista-dados", status: "Candidatura enviada", date: "06 Jul 2026", step: 1 }
    ],
    tasks: [
      { id: 1, title: "Teste técnico de HTML e CSS", company: "TechNova", due: "Prazo: 30/07/2026", duration: "60 minutos", icon: "code" },
      { id: 2, title: "Questionário comportamental", company: "SoftSolutions", due: "Prazo: 02/08/2026", duration: "20 minutos", icon: "quiz" },
      { id: 3, title: "Confirmar presença na entrevista", company: "TechNova", due: "Até 28/07/2026", duration: "2 minutos", icon: "users" }
    ],
    interviews: [{ job: "Desenvolvedor Front-end Júnior", company: "TechVision Solutions", date: "28", month: "Julho", time: "14:00 - 15:00", format: "Google Meet", location: "São Paulo (Híbrido)", status: "Agendada" }],
    notifications: [{ title: "Nova tarefa disponível", detail: "Teste técnico • prazo 30/07", route: "/tarefas" }, { title: "Candidatura atualizada", detail: "Você avançou para entrevista", route: "/candidaturas" }]
  },
  {
    id: "candidate-2",
    email: "mariana@talentmatch.com",
    password: "123456",
    profile: {
      name: "Mariana Souza", role: "Candidata", course: "Análise e Desenvolvimento de Sistemas",
      institution: "Faculdade de Tecnologia", semester: "5º semestre", email: "mariana@talentmatch.com",
      phone: "(11) 98888-4567", city: "São Paulo — SP", interest: "Desenvolvimento de Software e Dados",
      summary: "Estudante de Análise e Desenvolvimento de Sistemas, com interesse em desenvolvimento web e análise de dados. Possui conhecimentos em JavaScript, React, Python, SQL e Git, buscando sua primeira oportunidade profissional na área de tecnologia.",
      skills: ["JavaScript", "React", "Python", "SQL", "Git", "GitHub", "Power BI"],
      linkedin: "https://linkedin.com/in/marianasouza", github: "https://github.com/marianasouza", resume: "Curriculo_Mariana_Souza.pdf"
    },
    dashboard: { activeApplications: 2, pendingTasks: 2, scheduledInterviews: 1 },
    recommendedJobs: ["react-junior", "estagio-dev", "analista-dados"],
    applications: [
      { jobId: "estagio-dev", status: "Etapa de teste", date: "18 Jul 2026", step: 2 },
      { jobId: "analista-dados", status: "Análise de perfil", date: "16 Jul 2026", step: 1 }
    ],
    tasks: [
      { id: 11, title: "Teste de lógica de programação", company: "SoftSolutions", due: "Prazo: 27/07/2026", duration: "60 minutos", icon: "code" },
      { id: 12, title: "Questionário comportamental", company: "DataInsight", due: "Prazo: 28/07/2026", duration: "20 minutos", icon: "quiz" },
      { id: 13, title: "Confirmar entrevista para Estágio em Desenvolvimento Web", company: "SoftSolutions", due: "Até 28/07/2026", duration: "2 minutos", icon: "users" }
    ],
    interviews: [{ job: "Estágio em Desenvolvimento Web", company: "SoftSolutions", date: "29", month: "Julho", time: "10:00", format: "Google Meet", location: "Remoto", status: "Agendada" }],
    notifications: [{ title: "Entrevista agendada", detail: "29 de julho • 10h", route: "/tarefas" }, { title: "Novo teste disponível", detail: "Lógica de programação", route: "/tarefas" }]
  }
];

export function hydrateCandidate(candidate) {
  const profile = JSON.parse(localStorage.getItem(`talentmatch_profile_${candidate.id}`) || "null") || candidate.profile;
  const steps = ["Candidatura", "Análise", "Entrevista", "Resultado"];
  return {
    ...candidate, profile,
    recommendedJobs: candidate.recommendedJobs.map(byId).filter(Boolean),
    applications: candidate.applications.map((item) => ({ ...item, job: byId(item.jobId), steps })).filter((item) => item.job)
  };
}
