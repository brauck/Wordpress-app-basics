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







window.addEventListener(
  "load",
  function () {
    render(<MyFirstApp />, document.querySelector("#my-first-gutenberg-app"));
  },
  false
);




