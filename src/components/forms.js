import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { render } from "@wordpress/element";
import {
  SearchControl,
  Spinner,
  Button,
  TextControl,
} from "@wordpress/components";

export function EditPageForm({ pageId, onCancel, onSaveFinished }) {
  const { editEntityRecord } = useDispatch(coreDataStore);
  const handleChange = (title) =>
    editEntityRecord("postType", "page", pageId, { title });
  const { saveEditedEntityRecord } = useDispatch(coreDataStore);
  const handleSave = async () => {
    const updatedRecord = await saveEditedEntityRecord(
      "postType",
      "page",
      pageId
    );
    if (updatedRecord) {
      onSaveFinished();
    }
  };
  const { isSaving, hasEdits, lastError, page } = useSelect(
    (select) => ({
      isSaving: select(coreDataStore).isSavingEntityRecord(
        "postType",
        "page",
        pageId
      ),
      hasEdits: select(coreDataStore).hasEditsForEntityRecord(
        "postType",
        "page",
        pageId
      ),
      page: select(coreDataStore).getEditedEntityRecord(
        "postType",
        "page",
        pageId
      ),
      lastError: select(coreDataStore).getLastEntitySaveError(
        "postType",
        "page",
        pageId
      ),
    }),
    [pageId]
  );

  return (
    <PageForm
      title={page.title}
      onChangeTitle={handleChange}
      hasEdits={hasEdits}
      lastError={lastError}
      isSaving={isSaving}
      onCancel={onCancel}
      onSave={handleSave}
    />
  );
}

function PageForm({
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

