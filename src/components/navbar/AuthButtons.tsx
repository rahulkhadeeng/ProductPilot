export default function AuthButtons() {
  return (
    <button className="group relative flex transform items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md border bg-indigo-500 px-2 py-1 font-medium text-white transition-all duration-300 active:scale-95 sm:px-4 sm:py-1.5">
      <span className="relative z-10 flex items-center gap-2">Sign In</span>
      <div className="absolute -left-[75px] -top-[50px] -z-10 h-[155px] w-8 rotate-[35deg] bg-white opacity-20 transition-all duration-500 group-hover:left-[120%]" />
    </button>
  );
}
