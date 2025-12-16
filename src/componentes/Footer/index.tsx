import Link from "next/link";

export default async function Footer() {
  return (
    <footer className="pb-16 text-center">
      <p>
        <span>Copyright &copy; {new Date().getFullYear()} - </span>
        <Link href="/">Desafio Técnico Full Stack - Desenvolvedor React/Next.js</Link>
      </p>
    </footer>
  );
}
