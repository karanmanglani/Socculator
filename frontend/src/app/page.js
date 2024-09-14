'use client';
import Image from 'next/image'; // Import the image

export default function Home() {
  return (
    <div className="flex min-h-screen ">
      {/* Left Side: Content */}
      <div className="w-full md:w-2/3 flex flex-col justify-center p-8 lg:p-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          Performance Predictor: <br /> Advanced AI Model for Player Evaluation
        </h1>
        <h3 className="text-xl md:text-2xl font-medium text-white">
          Leveraging Machine Learning and Historical Data to Accurately Forecast Future Player Performance
        </h3>
      </div>

      {/* Right Side: Background Image */}
      <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/path-to-your-image.jpg)' }}>
        {/* Image is applied as background */}
      </div>
    </div>
  );
}
