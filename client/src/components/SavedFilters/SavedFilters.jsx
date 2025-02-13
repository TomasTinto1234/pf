import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveFilter,
  getPublications,
  setCurrentPage,
  saveSort,
  clearFilters,
  getUserInfo,
  setCity,
} from "../../redux/actions/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

export default function SavedFilters({ filterToSave, savedSort, savedCity, setSavedCity, clean }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.allUserInfo);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [savedValue, setSavedValue] = useState([]);
  const [storedValues, setStoredValues] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const loginUser = JSON.parse(window.localStorage.getItem("User"));

  useEffect(() => {
    const loginUser = JSON.parse(window.localStorage.getItem("User"));
    if (loginUser) {
      dispatch(getUserInfo(loginUser[0].id));
      setTimeout(() => {
        setStoredValues(Object.keys(localStorage).filter((k) => k.includes(loginUser[1].mail)));
      }, 100);
    }
  }, [dispatch, savedValue]);

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const regexp = /^\S*$/
  const validate = (input) => {
    return !regexp.test(input)
  }

  //AGREGAR LLAVE AL FINAL
  const handleLocalStorage = (keyValue) => {
    if (!keyValue || error) return;
    if (!loginUser) {
      toast({
        title: "Debe inciar session para poder guardar un filtro de busqueda!!!",
        status: "error",
        isClosable: true,
      });
      setValue("");
    } else {
      window.localStorage.setItem(
        keyValue + " " + user.loginInfo.mail,
        JSON.stringify([filterToSave, savedSort, savedCity])
      );
      setSavedValue([...savedValue, keyValue]);
      setValue("");
    }
  };

  const handleChange = (event) => {
    setError(validate(event.target.value));
    setValue(event.target.value);
  };
  const handleValue = (event) => {
    event.preventDefault();
    if (event.target.value === "") {
      dispatch(clearFilters());
      setSavedCity("");
      dispatch(getPublications(filterToSave, savedSort, savedCity));
      setCurrentPage(1);
    } else if (event.target.value) {
      let filter = localStorage.getItem(event.target.value + " " + user.loginInfo.mail);
      let newFilter = JSON.parse(filter);
      dispatch(saveFilter(newFilter[0]));
      dispatch(saveSort(newFilter[1]));
      dispatch(setCity(newFilter[2]));
      dispatch(getPublications(filterToSave, savedSort, newFilter[2]));
      dispatch(setCurrentPage(1));
      setSavedCity("");
    }
  };

  return (
    <Flex direction={"row"} marginRight={"10px"}>
      <Button
        onClick={onOpen}
        cursor={"pointer"}
        transition="all 0.2s"
        border={"1px solid black"}
        _hover={{ bg: "#D9D9D9" }}
        _expanded={{ bg: "white" }}
        _focus={{ bg: "#D9D9D9" }}
      >
        Mis Filtros
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"} fontSize="1.5em">
            Mis Filtros
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: "#FF8181", color: "white" }} />
          <ModalBody>
            <Text textAlign={"center"}>
              Podes guardar tus filtros personalizados y volver a utilizarlos.
              {error && <Text color={"red"}>Sin espacios</Text>}
            </Text>
            <br />
            <InputGroup borderColor={"black"}>
              <Input
                transition="all 0.2s"
                borderColor={"black"}
                _hover={{ bg: "#D9D9D9" }}
                _expanded={{ bg: "white" }}
                _focus={{ bg: "#D9D9D9" }}
                placeholder="Filtro"
                color={"black"}
                type="text"
                value={value}
                onChange={handleChange}
              />
              <InputRightElement
                onClick={() => handleLocalStorage(value)}
                children={<FontAwesomeIcon icon={faBookmark} color="gray.300" />}
                cursor={"pointer"}
              />
            </InputGroup>
            <br />
            <Select
              borderColor={"black"}
              _hover={{ bg: "#D9D9D9" }}
              _focus={{ bg: "#D9D9D9" }}
              onChange={handleValue}
            >
              <option value={""} selected={clean}>
                Mis Filtros
              </option>
              {storedValues?.map((v, i) => (
                <option key={i}>{v.split(" ")[0]}</option>
              ))}
            </Select>
          </ModalBody>
          <br />
          <ModalFooter>
            <Popover>
              <PopoverTrigger>
                <Button
                  border={"1px solid black"}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  colorScheme="gray"
                  mr={3}
                  fontWeight={"extrabold"}
                  fontSize={"x-large"}
                >
                  ?
                </Button>
              </PopoverTrigger>
              {isHovering && (
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader textAlign={"center"}>
                    Para poder guardar el filtro deseado asegúrese de tenerlo ya aplicado en la
                    página.
                  </PopoverHeader>
                  <PopoverBody>
                    Ej: Buscar ubicación "Mendoza", que sea "departamento" y de "menor precio".
                    Luego escriba cómo quiere que se llame (sin espacios) el filtro y guárdelo.
                  </PopoverBody>
                </PopoverContent>
              )}
            </Popover>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
