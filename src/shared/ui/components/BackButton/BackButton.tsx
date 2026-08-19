import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import './BackButton.css';

export const BackButton = () => {
  return (
    <Link to="/" className="back-button">
      <ArrowLeft />
    </Link>
  );
};
