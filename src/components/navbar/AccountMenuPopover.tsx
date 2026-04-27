import { message, Popover } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../shared/routes/routes";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../store/auth.store";

type AccountMenuPopoverProps = {
  initials: string;
  userEmail?: string | null;
};

const linkClass =
  "w-full text-left px-4 py-3 text-base font-semibold text-[#80011D] hover:bg-[#FFF5F5] transition-colors";

export function AccountMenuPopover({ initials, userEmail }: AccountMenuPopoverProps) {
  const [open, setOpen] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setLogoutBusy(true);
    try {
      await authService.logout();
      clearAuth();
      setOpen(false);
      void message.success("Logged out");
    } catch {
      void message.error("Could not log out. Please try again.");
    } finally {
      setLogoutBusy(false);
    }
  };

  const content = (
    <div className="min-w-[240px] py-1 lato shadow-sm">
      <p className="px-4 pt-2 pb-1 text-xs text-[#585858] truncate" title={userEmail ?? undefined}>
        {userEmail ?? "Account"}
      </p>
      <button type="button" className={linkClass} onClick={() => go(routes.contact)}>
        Contact Us
      </button>
      <button type="button" className={linkClass} onClick={() => go(routes.dashboard)}>
        Dashboard
      </button>
      <button type="button" className={linkClass} onClick={() => go(routes.orders)}>
        Order history
      </button>
      <div className="border-t border-[#F0F0F0] my-1" />
      <button
        type="button"
        className={`${linkClass} ${logoutBusy ? "opacity-50 pointer-events-none" : ""}`}
        onClick={() => void handleLogout()}
      >
        {logoutBusy ? "Logging out…" : "Log out"}
      </button>
    </div>
  );

  return (
    <Popover
      content={content}
      title={null}
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
      overlayInnerStyle={{ padding: 0 }}
    >
      <button
        type="button"
        className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 hover:ring-2 hover:ring-[#80011D] transition-shadow"
        title={userEmail ?? "Account menu"}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials}
      </button>
    </Popover>
  );
}
