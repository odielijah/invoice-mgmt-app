import { Moon } from "../assets/icons/Moon";
import { Sun } from "../assets/icons/Sun";
import logo from "/logo.svg";
import profile from "../assets/images/profile.png";

export default function Sidebar({ isDark, toggleTheme }) {
  return (
    <aside
      className="
      /* 1. Base Mobile/Tablet Styles (Top Bar) */
      w-full h-[72px] md:h-[80px] flex flex-row justify-between bg-sidebar dark:bg-sidebar-dark z-[100] sticky top-0
      
      /* 2. Desktop Styles (Left Sidebar) - Triggers at 1024px */
      lg:w-[103px] lg:h-screen lg:flex-col lg:rounded-r-[20px] lg:fixed lg:left-0
    "
    >
      {/* Logo Section */}
      <div
        className="
        bg-primary relative flex items-center justify-center overflow-hidden
        h-[72px] w-[72px] md:h-[80px] md:w-[80px] rounded-r-[20px]
        lg:h-[103px] lg:w-full
      "
      >
        <div className="absolute bottom-0 w-full h-1/2 bg-primary-light rounded-tl-[20px]"></div>
        <img src={logo} alt="logo" className="z-10 w-[28px] lg:w-[40px]" />
      </div>

      {/* Bottom/Right Actions */}
      <div className="flex flex-row lg:flex-col items-center">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="cursor-pointer text-secondary hover:text-white transition px-6 lg:px-0 lg:mb-8"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Divider Line */}
        <div className="bg-[#494E6E] h-full w-[1px] lg:w-full lg:h-[1px]" />

        {/* Profile Avatar */}
        <div className="px-6 py-4 lg:py-8 flex items-center justify-center">
          <img
            src={profile}
            alt="User profile"
            className="w-8 h-8 lg:w-[40px] lg:h-[40px] rounded-full border-2 border-transparent hover:border-primary cursor-pointer transition"
          />
        </div>
      </div>
    </aside>
  );
}
