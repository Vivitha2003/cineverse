import { Film } from 'lucide-react';

// A friendly message for "nothing here yet". Children can be a button or link.
function EmptyState({ icon: Icon = Film, title, message, children }) {
  return (
    <div className="state">
      <div className="state__icon">
        <Icon size={30} aria-hidden="true" />
      </div>
      <h3 className="state__title">{title}</h3>
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}

export default EmptyState;
