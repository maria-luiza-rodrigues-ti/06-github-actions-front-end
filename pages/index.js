import Link from "next/link";

export default function HomeScreen() {
    return (
        <div>
            <h1>Página Inicial</h1>
            <Link href="/sobre">Ir para página sobre</Link>
        </div>
    );
}
