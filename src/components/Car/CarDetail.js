import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { postRequest, getUrl, getRequest } from "../ApiCalls";
import CONSTANT from "../Global";
import DataLoader from "../Loader";
import CarTodoTab from "../CarDetailTabs/CarTodoTab";
import CarStatusTab from "../CarDetailTabs/CarStatusTab";
import { encryptData, decryptData } from "../EncrypDecryptData";
import { Navigate, useNavigate } from "react-router";
import Slider from "react-slick";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css"; // Import thumbnails plugin styles
import { Thumbnails } from "yet-another-react-lightbox/plugins"; // Import the Thumbnails plugin
import Captions from "yet-another-react-lightbox/plugins/captions";

import "yet-another-react-lightbox/plugins/captions.css";


function CarDetail(props) {
  const history = useNavigate();
  const [CarId, setCarId] = React.useState(0);
  const [Car, setCar] = React.useState({});
  const [CarProperties, setCarProperties] = React.useState({});
  const [CarImages, setCarImages] = React.useState([]);
  const [CarDetails, setCarDetails] = React.useState("");
  const [isLoading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [slides, setSlides] = React.useState([]);
  const [selectedImg, setSelectedImg] = React.useState();
  const [selectedImgIndex, setSelectedImgIndex] = React.useState();


  React.useEffect(() => {
    fn_SetCarDetails();
  }, []);

  const fn_SetCarDetails = async () => {
    const params = new URLSearchParams(window.location.search);
    const queryParamsObject = {};
    for (const [key, value] of params) {
      queryParamsObject[key] = value;
    }
    let id = queryParamsObject["Id"];
    id = id.replaceAll(" ", "+");
    let DecryptedId = decryptData(id);
    setCarId(DecryptedId);

    setLoading(true);
    await getRequest({
      requesturl: getUrl() + `/Car/GetCarById?CarId=` + DecryptedId,
    }).then((res) => {

      if (res.status == 401) {
        history("/");
      }
      else if (res) {
        setCar(res.model);
        setCarDetails(res.model.formatedKenteken + " " + res.model.carDetail);
      }
      setLoading(false);
    });

    await getRequest({
      requesturl: getUrl() + `/Car/FindCarProperties?CarId=` + DecryptedId,
    }).then((res) => {
      if (res.status == 401) {
        history("/");
      }
      else if (res) {
        setCarProperties(res.model);
      }
      setLoading(false);
    });

    await getRequest({
      requesturl: getUrl() + `/Car/GetCarImages?CarId=` + DecryptedId + `&ImageType=1`,
    }).then((res) => {
      if (res.status == 401) {
        history("/");
      }
      else if (res) {
        res.list.map((item) => {
          item.imageFilePath = item.imageFilePath.replaceAll("\\", "/");
        })
        setCarImages(res.list);
      }
      setLoading(false);
    });
  }
  var settings = {
    //dots: true,
    infinite: false,
    //speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    draggable: false,
    arrows: false
  };
  const handleOpenLightbox = (path, index) => {
    console.log('Muk' + CarImages)
    setSelectedImg(path);
    setSelectedImgIndex(index)
    console.log(path)
    setOpen(true);
    const slidesArray = CarImages.map((img) => ({ src: CONSTANT.IMAGE_URL + img.imageFilePath })); // Convert image array to slide objects
    if(slidesArray.length === 0)
    {setSlides(
      [
        { "src": "images/car-1.jpg" },
        { "src": "images/car-1.jpg" },
        { "src": "images/car-1.jpg" },   
        { "src": "images/car-1.jpg" },
        { "src": "images/car-1.jpg" },
        { "src": "images/car-1.jpg" },   
        { "src": "images/car-1.jpg" },
        { "src": "images/car-1.jpg" }
      ])
    }
    else{
      setSlides(slidesArray);
    }
  };


  return isLoading ? (
    <React.Fragment>
      <DataLoader />
    </React.Fragment>
  ) : (
    <React.Fragment>
      <div className="wrapper">
        <div className="container">
          <div className="text-white bg-primary d-flex align-items-center rounded-2 titleBox">
            <h1 className="mb-0 me-5">{Car.brandName + " " + Car.modelName + " " + CarProperties.carType}</h1>
            <div className="numberPlate me-3">
              <span title={CarId}>{Car.formatedKenteken}</span>
            </div>
            <div className="para">{Car.carDetail}</div>
          </div>
        </div>
        <section className="midSec">
          <div className="container">
            <div className="d-flex flex-wrap justify-content-between mb-4 pb-3">
              <div className="bg-lightgray rounded-1 min-w-137px d-flex align-items-start flex-column px-13px h-116px justify-content-center">
                <div className="position-relative lh-1 mb-3">
                  <a
                    href=""
                    className="d-inline-flex align-items-center text-decoration-none border-bottom border-primary h-20px"
                  >
                    <i className="min-w-20px min-h-20px me-2 position-relative editIcon"></i>
                    <span className="para">Wijzig</span>
                  </a>
                </div>
                <div className="lh-1 mb-3">
                  <a
                    href=""
                    className="d-inline-flex align-items-center text-decoration-none border-bottom border-primary h-20px"
                  >
                    <i className="min-w-20px min-h-20px me-2 position-relative descrIcon"></i>
                    <span className="para">Koperrapport</span>
                  </a>
                </div>
                <div className="lh-1">
                  <a
                    href=""
                    className="d-inline-flex align-items-center text-decoration-none border-bottom border-primary h-20px"
                  >
                    <i className="min-w-20px min-h-20px me-2 position-relative descrIcon"></i>
                    <span className="para">Autorapport</span>
                  </a>
                </div>
              </div>
              <div className="flex-fill w-100 mw-845px">
                <div id="carSlider" className="carSlider">
                  <Slider {...settings}>
                    {CarImages.length > 0 ?

                      CarImages.map((element, index) => (
                        <div>
                          <span className="imgWrapper" >
                            <img
                              src={CONSTANT.IMAGE_URL + element.imageFilePath}
                              alt=""
                              className="object-cover w-100 h-100 rounded-1"
                              onClick={() => handleOpenLightbox((CONSTANT.IMAGE_URL + element.imageFilePath), index)}
                            />
                          </span>
                        </div>
                      ))
                      :
                      Array.from(
                        { length: 8 },
                        (_, i) => (
                          <div>
                            <span className="imgWrapper">
                              <img
                                src="images/car-1.jpg"
                                alt=""
                                className="object-cover w-100 h-100 rounded-1"
                                //onClick={() => setOpen(true)}
                                onClick={() => handleOpenLightbox("",i)}
                              />
                            </span>
                          </div>
                        )
                      )


                    }
                  </Slider>
                </div>
              </div>
            </div>
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link"
                  id="nav-basis-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-basis"
                  type="button"
                  role="tab"
                  aria-controls="nav-basis"
                  aria-selected="true"
                >
                  Basis
                </button>
                <button
                  className="nav-link"
                  id="nav-eigenaar-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-eigenaar"
                  type="button"
                  role="tab"
                  aria-controls="nav-eigenaar"
                  aria-selected="false"
                >
                  Eigenaar
                </button>
                <button
                  className="nav-link"
                  id="nav-entry-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-entry"
                  type="button"
                  role="tab"
                  aria-controls="nav-entry"
                  aria-selected="false"
                >
                  Entry
                </button>
                <button
                  className="nav-link"
                  id="nav-techniek-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-techniek"
                  type="button"
                  role="tab"
                  aria-controls="nav-techniek"
                  aria-selected="false"
                >
                  Techniek
                </button>
                <button
                  className="nav-link"
                  id="nav-carrosserie-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-carrosserie"
                  type="button"
                  role="tab"
                  aria-controls="nav-carrosserie"
                  aria-selected="false"
                >
                  Carrosserie
                </button>
                <button
                  className="nav-link"
                  id="nav-logistiek-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-logistiek"
                  type="button"
                  role="tab"
                  aria-controls="nav-logistiek"
                  aria-selected="false"
                >
                  Logistiek
                </button>
                <button
                  className="nav-link"
                  id="nav-status-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-status"
                  type="button"
                  role="tab"
                  aria-controls="nav-status"
                  aria-selected="false"
                >
                  Status
                </button>
                <button
                  className="nav-link active"
                  id="nav-todo-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-todo"
                  type="button"
                  role="tab"
                  aria-controls="nav-todo"
                  aria-selected="false"
                >
                  To do
                </button>
                <button
                  className="nav-link"
                  id="nav-verkoop-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-verkoop"
                  type="button"
                  role="tab"
                  aria-controls="nav-verkoop"
                  aria-selected="false"
                >
                  Verkoop
                </button>
                <button
                  className="nav-link"
                  id="nav-financieel-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-financieel"
                  type="button"
                  role="tab"
                  aria-controls="nav-financieel"
                  aria-selected="false"
                >
                  Financieel
                </button>
                <button
                  className="nav-link"
                  id="nav-kentekens-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-kentekens"
                  type="button"
                  role="tab"
                  aria-controls="nav-kentekens"
                  aria-selected="false"
                >
                  Kentekens
                </button>
                <button
                  className="nav-link"
                  id="nav-memo-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-memo"
                  type="button"
                  role="tab"
                  aria-controls="nav-memo"
                  aria-selected="false"
                >
                  Memo
                </button>
                <button
                  className="nav-link"
                  id="nav-klacht-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-klacht"
                  type="button"
                  role="tab"
                  aria-controls="nav-klacht"
                  aria-selected="false"
                >
                  Klacht
                </button>
                <button
                  className="nav-link"
                  id="nav-documenten-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-documenten"
                  type="button"
                  role="tab"
                  aria-controls="nav-documenten"
                  aria-selected="false"
                >
                  Documenten
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade"
                id="nav-basis"
                role="tabpanel"
                aria-labelledby="nav-basis-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
              <div
                className="tab-pane fade"
                id="nav-eigenaar"
                role="tabpanel"
                aria-labelledby="nav-eigenaar-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
              <div
                className="tab-pane fade"
                id="nav-entry"
                role="tabpanel"
                aria-labelledby="nav-entry-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
              <div
                className="tab-pane fade"
                id="nav-techniek"
                role="tabpanel"
                aria-labelledby="nav-techniek-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
              <div
                className="tab-pane fade"
                id="nav-carrosserie"
                role="tabpanel"
                aria-labelledby="nav-carrosserie-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
              <div
                className="tab-pane fade"
                id="nav-logistiek"
                role="tabpanel"
                aria-labelledby="nav-logistiek-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
              <div
                className="tab-pane fade"
                id="nav-status"
                role="tabpanel"
                aria-labelledby="nav-status-tab"
              >
                <CarStatusTab car={Car} />
              </div>
              <div
                className="tab-pane fade show active"
                id="nav-todo"
                role="tabpanel"
                aria-labelledby="nav-todo-tab"
              >
                <CarTodoTab car={Car} carProperties={CarProperties} />
              </div>
              <div
                className="tab-pane fade"
                id="nav-verkoop"
                role="tabpanel"
                aria-labelledby="nav-verkoop-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
              <div
                className="tab-pane fade"
                id="nav-financieel"
                role="tabpanel"
                aria-labelledby="nav-financieel-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
              <div
                className="tab-pane fade"
                id="nav-kentekens"
                role="tabpanel"
                aria-labelledby="nav-kentekens-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
              <div
                className="tab-pane fade"
                id="nav-memo"
                role="tabpanel"
                aria-labelledby="nav-memo-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
              <div
                className="tab-pane fade"
                id="nav-klacht"
                role="tabpanel"
                aria-labelledby="nav-klacht-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
              <div
                className="tab-pane fade"
                id="nav-documenten"
                role="tabpanel"
                aria-labelledby="nav-documenten-tab"
              >
                <p>
                  <strong>Coming Soon...</strong>{" "}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div>
          <div className="image-thumbnails">

          </div>
          {open && (
            <Lightbox
              open={open}
              close={() => setOpen(false)}
              slides={slides && slides.length > 0 ? [
                {
                  ...slides[selectedImgIndex],
                  title: `${Car.formatedKenteken} Foto's ${(selectedImgIndex + 1)} / ${slides.length}`,
                },
                ...slides
                  .map((slide, index) => {
                    if (index === selectedImgIndex) return null;
                    return {
                      ...slide,
                      title: `${Car.formatedKenteken} Foto's ${(
                        index > selectedImgIndex
                          ? index + 1
                          : index == selectedImgIndex
                            ? index + 2
                            : index + 1
                      )} / ${slides.length}`,
                    };
                  })
                  .filter(slide => slide !== null) // Remove the 'null' entry (which was the specific image)
              ] : [
                {
                  src: "images/car-1.jpg",
                  title: `${Car.formatedKenteken} Foto's ${(selectedImgIndex + 1)} / 8`,
                },
                {
                  src: "images/car-1.jpg",
                  title: `${Car.formatedKenteken} Foto's ${(selectedImgIndex + 1)} / 8`,
                },
                {
                  src: "images/car-1.jpg",
                  title: `${Car.formatedKenteken} Foto's ${(selectedImgIndex + 1)} / 8`,
                },
                {
                  src: "images/car-1.jpg",
                  title: `${Car.formatedKenteken} Foto's ${(selectedImgIndex + 1)} / 8`,
                }
              ]}
              plugins={[Captions, Thumbnails]}
              //plugins={[Captions]}

              thumbnails={{ show: true }}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default CarDetail;
