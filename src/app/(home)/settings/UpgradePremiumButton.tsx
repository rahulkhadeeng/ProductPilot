"use client";

import { useState } from "react";
import { Crown } from "lucide-react";

import UpgradeMembershipModalContent from "@/components/UpgradeMembershipModalContent";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal/modal";

type UpgradePremiumButtonProps = {
  userEmail?: string | null;
};

export default function UpgradePremiumButton({
  userEmail,
}: UpgradePremiumButtonProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setVisible(true)} className="gap-2">
        <Crown className="h-4 w-4" />
        Upgrade to Premium
      </Button>

      <Modal visible={visible} setVisible={setVisible}>
        <UpgradeMembershipModalContent userEmail={userEmail} />
      </Modal>
    </>
  );
}
