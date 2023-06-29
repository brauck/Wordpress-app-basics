import { useState } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { Button, Modal, Spinner } from "@wordpress/components";
import { store as coreDataStore } from "@wordpress/core-data";
import { store as noticesStore } from "@wordpress/notices";

import { EditPageForm, CreatePageForm } from "./forms";

export function PageEditButton({ pageId }) {
  const [isOpen, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return (
    <>
      <Button onClick={openModal} variant="primary">
        Edit
      </Button>
      {isOpen && (
        <Modal onRequestClose={closeModal} title="Edit page">
          <EditPageForm
            pageId={pageId}
            onCancel={closeModal}
            onSaveFinished={closeModal}
          />
        </Modal>
      )}
    </>
  );
}

export function CreatePageButton() {
  const [isOpen, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return (
    <>
      <Button onClick={openModal} variant="primary">
        Create a new Page
      </Button>
      {isOpen && (
        <Modal onRequestClose={closeModal} title="Create a new page">
          <CreatePageForm onCancel={closeModal} onSaveFinished={closeModal} />
        </Modal>
      )}
    </>
  );
}

export function DeletePageButton({ pageId }) {
  // pageId = pageId * 1000; // to erase the error
  const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
  // useSelect returns a list of selectors if you pass the store handle
  // instead of a callback:
  const { getLastEntityDeleteError } = useSelect(coreDataStore);
  const handleDelete = async () => {
    const success = await deleteEntityRecord("postType", "page", pageId);
    if (success) {
      // Tell the user the operation succeeded:
      createSuccessNotice("The page was deleted!", {
        type: "snackbar",
      });
    } else {
      // We use the selector directly to get the error at this point in time.
      // Imagine we fetched the error like this:
      //     const { lastError } = useSelect( function() { /* ... */ } );
      // Then, lastError would be null inside of handleDelete.
      // Why? Because we'd refer to the version of it that was computed
      // before the handleDelete was even called.
      const lastError = getLastEntityDeleteError("postType", "page", pageId);
      const message =
        (lastError?.message || "There was an error.") +
        " Please refresh the page and try again.";
      // Tell the user how exactly the operation have failed:
      createErrorNotice(message, {
        type: "snackbar",
      });
    }
  };

  const { deleteEntityRecord } = useDispatch(coreDataStore);
  const { isDeleting } = useSelect(
    (select) => ({
      isDeleting: select(coreDataStore).isDeletingEntityRecord(
        "postType",
        "page",
        pageId
      ),
    }),
    [pageId]
  );

  return (
    <Button variant="primary" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? (
        <>
          <Spinner />
          Deleting...
        </>
      ) : (
        "Delete"
      )}
    </Button>
  );
}
