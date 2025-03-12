
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Button,
  useColorMode,
  useColorModeValue,
  Divider,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import { getUserSettings, updateUserSettings, resetAllProgress } from "../services/storageService";

const AppSettings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();
  
  const [settings, setSettings] = useState({
    darkMode: false,
    notificationsEnabled: true,
    dhikrRemindersEnabled: true
  });
  
  const headerBg = useColorModeValue("ramadan.deepBlue", "ramadan.navy");
  
  useEffect(() => {
    // Load user settings
    const userSettings = getUserSettings();
    setSettings(userSettings);
    
    // Sync color mode with settings
    if (userSettings.darkMode && colorMode === "light") {
      toggleColorMode();
    } else if (!userSettings.darkMode && colorMode === "dark") {
      toggleColorMode();
    }
  }, []);
  
  // const handleToggleDarkMode = () => {
  //   const newSettings = { ...settings, darkMode: !settings.darkMode };
  //   setSettings(newSettings);
  //   updateUserSettings(newSettings);
  //   toggleColorMode();
  // };
  
  // const handleToggleNotifications = () => {
  //   const newSettings = { ...settings, notificationsEnabled: !settings.notificationsEnabled };
  //   setSettings(newSettings);
  //   updateUserSettings(newSettings);
    
  //   // Request notification permission if turning on
  //   if (newSettings.notificationsEnabled && Notification.permission !== "granted") {
  //     Notification.requestPermission();
  //   }
  // };
  
  // const handleToggleDhikrReminders = () => {
  //   const newSettings = { ...settings, dhikrRemindersEnabled: !settings.dhikrRemindersEnabled };
  //   setSettings(newSettings);
  //   updateUserSettings(newSettings);
  // };
  
  const handleResetProgress = () => {
    resetAllProgress();
    onClose();
    
    toast({
      title: "Reset Complete",
      description: "All your progress has been reset",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    
    // Reload the page to reflect changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  
  return (
    <Card w="100%" overflow="hidden">
      <CardHeader bg={headerBg} py={4} color="white">
        <Heading size="md">Settings</Heading>
      </CardHeader>
      
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel htmlFor="dark-mode" mb="0">
              Dark Mode
            </FormLabel>
            <Switch
              id="dark-mode"
              isChecked={settings.darkMode}
              onChange={handleToggleDarkMode}
              colorScheme="purple"
            />
          </FormControl>
          
          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel htmlFor="notifications" mb="0">
              Enable Notifications
            </FormLabel>
            <Switch
              id="notifications"
              isChecked={settings.notificationsEnabled}
              onChange={handleToggleNotifications}
              colorScheme="purple"
            />
          </FormControl>
          
          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel htmlFor="dhikr-reminders" mb="0">
              Dhikr Reminders
            </FormLabel>
            <Switch
              id="dhikr-reminders"
              isChecked={settings.dhikrRemindersEnabled}
              onChange={handleToggleDhikrReminders}
              colorScheme="purple"
              isDisabled={!settings.notificationsEnabled}
            />
          </FormControl>
           */}
          <Divider my={2} />
          
          <Box textAlign="center">
            <Button
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={onOpen}
            >
              Reset All Progress
            </Button>
            <Text fontSize="xs" color="gray.500" mt={2}>
              This will reset all your tracked data
            </Text>
          </Box>
        </VStack>
      </CardBody>
      
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reset All Progress
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will reset all your tracked data including fasting, Quran progress, 
              good deeds challenges, and dhikr counts. This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleResetProgress} ml={3}>
                Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  );
};

export default AppSettings;
