import { message, Popover } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../shared/routes/routes";
import { authService } from "../../services/auth.service";

type AccountMenuPopoverProps = {
  initials: string;
  userEmail?: string | null;
};

const linkClass =
  "w-full text-left px-4 py-3.5 text-base font-semibold text-[#80011D] hover:bg-[#FFF5F5] active:bg-[#FFECEC] transition-colors rounded-lg";

export function AccountMenuPopover({ initials, userEmail }: AccountMenuPopoverProps) {
  const [open, setOpen] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setLogoutBusy(true);
    try {
      await authService.logout();
      queryClient.clear();
      setOpen(false);
      void message.success("Logged out");
    } catch {
      void message.error("Could not log out. Please try again.");
    } finally {
      setLogoutBusy(false);
    }
  };

  const content = (
    <div className="min-w-[260px] max-w-[min(100vw-2rem,20rem)] py-2 lato bg-white rounded-xl border border-[#E8E8E8] overflow-hidden">
      <div className="px-4 pt-3 pb-2 border-b border-[#F0F0F0]">
        <p className="text-xs font-medium uppercase tracking-wide text-[#9B9B9B]">Signed in as</p>
        <p className="text-sm font-semibold text-black truncate mt-0.5" title={userEmail ?? undefined}>
          {userEmail ?? "Account"}
        </p>
      </div>
      <nav className="py-1 px-1" aria-label="Account menu">
        <button type="button" className={linkClass} onClick={() => go(routes.dashboard)}>
          Dashboard
        </button>
        <button type="button" className={linkClass} onClick={() => go(routes.orders)}>
          Orders
        </button>
        <button type="button" className={linkClass} onClick={() => go(routes.contact)}>
          Contact us
        </button>
      </nav>
      <div className="border-t border-[#F0F0F0] mx-2" />
      <div className="py-1 px-1 pb-2">
        <button
          type="button"
          className={`${linkClass} text-[#585858] hover:text-[#80011D] ${logoutBusy ? "opacity-50 pointer-events-none" : ""}`}
          onClick={() => void handleLogout()}
        >
          {logoutBusy ? "Logging out…" : "Log out"}
        </button>
      </div>
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
      overlayInnerStyle={{ padding: 0, background: "transparent", boxShadow: "none" }}
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
