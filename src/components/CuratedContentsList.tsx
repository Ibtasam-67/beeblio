import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  createRef,
  FC,
} from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import "./CuratedContentList.scss";
import axios from "axios";
// import OwlCarousel from 'react-owl-carousel';
import { FilterContext } from "../context/filter/FilterContextProvider";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { authAxios } from "../api/authApi";
import Spinner from "../assets/images/spinner.svg";
import Slider from "react-slick";
import useFullPageLoader from "../hooks/FullPageLoader";
import { AlertContext } from "../context/alert/AlertContextProvider";
import { Event, SetDimension, InitAndPageViewGA } from "../components/Tracking";
import Subscription from "./Dashboard/Subscriptions/Index";
import PaymentCard from "./PaymentCard";
import ReactGA from "react-ga";

interface IProps {
  selectedSub: any;
  setSelectedSub: any;
  cardDetails: any;
  setCardDetails: any;
  handleCardInfo: any;
  modal: any;
  setModal: any;
  isAdded: any;
  setIsAdded: any;
  paymentInfos: any;
  activeTab: any;
  setActiveTab: any;
}

const CuratedContentsList: FC<IProps> = ({
  selectedSub,
  setSelectedSub,
  cardDetails,
  setCardDetails,
  handleCardInfo,
  modal,
  setModal,
  isAdded,
  setIsAdded,
  paymentInfos,
  activeTab,
  setActiveTab,
}) => {
  const filterContext = useContext(FilterContext);
  const longestModalTitle = 30;
  const [contents, setContents] = useState([]);
  // const [owlState, setOwlState] = useState({ options: {} })
  const [activeTab1, setActiveTab1] = useState("1");
  const [modalTitle, setModalTitle] = useState("");
  const [modall, setModall] = useState(false);
  const [rssFeeds, setRssFeeds] = useState([]);
  const [curatedContentType, setCuratedContentType] = useState("newspaper");
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(20);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const alertContext = useContext(AlertContext);
  const [lastPage, setLastPage] = useState(false);

  const fetchData = async () => {
    const result = await axios(
      `${process.env.REACT_APP_BASE_URL}/curated-contents?curatedContentType=${curatedContentType}&offset=${offset}&limit=${limit}&fields=id,type,url,contentType,contentHash,curatedContentType,mainGenres,subGenres,name,summary,country,sourceLink,contentLink,referenceImageLink,publicationDate,establishmentDate,rssFeeds,isbn,authors,publisher,serialNb,rate,isPremium`
    );
    if (
      result.data.content.length === 0 ||
      result.data.content.length < limit
    ) {
      setLastPage(true);
    }
    const contentsResult: any = [...contents, ...result.data.content];
    setContents(contentsResult);
  };

  useEffect(() => {
    fetchData();
  }, [curatedContentType, offset]);

  const toggle = (tab: any) => {
    if (activeTab1 !== tab) setActiveTab1(tab);
    setContents([]);
    setOffset(0);
    setCurrentSlide(0);
    switch (tab) {
      case "1":
        setCuratedContentType("newspaper");
        break;
      case "2":
        setCuratedContentType("magazine");
        break;
      case "3":
        setCuratedContentType("book");
        break;
      case "4":
        setCuratedContentType("other");
        break;
      default:
        break;
    }
  };

  const extractDisplayValues = (values: any) => {
    const resultMap: any = {};

    const subtitleLength = 25;
    const nameLength = 18;
    let subtitle = "";
    let name = "";
    let tooltipTitle = values.name;

    if (values.name.length > nameLength) {
      name = values.name.substring(0, nameLength - 3) + "...";
    } else {
      name = values.name;
    }

    if (values.curated_content_type == "BOOK") {
      if (values.authors.length > subtitleLength) {
        subtitle = values.authors.substring(0, subtitleLength - 3) + "...";
      } else {
        subtitle = values.authors;
      }
      tooltipTitle = tooltipTitle + "\n Authors: " + values.authors;
    } else {
      if (values.publisher.length > subtitleLength) {
        subtitle = values.publisher.substring(0, subtitleLength - 3) + "...";
      } else {
        subtitle = values.publisher;
      }
      tooltipTitle = tooltipTitle + "\n Publisher: " + values.publisher;
    }
    if (values.country) {
      tooltipTitle = tooltipTitle + "\n Country: " + values.country;
    }
    if (values.summary) {
      tooltipTitle = tooltipTitle + "\n Summary: " + values.summary;
    }
    resultMap.name = name;
    resultMap.subtitle = subtitle;
    resultMap.tooltipTitle = tooltipTitle;

    return resultMap;
  };

  const modalToggle = () => setModall(!modall);

  const handleContentClick = (res: any) => {
    if (res.rssFeeds && res.rssFeeds.length > 0) {
      Event(
        "CuratedContent",
        "Clicked On Curated Content",
        "Clicked On Feed-based Curated Content with Id: " + res.id
      );

      const fn: any = showLoader;
      fn();
      res.rssFeeds.map(async (feed: string) => {
        try {
          const result = await authAxios.get(
            `${process.env.REACT_APP_BASE_URL}/filter/rss-feeds`,
            { params: { rssFeedUrl: feed } }
          );

          if (result.status == 200 && result.data.rssFeedItems.length > 0) {
            rssFeeds.length = 0;
            setRssFeeds(rssFeeds.concat(result.data.rssFeedItems));
            setModalTitle(result.data.title);
            filterContext.clearResults();
            modalToggle();
          } else {
            if (result.status != 200) {
              alertContext.setWarningAlert(
                "Error contacting the server. Please try a different resource or contact the support team at info@beebl.io"
              );
            } else {
              alertContext.setInfoAlert("RSS feed not found");
            }
          }
          const fn: any = hideLoader;
          fn();
        } catch (error) {
          const fn: any = hideLoader;
          fn();
          alertContext.setWarningAlert(
            "Error contacting the server. Please try a different resource or contact the support team at info@beebl.io"
          );
        }
      });
    } else {
      filterContext.clearResults();
      filterContext.setCuratedContentUrl(res);
      filterContext.curatedContent.id = res.id;
      Event(
        "CuratedContent",
        "Clicked On Curated Content",
        "Clicked On  Feed-less Curated Content with Id:" + res.id
      );
      window.scrollTo(0, 0);
    }
  };

  const nextClick = (e: any) => {
    setCurrentSlide(e);
  };

  useEffect(() => {
    if (!lastPage) {
      if (currentSlide === offset + limit - 5) {
        setOffset((prev) => prev + 20);
      }
    }
  }, [currentSlide]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    centered: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    afterChange: nextClick,
  };

  return (
    <div className="tab style-2 mt-5">
      <Subscription
        changeSub={false}
        selectedSub={selectedSub}
        setSelectedSub={setSelectedSub}
        cardDetails={cardDetails}
        setCardDetails={setCardDetails}
        handleCardInfo={handleCardInfo}
        modal={modal}
        setModal={setModal}
        isAdded={isAdded}
        setIsAdded={setIsAdded}
        paymentInfos={paymentInfos}
        globalUserPaymentAndSubData={null}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <h2 className="text-center">You Can Also Select A Content Below</h2>
      <Nav tabs className="d-flex flex-column flex-sm-row">
        <NavItem>
          <NavLink
            className={classnames(
              { active: activeTab1 === "1" },
              "cursor-pointer"
            )}
            onClick={() => {
              toggle("1");
            }}
          >
            Newspapers
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames(
              { active: activeTab1 === "2" },
              "cursor-pointer"
            )}
            onClick={() => {
              toggle("2");
            }}
          >
            Magazines
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames(
              { active: activeTab1 === "3" },
              "cursor-pointer"
            )}
            onClick={() => {
              toggle("3");
            }}
          >
            Books
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames(
              { active: activeTab1 === "4" },
              "cursor-pointer"
            )}
            onClick={() => {
              toggle("4");
            }}
          >
            Others
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab1={activeTab1}>
        {contents.length === 0 && (
          <div className="d-flex justify-content-center align-items-center">
            <img className="mx-auto text-center" src={Spinner} />
          </div>
        )}
        <TabPane tabId="1" className="mx-2">
          <Slider {...settings}>
            {contents.map(function (res: any, index: number) {
              const displayMap = extractDisplayValues(res);
              return (
                <div className="item" key={res.id}>
                  <div
                    className={
                      "cases-item cursor-pointer px-4 pt-2 " +
                      (index === currentSlide ? "itemActive" : "")
                    }
                    onClick={() => handleContentClick(res)}
                  >
                    <div className="cases-images">
                      <img
                        className="img-fluid mx-auto"
                        src={res.referenceImageLink}
                        alt=""
                        style={{ height: "400px", maxWidth: "300px" }}
                      />
                    </div>
                    <div className="cases-description">
                      <a
                        href="#"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title={displayMap.tooltipTitle}
                      >
                        <h5>{displayMap.name} </h5>
                        <span>{displayMap.subtitle}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </TabPane>

        <TabPane tabId="2">
          <Slider {...settings}>
            {contents.map(function (res: any, index: number) {
              const displayMap = extractDisplayValues(res);

              return (
                <div className="item" key={res.id}>
                  <div
                    className={
                      "cases-item cursor-pointer px-4 pt-2 " +
                      (index === currentSlide ? "itemActive" : "")
                    }
                    onClick={() => handleContentClick(res)}
                  >
                    <div className="cases-images">
                      <img
                        className="img-fluid mx-auto"
                        src={res.referenceImageLink}
                        alt=""
                        style={{ height: "400px", maxWidth: "300px" }}
                      />
                    </div>
                    <div className="cases-description">
                      <a
                        href="#"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title={displayMap.tooltipTitle}
                      >
                        <h5>{displayMap.name} </h5>
                        <span>{displayMap.subtitle}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </TabPane>

        <TabPane tabId="3">
          <Slider {...settings}>
            {contents.map(function (res: any, index: number) {
              const displayMap = extractDisplayValues(res);

              return (
                <div className="item" key={res.id}>
                  <div
                    className={
                      "cases-item cursor-pointer px-4 pt-2 " +
                      (index === currentSlide ? "itemActive" : "")
                    }
                    onClick={() => handleContentClick(res)}
                  >
                    <div className="cases-images">
                      <img
                        className="img-fluid mx-auto"
                        src={res.referenceImageLink}
                        alt=""
                        style={{ height: "400px", maxWidth: "300px" }}
                      />
                    </div>
                    <div className="cases-description">
                      <a
                        href="#"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title={displayMap.tooltipTitle}
                      >
                        <h5>{displayMap.name} </h5>
                        <span>{displayMap.subtitle}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </TabPane>

        <TabPane tabId="4">
          <Slider {...settings}>
            {contents.map(function (res: any, index: number) {
              const displayMap = extractDisplayValues(res);

              return (
                <div className="item" key={res.id}>
                  <div
                    className={
                      "cases-item cursor-pointer px-4 pt-2 " +
                      (index === currentSlide ? "itemActive" : "")
                    }
                    onClick={() => handleContentClick(res)}
                  >
                    <div className="cases-images">
                      <img
                        className="img-fluid mx-auto"
                        src={res.referenceImageLink}
                        alt=""
                        style={{ height: "400px", maxWidth: "300px" }}
                      />
                    </div>
                    <div className="cases-description">
                      <a
                        href="#"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title={displayMap.tooltipTitle}
                      >
                        <h5>{displayMap.name} </h5>
                        <span>{displayMap.subtitle}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </TabPane>
      </TabContent>

      <Modal
        className={"maxHeight"}
        isOpen={modall}
        toggle={modalToggle}
        centered={true}
        size={"lg"}
        scrollable={true}
        style={{ top: "15%" }}
      >
        <ModalHeader toggle={modalToggle} className="m-2 p-2">
          {" "}
          <p
            className="m-0 p-0"
            data-toggle="tooltip"
            data-placement="bottom"
            title={modalTitle}
          >
            {modalTitle && modalTitle.length > longestModalTitle
              ? modalTitle.substring(0, longestModalTitle) + "..."
              : modalTitle}
          </p>{" "}
          <p className="m-0 p-0" style={{ fontSize: "70%", display: "inline" }}>
            Select an article to filter the words.
          </p>
        </ModalHeader>
        <ModalBody>
          {rssFeeds.map((feedItem: any, index: number) => {
            return (
              <div
                className="mx-2 mx-sm-4"
                key={index}
                onClick={() => {
                  handleContentClick(feedItem);
                  modalToggle();
                  Event(
                    "CuratedContent",
                    "Clicked On FeedItem",
                    "Clicked On FeedItem: " + feedItem.link
                  );
                }}
              >
                <p className="rssItem mb-0 pb-0" style={{ cursor: "alias" }}>
                  {feedItem.title}

                  <span
                    className=""
                    style={{ display: "block", fontSize: "75%" }}
                  >
                    <ReactGA.OutboundLink
                      to={feedItem.link}
                      eventLabel="External"
                      target="_blank"
                    >
                      <a>Read Full Content</a>
                    </ReactGA.OutboundLink>
                  </span>
                </p>
              </div>
            );
          })}
        </ModalBody>
      </Modal>
      {loader}
    </div>
  );
};

export default CuratedContentsList;
