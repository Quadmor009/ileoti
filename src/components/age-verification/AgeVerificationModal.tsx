type AgeVerificationModalProps = {
  denied: boolean;
  onConfirm: () => void;
  onDeny: () => void;
};

const AgeVerificationModal = ({
  denied,
  onConfirm,
  onDeny,
}: AgeVerificationModalProps) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/75">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl">
          <p className="mb-6 text-3xl font-bold text-[#8B0000]">Ile-Oti</p>
          {!denied ? (
            <>
              <h2 className="text-2xl font-semibold text-black">
                Are you 18 or older?
              </h2>
              <p className="mt-4 text-base text-[#585858]">
                You must be of legal drinking age to enter this site. Are you
                18 years of age or older?
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onConfirm}
                  className="h-14 flex-1 rounded-full bg-[#8B0000] px-6 text-white"
                >
                  Yes, Enter Site
                </button>
                <button
                  type="button"
                  onClick={onDeny}
                  className="h-14 flex-1 rounded-full border border-[#8B0000] px-6 text-[#8B0000]"
                >
                  No, Exit
                </button>
              </div>
            </>
          ) : (
            <div className="py-8">
              <p className="text-lg font-semibold text-[#8B0000]">
                Sorry, you must be 18 or older to access this site
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
