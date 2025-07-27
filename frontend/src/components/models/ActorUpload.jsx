import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";

export default function ActorUpload({ visible, onClose }) {
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient(); // <== Get React Query client
  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, actor } = await createActor(data);
    setBusy(false);

    if (error) {
      return updateNotification("error", error);
    }

    updateNotification("success", "Actor created successfully.");

    // ✅ Invalidate actors list to trigger refetch
    queryClient.invalidateQueries({ queryKey: ["actors"] });

    onClose(); // close modal after creation
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        onSubmit={!busy ? handleSubmit : null}
        title="Create New Actor"
        btnTitle="Create"
        busy={busy}
      />
    </ModalContainer>
  );
}
