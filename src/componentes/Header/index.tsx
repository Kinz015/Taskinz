"use client";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {

  return (
    <header className="flex bg-[#1b1b1f] h-50 items-center pl-21">
      <h1 className="text-white font-bold text-5xl">{title}</h1>
    </header>
  );
}
