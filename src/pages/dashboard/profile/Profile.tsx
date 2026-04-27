import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevDownIcon } from "../../../components/btns/ChevDown";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/navbar/Navbar";
import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";
import BottomLinks from "../top-bar/BottomLinks";
import Topbar from "../top-bar/Topbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../../services/auth.service";
import { getMembershipStatus } from "../../../services/membership.service";
import { useAuthStore } from "../../../store/auth.store";
import type { Address } from "../../../types";
import { message } from "antd";
import GetExclusiveAccessModal from "../../../components/get-exclusive-access-modal/GetExclusiveAccessModal";
import { routes } from "../../../shared/routes/routes";
import { usePageTitle } from "../../../lib/use-page-title";

const Profile = () => {
  usePageTitle("Profile");
  const [active, setActive] = useState(false);
  const [editing, setEditing] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const qc = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
  });

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: authService.getAddresses,
  });

  const { data: membership } = useQuery({
    queryKey: ["membership-status"],
    queryFn: getMembershipStatus,
    enabled: Boolean(accessToken),
  });

  const subscriptionActive =
    membership &&
    typeof membership === "object" &&
    "status" in membership &&
    (membership as { status?: string }).status === "ACTIVE";
  const expiresAt =
    subscriptionActive && "expiresAt" in membership
      ? (membership as { expiresAt?: string | null }).expiresAt
      : null;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
  });

  const handleEdit = () => {
    if (!editing && profile) {
      const p = profile as { firstName?: string; lastName?: string; phone?: string; dateOfBirth?: string };
      setForm({
        firstName: p.firstName ?? "",
        lastName: p.lastName ?? "",
        phone: p.phone ?? "",
        dateOfBirth: p.dateOfBirth
          ? new Date(p.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
    setEditing((v) => !v);
  };

  const updateMutation = useMutation({
    mutationFn: () => authService.updateProfile(form),
    onSuccess: () => {
      void message.success("Profile updated");
      setEditing(false);
      void qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => void message.error("Could not update profile"),
  });

  const p = profile as {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    membershipStatus?: string;
    dateOfBirth?: string;
  } | undefined;
  const fullName = [p?.firstName, p?.lastName].filter(Boolean).join(" ") || "—";
  const addrList: Address[] = Array.isArray(addresses) ? addresses : [];

  return (
    <div>
      <Navbar />
      <div className="max-w-[1200px] mx-auto py-10">
        <Topbar />
        <div className="px-5">
          <header className="mb-8">
            <div className="text-base font-normal mb-2 flex items-center gap-2 text-[#585858]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path
                  d="M3.87578 13.5758C5.19657 12.4159 7.00549 11.7008 9.00079 11.7008C10.9961 11.7008 12.805 12.4159 14.1258 13.5758M16.2008 9.00078C16.2008 12.9772 12.9772 16.2008 9.00078 16.2008C5.02433 16.2008 1.80078 12.9772 1.80078 9.00078C1.80078 5.02433 5.02433 1.80078 9.00078 1.80078C12.9772 1.80078 16.2008 5.02433 16.2008 9.00078ZM10.8008 7.20078C10.8008 8.19489 9.99489 9.00078 9.00078 9.00078C8.00667 9.00078 7.20078 8.19489 7.20078 7.20078C7.20078 6.20667 8.00667 5.40078 9.00078 5.40078C9.99489 5.40078 10.8008 6.20667 10.8008 7.20078Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Account
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Your profile</h1>
            <p className="text-[#585858] mt-2 max-w-2xl text-base leading-relaxed">
              Name, contact, and membership for checkout. Manage saved addresses below; add or change them at checkout when you place an order.
            </p>
            <Link
              to={routes.orders}
              className="inline-flex mt-4 text-sm font-semibold text-[#80011D] underline underline-offset-2"
            >
              Go to orders
            </Link>
          </header>

          {isLoading ? (
            <div className="bg-[#F4EEEE] rounded-[10px] h-32 animate-pulse mb-10" />
          ) : (
            <div className="bg-[#F5F5F5] rounded-[10px] p-5 flex flex-col gap-3.5 mb-10">
              {editing ? (
                <>
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <label className="text-[#707070] text-sm">First Name</label>
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        value={form.firstName}
                        onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[#707070] text-sm">Last Name</label>
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        value={form.lastName}
                        onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[#707070] text-sm">Phone</label>
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[#707070] text-sm">Birthday</label>
                      <input
                        type="date"
                        className="border rounded px-2 py-1 text-sm"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      className="bg-primary text-white text-xs px-4 py-2 rounded-full"
                      onClick={() => updateMutation.mutate()}
                    >
                      {updateMutation.isPending ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="border border-[#D9D9D9] text-xs px-4 py-2 rounded-full"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-sm font-normal flex items-center gap-2">
                    {fullName}
                    <button onClick={handleEdit}>
                      <img src={ImagesAndIcons.penBlue} alt="Edit" />
                    </button>
                  </h4>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3.5 lg:justify-between">
                    <div className="flex flex-col gap-1 w-1/2">
                      <p className="text-[#707070] text-sm font-normal">Email</p>
                      <p className="text-sm font-normal">{p?.email ?? "—"}</p>
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                      <p className="text-[#707070] text-sm font-normal">Phone number</p>
                      <p className="text-sm font-normal">{p?.phone ?? "—"}</p>
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                      <p className="text-[#707070] text-sm font-normal">Membership</p>
                      {subscriptionActive ? (
                        <>
                          <p className="text-sm font-semibold capitalize text-green-700">
                            {(membership as { plan?: { name?: string } | null }).plan?.name ?? "Active plan"}
                          </p>
                          {expiresAt ? (
                            <p className="text-xs text-[#585858]">
                              Renews / expires:{" "}
                              {new Date(expiresAt).toLocaleDateString("en-NG", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          ) : null}
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-normal capitalize text-[#585858]">
                            Inactive
                          </p>
                          <button
                            type="button"
                            className="text-left text-xs text-primary font-semibold underline mt-1"
                            onClick={() => setMembershipModalOpen(true)}
                          >
                            Join Membership
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                      <p className="text-[#707070] text-sm font-normal">Birthday</p>
                      <p className="text-sm font-normal">
                        {p?.dateOfBirth
                          ? new Date(p.dateOfBirth).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Addresses */}
          <div>
            <h4 className="text-base border-b mb-5.5 border-[#EDEDED] pb-5 flex items-center font-normal gap-2 text-[#1773B0]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path
                  d="M9.40351 15.7974L9.90554 16.2852L9.40351 15.7974ZM8.59638 15.7974L9.09841 15.3096L8.59638 15.7974ZM8.99673 7.19756V6.49756C8.61013 6.49756 8.29673 6.81096 8.29673 7.19756H8.99673ZM9.00273 7.19756H9.70273C9.70273 6.81096 9.38933 6.49756 9.00273 6.49756V7.19756ZM9.00273 7.20399V7.90399C9.38933 7.90399 9.70273 7.59059 9.70273 7.20399H9.00273ZM8.99673 7.20399H8.29673C8.29673 7.59059 8.61013 7.90399 8.99673 7.90399V7.20399ZM14.2714 7.13573H13.5714C13.5714 8.60085 12.7648 10.3018 11.7183 11.8634C10.6886 13.4 9.5038 14.6897 8.90148 15.3096L9.40351 15.7974L9.90554 16.2852C10.5363 15.636 11.7854 14.2781 12.8814 12.6428C13.9605 11.0324 14.9714 9.03704 14.9714 7.13573H14.2714ZM8.59638 15.7974L9.09841 15.3096C8.49609 14.6897 7.31127 13.4 6.28154 11.8634C5.23505 10.3018 4.42852 8.60085 4.42852 7.13573H3.72852H3.02852C3.02852 9.03704 4.03936 11.0324 5.11854 12.6428C6.21446 14.2781 7.46358 15.636 8.09435 16.2852L8.59638 15.7974ZM3.72852 7.13573H4.42852C4.42852 4.56799 6.48309 2.50078 8.99994 2.50078V1.80078V1.10078C5.69413 1.10078 3.02852 3.81065 3.02852 7.13573H3.72852ZM8.99994 1.80078V2.50078C11.5168 2.50078 13.5714 4.56799 13.5714 7.13573H14.2714H14.9714C14.9714 3.81065 12.3058 1.10078 8.99994 1.10078V1.80078Z"
                  fill="#707070"
                />
              </svg>
              <span className="min-w-0 truncate">
                {addrList[0] ? `${addrList[0].city}, ${addrList[0].address}` : "Saved addresses"}
              </span>
              <button type="button" onClick={() => setActive(!active)} aria-expanded={active} aria-label="Toggle addresses">
                <ChevDownIcon open={active} color="#1773B0" />
              </button>
            </h4>

            {active && (
              <div>
                <p className="text-base font-normal mb-5">Addresses</p>
                <div className="flex flex-col lg:flex-row gap-8">
                  {addrList.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#E0E0E0] bg-[#FAFAFA] px-5 py-8 max-w-lg">
                      <p className="text-sm text-[#585858] leading-relaxed">
                        You do not have any saved addresses yet. Add a delivery address the next time you checkout — it will be stored on your account for faster reordering.
                      </p>
                      <Link
                        to={routes.products}
                        className="inline-flex mt-4 text-sm font-semibold text-[#80011D] underline underline-offset-2"
                      >
                        Continue shopping
                      </Link>
                    </div>
                  ) : (
                    addrList.map((addr) => (
                      <div key={addr.id} className="w-61.5">
                        <div className="text-sm font-normal">
                          <p className="text-[#707070] flex items-center justify-between mb-2 capitalize">
                            {addr.type.toLowerCase()} address
                            <button
                              onClick={() =>
                                void message.info("Address editing coming soon")
                              }
                            >
                              <img src={ImagesAndIcons.penBlue} alt="Edit" />
                            </button>
                          </p>
                          <p className="text-black">{addr.fullName}</p>
                          <p className="text-black">
                            {addr.address}, {addr.city}, {addr.state} {addr.zip ?? ""}
                            {addr.country}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <BottomLinks />
        </div>
      </div>
      <Footer />
      <GetExclusiveAccessModal
        open={membershipModalOpen}
        onClose={() => setMembershipModalOpen(false)}
        hideDefaultJoinButton
      />
    </div>
  );
};

export default Profile;
