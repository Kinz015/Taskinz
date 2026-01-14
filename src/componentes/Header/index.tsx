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
        justify-between
      "
    >
      <h1
        className="
          text-white font-bold
          text-2xl sm:text-4xl lg:text-4xl
          text-center lg:text-left
        "
      >
        {title}
      </h1>
      <div className="flex justify-center items-center gap-2">
        <div className="p-4 bg-white rounded-full"></div>
        <span className="text-white font-bold pt-05">Nome do usuário</span>
      </div>
    </header>
  );
}
