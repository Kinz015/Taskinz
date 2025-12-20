"use client";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header
      className="
        flex items-center
        bg-[#1b1b1f]
        h-50
        px-4 sm:px-10 lg:pl-21
        justify-center lg:justify-start
      "
    >
      <h1
        className="
          text-white font-bold
          text-2xl sm:text-4xl lg:text-5xl
          text-center lg:text-left
        "
      >
        {title}
      </h1>
    </header>
  );
}
