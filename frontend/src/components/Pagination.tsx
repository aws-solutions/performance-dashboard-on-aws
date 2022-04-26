import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
    <div className="pagination margin-right-2 margin-left-2 text-center">
      {props.currentPage > 1 && (
        <div
          className="prevNextItem margin-right-2"
          onClick={changePage(props.currentPage - 1)}
          aria-label={t("GoToPrevPage")}
        >
          &lt; &thinsp; {t("Pagination.Previous")}
        </div>
      )}

      {pages.map((page) => {
        return page > -1 ? (
          <div
            className={`paginationItem ${
              props.currentPage === page ? "current" : ""
            }`}
            onClick={changePage(page)}
            key={page}
            aria-label={t("Pagination.GoToPage", {
              page: page,
            })}
          >
            {page}
          </div>
        ) : (
          <div className="dots" key={`dots ${page}`}>
            &thinsp; &#8230; &thinsp;
          </div>
        );
      })}

      {props.currentPage < props.numPages && (
        <div
          className="prevNextItem margin-left-2"
          onClick={changePage(props.currentPage + 1)}
          aria-label={t("GoToNextPage")}
        >
          {t("Pagination.Next")} &thinsp; &gt;
        </div>
      )}
    </div>
  );
}

export default Pagination;
