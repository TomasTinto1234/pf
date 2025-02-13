import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NavBarForms from "../NavBar/NavBarForms";
import Footer from "../Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faAt, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";

import Rating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import CardPerfil from "../Cards/CardPerfil";
import { useHistory } from "react-router-dom";
import {
  getFavsUser,
  getInfoUser,
  getPubs,
  getUserImage,
  getUserInfo,
  blockUser,
  restoreUser,
  getUserImage2,
  limpiar
} from "../../redux/actions";
import AlertBRUser from "./AlertBRUser";
export default function UsersAdmin() {
  const history = useHistory();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.infoUserAdmin);
  // const allUserInfo = useSelector((state) => state.allUserInfo);
  const publicationsUser = useSelector((state) => state.publicationsUser);
  const favoritesUser = useSelector((state) => state.favoritesUser);
  const imageUser = useSelector((state) => state.imageUser2);
  const [alertBRUser, setAlertBRUser] = useState([false, false]);
  /* const [infoUser,setInfoUser] = useState(user) */
  const infoUser = JSON.parse(window.localStorage.getItem("ViewUser"));

  const handleBlock = () => {
    setAlertBRUser([true, true]);
  };

  const handleRestore = () => {
    setAlertBRUser([true, true]);
  };

  useEffect(() => {
    dispatch(getPubs(infoUser[0].id));
    dispatch(getFavsUser(infoUser[0].id));
    dispatch(getUserImage2(infoUser[0].id));
    if (!infoUser) {
      const user = JSON.parse(window.localStorage.getItem("User"));
      dispatch(getInfoUser(user));
      dispatch(getUserInfo(infoUser[0].id));
    }
    return () => {
      dispatch(limpiar())
    //  window.localStorage.removeItem("ViewUser")
    }
  }, [dispatch]);

  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  return (
    <Box>
      <NavBarForms />
      <Stack
        position={"relative"}
        align={"start"}
        justify={"center"}
        direction={"row"}
        py={10}
        backgroundColor={"#EDEDED"}
      >
        <Center px={6}>
          <Box
            maxW={"400px"}
            w={"600px"}
            h={"500px"}
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            rounded={"lg"}
            p={6}
            textAlign={"center"}
          >
            {!infoUser[0].admin &&
            <Flex>
              {infoUser[0].banned ? (
                <Button onClick={() => handleRestore()}>
                  {/* <FontAwesomeIcon icon="fa-regular fa-ban" /> */}
                  <FontAwesomeIcon icon={faBan} color="black" fontSize="30px" p={"0"} />
                </Button>
              ) : (
                <Button onClick={() => handleBlock()}>
                  <FontAwesomeIcon icon={faBan} color="red" fontSize="30px" p={"0"} />
                </Button>
              )}
            </Flex>}
            <Avatar
              size={"2xl"}
              src={imageUser ? imageUser : null}
              alt={"Avatar Alt"}
              mb={4}
              pos={"relative"}
            />
            <Heading fontSize={"2xl"} fontFamily={"body"}>
              {infoUser[0].name}
            </Heading>
            <Text fontWeight={600} color={"gray.500"} mb={4}>
              {infoUser[0].loginInfo.mail}
            </Text>
            <Flex justifyContent="center" alignContent="center">
              <Rating rating={infoUser[0].rating} ratingAmount={infoUser[0].ratingAmount} />
            </Flex>
            <Flex direction={"column"} alignItems="flex-start" p={5} w={"350px"}>
              <Text w={"100%"} textAlign={"left"} color={useColorModeValue("gray.700", "gray.400")} px={3}>
                Ciudad: {infoUser[0].city}
              </Text>
              <br />
              <Text w={"100%"} textAlign={"left"} color={useColorModeValue("gray.700", "gray.400")} px={3}>
                Descripción: {infoUser[0].description}
              </Text>
            </Flex>
            <br />
          </Box>
        </Center>
        <Box
          maxW={"600px"}
          w={"600px"}
          h={"500px"}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          rounded={"lg"}
          p={6}
          textAlign={"center"}
          overflowY={"scroll"}
        >
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab fontWeight={600} color={"gray.500"} mb={4}>
                Publicaciones
              </Tab>
              <Tab fontWeight={600} color={"gray.500"} mb={4}>
                Favoritos
              </Tab>
            </TabList>
            <TabPanels display={"flex"} justifyContent="center">
              <TabPanel>
                {publicationsUser?.map((f, index) => {
                  return (
                    <Box key={index}>
                      <CardPerfil
                        id={f.id}
                        img={f.property.propertyImages}
                        precio={f.property.price}
                       // ciudad={f.property.city.name}
                        premium={f.premium}
                      />
                    </Box>
                  );
                })}
              </TabPanel>
              <TabPanel>
                {favoritesUser?.map((f, index) => {
                  return (
                    <Box key={index}>
                      <CardPerfil
                        id={f.id}
                        img={f.property.propertyImages}
                        precio={f.property.price}
                        //ciudad={f.property.city.name}
                        premium={f.premium}
                      />
                    </Box>
                  );
                })}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <AlertBRUser
          alertBRUser={alertBRUser}
          setAlertBRUser={setAlertBRUser}
          userId={infoUser[0].id}
          banned={infoUser[0].banned}
          userEmail={infoUser[0].loginInfo.mail}
        />
      </Stack>
      <Footer />
    </Box>
  );
}
