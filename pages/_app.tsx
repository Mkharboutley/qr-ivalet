import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from '@/utils/firebase';
import { NextUIProvider } from "@nextui-org/react";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </FirebaseAppProvider>
  );
}
