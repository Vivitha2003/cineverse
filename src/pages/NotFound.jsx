import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <div className="page container">
      <EmptyState icon={Compass} title="This page does not exist" message="The link may be broken or the page may have moved.">
        <Link to="/" className="btn btn--primary">
          Back to home
        </Link>
      </EmptyState>
    </div>
  );
}

export default NotFound;
