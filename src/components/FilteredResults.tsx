import React, {
  useContext,
  useState,
  Fragment,
  useEffect,
  useRef,
} from "react";
import { FilterContext } from "../context/filter/FilterContextProvider";
import classnames from "classnames";
import "./FilteredResults.scss";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
} from "reactstrap";
import { useHistory, useLocation, Link, useRouteMatch } from "react-router-dom";
import { authAxios } from "../api/authApi";
import { AlertContext } from "../context/alert/AlertContextProvider";
import useFullPageLoader from "../hooks/FullPageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faVolumeUp,
  faSpinner,
  faTimes,
  faBook,
  faFileAudio,
} from "@fortawesome/free-solid-svg-icons";
import { Event, SetDimension, InitAndPageViewGA } from "../components/Tracking";

const FilteredResults = () => {
  const filterContext = useContext(FilterContext);
  let filterdResults = filterContext.filteredResults;
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const [accent, setAccent] = useState("Joanna_English_US");
  const [filterHasRun, setFilterHasRun] = useState(false);

  const resultRef: any = useRef(null);
  const match = useRouteMatch();
  const { pathname } = useLocation();

  useEffect(() => {
    if (filterdResults.length > 0 && resultRef && resultRef.current) {
      setTimeout(() => {
        window.scrollTo(0, resultRef.current.offsetTop);
      }, 1000);
    }
  }, [filterdResults]);

  useEffect(() => {
    const temp: any = localStorage.getItem("filteredResults");
    const tempSearch: any = localStorage.getItem("searchedFilterCriteria");
    const tempCollection: any = localStorage.getItem(
      "collectionFilterCriteria"
    );

    if (temp && !tempSearch && !tempCollection) {
      filterContext.setResults(JSON.parse(temp));
      setFilterHasRun(true);
    }
  }, []);

  const longestWordCharCount = 12;
  const [meaning, setMeaning] = useState([""]);
  const [lines, setLines] = useState([]);
  const [filteredLines, setFilteredLines] = useState([]);
  const [sentencesToSave, setSentencesToSave] = useState([] as any);
  const [selectedWord, setSelectedWord] = useState("");
  const [likedWord, setLikedWord] = useState("");
  const [playing, setPlaying] = useState(false);
  const audioRef: any = useRef(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const currentUserToken =
    localStorage.getItem("currentUserToken") &&
    localStorage.getItem("currentUserToken")?.includes("Bearer");
  const user: any = localStorage.getItem("currentUser");
  const currentUser: any = JSON.parse(user);
  const alertContext = useContext(AlertContext);
  const [displayMsg, setDisplayMsg] = useState(true);

  const [modall, setModall] = useState(false);
  const modalToggle = () => {
    setModall(!modall);
    if (modall) {
      handleModalClose();
    }
  };
  let history = useHistory();

  const handleLikeDislike = (word: string, type: string) => {
    if (type === "like") {
      setLikedWord(encodeURI(word.toLowerCase()));
    }
  };

  const handleReact = async (word: string, type: string, message: string) => {
    const body = {
      domain: "WORD",
      event: type === "like" ? "LIKE" : "UNLIKE",
      word: word,
    };

    try {
      /*        
            const result = await authAxios.post(`${process.env.REACT_APP_BASE_URL}/event`, body);
*/
      if (message) {
        alertContext.setSuccessAlert(message);
        const hideFn: any = hideLoader;
        hideFn();
      } else {
        alertContext.setSuccessAlert(
          type === "like"
            ? "The action was successfully completed"
            : "The action was successfully completed"
        );
        const hideFn: any = hideLoader;
        hideFn();
      }
    } catch (error) {
      const { response } = error;
      alertContext.setErrorAlert(response.data.message);
    }
  };

  const handleWordReact = async (word: string, type: string) => {
    if (currentUserToken) {
      const fn: any = showLoader;
      fn();
      const result = await authAxios.get(
        `${process.env.REACT_APP_BASE_URL}/user/statistics`
      );
      if (+result.data.totalWordCollected < 6) {
        handleReact(
          word,
          type,
          "To review all the words you like, go to Settings"
        );
        //alertContext.setWarningAlert('To review all the words you like, go to Settings')
      } else {
        handleReact(word, type, "");
      }
    } else {
      setMeaning([]);
      setLines([]);
      setFilteredLines([]);
      setTimeout(() => {
        modalToggle();
      }, 100);
    }
  };

  const handleModalSignUp = () => {
    // filterContext.clearResults();
    window.scrollTo(0, -100);
    modalToggle();
    history.push("/auth");
  };

  const handleMeaning = async (word: string) => {
    const url = `/meaning?w=` + word;
    window.open(url);
  };

  const handleReference = async (word: string) => {
    const fn: any = showLoader;
    fn();
    setSelectedWord(encodeURI(word.toLowerCase()));
    document.addEventListener("keydown", escFunction, false);
  };

  const fetchLinesOfWord = async (word: string) => {
    let filterCriteria = null;
    const history = localStorage.getItem("filterCriteria");
    if (history !== null) {
      filterCriteria = JSON.parse(history);
      try {
        const queryParams = {
          contentId: filterCriteria.contentId,
          filterLimit: filterCriteria.filterLimit,
          sorting: filterCriteria.sorting,
          url: filterCriteria.url,
          selectedFile: filterCriteria.selectedFile,
        };

        const result = await authAxios.get(
          `${process.env.REACT_APP_BASE_URL}/filter/sentences?word=${word}`,
          { params: queryParams }
        );

        if (result.data.length > 0) {
          setLines(result.data);
        } else {
          const fn: any = hideLoader;
          fn();
          alertContext.setWarningAlert(
            "This doesn't appear to be word in the text. It may happen if there was an issue extracting the text from the provided content. Please try another word. If the issue persists, please contact the support team at info@beebl.io"
          );
          setSelectedWord("");
        }
      } catch (error) {
        const fn: any = hideLoader;
        fn();
        alertContext.setErrorAlert("Something went wrong. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (likedWord) {
      fetchLinesOfWord(likedWord);
    }
  }, [likedWord]);

  useEffect(() => {
    if (selectedWord !== "") {
      fetchLinesOfWord(selectedWord);
    }
  }, [selectedWord]);

  const handleAudio = async (line: string, accent: string) => {
    setAudioLoading(true);
    const encodedSentence = encodeURI(line);
    try {
      const result = await authAxios.get(
        `${process.env.REACT_APP_BASE_URL}/filter/audio?sentence=${encodedSentence}&accent=${accent}&word=${selectedWord}`
      );
      setAudioLoading(false);
      audioRef.current.src = result.data;
      audioRef.current.play();
      setPlaying(true);
    } catch (error) {
      alertContext.setErrorAlert("Audio not found");
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    setLines([]);
  }, [filterdResults]);

  const escFunction = (event: any) => {
    if (event.keyCode === 27) {
      handleModalClose();
    }
  };
  useEffect(() => {
    if (lines.length > 0) {
      setFilteredLines(
        lines.filter((line: string) =>
          line.toLowerCase().includes(`${selectedWord}`)
        )
      );
      const fn: any = hideLoader;
      fn();
      modalToggle();
    }
  }, [lines]);

  const handleModalClose = () => {
    // if (playing) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
    // }
    setModall(false);
    setTimeout(() => {
      setMeaning([]);
      setLines([]);
      setFilteredLines([]);
      setSentencesToSave([]);
      setSelectedWord("");
      document.removeEventListener("keydown", escFunction, false);
    }, 100);
  };

  const handleSaveWordWithSentences = async (word: string, type: string) => {
    if (!currentUserToken) {
      setDisplayMsg(!displayMsg);

      setLines([]);
      setMeaning([]);
      return;
    }

    if (filteredLines.length > 0) {
      filteredLines.map((line, index) => {
        if (index < 5) {
          return sentencesToSave.push(line);
        }
      });
    }

    const history = localStorage.getItem("filterCriteria");
    //let filterCriteria = null;
    //if( history != null ){
    let filterCriteria = history != null ? JSON.parse(history) : null;
    //}

    const body = {
      // domain: 'WORD',
      event: "LIKE",
      sentences: sentencesToSave,
      contentId: filterCriteria?.contentId,
      word: word,
    };
    try {
      const statResult = await authAxios.get(
        `${process.env.REACT_APP_BASE_URL}/user/statistics`
      );
      const eventSaveResult = await authAxios.post(
        `${process.env.REACT_APP_BASE_URL}/event`,
        body
      );

      if (+statResult.data.totalWordCollected < 1) {
        handleReact(
          word,
          type,
          "To review all the words you like, go to Settings"
        );
      } else {
        handleReact(word, type, "");
      }
    } catch (error) {
      const { response } = error;
      alertContext.setErrorAlert(response.data.message);
    }
  };

  return (
    <div
      ref={resultRef}
      style={{ display: pathname === `/auth` ? "none" : "block" }}
    >
      <div
        className={classnames(
          { "is-open": filterdResults.length > -1 },
          "c-panel"
        )}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12 ">
              {(filterHasRun || filterdResults.length > 0) && (
                <h2
                  className="text-center pb-5 pt-5"
                  style={{ paddingBottom: "0 !important" }}
                >
                  Filtered Result
                </h2>
              )}

              <div
                className={classnames(
                  { filteredResults: filterdResults.length > 0 },
                  ""
                )}
              >
                {filterdResults.map((result: any, index: number) => {
                  const times =
                    result.number > 1 ? result.number + " times " : "once";
                  return (
                    <div
                      className="d-flex flex-column justify-content-between item"
                      key={index}
                    >
                      <div className="justify-content-between flex-wrap">
                        <p
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title={result.word}
                          className="font-weight-bold h5 filteredWord"
                          style={{ textAlign: "center" }}
                        >
                          {result.word &&
                          result.word.length > longestWordCharCount + 3
                            ? result.word.substring(0, longestWordCharCount) +
                              "..."
                            : result.word}{" "}
                        </p>
                        <p style={{ textAlign: "center", fontSize: "12px" }}>
                          ( {result.number} )
                        </p>
                      </div>

                      <p style={{ textAlign: "center" }}>
                        <div className="ml-2" style={{ textAlign: "center" }}>
                          <button
                            className="text-primary pr-2 cursor-pointer filterButton"
                            onClick={() => {
                              handleMeaning(result.word);
                              Event(
                                "FilteredResult",
                                "Clicked on Dictionary Link ",
                                "Clicked on Dictionary Link From Result List for:" +
                                  result.word
                              );
                            }}
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Open the dictionary definition"
                          >
                            <FontAwesomeIcon
                              style={{ fontSize: "24px" }}
                              className="cursor-pointer pr-1 indigo"
                              icon={faBook}
                            />
                            Dictionary
                          </button>
                        </div>

                        <div className="ml-2" style={{ textAlign: "center" }}>
                          <button
                            className="text-primary pr-2 cursor-pointer filterButton"
                            onClick={() => {
                              handleReference(result.word);
                              Event(
                                "FilteredResult",
                                "Clicked on Details Link ",
                                "Clicked on Details Link From Result List for:" +
                                  result.word
                              );
                            }}
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Learn more about the word"
                          >
                            <FontAwesomeIcon
                              style={{ fontSize: "26px" }}
                              className="far cursor-pointer pr-1 indigo"
                              icon={faFileAudio}
                            />
                            Read, Listen & Save
                            {/*
                                                    <button className="react filterButton" onClick={() => { handleLikeDislike(result.word, 'like') }}>
                                                        <FontAwesomeIcon style={{ fontSize: '24px' }} className="cursor-pointer pr-1 indigo" icon={faThumbsUp} />
                                                    </button>
                                                */}
                          </button>
                        </div>
                      </p>
                      {/*
                                            <div className="justify-content-between flex-wrap">
                                                
                                                <p className="filteredWord" style={{ textAlign: 'center' , fontSize: 'x-small'}}>(occurs {times} in this text)</p>

                                                
                                            </div>
                                            */}
                      {/* <span className="text-secondary text-muted iterationNumber ">Number of iteration: {result.number}</span> */}
                    </div>
                  );
                })}
                {filterdResults.length == 0 && filterHasRun && (
                  <div>
                    <p className="pt-4 text-info lead text-center">
                      No Word Found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Modal
          className={"maxHeight"}
          backdrop="static"
          keyboard={false}
          isOpen={modall}
          toggle={modalToggle}
          centered={true}
          size={"lg"}
          scrollable={true}
          style={{ top: "15%" }}
        >
          <ModalHeader toggle={modalToggle}>
            Learn more about: "{selectedWord}"
          </ModalHeader>
          <ModalBody className="d-flex flex-column">
            {/*
                        <a className="cursor-pointer align-self-end" onClick={() => { handleModalClose() }}>
                            <FontAwesomeIcon icon={faTimes} />
                        </a>
                        */}

            {selectedWord && filteredLines.length > 0 && (
              <div className="filteredResultsHeader text-center login-form  px-5 py-5">
                <div className="form-group">
                  <p style={{ paddingTop: "12px" }}>
                    <button
                      style={{ fontSize: "22px" }}
                      className="react filterButton"
                      onClick={() => {
                        handleSaveWordWithSentences(selectedWord, "like");
                        Event(
                          "FilteredResult",
                          "Clicked on Save this Link ",
                          "Clicked on Save this Link From Popup for:" +
                            selectedWord
                        );
                      }}
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Like and save to review later"
                    >
                      Save this to review later? &nbsp;
                      <FontAwesomeIcon
                        style={{ fontSize: "24px" }}
                        className="cursor-pointer pr-1 indigo"
                        icon={faThumbsUp}
                      />
                    </button>
                  </p>

                  <div className="ml-2" style={{ textAlign: "center" }}>
                    <button
                      className="text-primary pr-2 cursor-pointer filterButton"
                      onClick={() => {
                        handleMeaning(selectedWord);
                        Event(
                          "FilteredResult",
                          "Clicked on Dictionary Link ",
                          "Clicked on Dictionary Link From Detail Popup for:" +
                            selectedWord
                        );
                      }}
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Open the dictionary definition"
                    >
                      <FontAwesomeIcon
                        style={{ fontSize: "24px" }}
                        className="cursor-pointer pr-1 indigo"
                        icon={faBook}
                      />
                      Dictionary Definition
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <select
                    className="form-control"
                    value={accent}
                    onChange={(e) => {
                      setAccent(e.target.value);
                      Event(
                        "FilteredResult",
                        "Clicked on Accent Select ",
                        "Clicked on Accent select. Selected: " + e.target.value
                      );
                    }}
                  >
                    <option value="Joanna_English_US">
                      {" "}
                      US Female Adult - Or Select A Different Accent
                    </option>
                    <option value="Matthew_English_US"> US Male Adult </option>
                    <option value="Ivy_English_US"> US Female Child</option>
                    <option value="Justin_English_US"> US Male Child </option>
                    <option value="Emma_English_British">
                      {" "}
                      British Female Adult
                    </option>
                    <option value="Brian_English_British">
                      {" "}
                      British Male Adult
                    </option>
                    <option value="Aditi_English_Indian">
                      {" "}
                      Indian Female Adult
                    </option>
                    <option value="Nicole_English_Australian">
                      Australian Female Adult
                    </option>
                    <option value="Russell_English_Australian">
                      {" "}
                      Australian Male Adult
                    </option>
                    <option value="Geraint_English_Welsh">
                      {" "}
                      Welsh Male Adult
                    </option>
                  </select>
                </div>
              </div>
            )}

            {selectedWord && filteredLines.length > 0 && (
              <div className=" my-4">
                {meaning.length > 0 &&
                  meaning.map((def, index) => {
                    return <h4 key={index}>{def}</h4>;
                  })}

                {filteredLines.length > 0 &&
                  filteredLines.map((line, index) => {
                    return (
                      <p key={index}>
                        {" "}
                        <button
                          className="filterButton"
                          onClick={() => {
                            handleAudio(line, accent);
                            Event(
                              "FilteredResult",
                              "Clicked on Play Audio ",
                              "Clicked on Play Audio: playing " +
                                line +
                                " with accent: " +
                                accent
                            );
                          }}
                        >
                          {!audioLoading && (
                            <FontAwesomeIcon icon={faVolumeUp} />
                          )}
                          {audioLoading && (
                            <FontAwesomeIcon
                              className="loading-icon"
                              icon={faSpinner}
                            />
                          )}
                        </button>{" "}
                        {line}
                      </p>
                    );
                  })}

                <div className="d-flex justify-content-end">
                  {/*
                                <Button className="btn btn-light btn-md align-self-end mr-2" onClick={() => { handleModalClose() }}><span>Cancel</span></Button>
                                */}
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <div className="row">
              {!currentUserToken &&
                lines.length === 0 &&
                meaning.length === 0 && (
                  <h6 style={{ display: displayMsg ? "none" : "inherit" }}>
                    To use this feature, please sign up or log in
                  </h6>
                )}
            </div>
            <div className="row">
              {!currentUserToken && lines.length === 0 && meaning.length === 0 && (
                <Link
                  style={{ display: displayMsg ? "none" : "inherit" }}
                  to="auth"
                  className=" btn btn-theme btn-md"
                  onClick={() => {
                    handleModalSignUp();
                    Event(
                      "FilteredResult",
                      "Clicked on Sign Up From Modal ",
                      "Clicked on Sign Up From Modal "
                    );
                  }}
                >
                  <span>Sign Up</span>
                </Link>
              )}
              <Button color="secondary" onClick={modalToggle}>
                Cancel
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
      <audio ref={audioRef} style={{ display: "none" }}></audio>
      {loader}
    </div>
  );
};

export default FilteredResults;
