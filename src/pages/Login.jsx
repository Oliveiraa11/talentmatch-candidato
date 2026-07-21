import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  Rocket,
  Search,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function showInfo(text) {
    setMessage({ type: "info", text });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setMessage({ type: "error", text: "Preencha o e-mail e a senha para continuar." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: "error", text: "Informe um endereço de e-mail válido." });
      return;
    }

    setLoading(true);
    setMessage(null);
    timerRef.current = setTimeout(() => {
      if (!login(email, password)) {
        setLoading(false);
        setMessage({ type: "error", text: "E-mail ou senha incorretos. Verifique os dados e tente novamente." });
        return;
      }

      setLoading(false);
      setMessage({ type: "success", text: "Login realizado com sucesso! Redirecionando..." });
      timerRef.current = setTimeout(() => {
        const destination = location.state?.from?.pathname;
        navigate(destination && destination !== "/login" ? destination : "/dashboard", { replace: true });
      }, 650);
    }, 700);
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-content">
          <div className="login-brand">
            <span><BriefcaseBusiness size={27} /></span>
            <strong>TalentMatch</strong>
          </div>

          <div className="login-intro">
            <h1>Bem-vindo de volta</h1>
            <p>Acesse sua conta para acompanhar suas candidaturas e oportunidades</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="exemplo@email.com"
                autoComplete="email"
                aria-invalid={message?.type === "error"}
              />
            </label>
            <label>
              <span>Senha</span>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={message?.type === "error"}
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                <span>Lembrar de mim</span>
              </label>
              <button type="button" className="login-link" onClick={() => showInfo("A recuperação de senha será disponibilizada em breve.")}>Esqueci minha senha</button>
            </div>

            {message && <div className={`login-message ${message.type}`} role="status">{message.type === "success" && <CheckCircle2 size={18} />}{message.text}</div>}

            <button className="login-submit" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
            <button className="google-login" type="button" onClick={() => showInfo("O acesso com Google será disponibilizado em breve.")}><b>G</b> Continuar com Google</button>
          </form>

          <p className="login-signup">Ainda não possui uma conta? <button type="button" onClick={() => showInfo("O cadastro de candidatos será disponibilizado em breve.")}>Criar conta</button></p>
        </div>
      </section>

      <section className="login-visual" aria-hidden="true">
        <div className="visual-content">
          <div className="match-illustration">
            <article className="application-mockup">
              <div className="mockup-heading"><span><Rocket size={20} /></span><div><b>Product Designer</b><small>TechFlow Studio</small></div><em>PENDENTE</em></div>
              <div className="mockup-progress"><i /></div>
              <div className="mockup-caption"><small>Application in progress</small><small>65%</small></div>
            </article>
            <div className="matching-badge"><CheckCircle2 size={18} /><span><b>Matching!</b><small>98% de compatibilidade</small></span></div>
          </div>
          <h2>Impulsione sua carreira</h2>
          <p>Encontre as melhores oportunidades do mercado de tecnologia e receba propostas baseadas nas suas habilidades reais.</p>
          <div className="visual-benefits">
            <span><i><Search /></i><small>Busca Inteligente</small></span><b />
            <span><i><Zap /></i><small>Match Instantâneo</small></span><b />
            <span><i><TrendingUp /></i><small>Crescimento</small></span>
          </div>
        </div>
      </section>
    </main>
  );
}
