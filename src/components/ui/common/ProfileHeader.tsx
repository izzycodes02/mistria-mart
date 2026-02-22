"use client";

import Avatar from "../smallUI/Avatar";
import GifBadges from "../smallUI/GifBadges";
import { IconPencil } from "@tabler/icons-react";
import CoverImage from "../smallUI/CoverImage";
import { useEffect, useRef, useState } from "react";
import TextInput from "../smallUI/inputs/TextInput";
import MiniNavBar from "@ui/smallUI/MiniNavBar";
import { createClient } from "@/utils/supabase/client";
import ModalWrapper from "./modals/ModalWrapper";
import { useInitialUserProfile } from "@/utils/providers/UserProfileProvider";

type Props = {
  hideProfileDetails?: boolean;
  heading?: string;
};

type ModalProps = {
  onClose: () => void;
  onUpdateUsername: (
    newName: string,
  ) => Promise<{ success: boolean; error?: string }>;
};

export function ChangeDisplayNameModal({
  onClose,
  onUpdateUsername,
}: ModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayNameError(null);

    // Validation
    if (displayName.trim().length === 0) {
      setDisplayNameError("Display name cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await onUpdateUsername(displayName.trim());
      if (result.success) {
        console.log("New Display Name:", displayName);
        onClose();
      } else {
        setDisplayNameError(result.error || "Failed to update display name");
      }
    } catch (err) {
      setDisplayNameError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter") return;

    const focusedElement = document.activeElement as HTMLElement;
    if (
      focusedElement?.tagName === "BUTTON" &&
      (focusedElement as HTMLButtonElement).type === "submit"
    ) {
      return;
    }

    e.preventDefault();
  };

  const renderModalContent = () => {
    return (
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleFormKeyDown}
        className="flex w-full flex-col items-center gap-4"
        aria-label="Quick add story form"
      >
        <TextInput
          label="Enter new display name"
          value={displayName}
          variant="col"
          placeholder="e.g. MangaLover99"
          maxLength={12}
          onChange={(e) => setDisplayName(e.target.value)}
          error={displayNameError}
        />

        <button
          type="submit"
          className="modalBtn primary"
          aria-label="Quick add this story to your library"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    );
  };

  return (
    <ModalWrapper heading="Change Display Name" onClose={onClose}>
      {renderModalContent()}
    </ModalWrapper>
  );
}



export default function ProfileHeaderSection({
  hideProfileDetails,
  heading,
}: Props) {
  // Get the current user
  const { user, profile, updateProfile } = useInitialUserProfile();

  const [activeDisplayDropdown, setActiveDisplayDropdown] = useState<
    "desktop" | "mobile" | null
  >(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const [openDisplayNameModal, setOpenDisplayNameModal] = useState(false);

  // Get display name from profile, with fallbacks
  const displayName = profile?.display_name || profile?.username || "User";

  const handleUpdateUsername = async (newName: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: newName })
      .eq("user_id", user.id);

    if (!error) {
      // This will update the global state and sync across all screen sizes
      updateProfile({ display_name: newName });
      return { success: true };
    }

    return { success: false, error: error?.message };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        (desktopDropdownRef.current &&
          desktopDropdownRef.current.contains(target)) ||
        (mobileDropdownRef.current &&
          mobileDropdownRef.current.contains(target))
      ) {
        return;
      }

      setActiveDisplayDropdown(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`relative sm:mb-22 md:mb-24 lg:mb-28 ${hideProfileDetails ? "mb-18" : "mb-30"}`}
      aria-label={
        hideProfileDetails ? (heading ?? "Profile header") : "Profile header"
      }
    >
      {/* Cover Image */}
      <CoverImage />

      {/* Header Section */}
      <div
        className={`absolute z-30 flex w-full flex-col justify-between gap-2.5 px-5 sm:-bottom-14 sm:px-6 md:-bottom-16 md:pl-8 md:pr-8 lg:-bottom-18 lg:pr-0 ${hideProfileDetails ? "-bottom-12 lg:pl-0" : "-bottom-26 lg:pl-12"}`}
      >
        {/* Top Row: Avatar + Nav */}
        <div className="flex items-end justify-between gap-3">
          {!hideProfileDetails ? (
            <>
              <div className="flex items-end">
                {/* Profile Picture */}
                <Avatar />
                {/* Display name*/}
                <div ref={desktopDropdownRef} className="relative">
                  <button
                    type="button"
                    id="displayNameDropdownButton-desktop"
                    onClick={() =>
                      setActiveDisplayDropdown((prev) =>
                        prev === "desktop" ? null : "desktop",
                      )
                    }
                    className="focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={activeDisplayDropdown === "desktop"}
                  >
                    <h1 className="displayName">{displayName}</h1>
                  </button>

                  {activeDisplayDropdown === "desktop" && (
                    <div
                      id="displayNameDropdownMenu-desktop"
                      role="menu"
                      className="absolute left-1/2 top-full -mt-2 ml-3 w-max min-w-[120px] -translate-x-1/2 transform rounded-lg border border-bb-border-1 bg-white p-1.5 shadow-lg"
                    >
                      <button
                        type="button"
                        className="flex w-full gap-1.5 rounded-[5px] p-1.5 px-3 text-sm hover:bg-[var(--secondary-trans)]"
                        onClick={() => {
                          setOpenDisplayNameModal(true);
                          setActiveDisplayDropdown(null);
                        }}
                      >
                        <IconPencil className="h-4.5 w-4.5 stroke-[1.75] text-[var(--secondary)]" />
                        <span>Edit display name</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Badges*/}
                <div className="ml-2 pb-[6px] sm:ml-4 sm:block md:pb-3 lg:pb-5">
                  <GifBadges />
                </div>
              </div>
              {/* Nav */}
              <MiniNavBar />
            </>
          ) : heading ? (
            <>
              <h1 className="displayName hiddenDetails">{heading}</h1>

              {/* Nav */}
              <MiniNavBar hideEditBtn />
            </>
          ) : null}
        </div>

        {/* Display name below avatar for sm+ screens */}
        {!hideProfileDetails ? (
          <div className="flex items-center gap-4 sm:hidden">
            <div ref={mobileDropdownRef} className="relative">
              <button
                type="button"
                id="displayNameDropdownButton-mobile"
                onClick={() =>
                  setActiveDisplayDropdown((prev) =>
                    prev === "mobile" ? null : "mobile",
                  )
                }
                className="focus:outline-none"
                aria-haspopup="true"
                aria-expanded={activeDisplayDropdown === "mobile"}
              >
                <h1 className="displayName mobile">{displayName}</h1>
              </button>

              {activeDisplayDropdown === "mobile" && (
                <div
                  id="displayNameDropdownMenu-mobile"
                  role="menu"
                  className="absolute top-full mt-1 w-max min-w-[120px] transform rounded-lg border border-bb-border-1 bg-white p-1.5 shadow-lg"
                >
                  <button
                    type="button"
                    className="flex w-full gap-1.5 rounded-[5px] p-1.5 px-3 text-sm hover:bg-[var(--secondary-trans)]"
                    onClick={() => {
                      setOpenDisplayNameModal(true);
                      setActiveDisplayDropdown(null);
                    }}
                  >
                    <IconPencil className="h-4.5 w-4.5 stroke-[1.75] text-[var(--secondary)]" />
                    <span>Edit display name</span>
                  </button>
                </div>
              )}
            </div>
            <div className="sm:ml-4 sm:block">
              {/* <GifBadges /> */}
            </div>
          </div>
        ) : (
          <div className="sm:hidden">
            <h1
              className="displayName hiddenDetails mobile sm:hidden"
              aria-hidden="true"
            >
              {heading}
            </h1>
          </div>
        )}

        {/* Edit Display Name Modal */}
        {openDisplayNameModal && (
          <ChangeDisplayNameModal
            onClose={() => setOpenDisplayNameModal(false)}
            onUpdateUsername={handleUpdateUsername}
          />
        )}
      </div>
    </header>
  );
}
