import "./globals.css";

export const metadata = {
    icons: {
        icon: "/logo.png",
    },
    title: "Shooie - Project Nippi",
    description: "A whatsapp web automation client built by @kp.here",
    image: "/raden.jpg",
    viewport: "width=device-width, initial-scale=1",
};

// or dynamic metadata
//   export async function generateMetadata({ params, searchParams }) {
//     return { title: '...' };
//   }

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head />
            <body>{children}</body>
        </html>
    );
}
