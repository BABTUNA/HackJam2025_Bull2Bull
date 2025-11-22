const AboutUs = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-bold text-emerald-700 mb-6 text-center">
          About Us
        </h2>
        <div className="space-y-6 text-gray-700">
          <p className="text-lg leading-relaxed">
            Welcome to Lost & Found Map, your community-driven platform for reporting and discovering lost and found items.
          </p>
          <p className="text-lg leading-relaxed">
            Our mission is to help reunite people with their belongings by providing an interactive map where community members can easily report lost items or items they've found.
          </p>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-emerald-700 mb-4">How It Works</h3>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Click on the map to report a lost or found item</li>
              <li>Add details about the item including description and contact information</li>
              <li>Browse the map to see all reported items in your area</li>
              <li>Contact the reporter directly if you find a match</li>
            </ul>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-emerald-700 mb-4">Our Values</h3>
            <p className="text-lg leading-relaxed">
              We believe in the power of community and helping one another. Every item reunited with its owner is a small victory that makes our community stronger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

