import {
  SearchControl,
  Spinner,
  Button,
  TextControl,
  Modal,
} from "@wordpress/components";
import { useState, render } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";


import { SnackbarList } from "@wordpress/components";
import { store as noticesStore } from "@wordpress/notices";

import PagesList from "./components/PagesList";
import { CreatePageButton } from "./components/buttons";


function Notifications() {
  const notices = useSelect((select) => select(noticesStore).getNotices(), []);
  const { removeNotice } = useDispatch(noticesStore);
  const snackbarNotices = notices.filter(({ type }) => type === "snackbar");

  return (
    <SnackbarList
      notices={snackbarNotices}
      className="components-editor-notices__snackbar"
      onRemove={removeNotice}
    />
  );
}

function MyFirstApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const { pages, hasResolved } = useSelect(
    (select) => {
      const query = {};
      if (searchTerm) {
        query.search = searchTerm;
      }
      const selectorArgs = ["postType", "page", query];
      return {
        pages: select(coreDataStore).getEntityRecords(...selectorArgs),
        hasResolved: select(coreDataStore).hasFinishedResolution(
          "getEntityRecords",
          selectorArgs
        ),
      };
    },
    [searchTerm]
  );

  return (
    <div>
      <div className="list-controls">
        <SearchControl onChange={setSearchTerm} value={searchTerm} />
        <CreatePageButton />
      </div>
      <PagesList hasResolved={hasResolved} pages={pages} onChange={setSearchTerm} value={searchTerm} />
      <Notifications />
    </div>
  );
}





export function PageForm({
  title,
  onChangeTitle,
  hasEdits,
  lastError,
  isSaving,
  onCancel,
  onSave,
}) {
  return (
    <div className="my-gutenberg-form">
      <TextControl label="Page title:" value={title} onChange={onChangeTitle} />
      {lastError ? (
        <div className="form-error">Error: {lastError.message}</div>
      ) : (
        false
      )}
      <div className="form-buttons">
        <Button
          onClick={onSave}
          variant="primary"
          disabled={!hasEdits || isSaving}
        >
          {isSaving ? (
            <>
              <Spinner />
              Saving
            </>
          ) : (
            "Save"
          )}
        </Button>
        <Button onClick={onCancel} variant="tertiary" disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

window.addEventListener(
  "load",
  function () {
    render(<MyFirstApp />, document.querySelector("#my-first-gutenberg-app"));
  },
  false
);



function DeletePageButton({ pageId }) {
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
