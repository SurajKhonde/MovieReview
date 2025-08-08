import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteActor, searchActor } from "../../api/actor";
import { useNotification, useSearch } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";
import ConfirmModal from "../models/ConfirmModal";
import UpdateActor from "../models/UpdateActor";
import NextAndPrevButton from "../NextAndPrevButton";
import NotFoundText from "../NotFoundText";
import { useQueryClient } from "@tanstack/react-query";
import { useActors, getActorsdata } from "../../hooks/useActors";
import Loader from "../Loader";

const limit = 20;

export default function Actors() {
  const [page, setPage] = useState(0);
  const [results, setResults] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [busy, setBusy] = useState(false);

  const queryClient = useQueryClient();
  const { updateNotification } = useNotification();
  const { handleSearch, resetSearch, resultNotFound } = useSearch();

  const {
    data: actors = [],
    isLoading,
  } = useActors(page, limit);
  useEffect(() => {
    if (actors?.length === limit) {
      queryClient.prefetchQuery({
        queryKey: ["actors", page + 1],
        queryFn: () => getActorsdata(page + 1, limit),
      });
    }
  }, [actors, page, queryClient]);

  const handleOnNextClick = () => {
    if (actors.length < limit) return;
    setPage((prev) => prev + 1);
  };

  const handleOnPrevClick = () => {
    if (page === 0) return;
    setPage((prev) => prev - 1);
  };

  const handleOnEditClick = (profile) => {
    setShowUpdateModal(true);
    setSelectedProfile(profile);
  };

  const hideUpdateModal = () => setShowUpdateModal(false);

  const handleOnSearchSubmit = (value) => {
    handleSearch(searchActor, value, setResults);
  };

  const handleSearchFormReset = () => {
    resetSearch();
    setResults([]);
  };

  const handleOnActorUpdate = () => {
    updateNotification("success", "Actor updated!");
    queryClient.invalidateQueries({ queryKey: ["actors"] });
  };

  const handleOnDeleteClick = (profile) => {
    setSelectedProfile(profile);
    setShowConfirmModal(true);
  };

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteActor(selectedProfile.id);
    setBusy(false);

    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    hideConfirmModal();
    queryClient.invalidateQueries({ queryKey: ["actors"] });
  };

  const hideConfirmModal = () => setShowConfirmModal(false);

  const actorList = results.length || resultNotFound ? results : actors;

  return (
    <>
      <div className="p-5">
        <div className="flex justify-end mb-5">
          <AppSearchForm
            onReset={handleSearchFormReset}
            onSubmit={handleOnSearchSubmit}
            placeholder="Search Actors..."
            showResetIcon={results.length || resultNotFound}
          />
        </div>
        {isLoading ? (
  <Loader message="Fetching actors..." />
) : (
  <>
    <NotFoundText visible={resultNotFound} text="Record not found" />

    {(!actorList || actorList.length === 0) ? (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-3xl font-semibold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400">
          No actors listed yet 🎭
        </p>
      </div>
    ) : (
      <>
        <div className="grid grid-cols-4 gap-5">
          {actorList.map((actor) => (
            <ActorProfile
              key={actor.id}
              profile={actor}
              onEditClick={() => handleOnEditClick(actor)}
              onDeleteClick={() => handleOnDeleteClick(actor)}
            />
          ))}
        </div>

        {!results.length && !resultNotFound && (
          <NextAndPrevButton
            className="mt-5"
            onNextClick={handleOnNextClick}
            onPrevClick={handleOnPrevClick}
          />
        )}
      </>
    )}
  </>
)}
      </div>

      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        subtitle="This action will remove this profile permanently!"
        busy={busy}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
      />

      <UpdateActor
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedProfile}
        onSuccess={handleOnActorUpdate}
      />
    </>
  );
}

const ActorProfile = ({ profile, onEditClick, onDeleteClick }) => {
  const [showOptions, setShowOptions] = useState(false);
  const acceptedNameLength = 15;

  const handleOnMouseEnter = () => setShowOptions(true);
  const handleOnMouseLeave = () => setShowOptions(false);

  const getName = (name) =>
    name.length <= acceptedNameLength ? name : name.substring(0, acceptedNameLength) + "..";

  const { name, about = "", avatar } = profile;
  if (!profile) return null;

  return (
    <div className="bg-white shadow dark:shadow dark:bg-secondary rounded h-20 overflow-hidden">
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className="flex cursor-pointer relative"
      >
        <img src={avatar} alt={name} className="w-20 aspect-square object-cover" />

        <div className="px-2">
          <h1 className="text-xl text-primary dark:text-white font-semibold whitespace-nowrap">
            {getName(name)}
          </h1>
          <p className="text-primary dark:text-white opacity-70">
            {about.substring(0, 50)}
          </p>
        </div>

        <Options
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          visible={showOptions}
        />
      </div>
    </div>
  );
};

const Options = ({ visible, onDeleteClick, onEditClick }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center space-x-5">
      <button
        onClick={onDeleteClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsTrash />
      </button>
      <button
        onClick={onEditClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsPencilSquare />
      </button>
    </div>
  );
};
