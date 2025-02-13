import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../../redux/actions";
import Loading from "../Loading/Loading";
import Card from "./Card";
import style from "./Cards.module.css";
import { Box, List, ListItem, Image } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import imgSearch from "../../Image/18058225_888_search_houseasdad.png";

export default function Cards() {
  const dispatch = useDispatch();
  const houses = useSelector((state) => state.houses);
  // const loading = useSelector((state) => state.loading);
  const currentPage = useSelector((state) => state.currentPage);

  /* **************** PAGINADO **************** */
  const housePage = 6;
  const pages = [];
  for (let i = 1; i <= Math.ceil(houses.length / housePage); i++) {
    pages.push(i);
  }

  const lastPage = currentPage * housePage;
  const firstPage = lastPage - housePage;
  const currentHouse = houses.slice(firstPage, lastPage);

  const handleClick = (e) => {
    dispatch(setCurrentPage(Number(e.target.id)));
  };

  const handleNext = (e) => {
    if (currentPage === pages.length) {
      dispatch(setCurrentPage(currentPage));
    } else {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePrev = (e) => {
    if (currentPage === 1) {
      dispatch(setCurrentPage(currentPage));
    } else {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const renderPaginado = pages.map((number) => {
    return (
      <li
        key={number}
        id={number}
        onClick={handleClick}
        className={currentPage === number ? style.active : null}
      >
        {number}
      </li>
    );
  });

  /* **************** RENDER CARDS **************** */
  return (
    <Box display={"flex"} justifyContent="center" marginTop="1rem" minHeight="100%" marginX={"10%"} paddingBottom={"60px"}>
        <Box>
          <List className={style.paginadoBtn}>
            <ListItem className={style.paginadoBtn} onClick={handlePrev}>
              <FontAwesomeIcon icon={faChevronLeft} fontSize="20px" />
            </ListItem>
            {renderPaginado}
            <ListItem className={style.paginadoBtn} onClick={handleNext}>
              <FontAwesomeIcon icon={faChevronRight} fontSize="20px" />
            </ListItem>
          </List>
       {currentHouse.length ? (
          <Box display={"flex"} flexWrap={"wrap"} justifyContent="space-evenly" m={"30px"}>
            {currentHouse?.map((r) => {
              if (r.approved) {
                return (
                  <Box key={r.id}>
                    <Card
                      id={r.id}
                      idUser={r.userId}
                      img={r.property.propertyImages}
                      precio={r.property.price}
                      ciudad={r.property.address}
                      metros={r.property.surface}
                      baño={r.property.bathrooms}
                      dormitorio={r.property.rooms}
                      ambientes={r.property.environments}
                      mascota={r.property.pets}
                      premium={r.premium}
                    />
                  </Box>
                );
              }
            })}
          </Box>
           ) : (
          <Box position="relative" zIndex={"2"} display={"flex"} justifyContent={"center"}>
            <Image src={imgSearch} alt="imgSearch" w={"50%"} />
           </Box>
           )}
           <List className={style.paginadoBtn}>
            <ListItem className={style.paginadoBtn} onClick={handlePrev}>
              <FontAwesomeIcon icon={faChevronLeft} fontSize="20px" />
            </ListItem>
            {renderPaginado}
            <ListItem className={style.paginadoBtn} onClick={handleNext}>
              <FontAwesomeIcon icon={faChevronRight} fontSize="20px" />
            </ListItem>
          </List>
        </Box>
    </Box>
  );
}
