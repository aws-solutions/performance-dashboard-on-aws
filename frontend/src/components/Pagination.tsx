import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useWindowSize } from "../hooks";
import "./Pagination.scss";

interface Props {
  numPages: number;
  currentPage: number;
  numPageLinksShown: number;
  gotoPage: Function;
  setCurrentPage: Function;
}

function Pagination(props: Props) {
  const { t } = useTranslation();
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 600;

  const changePage = (page: number) => () => {
    props.gotoPage(page - 1);
    props.setCurrentPage(page);
  };

  const findPaginationRange = () => {
    // There should be at least 5 page links (first page, last page, current
    //   page, and 2 set of dots).
    const numLinks = props.numPageLinksShown >= 5 ? props.numPageLinksShown : 5;
    // numLinksLeft: Page links between page 1 and the current page links.
    const numLinksLeft = Math.ceil(numLinks / 2) - 2;
    // numLinksRight: Page links between the current and last page links.
    const numLinksRight = numLinks - numLinksLeft - 3;

    // Case 1: If the number of pages is smaller or equal to the number of page
    // links to show, then show all of them.
    if (props.numPages <= numLinks) {
      return Array.from({ length: props.numPages }, (_, i) => i + 1);
    }

    var pages: number[] = new Array(numLinks);
    pages[0] = 1;
    pages[numLinks - 1] = props.numPages;

    // Case 2: No left dots. Right dots needed.
    if (props.currentPage <= 3 || numLinksLeft >= props.currentPage - 2) {
      for (var i = 1; i < numLinks - 2; ++i) {
        pages[i] = i + 1;
      }
      pages[numLinks - 2] = -1; // Dots
      return pages;
    }

    // Case 3: No right dots. Left dots needed.
    if (
      props.currentPage >= props.numPages - 2 ||
      numLinksRight >= props.numPages - props.currentPage - 1
    ) {
      pages[1] = -1; // Dots
      for (var i = 2; i < numLinks - 1; ++i) {
        pages[i] = props.numPages - numLinks + i + 1;
      }
      return pages;
    }

    // Case 4: Both left and right dots needed.
    pages[1] = -1; // Dots
    for (
      var i = 2, page = props.currentPage - numLinksLeft + 1;
      i < numLinks - 2;
      ++i, ++page
    ) {
      pages[i] = page;
    }
    pages[numLinks - 2] = -2; // Dots
    return pages;
  };

  let pages = findPaginationRange();

  useEffect(() => {
    pages = findPaginationRange();
  }, [props]);

  return (
    <div className="paginationRow text-center">
      {props.currentPage > 1 && (
        <div className="moveDirection margin-right-3">
          <span
            onClick={changePage(props.currentPage - 1)}
            aria-label={t("GoToPrevPage")}
          >
            <FontAwesomeIcon className="margin-right-1" icon={faAngleLeft} />
          </span>
          {!isMobile && (
            <span
              onClick={changePage(props.currentPage - 1)}
              aria-label={t("GoToPrevPage")}
            >
              {t("Pagination.Previous")}
            </span>
          )}
        </div>
      )}

      {pages.map((page) => {
        return page > -1 ? (
          <Button
            variant={props.currentPage === page ? "base" : "outline"}
            onClick={changePage(page)}
            onKeyDown={changePage(page)}
            key={page}
            aria-label={t("Pagination.GoToPage", {
              page: page,
            })}
          >
            {page}
          </Button>
        ) : (
          <div className="margin-right-1" key={`dots ${page}`}>
            &thinsp; &#8230; &thinsp;
          </div>
        );
      })}

      {props.currentPage < props.numPages && (
        <div className="moveDirection margin-left-3">
          {!isMobile && (
            <span
              onClick={changePage(props.currentPage + 1)}
              aria-label={t("GoToNextPage")}
            >
              {t("Pagination.Next")}
            </span>
          )}
          <span
            onClick={changePage(props.currentPage + 1)}
            aria-label={t("GoToNextPage")}
          >
            <FontAwesomeIcon className="margin-left-1" icon={faAngleRight} />
          </span>
        </div>
      )}
    </div>
  );
}

export default Pagination;
