import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { AiOutlineArrowRight } from "react-icons/ai";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { bedroomImage, kitchenImage, livingroomImage } from "../imagepaths";

const commonStyles = {
  button:
    "inline-flex items-center justify-center px-6 py-2 text-base font-semibold transition-all duration-200 rounded-lg",
  link: "text-base font-medium text-gray-800 transition-all duration-200 hover:text-indigo-600",
  sectionTitle: "text-4xl font-bold text-gray-900 sm:text-5xl",
  sectionSubtitle: "mt-5 text-base font-normal leading-7 text-gray-500",
  listItem: "flex items-center",
  listItemIcon: "text-base ml-2.5 text-black",
  listItemText: "flex-1 text-base font-medium text-gray-900 ml-2.5",
  gradientButton:
    "relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900",
};

const images = [
  {
    original: bedroomImage,
    thumbnail: "bedroom",
  },
  {
    original: kitchenImage,
    thumbnail: "kitchen",
  },
  {
    original: livingroomImage,
    thumbnail: "livingroom",
  },
];

const Home = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative min-h-screen">
      <section className="relative min-h-screen bg-white flex items-center justify-center">
        <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2">
            <h1 className={commonStyles.sectionTitle}>
              Architectural Intelligence
            </h1>
            <p className={commonStyles.sectionSubtitle}>
              Renovation meets AI: Transform your home with our AI-powered
              remodeling tool.
            </p>

            <p className="mt-10 text-base font-bold text-gray-900">
              Key features:
            </p>
            <ul className="mt-4 space-y-4">
              <li className={commonStyles.listItem}>
                <AiOutlineArrowRight className={commonStyles.listItemIcon} />
                <span className={commonStyles.listItemText}>
                  Interactive Design and Remodeling Tools
                </span>
              </li>
              <li className={commonStyles.listItem}>
                <AiOutlineArrowRight className={commonStyles.listItemIcon} />
                <span className={commonStyles.listItemText}>
                  Transform Your Home with AI style generation
                </span>
              </li>
              <li className={commonStyles.listItem}>
                <AiOutlineArrowRight className={commonStyles.listItemIcon} />
                <span className={commonStyles.listItemText}>
                  Replace your old furniture with AI-generated designs
                </span>
              </li>
            </ul>

            <div className="relative inline-flex mt-10 group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
              <a
                href="/design"
                className={commonStyles.gradientButton}
                role="button"
              >
                Get Started!!
              </a>
            </div>
          </div>

          <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
            <div className="rounded-xl overflow-hidden">
              <ImageGallery
                items={images}
                showThumbnails={false}
                showFullscreenButton={false}
                showPlayButton={false}
                autoPlay={true}
                showNav={false}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
