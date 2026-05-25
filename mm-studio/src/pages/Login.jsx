import { useEffect } from "react";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import BrandingPanel from "../components/auth/branding/BrandingPanel";
import LoginForm from "../components/auth/forms/LoginForm";
import RecoveryPasswordModal from "../components/auth/modals/RecoveryPasswordModal";
import GradientBackground from "../components/auth/animations/GradientBackground";

export default function Login() {
  const { restore, isAuthenticated } = useAuthStore();

  useEffect(() => { restore(); }, [restore]);

  return (
    <div className="min-h-screen flex bg-bg-main">
      <BrandingPanel />

      <div className="relative flex-1 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <GradientBackground />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/20">
              <span className="text-primary font-display font-bold">M</span>
            </div>
            <span className="text-base font-display font-bold text-text">MM Studio</span>
          </motion.div>

          <LoginForm />
        </div>
      </div>

      <RecoveryPasswordModal />
    </div>
  );
}
