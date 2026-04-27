import { Modal, message } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import Button from "../btns/Button";
import {
  getPlans,
  subscribeToPlan,
  type MembershipPlan,
} from "../../services/membership.service";
import { getApiErrorMessage } from "../../lib/api-error";
import { useAuthStore } from "../../store/auth.store";
import { useLoginModalStore } from "../../store/login-modal.store";
import { formatNGN } from "../../lib/format";

export type GetExclusiveAccessModalProps = {
  open?: boolean;
  onClose?: () => void;
  hideDefaultJoinButton?: boolean;
};

function perksList(perks: unknown): string[] {
  if (Array.isArray(perks)) {
    return perks.map((p) => String(p));
  }
  if (perks && typeof perks === "object") {
    return Object.values(perks as Record<string, unknown>).map((v) =>
      String(v),
    );
  }
  return [];
}

const defaultPerks = [
  { name: "VIP Access", img: ImagesAndIcons.vipAccess },
  { name: "Event Priority", img: ImagesAndIcons.eventPriority },
  { name: "Quaterly Gift Boxes", img: ImagesAndIcons.quaterlyGiftsBoxes },
  { name: "Exclusive Discounts", img: ImagesAndIcons.exclusiveDiscounts },
];

const GetExclusiveAccessModal = ({
  open: controlledOpen,
  onClose,
  hideDefaultJoinButton,
}: GetExclusiveAccessModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? Boolean(controlledOpen) : internalOpen;
  const close = () => {
    onClose?.();
    if (!isControlled) {
      setInternalOpen(false);
    }
  };

  const requestLogin = useLoginModalStore((s) => s.requestLogin);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const { data: plans } = useQuery({
    queryKey: ["membership-plans"],
    queryFn: getPlans,
    enabled: open,
  });

  useEffect(() => {
    if (plans?.length && !selectedPlanId) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans, selectedPlanId]);

  const selectedPlan: MembershipPlan | null =
    plans?.find((p) => p.id === selectedPlanId) ?? plans?.[0] ?? null;

  const perkLabels = perksList(selectedPlan?.perks);
  const displayPerks =
    perkLabels.length >= 4
      ? perkLabels.slice(0, 4).map((name, index) => ({
          name,
          img: defaultPerks[index]?.img ?? ImagesAndIcons.vipAccess,
        }))
      : defaultPerks.map((d, index) => ({
          name: perkLabels[index] ?? d.name,
          img: d.img,
        }));

  const handleGetStarted = async () => {
    if (!selectedPlanId) {
      void message.error("No membership plan is available right now.");
      return;
    }
    if (!accessToken) {
      close();
      requestLogin();
      void message.info("Please log in to continue.");
      return;
    }
    setSubscribing(true);
    try {
      const { authorizationUrl } = await subscribeToPlan(selectedPlanId);
      window.location.href = authorizationUrl;
    } catch (e) {
      void message.error(getApiErrorMessage(e));
    } finally {
      setSubscribing(false);
    }
  };

  const priceNum = selectedPlan ? Number(selectedPlan.price) : 0;

  return (
    <div>
      {!hideDefaultJoinButton ? (
        <Button
          handleClick={() => {}}
          type="white"
          label="Coming soon"
          className="text-xs py-2 cursor-not-allowed opacity-90 pointer-events-none"
        />
      ) : null}
      <Modal
        open={open}
        onCancel={close}
        footer={null}
        width="min(890px, 92vw)"
        centered
        closable={false}
      >
        <div className="p-10">
          <div className="flex justify-end">
            <button type="button" onClick={close}>
              <img src={ImagesAndIcons.xIcon} alt="" />
            </button>
          </div>
          <div className="flex mb-14 items-center justify-center gap-11">
            <img src={ImagesAndIcons.joinIlleotiBadge} alt="" />
            <h2 className="text-5xl font-bold text-primary  mt-6 mb-4">
              Join <br />
              Ile-Oti Premium <br /> Membership
            </h2>
          </div>
          {selectedPlan ? (
            <p className="text-center text-lg font-semibold mb-4">
              {selectedPlan.name} — {formatNGN(priceNum)}
            </p>
          ) : null}
          <div className="flex items-center justify-between">
            {displayPerks.map((data, index) => (
              <div
                key={index}
                className="flex w-45 h-45 border border-[#D8D8D8] rounded-2xl flex-col items-center justify-center gap-5"
              >
                <img src={data.img} alt="" />
                <p className="text-xl text-primary text-center font-bold">
                  {data.name}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3 mt-6">
            <Button
              type="red"
              label={subscribing ? "Redirecting…" : "Get Started"}
              className="font-semibold  rounded-[55px] py-6 text-xl mt-4"
              handleClick={() => void handleGetStarted()}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GetExclusiveAccessModal;
