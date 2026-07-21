import { createContext, useContext, useMemo, useState } from "react";
import { candidates, hydrateCandidate } from "../data/candidates";
import { AUTH_STORAGE_KEY, CANDIDATE_STORAGE_KEY } from "../routes/ProtectedRoute";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [candidateId, setCandidateId] = useState(() => localStorage.getItem(CANDIDATE_STORAGE_KEY));
  const [profileVersion, setProfileVersion] = useState(0);
  const candidate = useMemo(() => {
    const found = candidates.find((item) => item.id === candidateId);
    return found ? hydrateCandidate(found) : null;
  }, [candidateId, profileVersion]);

  function login(email, password) {
    const found = candidates.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
    if (!found) return false;
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    localStorage.setItem(CANDIDATE_STORAGE_KEY, found.id);
    setCandidateId(found.id);
    return true;
  }
  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(CANDIDATE_STORAGE_KEY);
    setCandidateId(null);
  }
  function saveProfile(profile) {
    localStorage.setItem(`talentmatch_profile_${candidate.id}`, JSON.stringify(profile));
    setProfileVersion((value) => value + 1);
  }
  return <AuthContext.Provider value={{ candidate, login, logout, saveProfile }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
