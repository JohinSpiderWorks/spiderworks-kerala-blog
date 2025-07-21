import React from 'react';

function Footer() {
  return (
    <div>
      {/* Footer */}
      <footer className="mt-24 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
              Blog
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Bringing you knowledge, stories, and inspiration every day
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>

          {/* Hover color change for 'W' */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 group">
              © {new Date().getFullYear() }
              <span className="p-1">
                 Spider
                <span className="transition-colors font-extrabold duration-300 group-hover:text-[#03dbab]">
                  W
                </span>
                orks Technologies, Kochi - India. All rights reserved.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;