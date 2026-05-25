import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef(function PasswordInput({ ...props }, ref) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input ref={ref} type={show ? "text" : "password"} {...props}
        className="floating-label-input w-full bg-bg-input border border-border-card rounded-lg px-4 py-3 text-sm text-text outline-none focus:border-primary transition-colors pr-10" />
      <button type="button" onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
});

export default PasswordInput;
