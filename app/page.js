"use client";

import {
  Box,
  Button,
  Stack,
  TextField,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import FirebaseAuth from "../components/FirebaseAuth";
import { LanguageProvider, useLanguage } from "../LanguageContext";
import { translations } from "../translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

function ChatApp() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: translations[language].welcome,
      },
    ]);
  }, [language]);

  const sendMessage = async () => {
    // ... (keep the existing sendMessage function)
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        bgcolor="background.default"
      >
        <Box
          p={2}
          borderBottom="1px solid"
          borderColor="divider"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <FirebaseAuth />
          <LanguageSwitcher />
        </Box>
        <Box
          flexGrow={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={3}
        >
          <Stack
            direction={"column"}
            width="100%"
            maxWidth="600px"
            height="80vh"
            bgcolor="white"
            borderRadius={4}
            boxShadow={3}
            p={3}
            spacing={3}
          >
            <Stack
              direction={"column"}
              spacing={2}
              flexGrow={1}
              overflow="hidden"
              sx={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === "assistant" ? "flex-start" : "flex-end"
                  }
                >
                  <Box
                    bgcolor={
                      message.role === "assistant"
                        ? "primary.light"
                        : "secondary.light"
                    }
                    color={
                      message.role === "assistant"
                        ? "primary.contrastText"
                        : "secondary.contrastText"
                    }
                    borderRadius={2}
                    p={2}
                    maxWidth="80%"
                  >
                    {message.content}
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <TextField
                label={translations[language].messagePlaceholder}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                variant="outlined"
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={isLoading}
              >
                {isLoading
                  ? translations[language].sending
                  : translations[language].send}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <ChatApp />
    </LanguageProvider>
  );
}
