function PagesList({ hasResolved, pages }) {
  if (!hasResolved) {
    return <Spinner />;
  }
  if (!pages?.length) {
    return <div>No results</div>;
  }

  return (
    <table className="wp-list-table widefat fixed striped table-view-list">
      <thead>
        <tr>
          <td>Title</td>
        </tr>
      </thead>
      <tbody>
        {pages?.map((page) => (
          <tr key={page.id}>
            <td>{decodeEntities(page.title.rendered)}</td>
            <td>
              <div className="form-buttons">
                <PageEditButton pageId={page.id} />
                <DeletePageButton pageId={page.id} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
