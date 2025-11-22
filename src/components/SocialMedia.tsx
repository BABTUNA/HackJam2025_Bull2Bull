interface SocialMediaProps {
  instagramUrl?: string;
}

const SocialMedia = ({ instagramUrl }: SocialMediaProps) => {
  const handleInstagramClick = () => {
    if (instagramUrl) {
      window.open(instagramUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleInstagramKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleInstagramClick();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-bold text-emerald-700 mb-6 text-center">
          Social Media
        </h2>
        <div className="space-y-6 text-gray-700">
          <p className="text-lg leading-relaxed text-center">
            Connect with us on social media to stay updated on community news and success stories!
          </p>
          
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="flex flex-col items-center gap-4 p-6 bg-emerald-50 rounded-lg w-full max-w-md">
              <span className="text-6xl" role="img" aria-hidden="true">
                📷
              </span>
              <h3 className="text-2xl font-semibold text-emerald-700">Instagram</h3>
              <p className="text-center text-gray-600">
                Follow us for updates, success stories, and community highlights
              </p>
              {instagramUrl ? (
                <button
                  className="px-6 py-3 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white rounded-lg font-semibold hover:from-emerald-800 hover:to-emerald-950 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                  onClick={handleInstagramClick}
                  onKeyDown={handleInstagramKeyDown}
                  tabIndex={0}
                  aria-label="Visit our Instagram page"
                >
                  Follow Us on Instagram
                </button>
              ) : (
                <p className="text-gray-500 italic">Instagram link coming soon!</p>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600">
              Share your success stories with us using the hashtag <span className="font-semibold text-emerald-700">#LostAndFoundMap</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;

