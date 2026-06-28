import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container mx-auto px-4 py-16 text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Species not found</h1>
    <p className="text-gray-600 mb-8">
      That bird isn&apos;t in the guide, or the link may be incorrect.
    </p>
    <Link
      to="/"
      className="inline-block px-6 py-3 bg-belize-green text-white rounded-lg font-medium hover:bg-belize-green-dark transition-colors"
    >
      Back to field guide
    </Link>
  </div>
);

export default NotFound;
