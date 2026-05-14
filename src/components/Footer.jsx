import logo from '../assets/logo.jpg';

const Footer = () => {
  return (
    <footer className="w-full py-16 bg-surface-container-low dark:bg-surface-dim border-t border-outline-variant/30">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-gutter text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <img src={logo} alt="Snow Cakes Logo" className="h-28 mb-4 object-contain mix-blend-multiply" />
          <p className="font-body-sm text-body-sm text-on-surface-variant">Elevating the simple joy of artisan baking with premium ingredients and time-honored techniques in Lalitpur.</p>
        </div>
        <div>
          <h4 className="font-label-lg text-label-lg text-primary mb-6">Location</h4>
          <p className="font-body-sm text-on-surface-variant mb-2">Tikathali, Lalitpur</p>
          <p className="font-body-sm text-on-surface-variant">Balkot, Lalitpur</p>
        </div>
        <div>
          <h4 className="font-label-lg text-label-lg text-primary mb-6">Contact</h4>
          <p className="font-body-sm text-on-surface-variant mb-2">Phone: +977 986-0568012</p>
          <p className="font-body-sm text-on-surface-variant">Phone: +977 976-3443555</p>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-16 pt-8 border-t border-outline-variant/10 text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant opacity-70">© {new Date().getFullYear()} Snow Cakes Bakery. Handcrafted with love.</p>
      </div>
    </footer>
  );
};

export default Footer;
