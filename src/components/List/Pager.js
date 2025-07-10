import * as React from "react";
import CONSTANT from "../Global";
function Pagination(props) {
  
  const { currentPage, maxPageLimit, minPageLimit } = props;
  const pageNumberLimit = CONSTANT.PAGENUMBERLIMIT;
  //const totalPages = props.totalPages;
  const totalPages = Math.ceil(props.totalPages);
  // build page numbers list based on total number of pages
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const handlePrevClick = () => {
    props.onPrevClick();
  };

  const handleNextClick = () => {
    props.onNextClick();
  };

  const handleFirstClick = () => {
    props.onFirstClick();
  };

  const handleLastClick = () => {
    props.onLastClick();
  };

  const handlePageClick = (e) => {
    e.preventDefault();
    props.onPageChange(Number(e.target.id));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (currentPage === 1) {
      // Display the first three pages if the current page is 1
      for (let i = 1; i <= Math.min(3, totalPages); i++) {
        pageNumbers.push(
          <a
            href="#"
            onClick={handlePageClick}
            key={i}
            id={i}
            className={currentPage === i ? "current" : ""}
          >
            {i}
          </a>
        );
      }

      if (totalPages > 3) {
        pageNumbers.push(<span key="start-ellipsis">...</span>);
        pageNumbers.push(
          <a
            href="#"
            onClick={handlePageClick}
            key={totalPages}
            id={totalPages}
            className={currentPage === totalPages ? "current" : ""}
          >
            {totalPages}
          </a>
        );
      }
    } else {
      // Render the first page
      pageNumbers.push(
        <a
          href="#"
          onClick={handlePageClick}
          key={1}
          id={1}
          className={currentPage === 1 ? "current" : ""}
        >
          1
        </a>
      );

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      if (startPage > 2) {
        pageNumbers.push(<span key="start-ellipsis">...</span>);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <a
            href="#"
            onClick={handlePageClick}
            key={i}
            id={i}
            className={currentPage === i ? "current" : ""}
          >
            {i}
          </a>
        );
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="end-ellipsis">...</span>);
      }

      // Render the last page
      if (totalPages > 1) {
        pageNumbers.push(
          <a
            href="#"
            onClick={handlePageClick}
            key={totalPages}
            id={totalPages}
            className={currentPage === totalPages ? "current" : ""}
          >
            {totalPages}
          </a>
        );
      }
    }

    // if (totalPages <= pageNumberLimit) {
    //   for (let i = 1; i <= totalPages; i++) {
    //     pageNumbers.push(
    //       <a
    //         href="#"
    //         onClick={handlePageClick}
    //         key={i}
    //         id={i}
    //         className={currentPage === i ? "current" : ""}
    //       >
    //         {i}
    //       </a>
    //     );
    //   }
    // } else {
    //   // Show first two pages, last two pages, and pages around the current page
    //   if (currentPage > 2) {
    //     pageNumbers.push(
    //       <a
    //         href="#"
    //         onClick={handlePageClick}
    //         key={1}
    //         id={1}
    //         className={currentPage === 1 ? "current" : ""}
    //       >
    //         1
    //       </a>
    //     );
    //     if (currentPage > 3) {
    //       pageNumbers.push(<span key="start-ellipsis">...</span>);
    //     }
    //   }

    //   const startPage = Math.max(2, currentPage - 1);
    //   const endPage = Math.min(totalPages - 1, currentPage + 1);

    //   for (let i = startPage; i <= endPage; i++) {
    //     pageNumbers.push(
    //       <a
    //         href="#"
    //         onClick={handlePageClick}
    //         key={i}
    //         id={i}
    //         className={currentPage === i ? "current" : ""}
    //       >
    //         {i}
    //       </a>
    //     );
    //   }

    //   if (currentPage < totalPages - 2) {
    //     if (currentPage < totalPages - 3) {
    //       pageNumbers.push(<span key="end-ellipsis">...</span>);
    //     }
    //     pageNumbers.push(
    //       <a
    //         href="#"
    //         onClick={handlePageClick}
    //         key={totalPages}
    //         id={totalPages}
    //         className={currentPage === totalPages ? "current" : ""}
    //       >
    //         {totalPages}
    //       </a>
    //     );
    //   }
    // }
    return pageNumbers;
  };
  
  // const pageNumbers = pages.map((page) => {
  //   if (page <= maxPageLimit && page > minPageLimit) {
  //     return (
  //       // <li
  //       //   key={page}
  //       //   id={page}
  //       //   onClick={handlePageClick}
  //       //   className={currentPage === page ? "page-item active" : "page-item"}
  //       // >
  //       //   <a className="page-link" href="#" id={page}>
  //       //     {page}
  //       //   </a>
  //       // </li>

  //       <a
  //         href="#"
  //         onClick={handlePageClick}
  //         key={page}
  //         id={page}
  //         className={currentPage === page ? "current" : ""}
  //       >
  //         {page}
  //       </a>
  //     );
  //   } else {
  //     return null;
  //   }
  // });

  // page ellipses
  let pageIncrementEllipses = null;
  if (pages.length > maxPageLimit) {
    pageIncrementEllipses = <li onClick={handleNextClick}>&hellip;</li>;
  }
  if (pages.length > maxPageLimit) {
    pageIncrementEllipses = <li onClick={handleLastClick}>&hellip;</li>;
  }
  let pageDecremenEllipses = null;
  if (minPageLimit >= 1) {
    pageDecremenEllipses = <li onClick={handlePrevClick}>&hellip;</li>;
  }
  if (minPageLimit >= 1) {
    pageDecremenEllipses = <li onClick={handleFirstClick}>&hellip;</li>;
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between  pb-2">
        <div className="d-flex">
          <button
            className={
              currentPage === pages[0]
                ? "btn btn-primary-trans disabled me-2"
                : "btn btn-primary-trans me-2"
            }
          >
            <i className="arrowIcon arrowLeft"></i>
            <span onClick={handleFirstClick}>Eerste pagina</span>
          </button>
          <button
            className={
              currentPage === pages[0]
                ? "btn btn-primary-trans disabled me-2"
                : "btn btn-primary-trans me-2"
            }
          >
            <i className="arrowIcon arrowLeft"></i>
            <span onClick={handlePrevClick}>Vorige pagina</span>
          </button>
        </div>

        <div className="d-flex pagination">{renderPageNumbers()}</div>

        <div className="d-flex">
          <button
            className={
              currentPage === Math.ceil(pages[pages.length - 1])
                ? "btn btn-primary-trans disabled me-2"
                : "btn btn-primary-trans me-2"
            }
          >
            <span onClick={handleNextClick} >Volgende pagina</span>
            <i className="arrowIcon"></i>
          </button>
          <button
            className={
              currentPage === Math.ceil(pages[pages.length - 1])
                ? "btn btn-primary-trans disabled me-2"
                : "btn btn-primary-trans me-2"
            }
          >
            <span onClick={handleLastClick} >Laatste pagina</span>
            <i className="arrowIcon"></i>
          </button>
        </div>
      </div>
      {/* <div className="bootstrap-pagination">
      <p className="float-left">
      Items {props.startIndex + 1} tot {props.endIndex + 1} van{" "}
        {props.totalRecords} 
      </p>
      <nav>
        <ul className="pagination justify-content-end">
          <li
            className={
              currentPage === pages[0] ? "page-item disabled" : "page-item "
            }
          >
            <a onClick={handlePrevClick} className="page-link" tabIndex={-1} style={{cursor:"pointer"}}>
            Vorige 
            </a>
          </li>
          {pageNumbers}
          <li
            className={
              currentPage === pages[pages.length - 1]
                ? "page-item disabled"
                : "page-item "
            }
          >
            <a onClick={handleNextClick} className="page-link" tabIndex={-1} style={{cursor:"pointer"}}>
            Volgende 
            </a>
          </li>
        </ul>
      </nav>
    </div> */}
    </>
  );
}

export default Pagination;
