import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SocketContext, socket } from "@/context/sockets";
import { NextUIProvider } from "@nextui-org/react";
import { Layout } from "../components/layout/layout";
import { openNewBackgroundTab } from "@/libs/functions";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const getNextGroup = () => {
    fetch("/api/groups/next")
      .then((res) => res.json())
      .then((data) => {
        if (data?.status == "error") {
          console.log(data?.message);
        } else {
          setTimeout(() => {
            const { id, url, estado, microsegmento } = data;
            let u = `${url}/members?exp_grp=1${
              estado ? `&estado=${estado}` : null
            }${
              microsegmento ? `&microsegmento=${microsegmento}` : null
            }${`&scrap_id=${id}`}`;
            openNewBackgroundTab(u);
          }, 2e3);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    socket.on("scrap-next", getNextGroup);
    return () => {
      socket.off("scrap-next", getNextGroup);
    };
  }, []);
  return (
    <NextThemesProvider defaultTheme="system" attribute="class">
      <NextUIProvider>
        <SocketContext.Provider value={socket}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SocketContext.Provider>
      </NextUIProvider>
    </NextThemesProvider>
  );
}

export default MyApp;
