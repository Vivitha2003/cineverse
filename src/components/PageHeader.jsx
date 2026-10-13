// The big title at the top of a page. Children (like buttons) appear on the right.
function PageHeader({ title, subtitle, children }) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}

export default PageHeader;
